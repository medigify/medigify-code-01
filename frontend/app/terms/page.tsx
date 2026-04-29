import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-text-primary mb-8">
        Terms of Service
      </h1>
      <div className="prose prose-invert max-w-none space-y-6 text-text-secondary leading-relaxed">
        <p>
          Welcome to Medigify. By accessing or using our platform, you agree to
          be bound by these Terms of Service.
        </p>
        <h2 className="font-heading text-xl font-semibold text-text-primary mt-8 mb-4">
          1. Use of Service
        </h2>
        <p>
          Medigify provides a medical education platform for practice questions,
          mock exams, and study tools. The content is for educational purposes
          only and should not be used as medical advice.
        </p>
        <h2 className="font-heading text-xl font-semibold text-text-primary mt-8 mb-4">
          2. User Conduct
        </h2>
        <p>
          You agree not to misuse the platform, share copyrighted content
          without permission, or attempt to reverse-engineer the service.
        </p>
        <h2 className="font-heading text-xl font-semibold text-text-primary mt-8 mb-4">
          3. Intellectual Property
        </h2>
        <p>
          All content on Medigify, including questions, explanations, and
          design, is the property of Medigify and protected by intellectual
          property laws.
        </p>
        <h2 className="font-heading text-xl font-semibold text-text-primary mt-8 mb-4">
          4. Disclaimer
        </h2>
        <p>
          Medigify is provided &ldquo;as is&rdquo; without warranty of any kind. We do not
          guarantee the accuracy of all questions or that the service will be
          uninterrupted.
        </p>
        <h2 className="font-heading text-xl font-semibold text-text-primary mt-8 mb-4">
          5. Changes
        </h2>
        <p>
          We reserve the right to update these terms at any time. Continued use
          of the platform constitutes acceptance of the updated terms.
        </p>
        <p className="text-sm mt-8">Last updated: March 2026</p>
      </div>
    </div>
  );
}
