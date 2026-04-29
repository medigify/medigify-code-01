import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'ghost' | 'disabled-coming-soon';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  fullWidth?: boolean;
}

export default function Button({
  variant = 'filled',
  size = 'md',
  children,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center font-body font-medium rounded-md transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 min-h-[48px]';

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    filled:
      'bg-accent text-white hover:bg-accent-hover active:bg-accent-hover',
    ghost:
      'border border-accent text-accent hover:bg-accent/10 active:bg-accent/20',
    'disabled-coming-soon':
      'bg-bg-surface-hover text-text-secondary border border-border cursor-not-allowed opacity-70',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const isComingSoon = variant === 'disabled-coming-soon';

  return (
    <div className="relative group inline-flex">
      <button
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`}
        disabled={disabled || isComingSoon}
        {...props}
      >
        {children}
      </button>
      {isComingSoon && (
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs bg-bg-surface text-text-secondary px-2 py-1 rounded border border-border opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50">
          Coming Soon
        </span>
      )}
    </div>
  );
}
