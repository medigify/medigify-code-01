'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen } from 'lucide-react';
import Button from '@/components/ui/Button';
import mcqData from '@/data/mcqs.json';
import { MCQ } from '@/lib/types';
import { getSubjects } from '@/lib/utils';

const BLOCK_SIZES = [5, 10, 15, 20];

export default function PracticePage() {
  const router = useRouter();
  const mcqs = mcqData as MCQ[];
  const subjects = useMemo(() => getSubjects(mcqs), [mcqs]);

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [blockSize, setBlockSize] = useState<number | 'all'>(10);

  const toggleSubject = (subjectName: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectName)
        ? prev.filter((s) => s !== subjectName)
        : [...prev, subjectName]
    );
  };

  const availableCount = useMemo(() => {
    if (selectedSubjects.length === 0) return mcqs.length;
    return mcqs.filter((m) => selectedSubjects.includes(m.subject)).length;
  }, [selectedSubjects, mcqs]);

  const actualBlockSize = blockSize === 'all' ? availableCount : Math.min(blockSize, availableCount);

  const handleStart = () => {
    const subjectsParam =
      selectedSubjects.length === 0
        ? 'all'
        : selectedSubjects.join(',');

    router.push(
      `/practice/session?subjects=${encodeURIComponent(subjectsParam)}&count=${actualBlockSize}`
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Page Header */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <BookOpen className="w-8 h-8 text-accent" />
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-text-primary">
            Practice Mode
          </h1>
        </div>
        <p className="text-text-secondary max-w-lg mx-auto">
          Select subjects and block size to start a low-pressure practice
          session with immediate feedback.
        </p>
      </div>


      {/* Subject Selection */}
      <section aria-labelledby="subjects-heading" className="mb-10">
        <h2
          id="subjects-heading"
          className="font-heading text-xl font-semibold text-text-primary mb-4"
        >
          Select Subjects
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {subjects.map((subject) => {
            const isSelected = selectedSubjects.includes(subject.name);
            return (
              <button
                key={subject.name}
                onClick={() => toggleSubject(subject.name)}
                className={`relative p-4 rounded-lg border text-left transition-all duration-150 min-h-[48px] ${
                  isSelected
                    ? 'border-accent bg-accent/10 ring-1 ring-accent'
                    : 'border-border bg-bg-surface hover:bg-bg-surface-hover hover:border-accent/30'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
                <p className="font-medium text-text-primary text-sm">
                  {subject.name}
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  {subject.count} MCQ{subject.count !== 1 ? 's' : ''}
                </p>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-text-secondary mt-3">
          {selectedSubjects.length === 0
            ? `All subjects selected (${availableCount} MCQs available)`
            : `${selectedSubjects.length} subject${selectedSubjects.length !== 1 ? 's' : ''} selected (${availableCount} MCQs available)`}
        </p>
      </section>

      {/* Block Size Picker */}
      <section aria-labelledby="block-size-heading" className="mb-10">
        <h2
          id="block-size-heading"
          className="font-heading text-xl font-semibold text-text-primary mb-4"
        >
          Block Size
        </h2>
        <div className="flex flex-wrap gap-3">
          {BLOCK_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => setBlockSize(size)}
              disabled={size > availableCount}
              className={`px-5 py-2.5 rounded-full border text-sm font-medium transition-all duration-150 min-h-[48px] ${
                blockSize === size
                  ? 'bg-accent text-white border-accent'
                  : size > availableCount
                  ? 'border-border text-text-secondary/40 cursor-not-allowed'
                  : 'border-border text-text-secondary hover:border-accent/30 hover:text-text-primary'
              }`}
            >
              {size}
            </button>
          ))}
          <button
            onClick={() => setBlockSize('all')}
            className={`px-5 py-2.5 rounded-full border text-sm font-medium transition-all duration-150 min-h-[48px] ${
              blockSize === 'all'
                ? 'bg-accent text-white border-accent'
                : 'border-border text-text-secondary hover:border-accent/30 hover:text-text-primary'
            }`}
          >
            All ({availableCount})
          </button>
        </div>
      </section>

      {/* Start Button */}
      <div className="text-center">
        <Button
          variant="filled"
          size="lg"
          onClick={handleStart}
          disabled={availableCount === 0}
        >
          Start Practice ({actualBlockSize} question{actualBlockSize !== 1 ? 's' : ''})
        </Button>
      </div>
    </div>
  );
}
