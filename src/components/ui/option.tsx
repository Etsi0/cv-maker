import { OptionHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type TOption = {
	className?: string;
} & OptionHTMLAttributes<HTMLOptionElement>;
export const Option = ({ className, children, ...props }: TOption) => (
	<option className={cn(`text-primary-500`, className)} {...props}>
		{children}
	</option>
);
