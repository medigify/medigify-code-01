import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <span className="text-7xl md:text-9xl font-heading font-bold text-accent/20">
        404
      </span>
      <h1 className="mt-4 font-heading text-2xl md:text-3xl font-bold text-text-primary">
        Page Not Found
      </h1>
      <p className="mt-2 text-text-secondary max-w-md">
        The page you&apos;re looking for doesn&apos;t exist. Maybe it was moved or you
        mistyped the URL.
      </p>
      <div className="mt-8">
        <Link href="/">
          <Button variant="filled" size="md">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
