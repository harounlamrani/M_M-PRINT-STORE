'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

/**
 * Magic UI "interactive hover button" — on hover the label slides out
 * while a duplicate label + arrow slides in. Adapted to MM PRINT brand
 * tokens (red button, white text, 8px radius).
 */
export const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ children, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        'group relative inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-md bg-mm-red px-8 py-4 text-body-lg font-medium text-white transition-colors duration-200 hover:bg-mm-red-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mm-red focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      {...props}
    >
      <span className="flex items-center gap-2">
        <span
          className="h-2 w-2 rounded-full bg-white transition-all duration-300 group-hover:scale-150"
          aria-hidden="true"
        />
        <span className="inline-block whitespace-nowrap transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
          {children}
        </span>
      </span>
      <span
        className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100"
        aria-hidden="true"
      >
        <span className="whitespace-nowrap">{children}</span>
        <ArrowRight className="h-5 w-5" aria-hidden="true" />
      </span>
    </button>
  );
});

InteractiveHoverButton.displayName = 'InteractiveHoverButton';
