import { LabelHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type TDoneLabel = {
	className?: string;
	children?: React.ReactNode;
} & LabelHTMLAttributes<HTMLLabelElement>;
export const DoneLabel = (prop: TDoneLabel) => {
	const { children, className, ...props } = prop;
	return (
		<label className={cn('peer-disabled:opacity-7 grid gap-[.375rem] text-sm font-medium leading-none peer-disabled:cursor-not-allowed', className)} {...props}>
			{children}
		</label>
	);
};
