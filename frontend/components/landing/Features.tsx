import { Library, Timer, Layers, Smartphone } from 'lucide-react';
import Card from '@/components/ui/Card';

export default function Features() {
  const features = [
    {
      icon: Library,
      title: "10,000+ Past Paper MCQs",
      description:
        "Organized by subject, topic, and year. Every question comes with a detailed explanation.",
    },
    {
      icon: Timer,
      title: "Exam-Realistic Mock Tests",
      description:
        "Timed blocks with no answer peeking. Full review after submission.",
    },
    {
      icon: Layers,
      title: "Smart Flashcards",
      description:
        "One tap turns any question into a flashcard. Our algorithm surfaces it when you need it most, targeting your weak concepts.",
    },
    {
      icon: Smartphone,
      title: "Works Everywhere",
      description: (
        <>
          Install as an app on your phone. Study on slow networks. No app store needed.{" "}
          <div className="group relative inline-block mt-1">
            <span className="text-accent hover:text-accent-hover font-medium cursor-help transition-colors">
              Learn more
            </span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-bg-surface border border-border shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 text-center pointer-events-none rounded-lg">
              <p className="mb-2 text-text-primary"><strong>iOS:</strong> Tap Share in Safari, then 'Add to Home Screen'.</p>
              <p className="text-text-primary"><strong>Android:</strong> Tap menu in Chrome, then 'Add to Home screen'.</p>
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-bg-surface"></div>
            </div>
          </div>
        </>
      ),
    },
  ];

  return (
    <section id="features" className="py-16 md:py-24" aria-labelledby="features-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          id="features-heading"
          className="font-heading text-3xl md:text-4xl font-bold text-center text-text-primary"
        >
          Everything You Need to Pass
        </h2>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} hoverable>
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-text-primary">
                  {feature.title}
                </h3>
                <div className="mt-2 text-text-secondary leading-relaxed text-base">
                  {feature.description}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
