import { InputHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

type TInput = {
	className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: TInput) {
	return (
		<input
			className={cn(
				`flex h-10 w-full rounded-md border border-body-200 bg-body-100 px-3 py-2 text-sm accent-primary-500 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-primary-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`,
				className,
			)}
			{...props}
		/>
	);
}
