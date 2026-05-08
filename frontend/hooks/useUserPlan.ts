'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Plan } from '@/lib/plans';

interface UserPlanState {
  plan: Plan;
  isPro: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useUserPlan(): UserPlanState {
  const [state, setState] = useState<UserPlanState>({
    plan: 'free',
    isPro: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const supabase = createClient();

    const fetchPlan = async () => {
      const isMockMode =
        process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://mock-project.supabase.co';

      if (isMockMode) {
        // In mock mode everyone is free
        setState({ plan: 'free', isPro: false, isLoading: false, error: null });
        return;
      }

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setState({ plan: 'free', isPro: false, isLoading: false, error: null });
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('plan')
          .eq('id', user.id)
          .single();

        if (error || !profile) {
          setState({
            plan: 'free',
            isPro: false,
            isLoading: false,
            error: 'Could not load your subscription status.',
          });
          return;
        }

        const plan = (profile.plan as Plan) ?? 'free';
        setState({ plan, isPro: plan === 'pro', isLoading: false, error: null });
      } catch {
        setState({
          plan: 'free',
          isPro: false,
          isLoading: false,
          error: 'Could not load your subscription status.',
        });
      }
    };

    void fetchPlan();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      void fetchPlan();
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void fetchPlan();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return state;
}
