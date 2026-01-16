import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cn, INPUT_DEBOUNCE_DELAY, buttonBase } from '@/lib/util';

import { sidebarContent, sidebarType, TSidebar, TSidebarContent, useSidebarJsonContext } from '@/context/sidebarContext';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DeleteWrapper } from '@/components/ui/deleteWrapper';
import { Option } from '@/components/ui/option';
import { Card } from '@/components/ui/card';
import { LinkButton } from '@/components/ui/link';
import { Select } from '@/components/ui/select';

// Memoized option list to avoid recreating on every render
const SidebarTypeOptions = sidebarType.map((type) => (
	<Option key={type} value={type}>
		{String(type).charAt(0).toUpperCase() + String(type).slice(1)}
	</Option>
));

// Input component with local state for performance
function GridItemInput({ gridItemId, value, onChange }: { gridItemId: string; value: string; onChange: (id: string, value: string) => void }) {
	const [localValue, setLocalValue] = useState(value);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const onChangeRef = useRef(onChange);

	useEffect(() => {
		onChangeRef.current = onChange;
	}, [onChange]);

	useEffect(() => {
		setLocalValue(value);
	}, [value]);

	useEffect(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(() => {
			onChangeRef.current(gridItemId, localValue);
		}, INPUT_DEBOUNCE_DELAY);

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [localValue, gridItemId]);

	return (
		<Label>
			Text
			<Input
				value={localValue}
				onChange={(event) => setLocalValue(event.target.value)}
			/>
		</Label>
	);
}

// Extracted component for text content type
const SidebarTextItem = memo(function SidebarTextItem({
	contentIndex,
	item,
	onMove,
	onDelete,
	onTypeChange,
	onContentChange,
}: {
	contentIndex: number;
	item: Extract<TSidebarContent, { type: 'text' }>;
	onMove: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onDelete: () => void;
	onTypeChange: (value: (typeof sidebarType)[number]) => void;
	onContentChange: (value: string) => void;
}) {
	const [localValue, setLocalValue] = useState(item.content);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const onContentChangeRef = useRef(onContentChange);

	useEffect(() => {
		onContentChangeRef.current = onContentChange;
	}, [onContentChange]);

	useEffect(() => {
		setLocalValue(item.content);
	}, [item.content]);

	useEffect(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(() => {
			onContentChangeRef.current(localValue);
		}, INPUT_DEBOUNCE_DELAY);

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [localValue]);

	return (
		<Card>
			<DeleteWrapper onChange={onMove} onClick={onDelete} type='vertical' value={contentIndex}>
				<Label>
					Type
					<Select
						onChange={(event) => {
							const eValue = event.target.value as (typeof sidebarType)[number];
							if (sidebarType.includes(eValue)) {
								onTypeChange(eValue);
							}
						}}
						value={item.type}
					>
						{SidebarTypeOptions}
					</Select>
				</Label>
				<Label>
					Text
					<Input
						value={localValue}
						onChange={(event) => setLocalValue(event.target.value)}
					/>
				</Label>
			</DeleteWrapper>
		</Card>
	);
});

// Extracted component for link content type
const SidebarLinkItem = memo(function SidebarLinkItem({
	contentIndex,
	item,
	onMove,
	onDelete,
	onTypeChange,
	onTextChange,
	onHrefChange,
}: {
	contentIndex: number;
	item: Extract<TSidebarContent, { type: 'link' }>;
	onMove: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onDelete: () => void;
	onTypeChange: (value: (typeof sidebarType)[number]) => void;
	onTextChange: (value: string) => void;
	onHrefChange: (value: string) => void;
}) {
	const [localText, setLocalText] = useState(item.content.text);
	const [localHref, setLocalHref] = useState(item.content.href);
	const textTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const hrefTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const onTextChangeRef = useRef(onTextChange);
	const onHrefChangeRef = useRef(onHrefChange);

	useEffect(() => {
		onTextChangeRef.current = onTextChange;
		onHrefChangeRef.current = onHrefChange;
	}, [onTextChange, onHrefChange]);

	useEffect(() => {
		setLocalText(item.content.text);
		setLocalHref(item.content.href);
	}, [item.content.text, item.content.href]);

	useEffect(() => {
		if (textTimeoutRef.current) {
			clearTimeout(textTimeoutRef.current);
		}
		textTimeoutRef.current = setTimeout(() => {
			onTextChangeRef.current(localText);
		}, INPUT_DEBOUNCE_DELAY);

		return () => {
			if (textTimeoutRef.current) {
				clearTimeout(textTimeoutRef.current);
			}
		};
	}, [localText]);

	useEffect(() => {
		if (hrefTimeoutRef.current) {
			clearTimeout(hrefTimeoutRef.current);
		}
		hrefTimeoutRef.current = setTimeout(() => {
			onHrefChangeRef.current(localHref);
		}, INPUT_DEBOUNCE_DELAY);

		return () => {
			if (hrefTimeoutRef.current) {
				clearTimeout(hrefTimeoutRef.current);
			}
		};
	}, [localHref]);

	return (
		<Card>
			<DeleteWrapper onChange={onMove} onClick={onDelete} type='vertical' value={contentIndex}>
				<Label>
					Type
					<Select
						onChange={(event) => {
							const eValue = event.target.value as (typeof sidebarType)[number];
							if (sidebarType.includes(eValue)) {
								onTypeChange(eValue);
							}
						}}
						value={item.type}
					>
						{SidebarTypeOptions}
					</Select>
				</Label>
				<Label>
					Label
					<Input
						value={localText}
						onChange={(event) => setLocalText(event.target.value)}
					/>
				</Label>
				<Label>
					Link
					<Input
						value={localHref}
						onChange={(event) => setLocalHref(event.target.value)}
					/>
				</Label>
			</DeleteWrapper>
		</Card>
	);
});

// Extracted component for grid content type
const SidebarGridItem = memo(function SidebarGridItem({
	item,
	onTypeChange,
	onGridItemMove,
	onGridItemDelete,
	onGridItemChange,
	onAddGridItem,
}: {
	item: Extract<TSidebarContent, { type: 'grid' }>;
	onTypeChange: (value: (typeof sidebarType)[number]) => void;
	onGridItemMove: (gridIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => void;
	onGridItemDelete: (gridIndex: number) => () => void;
	onGridItemChange: (id: string, value: string) => void;
	onAddGridItem: () => void;
}) {
	return (
		<Card className='grid-cols-2'>
			{item.content.map((gridItem) => {
				const gridItemIndex = item.content.findIndex((item) => item.id === gridItem.id);
				return (
					<DeleteWrapper
						key={gridItem.id}
						onChange={onGridItemMove(gridItemIndex)}
						onClick={onGridItemDelete(gridItemIndex)}
						type='vertical'
						value={gridItemIndex}
					>
						<Label>
							Type
							<Select
								onChange={(event) => {
									const eValue = event.target.value as (typeof sidebarType)[number];
									if (sidebarType.includes(eValue)) {
										onTypeChange(eValue);
									}
								}}
								value={item.type}
							>
								{SidebarTypeOptions}
							</Select>
						</Label>
						<GridItemInput gridItemId={gridItem.id} value={gridItem.value} onChange={onGridItemChange} />
					</DeleteWrapper>
				);
			})}
			<LinkButton className={buttonBase} onClick={onAddGridItem}>
				ADD GRID ITEM
			</LinkButton>
		</Card>
	);
});

// Extracted component for sidebar section
const SidebarSection = memo(function SidebarSection({
	sectionIndex,
	section,
	onSectionTitleChange,
	onSectionMove,
	onSectionDelete,
	onContentMove,
	onContentDelete,
	onContentTypeChange,
	onTextContentChange,
	onLinkTextChange,
	onLinkHrefChange,
	onGridItemMove,
	onGridItemDelete,
	onGridItemChange,
	onAddContentItem,
	onAddGridItem,
}: {
	sectionIndex: number;
	section: TSidebar;
	onSectionTitleChange: (value: string) => void;
	onSectionMove: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onSectionDelete: () => void;
	onContentMove: (contentIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => void;
	onContentDelete: (contentIndex: number) => () => void;
	onContentTypeChange: (contentIndex: number) => (value: (typeof sidebarType)[number]) => void;
	onTextContentChange: (contentIndex: number) => (value: string) => void;
	onLinkTextChange: (contentIndex: number) => (value: string) => void;
	onLinkHrefChange: (contentIndex: number) => (value: string) => void;
	onGridItemMove: (contentIndex: number) => (gridIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => void;
	onGridItemDelete: (contentIndex: number) => (gridIndex: number) => () => void;
	onGridItemChange: (contentIndex: number) => (gridItemId: string, value: string) => void;
	onAddContentItem: () => void;
	onAddGridItem: (contentIndex: number) => () => void;
}) {
	const [localTitle, setLocalTitle] = useState(section.title);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const onSectionTitleChangeRef = useRef(onSectionTitleChange);

	useEffect(() => {
		onSectionTitleChangeRef.current = onSectionTitleChange;
	}, [onSectionTitleChange]);

	useEffect(() => {
		setLocalTitle(section.title);
	}, [section.title]);

	useEffect(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(() => {
			onSectionTitleChangeRef.current(localTitle);
		}, INPUT_DEBOUNCE_DELAY);

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [localTitle]);

	return (
		<Card>
			<DeleteWrapper onChange={onSectionMove} onClick={onSectionDelete} type='horizontal' value={sectionIndex}>
				<Label>
					Title
					<Input
						className='text-center text-base font-semibold'
						value={localTitle}
						onChange={(event) => setLocalTitle(event.target.value)}
					/>
				</Label>
			</DeleteWrapper>
			{section.content.map((item, j) => {
				switch (item.type) {
					case 'text':
						return (
							<SidebarTextItem
								key={item.id}
								contentIndex={j}
								item={item}
								onMove={onContentMove(j)}
								onDelete={onContentDelete(j)}
								onTypeChange={onContentTypeChange(j)}
								onContentChange={onTextContentChange(j)}
							/>
						);
					case 'link':
						return (
							<SidebarLinkItem
								key={item.id}
								contentIndex={j}
								item={item}
								onMove={onContentMove(j)}
								onDelete={onContentDelete(j)}
								onTypeChange={onContentTypeChange(j)}
								onTextChange={onLinkTextChange(j)}
								onHrefChange={onLinkHrefChange(j)}
							/>
						);
					case 'grid':
						return (
							<SidebarGridItem
								key={item.id}
								item={item}
								onTypeChange={onContentTypeChange(j)}
								onGridItemMove={onGridItemMove(j)}
								onGridItemDelete={onGridItemDelete(j)}
								onGridItemChange={onGridItemChange(j)}
								onAddGridItem={onAddGridItem(j)}
							/>
						);
					default:
						return null;
				}
			})}
			<LinkButton className={buttonBase} onClick={onAddContentItem}>
				ADD SECTION ITEM
			</LinkButton>
		</Card>
	);
});

export default function SidebarSettings({ className }: { className?: string }) {
	const { SidebarJson, setSidebarJson } = useSidebarJsonContext();

	// Memoized handlers using useCallback
	const handleSectionTitleChange = useCallback(
		(sectionIndex: number) => (value: string) => {
			setSidebarJson((prev) => {
				const newState = [...prev];
				newState[sectionIndex] = { ...newState[sectionIndex], title: value };
				return newState;
			});
		},
		[setSidebarJson],
	);

	const handleSectionMove = useCallback(
		(sectionIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
			setSidebarJson((prev) => {
				const newState = [...prev];
				const oldIndex = newState[sectionIndex];
				newState.splice(sectionIndex, 1);
				newState.splice(parseInt(event.target.value), 0, oldIndex);
				return newState;
			});
		},
		[setSidebarJson],
	);

	const handleSectionDelete = useCallback(
		(sectionIndex: number) => () => {
			setSidebarJson((prev) => {
				const newState = [...prev];
				newState.splice(sectionIndex, 1);
				return newState;
			});
		},
		[setSidebarJson],
	);

	const handleContentMove = useCallback(
		(sectionIndex: number) => (contentIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
			setSidebarJson((prev) => {
				const newState = prev.map((section, i) => {
					if (i === sectionIndex) {
						const newContent = [...section.content];
						const oldItem = newContent[contentIndex];
						newContent.splice(contentIndex, 1);
						newContent.splice(parseInt(event.target.value), 0, oldItem);
						return { ...section, content: newContent };
					}
					return section;
				});
				return newState;
			});
		},
		[setSidebarJson],
	);

	const handleContentDelete = useCallback(
		(sectionIndex: number) => (contentIndex: number) => () => {
			setSidebarJson((prev) => {
				const newState = prev.map((section, i) => {
					if (i === sectionIndex) {
						const newContent = [...section.content];
						newContent.splice(contentIndex, 1);
						return { ...section, content: newContent };
					}
					return section;
				});
				return newState;
			});
		},
		[setSidebarJson],
	);

	const handleContentTypeChange = useCallback(
		(sectionIndex: number) => (contentIndex: number) => (value: (typeof sidebarType)[number]) => {
			setSidebarJson((prev) => {
				const newState = prev.map((section, i) => {
					if (i === sectionIndex) {
						const newContent = [...section.content];
						const existingItem = newContent[contentIndex];
						const existingId = existingItem.id || crypto.randomUUID();
						newContent[contentIndex] = {
							id: existingId,
							type: value,
							content: sidebarContent[value],
						} as TSidebarContent;
						return { ...section, content: newContent };
					}
					return section;
				});
				return newState;
			});
		},
		[setSidebarJson],
	);

	const handleTextContentChange = useCallback(
		(sectionIndex: number) => (contentIndex: number) => (value: string) => {
			setSidebarJson((prev) => {
				const newState = prev.map((section, i) => {
					if (i === sectionIndex) {
						const newContent = [...section.content];
						if (newContent[contentIndex].type === 'text') {
							newContent[contentIndex] = { ...newContent[contentIndex], content: value };
						}
						return { ...section, content: newContent };
					}
					return section;
				});
				return newState;
			});
		},
		[setSidebarJson],
	);

	const handleLinkTextChange = useCallback(
		(sectionIndex: number) => (contentIndex: number) => (value: string) => {
			setSidebarJson((prev) => {
				const newState = prev.map((section, i) => {
					if (i === sectionIndex) {
						const newContent = [...section.content];
						if (newContent[contentIndex].type === 'link') {
							newContent[contentIndex] = {
								...newContent[contentIndex],
								content: { ...newContent[contentIndex].content, text: value },
							};
						}
						return { ...section, content: newContent };
					}
					return section;
				});
				return newState;
			});
		},
		[setSidebarJson],
	);

	const handleLinkHrefChange = useCallback(
		(sectionIndex: number) => (contentIndex: number) => (value: string) => {
			setSidebarJson((prev) => {
				const newState = prev.map((section, i) => {
					if (i === sectionIndex) {
						const newContent = [...section.content];
						if (newContent[contentIndex].type === 'link') {
							newContent[contentIndex] = {
								...newContent[contentIndex],
								content: { ...newContent[contentIndex].content, href: value },
							};
						}
						return { ...section, content: newContent };
					}
					return section;
				});
				return newState;
			});
		},
		[setSidebarJson],
	);

	const handleGridItemMove = useCallback(
		(sectionIndex: number) => (contentIndex: number) => (gridIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
			setSidebarJson((prev) => {
				const newState = prev.map((section, i) => {
					if (i === sectionIndex) {
						const newContent = [...section.content];
						if (newContent[contentIndex].type === 'grid') {
							const newGrid = [...newContent[contentIndex].content];
							const oldItem = newGrid[gridIndex];
							newGrid.splice(gridIndex, 1);
							newGrid.splice(parseInt(event.target.value), 0, oldItem);
							newContent[contentIndex] = { ...newContent[contentIndex], content: newGrid };
						}
						return { ...section, content: newContent };
					}
					return section;
				});
				return newState;
			});
		},
		[setSidebarJson],
	);

	const handleGridItemDelete = useCallback(
		(sectionIndex: number) => (contentIndex: number) => (gridIndex: number) => () => {
			setSidebarJson((prev) => {
				const newState = prev.map((section, i) => {
					if (i === sectionIndex) {
						const newContent = [...section.content];
						if (newContent[contentIndex].type === 'grid') {
							const newGrid = [...newContent[contentIndex].content];
							newGrid.splice(gridIndex, 1);
							newContent[contentIndex] = { ...newContent[contentIndex], content: newGrid };
						}
						return { ...section, content: newContent };
					}
					return section;
				});
				return newState;
			});
		},
		[setSidebarJson],
	);

	const handleGridItemChange = useCallback(
		(sectionIndex: number) => (contentIndex: number) => (gridItemId: string, value: string) => {
			setSidebarJson((prev) => {
				const newState = prev.map((section, i) => {
					if (i === sectionIndex) {
						const newContent = [...section.content];
						if (newContent[contentIndex].type === 'grid') {
							const newGrid = newContent[contentIndex].content.map((item) =>
								item.id === gridItemId ? { ...item, value } : item
							);
							newContent[contentIndex] = { ...newContent[contentIndex], content: newGrid };
						}
						return { ...section, content: newContent };
					}
					return section;
				});
				return newState;
			});
		},
		[setSidebarJson],
	);

	const handleAddContentItem = useCallback(
		(sectionIndex: number) => () => {
			setSidebarJson((prev) => {
				const newState = [...prev];
				newState[sectionIndex] = {
					...newState[sectionIndex],
					content: [...newState[sectionIndex].content, { id: crypto.randomUUID(), content: '', type: 'text' }],
				};
				return newState;
			});
		},
		[setSidebarJson],
	);

	const handleAddGridItem = useCallback(
		(sectionIndex: number) => (contentIndex: number) => () => {
			setSidebarJson((prev) => {
				const newState = prev.map((section, i) => {
					if (i === sectionIndex) {
						const newContent = [...section.content];
						if (newContent[contentIndex].type === 'grid') {
							const newGrid = [...newContent[contentIndex].content, { id: crypto.randomUUID(), value: '' }];
							newContent[contentIndex] = { ...newContent[contentIndex], content: newGrid };
						}
						return { ...section, content: newContent };
					}
					return section;
				});
				return newState;
			});
		},
		[setSidebarJson],
	);

	const handleAddSection = useCallback(() => {
		setSidebarJson((prev) => [...prev, { id: crypto.randomUUID(), content: [{ id: crypto.randomUUID(), content: '', type: 'text' }], title: '' }]);
	}, [setSidebarJson]);

	// Memoize section handlers
	const sectionHandlers = useMemo(() => {
		if (!SidebarJson || SidebarJson.length === 0) return [];
		return SidebarJson.map((_, i) => ({
			onSectionTitleChange: handleSectionTitleChange(i),
			onSectionMove: handleSectionMove(i),
			onSectionDelete: handleSectionDelete(i),
			onContentMove: handleContentMove(i),
			onContentDelete: handleContentDelete(i),
			onContentTypeChange: handleContentTypeChange(i),
			onTextContentChange: handleTextContentChange(i),
			onLinkTextChange: handleLinkTextChange(i),
			onLinkHrefChange: handleLinkHrefChange(i),
			onGridItemMove: handleGridItemMove(i),
			onGridItemDelete: handleGridItemDelete(i),
			onGridItemChange: handleGridItemChange(i),
			onAddContentItem: handleAddContentItem(i),
			onAddGridItem: handleAddGridItem(i),
		}));
	}, [
		SidebarJson,
		handleSectionTitleChange,
		handleSectionMove,
		handleSectionDelete,
		handleContentMove,
		handleContentDelete,
		handleContentTypeChange,
		handleTextContentChange,
		handleLinkTextChange,
		handleLinkHrefChange,
		handleGridItemMove,
		handleGridItemDelete,
		handleGridItemChange,
		handleAddContentItem,
		handleAddGridItem,
	]);

	if (!SidebarJson) return null;

	return (
		<div className={cn('grid gap-10', className)}>
			{SidebarJson.map((section, i) => {
				const handlers = sectionHandlers[i];
				if (!handlers) return null;
				return <SidebarSection key={section.id} sectionIndex={i} section={section} {...handlers} />;
			})}
			<LinkButton className={buttonBase} onClick={handleAddSection}>
				ADD SECTION
			</LinkButton>
		</div>
	);
}
