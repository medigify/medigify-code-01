import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const policyLinks = [
    { href: '/terms', label: 'Terms and Conditions' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/return-refund-policy', label: 'Return / Refund Policy' },
    { href: '/shipping-policy', label: 'Shipping Policy' },
    { href: '/cancellation-policy', label: 'Cancellation Policy' },
  ];

  return (
    <footer className="border-t border-border bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 md:gap-4">
          {/* Logo & Tagline */}
          <div className="text-center md:text-left md:max-w-sm">
            <Image
              src="/logo.svg"
              alt="Medigify Logo"
              width={192}
              height={54}
              className="w-40 md:w-48 h-auto object-contain mx-auto md:mx-0"
            />
            <div className="text-text-secondary text-sm mt-4 space-y-1">
              <p className="font-medium text-text-primary">Clarity In Every Concept</p>
              <p>AI-powered MCQs | Structured Notes | Flashcards</p>
              <p className="italic text-accent">By Students, For Students</p>
            </div>
            <div className="mt-4 text-text-secondary text-sm">
              <p>For feedback/queries: email us at <a href="mailto:support@medigify.com" className="hover:text-accent transition-colors">support@medigify.com</a></p>
            </div>
          </div>

          {/* Links and Address */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm text-center md:text-left">
              {policyLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-text-secondary hover:text-text-primary transition-colors duration-150"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="mailto:support@medigify.com"
                className="text-text-secondary hover:text-text-primary transition-colors duration-150"
              >
                Contact Us
              </a>
            </div>

            <div className="text-center md:text-left text-text-secondary text-xs max-w-xs leading-relaxed">
              <p>Boys Hostel, House # 1 Street 20, Shalimar Link Road, Lahore</p>
              <p className="mt-1">+92-300-4084760</p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 mt-2 text-sm">
              <a href="https://instagram.com/Medigify" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent transition-colors">
                Instagram
              </a>
              <a href="https://www.linkedin.com/company/medigify" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent transition-colors">
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex justify-center items-center text-text-secondary text-sm">
          <p>© 2026 Medigify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
