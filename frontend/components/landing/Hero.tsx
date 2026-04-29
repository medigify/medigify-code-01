import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function Hero() {
  return (
    <section className="py-16 md:py-24 lg:py-32" aria-labelledby="hero-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <h1
              id="hero-heading"
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-text-primary"
            >
              Ace Your Medical Exams, One Question at a Time
            </h1>
            <p className="mt-6 text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Pakistan&apos;s smartest question bank. UHS past papers,
              spaced-repetition flashcards, and mock tests. Built for how you
              actually study.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link href="/practice">
                <Button variant="filled" size="lg">
                  Try Practice Mode. It&apos;s Free
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="ghost" size="lg">
                  See How It Works
                </Button>
              </a>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="flex-shrink-0">
            <div className="w-[280px] h-[560px] bg-bg-surface border-2 border-border rounded-[2.5rem] p-3 relative overflow-hidden">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-bg-primary rounded-b-2xl z-10" />
              {/* Screen Content */}
              <div className="w-full h-full bg-bg-primary rounded-[2rem] p-4 pt-8 overflow-hidden">
                {/* Mini Progress Bar */}
                <div className="w-full h-1 bg-border rounded-full mb-3">
                  <div className="w-3/10 h-full bg-accent rounded-full" style={{ width: '30%' }} />
                </div>
                <p className="text-xs text-text-secondary text-right mb-4">
                  Question 3 of 10
                </p>
                {/* Mini Question Card */}
                <div className="bg-bg-surface border border-border rounded-lg p-3 mb-3">
                  <p className="text-xs text-text-primary leading-relaxed">
                    Which cranial nerve carries taste from the anterior 2/3 of the tongue?
                  </p>
                </div>
                {/* Mini Options */}
                {['CN IX', 'CN VII ✓', 'CN V', 'CN X'].map((opt, i) => (
                  <div
                    key={i}
                    className={`mb-2 p-2 rounded border text-xs ${
                      i === 1
                        ? 'border-success bg-success/10 text-success'
                        : 'border-border text-text-secondary opacity-60'
                    }`}
                  >
                    {String.fromCharCode(65 + i)}. {opt}
                  </div>
                ))}
                {/* Mini Explanation */}
                <div className="border-l-2 border-accent bg-bg-surface rounded-r-lg p-2 mt-3">
                  <p className="text-[10px] text-text-secondary leading-relaxed">
                    The facial nerve (CN VII) carries taste via the chorda tympani...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
