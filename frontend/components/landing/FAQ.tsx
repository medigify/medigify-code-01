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
        "We're launching with UHS past papers across all major subjects. NUMS, AKU, and UCMD support is being added rapidly.",
    },
    {
      question: 'Can I use it on my phone?',
      answer:
        'Absolutely. Medigify is built mobile-first as a Progressive Web App. Install it from your browser, no app store needed.',
    },
    {
      question: 'How do flashcards work?',
      answer:
        "Tap 'Add to Flashcards' on any question. We use the SM-2 spaced-repetition algorithm to schedule your reviews at the optimal time for long-term memory.",
    },
    {
      question: 'I found a mistake in a question.',
      answer:
        'Use the Report button on any MCQ. Our team reviews every report and makes corrections quickly.',
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
