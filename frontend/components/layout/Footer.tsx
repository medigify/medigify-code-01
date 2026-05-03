import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 md:gap-4">
          {/* Logo & Tagline */}
          <div className="text-center md:text-left md:max-w-sm">
            <img src="/logo.svg" alt="Medigify Logo" className="w-40 md:w-48 h-auto object-contain mx-auto md:mx-0" />
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
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-sm">
              <Link href="/terms" className="text-text-secondary hover:text-text-primary transition-colors duration-150">Terms of Service</Link>
              <Link href="/privacy" className="text-text-secondary hover:text-text-primary transition-colors duration-150">Privacy Policy</Link>
              <a href="mailto:support@medigify.com" className="text-text-secondary hover:text-text-primary transition-colors duration-150">Contact Us</a>
            </div>
            
            <div className="text-center md:text-left text-text-secondary text-xs max-w-xs leading-relaxed">
              Boys Hostel, House # 1 Street 20, Shalimar Link Road, Lahore
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
