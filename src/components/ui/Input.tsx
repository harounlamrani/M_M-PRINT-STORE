'use client';

import { forwardRef, InputHTMLAttributes, LabelHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  dark?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, dark = false, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className={cn(
            'block mb-2 text-body-sm font-medium',
            dark ? 'text-white' : 'text-black'
          )}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-md px-4 py-3 text-body-md border transition-all duration-fast',
            dark
              ? 'bg-gray-800 text-white placeholder:text-gray-500 border-gray-700 focus:border-mm-red focus:ring-2 focus:ring-mm-red/20'
              : 'bg-white text-black placeholder:text-gray-400 border-gray-300 focus:border-mm-red focus:ring-2 focus:ring-mm-red/20',
            error && 'border-mm-red',
            'focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-body-sm text-mm-red" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className={cn('mt-1.5 text-body-sm', dark ? 'text-zinc-400' : 'text-gray-500')}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  dark?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, dark = false, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className={cn(
            'block mb-2 text-body-sm font-medium',
            dark ? 'text-white' : 'text-black'
          )}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full rounded-md px-4 py-3 text-body-md border transition-all duration-fast resize-y min-h-[100px]',
            dark
              ? 'bg-gray-800 text-white placeholder:text-gray-500 border-gray-700 focus:border-mm-red focus:ring-2 focus:ring-mm-red/20'
              : 'bg-white text-black placeholder:text-gray-400 border-gray-300 focus:border-mm-red focus:ring-2 focus:ring-mm-red/20',
            error && 'border-mm-red',
            'focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
          {...props}
        />
        {error && (
          <p id={`${textareaId}-error`} className="mt-1.5 text-body-sm text-mm-red" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${textareaId}-helper`} className={cn('mt-1.5 text-body-sm', dark ? 'text-zinc-400' : 'text-gray-500')}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  dark?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, placeholder, id, dark = false, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    // SVG arrow for light theme (encoded for CSS url())
    const lightArrow = 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E';
    // SVG arrow for dark theme (encoded for CSS url())
    const darkArrow = 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23FFFFFF%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E';

    const darkSelectStyles = 'bg-gray-800 text-white placeholder:text-gray-500 border-gray-700 focus:border-mm-red focus:ring-2 focus:ring-mm-red/20';
    const lightSelectStyles = 'bg-white text-black placeholder:text-gray-400 border-gray-300 focus:border-mm-red focus:ring-2 focus:ring-mm-red/20';
    const arrow = dark ? darkArrow : lightArrow;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className={cn(
            'block mb-2 text-body-sm font-medium',
            dark ? 'text-white' : 'text-black'
          )}>
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'w-full rounded-md px-4 py-3 text-body-md border transition-all duration-fast appearance-none pr-10',
            dark ? darkSelectStyles : lightSelectStyles,
            error && 'border-mm-red',
            'focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
          style={{ backgroundImage: `url("${arrow}")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center' }}
          {...props}
        >
          {placeholder && (
            <option value="" disabled selected>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={`${selectId}-error`} className="mt-1.5 text-body-sm text-mm-red" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${selectId}-helper`} className={cn('mt-1.5 text-body-sm', dark ? 'text-zinc-400' : 'text-gray-500')}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';