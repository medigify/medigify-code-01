import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Tagline */}
          <div className="text-center md:text-left">
            <span className="font-heading text-lg font-bold">
              <span className="text-accent">M</span>
              <span className="text-text-primary">edigify</span>
            </span>
            <p className="text-text-secondary text-sm mt-1">
              Made for Pakistani medical students
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/terms"
              className="text-text-secondary hover:text-text-primary transition-colors duration-150"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="text-text-secondary hover:text-text-primary transition-colors duration-150"
            >
              Privacy Policy
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-text-secondary text-sm">
            © 2026 Medigify. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
