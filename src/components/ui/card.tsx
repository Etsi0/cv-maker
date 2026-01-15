import { cn } from "@/lib/util";
import { HTMLAttributes } from "react";

type TCard = {
	className?: string;
} & HTMLAttributes<HTMLDivElement>;

export function Card({ className, children, ...props }: TCard) {
	return (
		<div className={cn('grid gap-3 bg-body-50 p-4 border border-body-100 rounded-md shadow-md', className)} {...props}>
			{children}
		</div>
	);
}