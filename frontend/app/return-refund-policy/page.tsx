import type { Metadata } from 'next';
import PolicyPage from '@/components/layout/PolicyPage';

export const metadata: Metadata = {
  title: 'Return / Refund Policy',
};

export default function ReturnRefundPolicyPage() {
  return (
    <PolicyPage
      title="Return / Refund Policy"
      intro={[
        'We want you to have a positive experience with Medigify. Because our products are digital, this policy outlines the conditions for refunds.',
      ]}
      sections={[
        {
          heading: '1. Nature of Digital Goods',
          paragraphs: [
            'Since Medigify provides immediate access to digital study materials, flashcards, and mock exams, all purchases are generally non-refundable once access has been granted to the user account.',
          ],
        },
        {
          heading: '2. Refund Eligibility',
          paragraphs: [
            'Refunds may be considered on a case-by-case basis under the following circumstances:',
          ],
          bullets: [
            'A technical defect prevents you from accessing the content, and our support team is unable to resolve the issue within 72 hours.',
            'Duplicate payments made due to a processing error by the payment gateway.',
          ],
        },
        {
          heading: '3. Refund Process',
          paragraphs: [
            'To request a refund, please contact us within 7 days of your purchase. You must provide proof of purchase and a detailed description of the issue.',
          ],
        },
        {
          heading: '4. Non-Refundable Items',
          paragraphs: [
            'Refunds will not be issued for "change of mind" or if the user has already completed a significant portion of the available mock exams or study modules.',
          ],
        },
      ]}
      lastUpdated="March 2026"
    />
  );
}
