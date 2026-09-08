'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, fullWidth, disabled, children, ...props }, ref) => {
    // Base styles matching .btn from globals.css
    const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-body-md font-medium transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mm-red focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed';

    // Variants matching globals.css exactly (.btn-primary, .btn-secondary, .btn-ghost, .btn-outline)
    const variants = {
      // Commander - Primary CTA
      primary: 'bg-mm-red text-white hover:bg-mm-red-dark active:bg-mm-red-dark/90',
      // Secondary - Light theme only (gray-100 bg, black text)
      secondary: 'bg-gray-100 text-black hover:bg-gray-200 active:bg-gray-200/90 border border-gray-300',
      // Ghost - Light theme only (transparent, black text, gray-100 hover)
      ghost: 'bg-transparent text-black hover:bg-gray-100 active:bg-gray-100/50',
      // Outline - WhatsApp style (red border, red text, red bg on hover)
      outline: 'border-2 border-mm-red text-mm-red hover:bg-mm-red hover:text-white active:bg-mm-red-dark',
    };

    // Size adjustments applied on top of base .btn (which is md)
    const sizes = {
      sm: 'px-4 py-2 text-body-sm rounded-md',
      md: '', // Base .btn already has px-6 py-3 text-body-md rounded-md
      lg: 'px-8 py-4 text-body-lg rounded-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], fullWidth && 'w-full', className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';