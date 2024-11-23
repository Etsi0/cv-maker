import { ChangeEvent } from 'react';
import Image from 'next/image';

import { useHeaderJsonContext } from '@/context/headerContext';

import { Input } from '@/components/ui/shadcn/input';
import { DoneLabel } from '@/components/ui/elements/label';

import { DeleteWrapper } from '@/components/deleteWrapper';
import { IconSelect } from '@/components/iconSelect';

import { SvgList } from '@/components/SVGs';
import { DeleteButton } from '../ui/deleteButton';

export default function HeaderSettings({ className }: { className?: string }) {
	const { HeaderJson, setHeaderJson } = useHeaderJsonContext();

	function SetImage(data: ChangeEvent<HTMLInputElement>) {
		const file = data.target.files?.[0];
		if (!file) {
			return;
		}

		const reader = new FileReader();
		reader.onload = function (event) {
			const temp = structuredClone(HeaderJson);
			if (event.target?.result && typeof event.target.result === 'string') {
				temp.img = event.target.result;
			} else {
				temp.img = '';
			}
			setHeaderJson(temp);
		};
		reader.readAsDataURL(file);
	}

	return (
		<div className={className}>
			<div className='flex items-start gap-[.375rem]'>
				<DeleteButton
					onClick={() => {
						const temp = structuredClone(HeaderJson);
						temp.img = '';
						setHeaderJson(temp);
					}}
				/>
				<DoneLabel>
					Image
					<DoneLabel className='place-content-start' tabIndex={0}>
						<div className='relative inline-block cursor-pointer overflow-hidden rounded-md transition before:absolute before:grid before:h-full before:w-full before:place-items-center before:bg-neutral-900/75 before:text-center before:text-white before:opacity-0 before:transition-opacity before:content-["Click_to_add_a_image"] before:hover:opacity-100'>
							{(HeaderJson.img && <Image className='aspect-square object-cover' src={HeaderJson.img} alt={'pfp'} width={96} height={96} />) || (
								<div className='h-24 w-24 bg-primary-50'></div>
							)}
						</div>
						<Input className='hidden bg-primary-50' type='file' accept='.png,.jpg,.jpeg,.webp' onChange={(event) => SetImage(event)} />
					</DoneLabel>
				</DoneLabel>
			</div>
			<DoneLabel>
				Name
				<Input
					value={HeaderJson.name}
					onChange={(event) => {
						const temp = structuredClone(HeaderJson);
						temp.name = event.target.value;
						setHeaderJson(temp);
					}}
				/>
			</DoneLabel>
			{HeaderJson.content.map((items, i) => (
				<DeleteWrapper
					className='grid-cols-2'
					key={`header-${i}`}
					onChange={(event) => {
						const temp = structuredClone(HeaderJson);
						const oldIndex = temp.content[i];
						temp.content.splice(i, 1);
						temp.content.splice(parseInt(event.target.value), 0, oldIndex);
						setHeaderJson(temp);
					}}
					onClick={() => {
						const temp = structuredClone(HeaderJson);
						temp.content.splice(i, 1);
						setHeaderJson(temp);
					}}
					type='horizontal'
					value={i}
				>
					<DoneLabel>
						Icon
						<IconSelect
							value={items.icon}
							onChange={(event) => {
								const temp = structuredClone(HeaderJson);
								temp.content[i].icon = event.target.value as keyof typeof SvgList;
								setHeaderJson(temp);
							}}
						/>
					</DoneLabel>
					<DoneLabel>
						Text
						<Input
							value={items.text}
							onChange={(event) => {
								const temp = structuredClone(HeaderJson);
								temp.content[i].text = event.target.value;
								setHeaderJson(temp);
							}}
						/>
					</DoneLabel>
				</DeleteWrapper>
			))}
			<button
				className='h-10 w-full rounded-md border bg-body-50 text-primary-500'
				onClick={() => {
					const temp = structuredClone(HeaderJson);
					temp.content.push({ icon: '', text: '' });
					setHeaderJson(temp);
				}}
			>
				ADD
			</button>
		</div>
	);
}
