import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function FinalCTA() {
  return (
    <section className="py-16 md:py-24 bg-bg-surface border-t border-border" aria-labelledby="final-cta-heading">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2
          id="final-cta-heading"
          className="font-heading text-3xl md:text-4xl font-bold text-text-primary"
        >
          Your Exams Won&apos;t Wait. Neither Should You.
        </h2>
        <div className="mt-8">
          <Link href="/practice">
            <Button variant="filled" size="lg">
              Start Practicing Now. It&apos;s Free
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
