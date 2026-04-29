import { Quote } from 'lucide-react';

export default function Testimonials() {
  /* TODO: Replace with real testimonials */
  const testimonials = [
    {
      quote:
        "Finally a platform that understands UHS papers. The explanations are actually helpful.",
      name: 'Sarah A.',
      detail: '3rd Year, KEMU',
    },
    {
      quote:
        "I use the flashcard feature every single day. My retention has gone up dramatically.",
      name: 'Ahmed R.',
      detail: '2nd Year, AIMC',
    },
    {
      quote:
        "The mock tests feel exactly like the real exam. The pressure, the timer, everything.",
      name: 'Fatima K.',
      detail: 'Final Year, SMC',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-bg-surface border-y border-border" aria-labelledby="testimonials-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          id="testimonials-heading"
          className="font-heading text-3xl md:text-4xl font-bold text-center text-text-primary"
        >
          What Students Are Saying
        </h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-bg-primary border border-border rounded-lg p-6"
            >
              <Quote className="w-8 h-8 text-accent/30 mb-4" />
              <p className="text-text-primary italic leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="font-semibold text-text-primary">
                  {testimonial.name}
                </p>
                <p className="text-sm text-text-secondary">
                  {testimonial.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
