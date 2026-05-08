import Link from 'next/link';
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
          <div className="inline-block mt-1">
            <Link
              href="/pwa-guide"
              className="text-accent hover:text-accent-hover font-medium transition-colors"
            >
              Learn more
            </Link>
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
