import { cn } from '@/lib/utils';

import { mainTypes, useMainSectionJsonContext } from '@/context/mainSectionContext';

import { Input } from '@/components/ui/shadcn/input';
import { Option } from '@/components/ui/elements/option';
import { DoneLabel } from '@/components/ui/elements/label';

import { DeleteWrapper } from '../deleteWrapper';

import { SvgList } from '../SVGs';
import { IconSelect } from '../iconSelect';

export default function MainSectionSettings({ className }: { className?: string }) {
	const { MainSectionJson, setMainSectionJson } = useMainSectionJsonContext();

	return (
		<div className={className}>
			{MainSectionJson.map((items, i) => (
				<div key={`main-${i}`} className='grid gap-2'>
					{/*==================================================
						Category Icon & Title & Type & Hidden
					==================================================*/}
					<DeleteWrapper
						className='grid-cols-2'
						onChange={(event) => {
							const temp = structuredClone(MainSectionJson);
							const oldIndex = temp[i];
							temp.splice(i, 1);
							temp.splice(parseInt(event.target.value), 0, oldIndex);
							setMainSectionJson(temp);
						}}
						onClick={() => {
							const temp = structuredClone(MainSectionJson);
							temp.splice(i, 1);
							setMainSectionJson(temp);
						}}
						type='vertical'
						value={i}
					>
						<DoneLabel>
							Icon
							<IconSelect
								value={items.icon}
								onChange={(event) => {
									const temp = structuredClone(MainSectionJson);
									temp[i].icon = event.target.value as keyof typeof SvgList;
									setMainSectionJson(temp);
								}}
							/>
						</DoneLabel>
						<DoneLabel>
							Title
							<Input
								value={items.title}
								onChange={(event) => {
									const temp = structuredClone(MainSectionJson);
									temp[i].title = event.target.value;
									setMainSectionJson(temp);
								}}
							/>
						</DoneLabel>
						<DoneLabel>
							Type
							<select
								className='h-10 w-full rounded-md border bg-body-50 px-3 py-2 text-sm text-primary-500'
								onChange={(event) => {
									const eValue = event.target.value;
									if (eValue === 'default' || eValue === 'card') {
										const temp = structuredClone(MainSectionJson);
										temp[i].type = eValue;
										setMainSectionJson(temp);
									}
								}}
								value={items.type}
							>
								{mainTypes.map((item, j) => (
									<Option key={`main-${i}-option-${j}`} value={item}>
										{String(item).charAt(0).toUpperCase() + String(item).slice(1)}
									</Option>
								))}
							</select>
						</DoneLabel>
						<DoneLabel>
							Hide Content
							<Input
								className='w-10'
								type='checkbox'
								checked={items.hidden}
								onChange={(event) => {
									const temp = structuredClone(MainSectionJson);
									temp[i].hidden = event.target.checked;
									setMainSectionJson(temp);
								}}
							/>
						</DoneLabel>
					</DeleteWrapper>
					<div className='relative space-y-4 py-2 pl-8 before:absolute before:left-[calc(2rem_/_2_-_1px)] before:top-0 before:h-full before:w-[2px] before:rounded-full before:bg-primary-500'>
						{/*==================================================
							Content
						==================================================*/}
						{items.content.map((item, j) => (
							<DeleteWrapper
								className='grid-cols-2'
								key={`main-${i}-content-${j}`}
								onChange={(event) => {
									const temp = structuredClone(MainSectionJson);
									const oldIndex = temp[i].content[j];
									temp[i].content.splice(j, 1);
									temp[i].content.splice(parseInt(event.target.value), 0, oldIndex);
									setMainSectionJson(temp);
								}}
								onClick={() => {
									const temp = structuredClone(MainSectionJson);
									temp[i].content.splice(j, 1);
									setMainSectionJson(temp);
								}}
								type='vertical'
								value={j}
							>
								<DoneLabel>
									Title
									<Input
										value={item.title}
										onChange={(event) => {
											const temp = structuredClone(MainSectionJson);
											temp[i].content[j].title = event.target.value;
											setMainSectionJson(temp);
										}}
									/>
								</DoneLabel>
								<DoneLabel>
									Sub Title
									<Input
										value={item.subTitle}
										onChange={(event) => {
											setMainSectionJson((prevState) => {
												const newState = [...prevState];
												newState[i].content[j].subTitle = event.target.value;
												return newState;
											});
										}}
									/>
								</DoneLabel>
								<DoneLabel className='col-span-2'>
									Text
									<textarea
										className='h-36 rounded-md border p-3 text-sm text-primary-500'
										value={item.text}
										onChange={(event) => {
											const temp = structuredClone(MainSectionJson);
											temp[i].content[j].text = event.target.value;
											setMainSectionJson(temp);
										}}
									/>
								</DoneLabel>
							</DeleteWrapper>
						))}
						<button
							className={cn('h-10 w-full rounded-md border bg-body-50 text-primary-500')}
							onClick={() => {
								const temp = structuredClone(MainSectionJson);
								temp[i].content.push({
									title: '',
									subTitle: '',
									text: '',
								});
								setMainSectionJson(temp);
							}}
						>
							ADD SECTION ITEM
						</button>
					</div>
				</div>
			))}
			<button
				className={cn('h-10 w-full rounded-md border bg-body-50 text-primary-500')}
				onClick={() => {
					const temp = structuredClone(MainSectionJson);
					temp.push({
						content: [
							{
								title: '',
								subTitle: '',
								text: '',
							},
						],
						hidden: false,
						icon: '',
						title: '',
						type: 'default',
					});
					setMainSectionJson(temp);
				}}
			>
				ADD SECTION
			</button>
		</div>
	);
}
