'use client';

import { useState, useCallback, useRef } from 'react';
import { MCQ, Answer, PracticeSessionState } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

function createSessionState(questions: MCQ[]): PracticeSessionState {
  const now = Date.now();
  return {
    questions,
    currentIndex: 0,
    answers: new Map(),
    sessionStartTime: now,
    currentQuestionStartTime: now,
    isComplete: false,
  };
}

export function usePracticeSession(questions: MCQ[]) {
  const [session, setSession] = useState<PracticeSessionState>(() =>
    createSessionState(questions)
  );

  const questionStartTimeRef = useRef(session.currentQuestionStartTime);

  const currentQuestion = session.questions[session.currentIndex];
  const currentAnswer = currentQuestion
    ? session.answers.get(currentQuestion.id)
    : undefined;
  const hasAnswered = currentAnswer !== undefined;
  const isLastQuestion = session.currentIndex === session.questions.length - 1;

  const selectAnswer = useCallback(
    (optionKey: string) => {
      if (hasAnswered || !currentQuestion) return;

      const timeSpentMs = Date.now() - questionStartTimeRef.current;
      const isCorrect = optionKey === currentQuestion.correct_option;

      const answer: Answer = {
        selectedOption: optionKey,
        isCorrect,
        timeSpentMs,
      };

      setSession((prev) => {
        const newAnswers = new Map(prev.answers);
        newAnswers.set(currentQuestion.id, answer);
        return { ...prev, answers: newAnswers };
      });

      // Sync attempt to Supabase / Mock Layer
      const syncAttempt = async () => {
        const isMockMode = process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://mock-project.supabase.co';
        if (isMockMode) {
          const userId = localStorage.getItem('mock_user_id');
          if (userId) {
             console.log(`[Mock DB]: Stored attempt for Q ${currentQuestion.id} (Correct: ${isCorrect})`);
          }
        } else {
          try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              const { error } = await supabase.from('question_attempts').insert({
                user_id: user.id,
                question_id: currentQuestion.id,
                selected_option: optionKey,
                is_correct: isCorrect,
                time_spent_seconds: Math.round(timeSpentMs / 1000),
                mode: 'practice'
              });
              if (error) {
                console.error('[Medigify] Failed to save attempt:', error.message, '| Code:', error.code, '| Details:', error.details);
              } else {
                console.log(`[Medigify] Saved attempt: Q${currentQuestion.id} correct=${isCorrect}`);
              }
            } else {
              console.warn('[Medigify] No authenticated user — attempt not saved.');
            }
          } catch (err) {
            console.error('[Medigify] Unexpected error saving attempt:', err);
          }
        }
      };

      syncAttempt();
    },
    [currentQuestion, hasAnswered]
  );

  const nextQuestion = useCallback(() => {
    if (!hasAnswered) return;

    if (isLastQuestion) {
      setSession((prev) => ({ ...prev, isComplete: true }));
    } else {
      questionStartTimeRef.current = Date.now();
      setSession((prev) => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
        currentQuestionStartTime: Date.now(),
      }));
    }
  }, [hasAnswered, isLastQuestion]);

  const totalCorrect = Array.from(session.answers.values()).filter(
    (a) => a.isCorrect
  ).length;

  const totalIncorrect = session.answers.size - totalCorrect;

  const avgTimeMs =
    session.answers.size > 0
      ? Array.from(session.answers.values()).reduce(
          (sum, a) => sum + a.timeSpentMs,
          0
        ) / session.answers.size
      : 0;

  const longestTimeMs =
    session.answers.size > 0
      ? Math.max(
          ...Array.from(session.answers.values()).map((a) => a.timeSpentMs)
        )
      : 0;

  const longestQuestion = session.questions.find((q) => {
    const answer = session.answers.get(q.id);
    return answer && answer.timeSpentMs === longestTimeMs;
  });

  return {
    session,
    currentQuestion,
    currentAnswer,
    hasAnswered,
    isLastQuestion,
    selectAnswer,
    nextQuestion,
    totalCorrect,
    totalIncorrect,
    avgTimeMs,
    longestTimeMs,
    longestQuestion,
  };
}
