import { LabelHTMLAttributes } from 'react';
import { cn } from '@/lib/util';

type TLabel = {
	className?: string;
	children?: React.ReactNode;
} & LabelHTMLAttributes<HTMLLabelElement>;
export const Label = (prop: TLabel) => {
	const { children, className, ...props } = prop;
	return (
		<label className={cn('grid gap-1.5 text-sm font-medium', className)} {...props}>
			{children}
		</label>
	);
};
