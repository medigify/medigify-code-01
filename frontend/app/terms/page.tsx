import type { Metadata } from 'next';
import PolicyPage from '@/components/layout/PolicyPage';

export const metadata: Metadata = {
  title: 'Terms and Conditions',
};

export default function TermsPage() {
  return (
    <PolicyPage
      title="Terms and Conditions"
      intro={[
        'Welcome to Medigify. By accessing or using our platform, you agree to be bound by these Terms and Conditions.',
      ]}
      sections={[
        {
          heading: '1. Use of Service',
          paragraphs: [
            'Medigify provides a medical education platform for practice questions, mock exams, and study tools. The content is for educational purposes only and should not be used as medical advice.',
          ],
        },
        {
          heading: '2. User Conduct',
          paragraphs: [
            'You agree not to misuse the platform, share copyrighted content without permission, or attempt to reverse-engineer the service.',
          ],
        },
        {
          heading: '3. Intellectual Property',
          paragraphs: [
            'All content on Medigify, including questions, explanations, and design, is the property of Medigify and protected by intellectual property laws.',
          ],
        },
        {
          heading: '4. Disclaimer',
          paragraphs: [
            'Medigify is provided "as is" without warranty of any kind. We do not guarantee the accuracy of all questions or that the service will be uninterrupted.',
          ],
        },
        {
          heading: '5. Changes',
          paragraphs: [
            'We reserve the right to update these terms at any time. Continued use of the platform constitutes acceptance of the updated terms.',
          ],
        },
      ]}
      lastUpdated="March 2026"
    />
  );
}
