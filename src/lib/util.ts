import { twMerge } from 'tailwind-merge';
import { clsx, ClassValue } from 'clsx';

export const whenHoveringLink = 'hover:brightness-125 hover:active:brightness-150';
export const whenHoveringButton = 'hover:opacity-85 hover:active:opacity-50';

export const INPUT_DEBOUNCE_DELAY = 500;

// Form input base styles
export const baseFormInput = 'h-10 w-full px-3 py-2 border border-body-200 bg-body-100 rounded-md text-sm';
export const formInputWithCursor = 'cursor-pointer ' + baseFormInput;

// Focus styles
export const focusVisibleOutline = 'focus-visible:outline-primary-500 focus-visible:outline-2';

// Disabled styles
export const disabledFormInput = 'disabled:cursor-not-allowed disabled:opacity-50';
export const disabledState = 'cursor-not-allowed opacity-50';

// Button styles
export const buttonBase = 'cursor-pointer bg-body-100 w-full h-10 px-3 py-2 border border-body-200 rounded-md';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function clamp(min: number, value: number, max: number): number {
	return Math.max(min, Math.min(value, max));
}