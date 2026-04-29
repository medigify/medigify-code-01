#!/usr/bin/env node
/**
 * seed-mcqs.mjs — Parse .txt MCQ files and push to Supabase
 *
 * Usage:
 *   node scripts/seed-mcqs.mjs                  # parse + push all
 *   node scripts/seed-mcqs.mjs --dry-run        # parse only, save JSON, don't push
 *   node scripts/seed-mcqs.mjs --folder Anatomy  # only process one subject folder
 *
 * Re-running is safe — uses upsert (ON CONFLICT id DO UPDATE).
 * New files in data/ will be picked up automatically.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const OUT_JSON = path.join(ROOT, 'frontend', 'data', 'mcqs.json');

// ── Config ──────────────────────────────────────────────────
const ENV_FILE = path.join(ROOT, 'frontend', '.env.local');
const env = loadEnv(ENV_FILE);

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

const SUBJECT_MAP = {
  'Anatomy': 'Anatomy',
  'Biochem': 'Biochemistry',
  'Community Medicine': 'Community Medicine',
  'Embryo': 'Embryology',
  'Histo': 'Histology',
  'Pathology': 'Pathology',
  'Pharmacology': 'Pharmacology',
};

const ID_PREFIX = {
  'Anatomy': 'anat',
  'Biochemistry': 'bio',
  'Community Medicine': 'cm',
  'Embryology': 'emb',
  'Histology': 'histo',
  'Pathology': 'path',
  'Pharmacology': 'pharm',
};

// ── CLI args ────────────────────────────────────────────────
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const folderIdx = args.indexOf('--folder');
const ONLY_FOLDER = folderIdx !== -1 ? args[folderIdx + 1] : null;

// ── Main ────────────────────────────────────────────────────
async function main() {
  const folders = fs.readdirSync(DATA_DIR).filter(f => {
    const full = path.join(DATA_DIR, f);
    if (!fs.statSync(full).isDirectory()) return false;
    if (ONLY_FOLDER && f !== ONLY_FOLDER) return false;
    return true;
  });

  let allMcqs = [];
  const counters = {}; // per-subject running ID counter

  for (const folder of folders) {
    const subject = SUBJECT_MAP[folder] || folder;
    const prefix = ID_PREFIX[subject] || folder.toLowerCase().slice(0, 4);
    if (!counters[prefix]) counters[prefix] = 0;

    const folderPath = path.join(DATA_DIR, folder);
    const files = fs.readdirSync(folderPath)
      .filter(f => f.endsWith('.txt'))
      .sort((a, b) => {
        const numA = parseInt(a.match(/^(\d+)/)?.[1] || '0');
        const numB = parseInt(b.match(/^(\d+)/)?.[1] || '0');
        return numA - numB;
      });

    for (const file of files) {
      const topic = extractTopic(file);
      const content = fs.readFileSync(path.join(folderPath, file), 'utf-8');
      const questions = parseFile(content, subject, topic);

      for (const q of questions) {
        counters[prefix]++;
        q.id = `${prefix}${String(counters[prefix]).padStart(4, '0')}`;
        allMcqs.push(q);
      }
    }
  }

  console.log(`Parsed ${allMcqs.length} MCQs across ${folders.length} subjects`);

  // Subject breakdown
  const breakdown = {};
  for (const q of allMcqs) {
    breakdown[q.subject] = (breakdown[q.subject] || 0) + 1;
  }
  for (const [subj, count] of Object.entries(breakdown).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${subj}: ${count}`);
  }

  // Save local JSON (always — frontend uses this)
  fs.writeFileSync(OUT_JSON, JSON.stringify(allMcqs, null, 2) + '\n');
  console.log(`\nSaved to ${path.relative(ROOT, OUT_JSON)}`);

  if (DRY_RUN) {
    console.log('Dry run — skipping Supabase push.');
    return;
  }

  // Push to Supabase
  if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error('Missing SUPABASE_URL or SERVICE_KEY in .env.local — skipping push.');
    process.exit(1);
  }

  await pushToSupabase(allMcqs);
}

// ── Parser ──────────────────────────────────────────────────
function parseFile(content, subject, fileTopic) {
  const questions = [];
  // Split into question blocks by "Question:" prefix
  const blocks = content.split(/(?=^Question:)/m).filter(b => b.trim());

  // Check if first block is a topic header (doesn't start with "Question:")
  let blockTopic = fileTopic;
  let startIdx = 0;
  if (blocks.length > 0 && !blocks[0].trim().startsWith('Question:')) {
    // First block is a topic line
    blockTopic = blocks[0].trim().split('\n')[0].trim() || fileTopic;
    startIdx = 1;
  }

  for (let i = startIdx; i < blocks.length; i++) {
    const block = blocks[i].trim();
    if (!block) continue;

    const q = parseQuestion(block, subject, blockTopic);
    if (q) questions.push(q);
  }

  return questions;
}

function parseQuestion(block, subject, topic) {
  const lines = block.split('\n').map(l => l.trim()).filter(Boolean);

  // Extract statement
  const statementLine = lines.find(l => l.startsWith('Question:'));
  if (!statementLine) return null;

  // Statement may span multiple lines until "Options:"
  const statementStart = lines.indexOf(statementLine);
  const optionsLineIdx = lines.findIndex(l => l === 'Options:');
  let statement;
  if (optionsLineIdx > statementStart) {
    statement = lines.slice(statementStart, optionsLineIdx)
      .join(' ')
      .replace(/^Question:\s*/, '')
      .trim();
  } else {
    statement = statementLine.replace(/^Question:\s*/, '').trim();
  }

  // Extract options
  const options = {};
  const optionLetters = ['a', 'b', 'c', 'd', 'e'];
  for (const letter of optionLetters) {
    const regex = new RegExp(`^${letter}\\)\\s*(.+)`, 'i');
    const match = lines.find(l => regex.test(l));
    if (match) {
      options[letter] = match.replace(regex, '$1').trim();
    }
  }

  if (Object.keys(options).length < 2) return null; // Need at least 2 options

  // Extract correct answer
  const ansLine = lines.find(l => /^Ans\.?\s*/i.test(l));
  if (!ansLine) return null;

  const ansText = ansLine.replace(/^Ans\.?\s*/, '').trim();
  const correctOption = resolveCorrectOption(ansText, options);
  if (!correctOption) {
    console.warn(`  [WARN] Could not resolve answer: "${ansText}" in "${statement.slice(0, 50)}..."`);
    return null;
  }

  // Extract explanation (may be on the same line or the next line)
  const explIdx = lines.findIndex(l => l.startsWith('Explanation:'));
  let explanation = '';
  if (explIdx !== -1) {
    const sameLine = lines[explIdx].replace(/^Explanation:\s*/, '').trim();
    if (sameLine) {
      explanation = sameLine;
    } else if (explIdx + 1 < lines.length && !lines[explIdx + 1].startsWith('Tags:')) {
      // Explanation is on the next line(s) — collect until Tags: or end
      const explParts = [];
      for (let j = explIdx + 1; j < lines.length; j++) {
        if (lines[j].startsWith('Tags:')) break;
        explParts.push(lines[j]);
      }
      explanation = explParts.join(' ').trim();
    }
  }

  // Extract tags
  const tagLine = lines.find(l => l.startsWith('Tags:'));
  const tags = tagLine
    ? tagLine.replace(/^Tags:\s*/, '').split(',').map(t => t.trim()).filter(Boolean)
    : [];

  return {
    id: '', // filled by caller
    statement,
    options,
    correct_option: correctOption,
    explanation,
    subject,
    topic: topic || null,
    tags,
    year: null,
    academic_year: 1,
  };
}

function resolveCorrectOption(ansText, options) {
  // Clean leading colons/punctuation: ": Contains the median nerve" → "Contains the median nerve"
  let cleaned = ansText.replace(/^[:\s]+/, '').trim();

  // Pattern 1: "(A) Something" or "(a) Something"
  const letterMatch = cleaned.match(/^\(([a-eA-E])\)/);
  if (letterMatch) return letterMatch[1].toLowerCase();

  // Normalize for comparison
  const normalized = cleaned.replace(/\.+$/, '').trim().toLowerCase();
  if (!normalized) return null;

  // Pattern 2: exact match against option text (case-insensitive, trimmed)
  for (const [letter, text] of Object.entries(options)) {
    if (text.trim().toLowerCase() === normalized) return letter;
  }

  // Pattern 3: fuzzy — option text starts with answer or answer starts with option
  for (const [letter, text] of Object.entries(options)) {
    const optNorm = text.trim().toLowerCase();
    if (optNorm.startsWith(normalized) || normalized.startsWith(optNorm)) return letter;
  }

  // Pattern 4: substring containment (both directions)
  for (const [letter, text] of Object.entries(options)) {
    const optNorm = text.trim().toLowerCase();
    if (normalized.includes(optNorm) || optNorm.includes(normalized)) return letter;
  }

  // Pattern 5: Levenshtein distance ≤ 3 for typos (e.g. "vasoconstrictiom" vs "vasoconstriction")
  for (const [letter, text] of Object.entries(options)) {
    const optNorm = text.trim().toLowerCase();
    if (levenshtein(normalized, optNorm) <= 3) return letter;
  }

  // Pattern 6: word overlap — at least 60% of words match
  const ansWords = normalized.split(/\s+/).filter(w => w.length > 2);
  for (const [letter, text] of Object.entries(options)) {
    const optWords = text.trim().toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const common = ansWords.filter(w => optWords.includes(w)).length;
    const overlap = common / Math.max(ansWords.length, optWords.length);
    if (overlap >= 0.6 && common >= 2) return letter;
  }

  return null;
}

function levenshtein(a, b) {
  if (a.length > 80 || b.length > 80) return 999; // skip long strings
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

// ── Topic extraction from filename ──────────────────────────
function extractTopic(filename) {
  // "1. Introduction (General Anatomy) 7.txt" → "Introduction"
  // "3. Enzymes (Biochemistry) 83.txt" → "Enzymes"
  // "10 Vitamins (Biochemistry) 76.txt" → "Vitamins"
  const match = filename.match(/^\d+\.?\s*(.+?)\s*\(/);
  return match ? match[1].trim() : null;
}

// ── Supabase push ───────────────────────────────────────────
async function pushToSupabase(mcqs) {
  console.log(`\nPushing ${mcqs.length} MCQs to Supabase...`);

  const BATCH_SIZE = 200;
  let pushed = 0;
  let errors = 0;

  for (let i = 0; i < mcqs.length; i += BATCH_SIZE) {
    const batch = mcqs.slice(i, i + BATCH_SIZE).map(q => ({
      id: q.id,
      statement: q.statement,
      options: q.options,
      correct_option: q.correct_option,
      explanation: q.explanation,
      subject: q.subject,
      topic: q.topic,
      tags: q.tags,
      year: q.year,
      academic_year: q.academic_year,
    }));

    const res = await fetch(`${SUPABASE_URL}/rest/v1/questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Prefer': 'resolution=merge-duplicates',
      },
      body: JSON.stringify(batch),
    });

    if (res.ok) {
      pushed += batch.length;
      process.stdout.write(`  ${pushed}/${mcqs.length}\r`);
    } else {
      const err = await res.text();
      console.error(`\n  [ERROR] Batch ${i}-${i + batch.length}: ${res.status} ${err}`);
      errors++;
    }
  }

  console.log(`\nDone. Pushed: ${pushed}, Errors: ${errors}`);
}

// ── Env loader ──────────────────────────────────────────────
function loadEnv(filepath) {
  const result = {};
  if (!fs.existsSync(filepath)) return result;
  const lines = fs.readFileSync(filepath, 'utf-8').split('\n');
  for (const line of lines) {
    const match = line.match(/^(\w+)\s*=\s*"?([^"]*)"?/);
    if (match) result[match[1]] = match[2];
  }
  return result;
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
