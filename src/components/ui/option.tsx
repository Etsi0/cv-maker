import { OptionHTMLAttributes } from 'react';
import { cn } from '@/lib/util';

type TOption = {
	className?: string;
} & OptionHTMLAttributes<HTMLOptionElement>;
export const Option = ({ className, children, ...props }: TOption) => (
	<option className={cn(className)} {...props}>
		{children}
	</option>
);
