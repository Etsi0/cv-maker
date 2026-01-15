import { cn, formInputWithCursor, focusVisibleOutline, disabledFormInput } from "@/lib/util";
import { TextareaHTMLAttributes } from "react";

type TTextarea = {
	className?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = ({ className, ...props }: TTextarea) => {
	return (
		<textarea
			className={cn(
				formInputWithCursor,
				focusVisibleOutline,
				disabledFormInput,
				className,
			)}
			{...props}
		/>
	);
};