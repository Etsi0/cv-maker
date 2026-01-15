import { InputHTMLAttributes } from 'react';

import { cn, baseFormInput, focusVisibleOutline, disabledFormInput } from '@/lib/util';

type TInput = {
	className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: TInput) {
	return (
		<input
			className={cn(
				`${baseFormInput} accent-primary-500`,
				'file:border-0 file:bg-transparent file:text-sm file:font-medium',
				disabledFormInput,
				focusVisibleOutline,
				className,
			)}
			{...props}
		/>
	);
}
