import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { parseISO, format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path;
};

export function formatDateTime(isoString: string | undefined): string {
  if (!isoString) {
    return 'N/A';
  }
  try {
    const date = parseISO(isoString);
    return format(date, 'HH:mm dd/MM/yyyy');
  } catch (error) {
    console.error('Error parsing date:', error);
    return 'Invalid date';
  }
}

export function flattenArrays(nestedArrays: number[][]): number[] {
  if (!nestedArrays) {
    return [];
  }
  return nestedArrays.reduce((acc, curr) => acc.concat(curr), []);
}
