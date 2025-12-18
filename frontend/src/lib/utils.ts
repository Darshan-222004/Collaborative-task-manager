import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes conditionally.
 * Combines clsx for conditional logic and tailwind-merge for handling conflicts.
 * 
 * @param {...ClassValue[]} inputs - Class names or conditional objects
 * @returns {string} Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
