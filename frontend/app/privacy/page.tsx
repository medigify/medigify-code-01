import type { Metadata } from 'next';
import PolicyPage from '@/components/layout/PolicyPage';

export const metadata: Metadata = {
  title: 'Privacy Policy',
};

export default function PrivacyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      intro={[
        'Your privacy is important to us. This policy explains how Medigify collects, uses, and protects your information.',
      ]}
      sections={[
        {
          heading: '1. Information We Collect',
          paragraphs: [
            'Currently, Medigify does not collect personal information. In future releases with user accounts, we may collect your name, email address, and usage data to improve the service.',
          ],
        },
        {
          heading: '2. How We Use Information',
          paragraphs: [
            'Any information collected will be used to provide and improve the Medigify service, including personalizing your learning experience and tracking progress.',
          ],
        },
        {
          heading: '3. Data Security',
          paragraphs: [
            'We implement industry-standard security measures to protect your information. However, no method of electronic transmission is 100% secure.',
          ],
        },
        {
          heading: '4. Third Parties',
          paragraphs: [
            'We do not sell, trade, or share your personal information with third parties except as required by law.',
          ],
        },
        {
          heading: '5. Changes',
          paragraphs: [
            'We may update this policy from time to time. Please check back periodically for changes.',
          ],
        },
      ]}
      lastUpdated="March 2026"
    />
  );
}
