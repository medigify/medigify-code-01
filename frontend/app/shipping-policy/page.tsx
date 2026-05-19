import type { Metadata } from 'next';
import PolicyPage from '@/components/layout/PolicyPage';

export const metadata: Metadata = {
  title: 'Shipping Policy',
};

export default function ShippingPolicyPage() {
  return (
    <PolicyPage
      title="Shipping Policy"
      intro={[
        'Medigify operates as a digital-only platform. This policy explains how our services are delivered to you.',
      ]}
      sections={[
        {
          heading: '1. Digital Delivery',
          paragraphs: [
            'Medigify does not ship physical goods. All study materials, notes, and platform features are delivered electronically via our website.',
          ],
        },
        {
          heading: '2. Delivery Timeline',
          paragraphs: [
            'Access to premium features is typically granted immediately upon successful payment confirmation. You will receive an automated email notification once your transaction is processed.',
          ],
        },
        {
          heading: '3. Access Requirements',
          paragraphs: [
            'To access the service, you must have a compatible device and a stable internet connection. Medigify is not responsible for delivery failures resulting from user-side technical issues.',
          ],
        },
        {
          heading: '4. International Access',
          paragraphs: [
            'As a digital service, Medigify is available to users globally, provided they comply with our Terms and Conditions and local regulations.',
          ],
        },
      ]}
      lastUpdated="March 2026"
    />
  );
}
