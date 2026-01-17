import { cn } from '@/lib/util';
import { DialogHTMLAttributes, ReactNode, forwardRef } from 'react';

type TDialog = DialogHTMLAttributes<HTMLDialogElement> & {
	className?: string;
	children: ReactNode;
};

export const Dialog = forwardRef<HTMLDialogElement, TDialog>(function Dialog({ className, children, ...props }, ref) {
	return (
		<dialog ref={ref} className={cn('border-body-100 bg-body-50 m-auto rounded-xl border p-8 backdrop:bg-black/25', className)} {...props}>
			{children}
		</dialog>
	);
});