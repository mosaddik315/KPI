import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

export const GOLDEN_RATIO = 1.61803398875;

// Fibonacci sequence for spacing
export const FIBONACCI = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
