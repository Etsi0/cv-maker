import { twMerge } from 'tailwind-merge';
import { clsx, ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Debounce delay for input fields (in milliseconds)
export const INPUT_DEBOUNCE_DELAY = 500;

export function clamp(min: number, value: number, max: number): number {
	return Math.max(min, Math.min(value, max));
}