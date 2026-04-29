'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Plan } from '@/lib/plans';

interface UserPlanState {
  plan: Plan;
  isPro: boolean;
  isLoading: boolean;
}

export function useUserPlan(): UserPlanState {
  const [state, setState] = useState<UserPlanState>({
    plan: 'free',
    isPro: false,
    isLoading: true,
  });

  useEffect(() => {
    const fetchPlan = async () => {
      const isMockMode =
        process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://mock-project.supabase.co';

      if (isMockMode) {
        // In mock mode everyone is free
        setState({ plan: 'free', isPro: false, isLoading: false });
        return;
      }

      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setState({ plan: 'free', isPro: false, isLoading: false });
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('plan')
          .eq('id', user.id)
          .single();

        if (error || !profile) {
          setState({ plan: 'free', isPro: false, isLoading: false });
          return;
        }

        const plan = (profile.plan as Plan) ?? 'free';
        setState({ plan, isPro: plan === 'pro', isLoading: false });
      } catch {
        // Fallback to free on any error — never block the user
        setState({ plan: 'free', isPro: false, isLoading: false });
      }
    };

    fetchPlan();
  }, []);

  return state;
}
