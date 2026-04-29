'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Flame, Play, Clock, Target, AlertCircle, Zap,
  BookOpen, TrendingUp, Award, ChevronRight,
  BarChart3, CheckCircle2, RefreshCw, Lock
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
import { useUserPlan } from '@/hooks/useUserPlan';
import mcqData from '@/data/mcqs.json';
import type { MCQ } from '@/lib/types';

interface Profile {
  first_name: string | null;
  username: string | null;
  examining_body_id: string | null;
  college_id: string | null;
  academic_year: number | null;
}

interface Attempt {
  question_id: string;
  is_correct: boolean;
  created_at: string;
}

interface Stats {
  total: number;
  correct: number;
  accuracy: number;
  streak: number;
}

interface SubjectStat {
  total: number;
  correct: number;
}

const ALL_SUBJECTS = [
  { name: 'Anatomy',            color: 'bg-blue-400',   light: 'text-blue-400',   border: 'border-blue-400/20' },
  { name: 'Embryology',         color: 'bg-purple-400', light: 'text-purple-400', border: 'border-purple-400/20' },
  { name: 'Histology',          color: 'bg-pink-400',   light: 'text-pink-400',   border: 'border-pink-400/20' },
  { name: 'Biochemistry',       color: 'bg-orange-400', light: 'text-orange-400', border: 'border-orange-400/20' },
  { name: 'Pathology',          color: 'bg-red-400',    light: 'text-red-400',    border: 'border-red-400/20' },
  { name: 'Pharmacology',       color: 'bg-yellow-400', light: 'text-yellow-400', border: 'border-yellow-400/20' },
  { name: 'Community Medicine', color: 'bg-green-400',  light: 'text-green-400',  border: 'border-green-400/20' },
];

const QUICK_ACTIONS = [
  { label: 'Quick 10',       desc: 'Random 10 MCQs',        href: '/practice/session?count=10',                    icon: Zap },
  { label: 'Embryology',     desc: '5 MCQs',                href: '/practice/session?subjects=Embryology&count=5', icon: BookOpen },
  { label: 'Weak Areas',     desc: 'Practice low scores',   href: '/practice',                                     icon: TrendingUp },
  { label: 'Custom Session', desc: 'Choose your subjects',  href: '/practice',                                     icon: RefreshCw },
];

function calcStreak(attempts: Attempt[]): number {
  if (attempts.length === 0) return 0;

  const uniqueDays = [
    ...new Set(attempts.map(a => new Date(a.created_at).toDateString())),
  ].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const today     = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86_400_000).toDateString();

  if (uniqueDays[0] !== today && uniqueDays[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    const prev = new Date(uniqueDays[i - 1]).getTime();
    const curr = new Date(uniqueDays[i]).getTime();
    if (Math.round((prev - curr) / 86_400_000) === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export default function DashboardPage() {
  const router  = useRouter();
  const { isPro, plan } = useUserPlan();

  const [profile,      setProfile]      = useState<Profile | null>(null);
  const [stats,        setStats]        = useState<Stats>({ total: 0, correct: 0, accuracy: 0, streak: 0 });
  const [subjectStats, setSubjectStats] = useState<Record<string, SubjectStat>>({});
  const [loading,      setLoading]      = useState(true);
  const [greeting,     setGreeting]     = useState('Good morning');

  // Build a lookup map of MCQ id → subject using local JSON
  const mcqMap = useMemo(() => {
    const map = new Map<string, string>();
    (mcqData as MCQ[]).forEach(q => map.set(q.id, q.subject));
    return map;
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12)      setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else                setGreeting('Good evening');

    const fetchAll = async () => {
      const isMockMode = process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://mock-project.supabase.co';

      if (isMockMode) {
        const mockId = localStorage.getItem('mock_user_id');
        if (!mockId) { router.push('/login'); return; }
        setProfile({ first_name: 'Demo', username: mockId, examining_body_id: 'UHS', college_id: 'KEMU', academic_year: 2 });
        // In mock mode keep stats at 0 — no real DB
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      // Fetch profile + attempts in parallel
      const [profileRes, attemptsRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('first_name, username, examining_body_id, college_id, academic_year')
          .eq('id', user.id)
          .single(),
        supabase
          .from('question_attempts')
          .select('question_id, is_correct, created_at')
          .eq('user_id', user.id),
      ]);

      if (profileRes.data) setProfile(profileRes.data);

      const attempts: Attempt[] = attemptsRes.data ?? [];

      // ── Compute stats ──
      const total   = attempts.length;
      const correct = attempts.filter(a => a.is_correct).length;
      const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
      const streak  = calcStreak(attempts);
      setStats({ total, correct, accuracy, streak });

      // ── Per-subject breakdown using local MCQ map ──
      const bySubject: Record<string, SubjectStat> = {};
      attempts.forEach(a => {
        const subject = mcqMap.get(a.question_id);
        if (!subject) return;
        if (!bySubject[subject]) bySubject[subject] = { total: 0, correct: 0 };
        bySubject[subject].total++;
        if (a.is_correct) bySubject[subject].correct++;
      });
      setSubjectStats(bySubject);

      setLoading(false);
    };

    fetchAll();
  }, [router, mcqMap]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-text-secondary text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const displayName  = profile?.first_name || profile?.username || 'Doctor';
  const totalMcqs    = 10_000;
  const progressPct  = Math.min((stats.total / totalMcqs) * 100, 100);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">

      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
        <div>
          <p className="text-text-secondary text-sm mb-1">{greeting},</p>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-text-primary">
              {displayName} 👋
            </h1>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${
              isPro
                ? 'bg-accent/10 text-accent border-accent/30'
                : 'bg-border/60 text-text-secondary border-border'
            }`}>
              {plan}
            </span>
          </div>
          {profile?.college_id && (
            <p className="text-text-secondary text-sm mt-1.5">
              {profile.college_id}
              {profile.academic_year  ? ` · Year ${profile.academic_year}` : ''}
              {profile.examining_body_id ? ` · ${profile.examining_body_id}` : ''}
            </p>
          )}
        </div>

        <Link href="/practice">
          <Button variant="filled" size="lg" className="gap-2">
            <Play className="w-4 h-4" />
            Start Practice
          </Button>
        </Link>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Streak', icon: Flame, color: 'text-warning', bg: 'bg-warning/10',
            hoverBorder: 'hover:border-warning/40',
            value: stats.streak > 0 ? stats.streak : 0,
            suffix: 'days',
            empty: stats.streak === 0,
          },
          {
            label: 'Attempted', icon: BarChart3, color: 'text-accent', bg: 'bg-accent/10',
            hoverBorder: 'hover:border-accent/40',
            value: stats.total,
            suffix: 'MCQs',
            empty: stats.total === 0,
          },
          {
            label: 'Accuracy', icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10',
            hoverBorder: 'hover:border-success/40',
            value: stats.accuracy,
            suffix: '%',
            empty: stats.total === 0,
          },
          {
            label: 'Correct', icon: Target, color: 'text-purple-400', bg: 'bg-purple-400/10',
            hoverBorder: 'hover:border-purple-400/40',
            value: stats.correct,
            suffix: 'right',
            empty: stats.total === 0,
          },
        ].map(({ label, icon: Icon, color, bg, hoverBorder, value, suffix, empty }) => (
          <div key={label} className={`bg-bg-surface border border-border rounded-xl p-5 relative overflow-hidden group ${hoverBorder} transition-colors duration-200`}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`p-1.5 ${bg} rounded-lg`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">{label}</span>
            </div>
            {empty ? (
              <span className="text-2xl font-heading font-bold text-text-secondary/40">—</span>
            ) : (
              <div className="flex items-end gap-1">
                <span className={`text-3xl font-heading font-bold ${color}`}>{value.toLocaleString()}</span>
                <span className="text-text-secondary text-sm mb-0.5">{suffix}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* Subject Progress */}
        <div className="lg:col-span-2 bg-bg-surface border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-semibold text-text-primary flex items-center gap-2">
              <Target className="w-5 h-5 text-accent" />
              Subject Progress
            </h2>
            <span className="text-xs text-text-secondary">
              {stats.total} / {totalMcqs.toLocaleString()} total
            </span>
          </div>

          {stats.total === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <BookOpen className="w-10 h-10 text-text-secondary/30" />
              <p className="text-text-secondary text-sm">No attempts yet. Start a practice session to see your progress!</p>
              <Link href="/practice">
                <Button variant="filled" size="sm">Start Practising</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {ALL_SUBJECTS.map(({ name, color, light, border }) => {
                const s = subjectStats[name];
                const attempted = s?.total ?? 0;
                const pct = attempted > 0 ? Math.round((s.correct / s.total) * 100) : 0;
                return (
                  <div key={name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${color}/60 border ${border}`} />
                        <span className="text-sm font-medium text-text-primary">{name}</span>
                        {!isPro && <Lock className="w-3 h-3 text-text-secondary/40" />}
                      </div>
                      <span className="text-xs text-text-secondary">
                        {attempted > 0 ? `${pct}% acc · ${attempted} done` : 'Not started'}
                      </span>
                    </div>
                    <div className="w-full bg-border rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${color} opacity-70 transition-all duration-500`}
                        style={{ width: attempted > 0 ? `${Math.max(pct, 2)}%` : '0%' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-4">
          {/* Quick Start */}
          <div className="bg-bg-surface border border-border rounded-xl p-5 flex-1">
            <h2 className="font-heading font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-warning" />
              Quick Start
            </h2>
            <div className="space-y-2">
              {QUICK_ACTIONS.map((action) => (
                <Link key={action.label} href={action.href}>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-bg-primary hover:bg-bg-surface-hover border border-transparent hover:border-border transition-all duration-150 group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-border rounded-md">
                        <action.icon className="w-3.5 h-3.5 text-text-secondary group-hover:text-accent transition-colors" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">{action.label}</p>
                        <p className="text-xs text-text-secondary">{action.desc}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-text-secondary/50 group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Pro upgrade card for free users */}
          {!isPro && (
            <div className="relative overflow-hidden rounded-xl border border-accent/25 bg-gradient-to-br from-accent/10 to-bg-surface p-5">
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent/15 rounded-full blur-2xl" />
              <div className="relative">
                <Zap className="w-6 h-6 text-accent mb-2" />
                <h3 className="font-heading font-semibold text-text-primary mb-1">Unlock Pro</h3>
                <p className="text-xs text-text-secondary mb-3">Unlimited MCQs across all 7 subjects</p>
                <Link href="/pricing">
                  <Button variant="filled" size="sm" className="w-full justify-center text-xs">
                    View Plans
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom Row ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Overall Progress */}
        <div className="bg-bg-surface border border-border rounded-xl p-6">
          <h2 className="font-heading font-semibold text-text-primary mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-success" />
            Overall Progress
          </h2>
          <div className="flex items-end gap-2 mb-3">
            <span className="text-4xl font-heading font-bold text-text-primary">
              {stats.total.toLocaleString()}
            </span>
            <span className="text-text-secondary mb-1">/ {totalMcqs.toLocaleString()} MCQs</span>
          </div>
          <div className="w-full bg-border rounded-full h-2 mb-2">
            <div
              className="h-2 bg-success rounded-full transition-all duration-700"
              style={{ width: `${Math.max(progressPct, 0.2)}%` }}
            />
          </div>
          <p className="text-xs text-text-secondary">
            {stats.total === 0
              ? 'Start your first session to track progress.'
              : `${(100 - progressPct).toFixed(1)}% of content remaining`}
          </p>
        </div>

        {/* Mock Tests placeholder */}
        <div className="bg-bg-surface border border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-center gap-3">
          <div className="p-3 bg-border/50 rounded-full">
            <Clock className="w-6 h-6 text-text-secondary" />
          </div>
          <div>
            <h2 className="font-heading font-semibold text-text-primary mb-1">Mock Tests</h2>
            <p className="text-text-secondary text-sm">
              Coming in Phase 3 — full timed exams with UHS & NUMS patterns.
            </p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-border text-text-secondary font-medium">Phase 3</span>
        </div>
      </div>

    </div>
  );
}
