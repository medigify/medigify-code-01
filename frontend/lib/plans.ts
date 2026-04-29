export const PLAN_LIMITS = {
  free: {
    mcqsPerSubject: 5,
    label: 'Free',
    description: '5 MCQs per subject per session',
  },
  pro: {
    mcqsPerSubject: Infinity,
    label: 'Pro',
    description: 'Unlimited MCQs across all subjects',
  },
} as const;

export type Plan = keyof typeof PLAN_LIMITS;
