import { Search, BookOpen, Brain } from 'lucide-react';
import Card from '@/components/ui/Card';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: Search,
      title: 'Pick Your Subject',
      description: 'Filter by your year, your examining body, your weak spots.',
    },
    {
      number: '02',
      icon: BookOpen,
      title: 'Practice or Test',
      description:
        'Low-pressure practice with instant answers, or timed mock exams that simulate the real thing.',
    },
    {
      number: '03',
      icon: Brain,
      title: 'Remember Everything',
      description:
        'Turn any question into a flashcard. Spaced repetition makes it stick.',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24" aria-labelledby="how-it-works-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          id="how-it-works-heading"
          className="font-heading text-3xl md:text-4xl font-bold text-center text-text-primary"
        >
          How It Works
        </h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connection line (desktop only) */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 z-0" />
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Card key={step.number} className="relative z-10 text-center">
                <span className="text-4xl font-heading font-bold text-accent/20">
                  {step.number}
                </span>
                <div className="mt-4 flex justify-center">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                </div>
                <h3 className="mt-4 font-heading text-xl font-semibold text-text-primary">
                  {step.title}
                </h3>
                <p className="mt-2 text-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
