import { ChangeEvent, ChangeEventHandler, Children, MouseEvent } from 'react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DeleteButton } from '@/components/ui/deleteButton';

type TDeleteWrapper = {
	children?: React.ReactNode;
	className?: string;
	onChange?: ChangeEventHandler<HTMLInputElement>;
	onClick: (event: MouseEvent<HTMLButtonElement>) => void;
	type: 'horizontal' | 'vertical';
	value: number;
};
export function DeleteWrapper({ children, className, onChange, onClick, type, value }: TDeleteWrapper) {
	const content = Children.toArray(children ?? []);

	return (
		<div className='grid gap-2'>
			<div className={cn(
				'grid gap-2',
				type === 'vertical' && 'grid-cols-[auto_minmax(0px,1fr)]',
				type === 'horizontal' && 'grid-cols-[auto_minmax(0px,1fr)_auto]'
			)}>
				<Label>
					Index
					<Input className={cn(className)} type='number' value={value} min={0} size={1} inputMode='numeric' onChange={onChange} />
				</Label>
				{content.shift()}
				<DeleteButton onClick={onClick} type={type} />
				{type === 'vertical' && content.shift()}
			</div>
			{content}
		</div>
	);
}
