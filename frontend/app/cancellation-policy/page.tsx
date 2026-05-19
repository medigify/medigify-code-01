import type { Metadata } from 'next';
import PolicyPage from '@/components/layout/PolicyPage';

export const metadata: Metadata = {
  title: 'Cancellation Policy',
};

export default function CancellationPolicyPage() {
  return (
    <PolicyPage
      title="Cancellation Policy"
      intro={[
        'This policy governs how you can manage or terminate your relationship with Medigify.',
      ]}
      sections={[
        {
          heading: '1. Subscription Cancellation',
          paragraphs: [
            'If you are on a recurring subscription plan, you may cancel your membership at any time through your account settings. To avoid the next billing cycle, cancellations must be made at least 24 hours before the renewal date.',
          ],
        },
        {
          heading: '2. Access After Cancellation',
          paragraphs: [
            'Upon cancellation, you will retain access to premium features until the end of your current paid billing period. No further charges will be applied once the cancellation is confirmed.',
          ],
        },
        {
          heading: '3. Service Termination',
          paragraphs: [
            'We reserve the right to suspend or terminate your account without notice if you violate our Terms and Conditions, including engaging in unauthorized content sharing or scraping.',
          ],
        },
        {
          heading: '4. No Partial Refunds',
          paragraphs: [
            'We do not provide prorated refunds for mid-month cancellations or unused portions of a subscription term.',
          ],
        },
      ]}
      lastUpdated="March 2026"
    />
  );
}
