import { ChangeEvent, MouseEvent, ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { Input } from './ui/shadcn/input';
import { DoneLabel } from './ui/elements/label';
import { DeleteButton } from './ui/deleteButton';

type IDeleteWrapper = {
	children?: ReactNode;
	className?: string;
	onChange: (event: ChangeEvent<HTMLInputElement>) => void;
	onClick: (event: MouseEvent<HTMLButtonElement>) => void;
	type: 'horizontal' | 'vertical';
	value: number;
};
export function DeleteWrapper({ children, className, onChange, onClick, type, value }: IDeleteWrapper) {
	return (
		<>
			<div className='flex items-start gap-[.375rem] rounded-lg bg-body-50 p-3'>
				<div className='grid gap-[.375rem]'>
					<DoneLabel>Index</DoneLabel>
					<Input className='w-16' type='number' value={value} min={0} onChange={onChange} />
					{type === 'vertical' && <DeleteButton onClick={onClick} type={type} />}
				</div>
				<div className={cn('grid min-h-full flex-1 gap-[.375rem]', className)}>{children}</div>
				{type === 'horizontal' && (
					<div className='grid gap-[.375rem]'>
						<DeleteButton onClick={onClick} type={type} />
					</div>
				)}
			</div>
		</>
	);
}
