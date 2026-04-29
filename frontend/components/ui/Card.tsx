import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}

export default function Card({
  children,
  className = '',
  hoverable = false,
}: CardProps) {
  return (
    <div
      className={`bg-bg-surface border border-border rounded-lg p-6 ${
        hoverable
          ? 'transition-colors duration-150 hover:bg-bg-surface-hover hover:border-accent/30'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
