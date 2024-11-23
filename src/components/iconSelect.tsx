import { SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Option } from '@/components/ui/elements/option';
import { SvgList } from './SVGs';

type TIconSelect = {
	className?: string;
} & SelectHTMLAttributes<HTMLSelectElement>;

export function IconSelect({ className, ...props }: TIconSelect) {
	return (
		<>
			<select className={cn('h-10 w-full rounded-md border bg-body-50 px-3 py-2 text-sm text-primary-500', className)} {...props}>
				<Option hidden>Select</Option>
				{Object.keys(SvgList)
					.sort()
					.map((items) => (
						<Option key={items} value={items}>
							{items}
						</Option>
					))}
			</select>
		</>
	);
}
