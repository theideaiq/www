import type { PropsWithChildren } from 'react';

export function Button({
  children,
  isLoading,
  ...props
}: PropsWithChildren<
  { isLoading?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>
>) {
  return (
    <button {...props} disabled={isLoading}>
      {isLoading ? 'Loading...' : children}
    </button>
  );
}

export function Card({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return <div className={className}>{children}</div>;
}

export function Input({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label>
      {label}
      <input {...props} />
    </label>
  );
}

export function Sheet({ children }: PropsWithChildren) {
  return <div>{children}</div>;
}

export function SheetContent({ children }: PropsWithChildren) {
  return <div>{children}</div>;
}

export function SheetTrigger({ children }: PropsWithChildren) {
  return <div>{children}</div>;
}
