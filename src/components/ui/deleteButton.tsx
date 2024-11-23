import { MouseEvent } from 'react';
import { DoneLabel } from '@/components/ui/elements/label';
import { Delete } from '@/components/SVGs';
import { cn } from '@/lib/utils';

export function DeleteButton({ onClick, type = 'horizontal' }: { onClick: (event: MouseEvent<HTMLButtonElement>) => void; type?: 'horizontal' | 'vertical' }) {
	return (
		<DoneLabel>
			Delete
			<button
				className={cn(
					'group h-10 rounded-md bg-primary-500 p-2 transition-colors hover:bg-red-200 focus-visible:bg-red-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-2',
					type === 'horizontal' && 'aspect-square',
				)}
				onClick={onClick}
			>
				<Delete className={cn('text-input transition-colors group-hover:text-red-500 group-focus-visible:text-red-500', type === 'vertical' && 'mx-auto h-full')} />
			</button>
		</DoneLabel>
	);
}
