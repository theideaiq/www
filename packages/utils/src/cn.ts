import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind CSS classes safely, resolving conflicts.
 * Combines `clsx` for conditional classes and `tailwind-merge` for conflict resolution.
 *
 * @param inputs - A list of class values (strings, objects, arrays).
 * @returns The merged class string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
