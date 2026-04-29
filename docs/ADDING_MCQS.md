# Adding New MCQs to Medify

## Quick Steps

```bash
# 1. Add your .txt file(s) to the right subject folder
cp my-new-questions.txt data/Anatomy/

# 2. Run the seed script (parses + pushes to Supabase)
node scripts/seed-mcqs.mjs

# 3. Done! Frontend JSON and Supabase are both updated.
```

## File Format

Each `.txt` file follows this exact format. **Every field matters.**

```
Question: Your question text here?
Options:
a) First option
b) Second option
c) Third option
d) Fourth option
Correct Option:
Ans. (C) Third option
Explanation: Why this answer is correct...
Tags: Subject, Topic, Block 1

Question: Next question...
Options:
a) ...
```

### Rules

| Field | Required | Notes |
|-------|----------|-------|
| `Question:` | Yes | Can span multiple lines until `Options:` |
| `Options:` | Yes | Must have a), b), c), d). Optional e) for 5 options |
| `Correct Option:` | Yes | Just the label line |
| `Ans.` | Yes | Can be `Ans. (C)` or `Ans. The full option text` |
| `Explanation:` | Yes | Can be on same line or next line |
| `Tags:` | Optional | Comma-separated tags |

### Answer Formats (all work)

```
Ans. (B) Streptokinase       # letter in parentheses (recommended)
Ans. (B)                     # just the letter
Ans. Streptokinase           # full option text match
```

## Folder Structure

Put files in the matching subject folder:

```
data/
  Anatomy/          → subject: "Anatomy"
  Biochem/          → subject: "Biochemistry"
  Community Medicine/ → subject: "Community Medicine"
  Embryo/           → subject: "Embryology"
  Histo/            → subject: "Histology"
  Pathology/        → subject: "Pathology"
  Pharmacology/     → subject: "Pharmacology"
```

### File Naming

```
{number}. {Topic Name} ({Category}) {count}.txt
```

Examples:
- `8. Bones (Histology) 18.txt`
- `3. Enzymes (Biochemistry) 83.txt`

The topic is extracted from the filename automatically.

## Adding a New Subject

1. Create a new folder in `data/` (e.g., `data/Physiology/`)
2. Add mappings in `scripts/seed-mcqs.mjs`:

```js
// In SUBJECT_MAP:
'Physiology': 'Physiology',

// In ID_PREFIX:
'Physiology': 'phys',
```

3. Run `node scripts/seed-mcqs.mjs`

## Script Options

```bash
# Parse + push everything (safe to re-run, uses upsert)
node scripts/seed-mcqs.mjs

# Parse only, don't push to Supabase (updates local JSON only)
node scripts/seed-mcqs.mjs --dry-run

# Process only one subject folder
node scripts/seed-mcqs.mjs --folder Anatomy
```

## What the Script Does

1. Reads all `.txt` files from `data/` folders
2. Parses each question block
3. Assigns unique IDs (e.g., `anat0001`, `bio0042`)
4. Saves to `frontend/data/mcqs.json` (used by the frontend)
5. Upserts to Supabase `questions` table (no duplicates)

**Re-running is always safe** — existing questions get updated, new ones get inserted.

## Troubleshooting

### `[WARN] Could not resolve answer`
The answer text doesn't match any option. Fix by using the letter format:
```
Ans. (B) Streptokinase
```

### `Missing SUPABASE_URL or SERVICE_KEY`
Check `frontend/.env.local` has:
```
NEXT_PUBLIC_SUPABASE_URL="https://..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."
```

### MCQ shows up in app but not Supabase (or vice versa)
Run `node scripts/seed-mcqs.mjs` — it syncs both.
