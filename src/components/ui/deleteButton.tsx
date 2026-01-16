import { MouseEvent } from 'react';
import { Label } from '@/components/ui/label';
import { Delete } from '@/components/SVGs';
import { cn } from '@/lib/util';
import { LinkButton } from '@/components/ui/link';

type TDeleteButton = {
	onClick: (event: MouseEvent<HTMLButtonElement>) => void;
	type?: 'horizontal' | 'vertical'
	className?: string;
}

export function DeleteButton({ onClick, type = 'horizontal', className }: TDeleteButton) {
	return (
		<Label className={className}>
			Delete
			<LinkButton
				className={cn(
					'group h-10 bg-primary-500 p-2 border border-primary-400 rounded-md transition-colors',
					'dark:not-[:is(:hover,_:focus-visible)]:border-primary-600',
					'hover:bg-red-200 hover:border-red-300',
					'focus-visible:bg-red-200 focus-visible:border-red-300 focus-visible:outline-red-300',
					type === 'horizontal' && 'aspect-square',
				)}
				onClick={onClick}
			>
				<Delete
					className={cn(
						'text-primary-50 transition-colors',
						'group-hover:text-red-500 group-focus-visible:text-red-500',
						type === 'vertical' && 'mx-auto h-full'
					)}
				/>
			</LinkButton>
		</Label>
	);
}
