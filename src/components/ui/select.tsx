import { cn, disabledFormInput, focusVisibleOutline, formInputWithCursor } from "@/lib/util";
import { SelectHTMLAttributes } from "react";

type TSelect = {
	className?: string;
} & SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...props }: TSelect) {
	return (
		<select
			className={cn(
				formInputWithCursor,
				disabledFormInput,
				focusVisibleOutline,
				className,
			)}
			{...props}
		>
			{children}
		</select>
	);
}