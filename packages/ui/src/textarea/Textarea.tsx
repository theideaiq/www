import { cn } from '@repo/utils';
import type React from 'react';
import { useId } from 'react';

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className, ...props }: TextareaProps) {
  const uniqueId = useId();
  const id = props.id || uniqueId;
  const errorId = `${id}-error`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          'w-full px-4 py-3 rounded-lg border bg-white transition-all outline-none min-h-[120px] resize-y',
          error
            ? 'border-red-500 focus:ring-2 focus:ring-red-200'
            : 'border-slate-200 focus:border-brand-pink focus:ring-2 focus:ring-pink-100',
          className,
        )}
        {...props}
      />
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
