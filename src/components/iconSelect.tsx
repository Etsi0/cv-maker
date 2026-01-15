import { SelectHTMLAttributes } from 'react';
import { Option } from '@/components/ui/option';
import { SvgList } from './SVGs';
import { Select } from '@/components/ui/select';

type TIconSelect = {
	className?: string;
} & SelectHTMLAttributes<HTMLSelectElement>;

export function IconSelect({ className, ...props }: TIconSelect) {
	return (
		<>
			<Select className={className} {...props}>
				<Option hidden>Select</Option>
				{Object.keys(SvgList)
					.sort()
					.map((items) => (
						<Option key={items} value={items}>
							{items}
						</Option>
					))}
			</Select>
		</>
	);
}
