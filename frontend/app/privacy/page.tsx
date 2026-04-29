import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-text-primary mb-8">
        Privacy Policy
      </h1>
      <div className="prose prose-invert max-w-none space-y-6 text-text-secondary leading-relaxed">
        <p>
          Your privacy is important to us. This policy explains how Medigify
          collects, uses, and protects your information.
        </p>
        <h2 className="font-heading text-xl font-semibold text-text-primary mt-8 mb-4">
          1. Information We Collect
        </h2>
        <p>
          Currently, Medigify does not collect personal information. In future
          releases with user accounts, we may collect your name, email address,
          and usage data to improve the service.
        </p>
        <h2 className="font-heading text-xl font-semibold text-text-primary mt-8 mb-4">
          2. How We Use Information
        </h2>
        <p>
          Any information collected will be used to provide and improve the
          Medigify service, including personalizing your learning experience and
          tracking progress.
        </p>
        <h2 className="font-heading text-xl font-semibold text-text-primary mt-8 mb-4">
          3. Data Security
        </h2>
        <p>
          We implement industry-standard security measures to protect your
          information. However, no method of electronic transmission is 100%
          secure.
        </p>
        <h2 className="font-heading text-xl font-semibold text-text-primary mt-8 mb-4">
          4. Third Parties
        </h2>
        <p>
          We do not sell, trade, or share your personal information with third
          parties except as required by law.
        </p>
        <h2 className="font-heading text-xl font-semibold text-text-primary mt-8 mb-4">
          5. Changes
        </h2>
        <p>
          We may update this policy from time to time. Please check back
          periodically for changes.
        </p>
        <p className="text-sm mt-8">Last updated: March 2026</p>
      </div>
    </div>
  );
}
