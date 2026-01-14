'use client';

import { InputHTMLAttributes, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Label } from './label';

type SwitchProps = {
	label?: string;
	className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

export const Switch = ({ label = 'THIS TEXT SHOULD NOT BE HERE', className, disabled, ...props }: SwitchProps) => {
	const inputRef = useRef<HTMLInputElement>(null);

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			inputRef.current?.click();
		}
	};

	return (
		<Label
			className={cn(
				'cursor-pointer flex items-center [--height:1.33lh] [--aspect-ratio:2]',
				disabled && 'cursor-not-allowed',
				className
			)}
		>
			{label}
			<input
				ref={inputRef}
				type="checkbox"
				className="peer sr-only"
				disabled={disabled}
				onKeyDown={handleKeyPress}
				{...props}
			/>
			<span
				className={cn(
					'relative inline-block bg-body-100 h-(--height) aspect-(--aspect-ratio) rounded-full ml-2 peer-focus-visible:outline-primary-500 transition-colors duration-[calc(150ms*1.414)] peer-checked:bg-primary-500',
					'before:absolute before:bg-white before:h-[calc(var(--height)*0.666)] before:aspect-square before:top-[calc(var(--height)*0.167)] before:left-[calc(var(--height)*0.167)] before:rounded-full before:transition-[left] before:duration-[calc(150ms*1.414)] peer-checked:before:left-[calc(var(--height)*var(--aspect-ratio)-var(--height)*0.666-var(--height)*0.167)]',
					!disabled && 'hover:opacity-87',
				)}
			/>
		</Label>
	);
};