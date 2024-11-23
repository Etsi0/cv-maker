import { cn } from '@/lib/utils';

import { sidebarContent, sidebarType, useSidebarJsonContext } from '@/context/sidebarContext';

import { Input } from '@/components/ui/shadcn/input';
import { DoneLabel } from '@/components/ui/elements/label';
import { DeleteWrapper } from '@/components/deleteWrapper';
import { Option } from '@/components/ui/elements/option';

export default function SidebarSettings({ className }: { className?: string }) {
	const { SidebarJson, setSidebarJson } = useSidebarJsonContext();

	return (
		SidebarJson && (
			<div className={cn('grid gap-10', className)}>
				{SidebarJson.map((items, i) => (
					<div key={`sidebar-${i}`} className='grid gap-2'>
						<DeleteWrapper
							onChange={(event) => {
								const temp = structuredClone(SidebarJson);
								const oldIndex = temp[i];
								temp.splice(i, 1);
								temp.splice(parseInt(event.target.value), 0, oldIndex);
								setSidebarJson(temp);
							}}
							onClick={() => {
								const temp = structuredClone(SidebarJson);
								temp.splice(i, 1);
								setSidebarJson(temp);
							}}
							type='horizontal'
							value={i}
						>
							<DoneLabel>
								Title
								<Input
									className='text-center text-base font-semibold'
									value={items.title}
									onChange={(event) => {
										const temp = [...SidebarJson];
										temp[i].title = event.target.value;
										setSidebarJson(temp);
									}}
								/>
							</DoneLabel>
						</DeleteWrapper>
						<div className='relative space-y-4 py-2 pl-8 before:absolute before:left-[calc(2rem_/_2_-_1px)] before:top-0 before:h-full before:w-[2px] before:rounded-full before:bg-primary-500'>
							{items.content.map((item, j) => {
								switch (item.type) {
									case 'text':
										return (
											<DeleteWrapper
												key={`sidebar-${i}-content-${j}`}
												onChange={(event) => {
													const temp = structuredClone(SidebarJson);
													const oldIndex = temp[i].content[j];
													temp[i].content.splice(j, 1);
													temp[i].content.splice(parseInt(event.target.value), 0, oldIndex);
													setSidebarJson(temp);
												}}
												onClick={() => {
													const temp = structuredClone(SidebarJson);
													temp[i].content.splice(j, 1);
													setSidebarJson(temp);
												}}
												type='vertical'
												value={j}
											>
												<DoneLabel>
													Type
													<select
														className='h-10 w-full rounded-md border bg-body-50 px-3 py-2 text-sm text-primary-500'
														onChange={(event) => {
															const eValue = event.target.value as (typeof sidebarType)[number];
															if (sidebarType.includes(eValue)) {
																const temp = structuredClone(SidebarJson);
																temp[i].content[j].type = eValue;
																temp[i].content[j].content = sidebarContent[eValue];
																setSidebarJson(temp);
															}
														}}
														value={item.type}
													>
														{sidebarType.map((type, x) => (
															<Option key={`sidebar-${i}-content-${j}-option-${x}`} value={type}>
																{String(type).charAt(0).toUpperCase() + String(type).slice(1)}
															</Option>
														))}
													</select>
												</DoneLabel>
												<DoneLabel>
													Text
													<Input
														value={item.content}
														onChange={(event) => {
															const temp = structuredClone(SidebarJson);
															temp[i].content[j].content = event.target.value;
															setSidebarJson(temp);
														}}
													/>
												</DoneLabel>
											</DeleteWrapper>
										);
									case 'link':
										return (
											<DeleteWrapper
												key={`sidebar-${i}-content-${j}`}
												onChange={(event) => {
													const temp = structuredClone(SidebarJson);
													const oldIndex = temp[i].content[j];
													temp[i].content.splice(j, 1);
													temp[i].content.splice(parseInt(event.target.value), 0, oldIndex);
													setSidebarJson(temp);
												}}
												onClick={() => {
													const temp = structuredClone(SidebarJson);
													temp[i].content.splice(j, 1);
													setSidebarJson(temp);
												}}
												type='vertical'
												value={j}
											>
												<DoneLabel>
													Type
													<select
														className='h-10 w-full rounded-md border bg-body-50 px-3 py-2 text-sm text-primary-500'
														onChange={(event) => {
															const eValue = event.target.value as (typeof sidebarType)[number];
															if (sidebarType.includes(eValue)) {
																const temp = structuredClone(SidebarJson);
																temp[i].content[j].type = eValue;
																temp[i].content[j].content = sidebarContent[eValue];
																setSidebarJson(temp);
															}
														}}
														value={item.type}
													>
														{sidebarType.map((type, x) => (
															<Option key={`sidebar-${i}-content-${j}-option-${x}`} value={type}>
																{String(type).charAt(0).toUpperCase() + String(type).slice(1)}
															</Option>
														))}
													</select>
												</DoneLabel>
												<DoneLabel>
													Label
													<Input
														value={item.content.text}
														onChange={(event) => {
															const temp = structuredClone(SidebarJson);
															if (temp[i].content[j].type === 'link') {
																temp[i].content[j].content.text = event.target.value;
																setSidebarJson(temp);
															}
														}}
													/>
												</DoneLabel>
												<DoneLabel>
													Link
													<Input
														value={item.content.href}
														onChange={(event) => {
															const temp = structuredClone(SidebarJson);
															if (temp[i].content[j].type === 'link') {
																temp[i].content[j].content.href = event.target.value;
																setSidebarJson(temp);
															}
														}}
													/>
												</DoneLabel>
											</DeleteWrapper>
										);
									case 'grid':
										return (
											<div key={j} className='grid grid-cols-2 gap-4'>
												{item.content.map((gridContent, x) => (
													<DeleteWrapper
														key={`sidebar-${i}-content-${j}-grid-${x}`}
														onChange={(event) => {
															const temp = structuredClone(SidebarJson);
															const oldIndex = temp[i].content[j];
															temp[i].content.splice(j, 1);
															temp[i].content.splice(parseInt(event.target.value), 0, oldIndex);
															setSidebarJson(temp);
														}}
														onClick={() => {
															const temp = structuredClone(SidebarJson);
															temp[i].content.splice(j, 1);
															setSidebarJson(temp);
														}}
														type='vertical'
														value={x}
													>
														<DoneLabel>
															Type
															<select
																className='h-10 w-full rounded-md border bg-body-50 px-3 py-2 text-sm text-primary-500'
																onChange={(event) => {
																	const eValue = event.target.value as (typeof sidebarType)[number];
																	if (sidebarType.includes(eValue)) {
																		const temp = structuredClone(SidebarJson);
																		temp[i].content[j].type = eValue;
																		temp[i].content[j].content = sidebarContent[eValue];
																		setSidebarJson(temp);
																	}
																}}
																value={item.type}
															>
																{sidebarType.map((type, k) => (
																	<Option key={`sidebar-${i}-content-${j}-grid-${x}-option-${k}`} value={type}>
																		{String(type).charAt(0).toUpperCase() + String(type).slice(1)}
																	</Option>
																))}
															</select>
														</DoneLabel>
														<DoneLabel>
															Text
															<Input
																value={gridContent}
																onChange={(event) => {
																	const temp = structuredClone(SidebarJson);
																	if (temp[i].content[j].type === 'grid') {
																		temp[i].content[j].content[x] = event.target.value;
																		setSidebarJson(temp);
																	}
																}}
															/>
														</DoneLabel>
													</DeleteWrapper>
												))}
												<button
													className='h-10 w-full rounded-md border bg-body-50 text-primary-500'
													onClick={() => {
														const temp = structuredClone(SidebarJson);
														if (temp[i].content[j].type === 'grid') {
															temp[i].content[j].content.push('');
															setSidebarJson(temp);
														}
													}}
												>
													ADD GRID ITEM
												</button>
											</div>
										);
									default:
										return null;
								}
							})}
							<button
								className='h-10 w-full rounded-md border bg-body-50 text-primary-500'
								onClick={() => {
									const temp = structuredClone(SidebarJson);
									temp[i].content.push({ content: '', type: 'text' });
									setSidebarJson(temp);
								}}
							>
								ADD SECTION ITEM
							</button>
						</div>
					</div>
				))}
				<button
					className='h-10 w-full rounded-md border bg-body-50 text-primary-500'
					onClick={() => {
						const temp = structuredClone(SidebarJson);
						temp.push({ content: [{ content: '', type: 'text' }], title: '' });
						setSidebarJson(temp);
					}}
				>
					ADD SECTION
				</button>
			</div>
		)
	);
}
