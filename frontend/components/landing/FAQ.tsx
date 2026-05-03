import Accordion from '@/components/ui/Accordion';

export default function FAQ() {
  const faqItems = [
    {
      question: 'Is Medigify free?',
      answer:
        'Yes, you can start practicing for free right now. Premium plans unlock the full question bank, all mock tests, and advanced analytics.',
    },
    {
      question: 'Which exams do you cover?',
      answer:
        'At launch, our platform features high-yield content specifically for the UHS curriculum. However, we are in the process of rapidly expanding our database to include other examining bodies to support more medical students.',
    },
    {
      question: 'Can I use it on my phone?',
      answer: (
        <>
          Absolutely. Medigify is built mobile-first as a Progressive Web App. Install it from your browser, no app store needed.{" "}
          <div className="group relative inline-block mt-1">
            <span className="text-accent hover:text-accent-hover font-medium cursor-help transition-colors">
              Learn more
            </span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-bg-surface-hover text-text-primary text-xs rounded-md border border-border shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 text-center pointer-events-none">
              <p className="mb-2 text-text-primary"><strong>iOS:</strong> Tap Share in Safari, then 'Add to Home Screen'.</p>
              <p className="text-text-primary"><strong>Android:</strong> Tap menu in Chrome, then 'Add to Home screen'.</p>
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-bg-surface-hover"></div>
            </div>
          </div>
        </>
      ),
    },
    {
      question: 'How do flashcards work?',
      answer:
        "Tap 'Add to Flashcards' on any question. We use the SM-2 spaced-repetition algorithm to schedule your reviews at the optimal time for long-term memory.",
    },
    {
      question: 'I found a mistake in a question.',
      answer:
        'Use report button on any MCQ, Flashcard or Notes. Our team regularly reviews all reports and ensures they’re corrected timely.',
    },
    {
      question: 'Will my progress be saved?',
      answer:
        'Yes! Create a free account and all your practice history, scores, and flashcards are saved automatically to your dashboard.',
    },
  ];

  return (
    <section id="faq" className="py-16 md:py-24" aria-labelledby="faq-heading">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          id="faq-heading"
          className="font-heading text-3xl md:text-4xl font-bold text-center text-text-primary"
        >
          Frequently Asked Questions
        </h2>
        <div className="mt-12">
          <Accordion items={faqItems} />
        </div>
      </div>
    </section>
  );
}
