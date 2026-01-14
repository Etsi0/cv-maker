import { MouseEvent } from 'react';
import { Label } from '@/components/ui/label';
import { Delete } from '@/components/SVGs';
import { cn } from '@/lib/utils';

type TDeleteButton = {
	onClick: (event: MouseEvent<HTMLButtonElement>) => void;
	type?: 'horizontal' | 'vertical'
	className?: string;
}

export function DeleteButton({ onClick, type = 'horizontal', className }: TDeleteButton) {
	return (
		<Label className={className}>
			Delete
			<button
				className={cn(
					'group h-10 rounded-md bg-primary-500 p-2 transition-colors hover:bg-red-200 focus-visible:bg-red-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-2',
					type === 'horizontal' && 'aspect-square',
				)}
				onClick={onClick}
			>
				<Delete className={cn('text-primary-50 transition-colors group-hover:text-red-500 group-focus-visible:text-red-500', type === 'vertical' && 'mx-auto h-full')} />
			</button>
		</Label>
	);
}
