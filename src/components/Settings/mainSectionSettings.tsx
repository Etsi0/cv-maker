import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { INPUT_DEBOUNCE_DELAY, buttonBase } from '@/lib/util';

import { mainTypes, TMainSection, useMainSectionJsonContext } from '@/context/mainSectionContext';

import { Input } from '@/components/ui/input';
import { Option } from '@/components/ui/option';
import { Label } from '@/components/ui/label';

import { DeleteWrapper } from '@/components/ui/deleteWrapper';

import { SvgList } from '../SVGs';
import { IconSelect } from '../iconSelect';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { LinkButton } from '@/components/ui/link';

// Memoized option list
const MainTypeOptions = mainTypes.map((item) => (
	<Option key={item} value={item}>
		{String(item).charAt(0).toUpperCase() + String(item).slice(1)}
	</Option>
));

// Extracted component for content items
const MainSectionContentItem = memo(function MainSectionContentItem({
	contentIndex,
	item,
	onMove,
	onDelete,
	onTitleChange,
	onSubTitleChange,
	onTextChange,
}: {
	contentIndex: number;
	item: { id: string; title: string; subTitle: string; text: string };
	onMove: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onDelete: () => void;
	onTitleChange: (value: string) => void;
	onSubTitleChange: (value: string) => void;
	onTextChange: (value: string) => void;
}) {
	const [localTitle, setLocalTitle] = useState(item.title);
	const [localSubTitle, setLocalSubTitle] = useState(item.subTitle);
	const [localText, setLocalText] = useState(item.text);
	const titleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const subTitleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const textTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const onTitleChangeRef = useRef(onTitleChange);
	const onSubTitleChangeRef = useRef(onSubTitleChange);
	const onTextChangeRef = useRef(onTextChange);

	useEffect(() => {
		onTitleChangeRef.current = onTitleChange;
		onSubTitleChangeRef.current = onSubTitleChange;
		onTextChangeRef.current = onTextChange;
	}, [onTitleChange, onSubTitleChange, onTextChange]);

	useEffect(() => {
		setLocalTitle(item.title);
		setLocalSubTitle(item.subTitle);
		setLocalText(item.text);
	}, [item.title, item.subTitle, item.text]);

	useEffect(() => {
		if (titleTimeoutRef.current) {
			clearTimeout(titleTimeoutRef.current);
		}
		titleTimeoutRef.current = setTimeout(() => {
			onTitleChangeRef.current(localTitle);
		}, INPUT_DEBOUNCE_DELAY);

		return () => {
			if (titleTimeoutRef.current) {
				clearTimeout(titleTimeoutRef.current);
			}
		};
	}, [localTitle]);

	useEffect(() => {
		if (subTitleTimeoutRef.current) {
			clearTimeout(subTitleTimeoutRef.current);
		}
		subTitleTimeoutRef.current = setTimeout(() => {
			onSubTitleChangeRef.current(localSubTitle);
		}, INPUT_DEBOUNCE_DELAY);

		return () => {
			if (subTitleTimeoutRef.current) {
				clearTimeout(subTitleTimeoutRef.current);
			}
		};
	}, [localSubTitle]);

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

	return (
		<Card>
			<DeleteWrapper onChange={onMove} onClick={onDelete} type='horizontal' value={contentIndex}>
				<Label>
					Title
					<Input
						value={localTitle}
						onChange={(event) => setLocalTitle(event.target.value)}
					/>
				</Label>
				<Label>
					Sub Title
					<Input
						value={localSubTitle}
						onChange={(event) => setLocalSubTitle(event.target.value)}
					/>
				</Label>
				<Label>
					Text
					<Textarea
						className='h-36'
						value={localText}
						onChange={(event) => setLocalText(event.target.value)}
					/>
				</Label>
			</DeleteWrapper>
		</Card>
	);
});

// Extracted component for main section
const MainSectionItem = memo(function MainSectionItem({
	sectionIndex,
	section,
	onMove,
	onDelete,
	onIconChange,
	onTitleChange,
	onTypeChange,
	onHiddenChange,
	onContentMove,
	onContentDelete,
	onContentTitleChange,
	onContentSubTitleChange,
	onContentTextChange,
	onAddContentItem,
}: {
	sectionIndex: number;
	section: TMainSection;
	onMove: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onDelete: () => void;
	onIconChange: (value: keyof typeof SvgList | '') => void;
	onTitleChange: (value: string) => void;
	onTypeChange: (value: 'default' | 'card') => void;
	onHiddenChange: (value: boolean) => void;
	onContentMove: (contentIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => void;
	onContentDelete: (contentIndex: number) => () => void;
	onContentTitleChange: (contentIndex: number) => (value: string) => void;
	onContentSubTitleChange: (contentIndex: number) => (value: string) => void;
	onContentTextChange: (contentIndex: number) => (value: string) => void;
	onAddContentItem: () => void;
}) {
	return (
		<Card>
			<DeleteWrapper onChange={onMove} onClick={onDelete} type='horizontal' value={sectionIndex}>
				<div className='grid grid-cols-2 gap-2'>
					<Label>
						Icon
						<IconSelect value={section.icon} onChange={(event) => onIconChange(event.target.value as keyof typeof SvgList | '')} />
					</Label>
					<Label>
						Title
						<Input value={section.title} onChange={(event) => onTitleChange(event.target.value)} />
					</Label>
				</div>
				<Label>
					Type
					<Select
						onChange={(event) => {
							const eValue = event.target.value;
							if (eValue === 'default' || eValue === 'card') {
								onTypeChange(eValue);
							}
						}}
						value={section.type}
					>
						{MainTypeOptions}
					</Select>
				</Label>
				<Switch label='Hide Content' checked={section.hidden} onChange={(event) => onHiddenChange(event.target.checked)} />
			</DeleteWrapper>
			{section.content.map((item, j) => (
				<MainSectionContentItem
					key={item.id}
					contentIndex={j}
					item={item}
					onMove={onContentMove(j)}
					onDelete={onContentDelete(j)}
					onTitleChange={onContentTitleChange(j)}
					onSubTitleChange={onContentSubTitleChange(j)}
					onTextChange={onContentTextChange(j)}
				/>
			))}
			<LinkButton className={buttonBase} onClick={onAddContentItem}>
				ADD SECTION ITEM
			</LinkButton>
		</Card>
	);
});

export default function MainSectionSettings({ className }: { className?: string }) {
	const { MainSectionJson, setMainSectionJson } = useMainSectionJsonContext();

	const handleSectionMove = useCallback(
		(sectionIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
			setMainSectionJson((prev) => {
				const newState = [...prev];
				const oldItem = newState[sectionIndex];
				newState.splice(sectionIndex, 1);
				newState.splice(parseInt(event.target.value), 0, oldItem);
				return newState;
			});
		},
		[setMainSectionJson],
	);

	const handleSectionDelete = useCallback(
		(sectionIndex: number) => () => {
			setMainSectionJson((prev) => {
				const newState = [...prev];
				newState.splice(sectionIndex, 1);
				return newState;
			});
		},
		[setMainSectionJson],
	);

	const handleIconChange = useCallback(
		(sectionIndex: number) => (value: keyof typeof SvgList | '') => {
			setMainSectionJson((prev) => {
				const newState = [...prev];
				newState[sectionIndex] = { ...newState[sectionIndex], icon: value };
				return newState;
			});
		},
		[setMainSectionJson],
	);

	const handleTitleChange = useCallback(
		(sectionIndex: number) => (value: string) => {
			setMainSectionJson((prev) => {
				const newState = [...prev];
				newState[sectionIndex] = { ...newState[sectionIndex], title: value };
				return newState;
			});
		},
		[setMainSectionJson],
	);

	const handleTypeChange = useCallback(
		(sectionIndex: number) => (value: 'default' | 'card') => {
			setMainSectionJson((prev) => {
				const newState = [...prev];
				newState[sectionIndex] = { ...newState[sectionIndex], type: value };
				return newState;
			});
		},
		[setMainSectionJson],
	);

	const handleHiddenChange = useCallback(
		(sectionIndex: number) => (value: boolean) => {
			setMainSectionJson((prev) => {
				const newState = [...prev];
				newState[sectionIndex] = { ...newState[sectionIndex], hidden: value };
				return newState;
			});
		},
		[setMainSectionJson],
	);

	const handleContentMove = useCallback(
		(sectionIndex: number) => (contentIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
			setMainSectionJson((prev) => {
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
		[setMainSectionJson],
	);

	const handleContentDelete = useCallback(
		(sectionIndex: number) => (contentIndex: number) => () => {
			setMainSectionJson((prev) => {
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
		[setMainSectionJson],
	);

	const handleContentTitleChange = useCallback(
		(sectionIndex: number) => (contentIndex: number) => (value: string) => {
			setMainSectionJson((prev) => {
				const newState = prev.map((section, i) => {
					if (i === sectionIndex) {
						const newContent = [...section.content];
						newContent[contentIndex] = { ...newContent[contentIndex], title: value };
						return { ...section, content: newContent };
					}
					return section;
				});
				return newState;
			});
		},
		[setMainSectionJson],
	);

	const handleContentSubTitleChange = useCallback(
		(sectionIndex: number) => (contentIndex: number) => (value: string) => {
			setMainSectionJson((prev) => {
				const newState = prev.map((section, i) => {
					if (i === sectionIndex) {
						const newContent = [...section.content];
						newContent[contentIndex] = { ...newContent[contentIndex], subTitle: value };
						return { ...section, content: newContent };
					}
					return section;
				});
				return newState;
			});
		},
		[setMainSectionJson],
	);

	const handleContentTextChange = useCallback(
		(sectionIndex: number) => (contentIndex: number) => (value: string) => {
			setMainSectionJson((prev) => {
				const newState = prev.map((section, i) => {
					if (i === sectionIndex) {
						const newContent = [...section.content];
						newContent[contentIndex] = { ...newContent[contentIndex], text: value };
						return { ...section, content: newContent };
					}
					return section;
				});
				return newState;
			});
		},
		[setMainSectionJson],
	);

	const handleAddContentItem = useCallback(
		(sectionIndex: number) => () => {
			setMainSectionJson((prev) => {
				const newState = [...prev];
				newState[sectionIndex] = {
					...newState[sectionIndex],
					content: [
						...newState[sectionIndex].content,
						{
							id: crypto.randomUUID(),
							title: '',
							subTitle: '',
							text: '',
						},
					],
				};
				return newState;
			});
		},
		[setMainSectionJson],
	);

	const handleAddSection = useCallback(() => {
		setMainSectionJson((prev) => [
			...prev,
			{
				id: crypto.randomUUID(),
				content: [
					{
						id: crypto.randomUUID(),
						title: '',
						subTitle: '',
						text: '',
					},
				],
				hidden: false,
				icon: '',
				title: '',
				type: 'default',
			},
		]);
	}, [setMainSectionJson]);

	// Memoize section handlers
	const sectionHandlers = useMemo(() => {
		return MainSectionJson.map((_, i) => ({
			onMove: handleSectionMove(i),
			onDelete: handleSectionDelete(i),
			onIconChange: handleIconChange(i),
			onTitleChange: handleTitleChange(i),
			onTypeChange: handleTypeChange(i),
			onHiddenChange: handleHiddenChange(i),
			onContentMove: handleContentMove(i),
			onContentDelete: handleContentDelete(i),
			onContentTitleChange: handleContentTitleChange(i),
			onContentSubTitleChange: handleContentSubTitleChange(i),
			onContentTextChange: handleContentTextChange(i),
			onAddContentItem: handleAddContentItem(i),
		}));
	}, [
		MainSectionJson,
		handleSectionMove,
		handleSectionDelete,
		handleIconChange,
		handleTitleChange,
		handleTypeChange,
		handleHiddenChange,
		handleContentMove,
		handleContentDelete,
		handleContentTitleChange,
		handleContentSubTitleChange,
		handleContentTextChange,
		handleAddContentItem,
	]);

	return (
		<div className={className}>
			{MainSectionJson.map((section, i) => (
				<MainSectionItem key={section.id} sectionIndex={i} section={section} {...sectionHandlers[i]} />
			))}
			<LinkButton className={buttonBase} onClick={handleAddSection}>
				ADD SECTION
			</LinkButton>
		</div>
	);
}
