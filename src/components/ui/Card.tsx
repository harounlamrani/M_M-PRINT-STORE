'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'hover' | 'interactive';
  dark?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', dark = false, children, ...props }, ref) => {
    const baseDefault = 'overflow-hidden rounded-lg border transition-all duration-normal';
    const baseHover = 'overflow-hidden rounded-lg border transition-all duration-normal hover:scale-[1.02]';
    const baseInteractive = 'overflow-hidden rounded-lg border transition-all duration-normal cursor-pointer';

    const variants = {
      default: cn(
        baseDefault,
        dark
          ? 'bg-gray-950 border-gray-700'
          : 'bg-white border-gray-200'
      ),
      hover: cn(
        baseHover,
        dark
          ? 'bg-gray-950 border-gray-700 hover:border-gray-600 hover:shadow-card-hover'
          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-card-hover'
      ),
      interactive: cn(
        baseInteractive,
        dark
          ? 'bg-gray-950 border-gray-700 hover:border-mm-red/50 hover:shadow-red'
          : 'bg-white border-gray-200 hover:border-mm-red/50 hover:shadow-red'
      ),
    };

    return (
      <div ref={ref} className={cn(variants[variant], className)} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pb-0', className)} {...props}>
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props}>
      {children}
    </div>
  )
);

CardContent.displayName = 'CardContent';

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props}>
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';