import React from 'react';
import type { Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function SessionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="overflow-x-hidden">{children}</div>;
}
