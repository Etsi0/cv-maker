import { ChangeEvent, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';

import { useHeaderJsonContext } from '@/context/headerContext';
import { cn, INPUT_DEBOUNCE_DELAY } from '@/lib/utils';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { DeleteWrapper } from '@/components/ui/deleteWrapper';
import { IconSelect } from '@/components/iconSelect';

import { SvgList } from '@/components/SVGs';
import { DeleteButton } from '@/components/ui/deleteButton';

function HeaderNameInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
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
			onChangeRef.current(localValue);
		}, INPUT_DEBOUNCE_DELAY);

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [localValue]);

	return (
		<Label>
			Name
			<Input
				value={localValue}
				onChange={(event) => setLocalValue(event.target.value)}
			/>
		</Label>
	);
}

const HeaderContentItem = memo(function HeaderContentItem({
	index,
	item,
	onMove,
	onDelete,
	onIconChange,
	onTextChange,
}: {
	index: number;
	item: { id: string; icon: keyof typeof SvgList | ''; text: string };
	onMove: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onDelete: () => void;
	onIconChange: (value: keyof typeof SvgList | '') => void;
	onTextChange: (value: string) => void;
}) {
	const [localText, setLocalText] = useState(item.text);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const onTextChangeRef = useRef(onTextChange);

	useEffect(() => {
		onTextChangeRef.current = onTextChange;
	}, [onTextChange]);

	useEffect(() => {
		setLocalText(item.text);
	}, [item.text]);

	useEffect(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(() => {
			onTextChangeRef.current(localText);
		}, INPUT_DEBOUNCE_DELAY);

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [localText]);

	return (
		<DeleteWrapper onChange={onMove} onClick={onDelete} type='horizontal' value={index}>
			<Label>
				Icon
				<IconSelect value={item.icon} onChange={(event) => onIconChange(event.target.value as keyof typeof SvgList | '')} />
			</Label>
			<Label>
				Text
				<Input
					value={localText}
					onChange={(event) => setLocalText(event.target.value)}
				/>
			</Label>
		</DeleteWrapper>
	);
});

export default function HeaderSettings({ className }: { className?: string }) {
	const { HeaderJson, setHeaderJson } = useHeaderJsonContext();

	const handleSetImage = useCallback(
		(data: ChangeEvent<HTMLInputElement>) => {
			const file = data.target.files?.[0];
			if (!file) {
				return;
			}

			const reader = new FileReader();
			reader.onload = function (event) {
				setHeaderJson((prev) => {
					if (event.target?.result && typeof event.target.result === 'string') {
						return { ...prev, img: event.target.result };
					}
					return { ...prev, img: '' };
				});
			};
			reader.readAsDataURL(file);
		},
		[setHeaderJson],
	);

	const handleDeleteImage = useCallback(() => {
		setHeaderJson((prev) => ({ ...prev, img: '' }));
	}, [setHeaderJson]);

	const handleNameChange = useCallback(
		(value: string) => {
			setHeaderJson((prev) => ({ ...prev, name: value }));
		},
		[setHeaderJson],
	);

	const handleContentMove = useCallback(
		(index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
			setHeaderJson((prev) => {
				const newContent = [...prev.content];
				const oldItem = newContent[index];
				newContent.splice(index, 1);
				newContent.splice(parseInt(event.target.value), 0, oldItem);
				return { ...prev, content: newContent };
			});
		},
		[setHeaderJson],
	);

	const handleContentDelete = useCallback(
		(index: number) => () => {
			setHeaderJson((prev) => {
				const newContent = [...prev.content];
				newContent.splice(index, 1);
				return { ...prev, content: newContent };
			});
		},
		[setHeaderJson],
	);

	const handleIconChange = useCallback(
		(index: number) => (value: keyof typeof SvgList | '') => {
			setHeaderJson((prev) => {
				const newContent = [...prev.content];
				newContent[index] = { ...newContent[index], icon: value };
				return { ...prev, content: newContent };
			});
		},
		[setHeaderJson],
	);

	const handleTextChange = useCallback(
		(index: number) => (value: string) => {
			setHeaderJson((prev) => {
				const newContent = [...prev.content];
				newContent[index] = { ...newContent[index], text: value };
				return { ...prev, content: newContent };
			});
		},
		[setHeaderJson],
	);

	const handleAddContent = useCallback(() => {
		setHeaderJson((prev) => ({
			...prev,
			content: [...prev.content, { id: crypto.randomUUID(), icon: '', text: '' }],
		}));
	}, [setHeaderJson]);

	// Memoize content item handlers
	const contentHandlers = useMemo(() => {
		if (!HeaderJson?.content) return [];
		return HeaderJson.content.map((_, i) => ({
			onMove: handleContentMove(i),
			onDelete: handleContentDelete(i),
			onIconChange: handleIconChange(i),
			onTextChange: handleTextChange(i),
		}));
	}, [HeaderJson?.content, handleContentMove, handleContentDelete, handleIconChange, handleTextChange]);

	if (!HeaderJson) return null;

	return (
		<div className={className}>
			<div className='flex items-start gap-2'>
				<DeleteButton onClick={handleDeleteImage} type='vertical' />
				<Label>
					Image
					<Label className='place-content-start' tabIndex={0}>
						<div className='relative inline-block cursor-pointer overflow-hidden rounded-md transition before:absolute before:grid before:h-full before:w-full before:place-items-center before:bg-neutral-900/75 before:text-center before:text-white before:opacity-0 before:transition-opacity before:content-["Click_to_add_a_image"] before:hover:opacity-100'>
							{(HeaderJson.img && <Image className='aspect-square object-cover' src={HeaderJson.img} alt={'pfp'} width={96} height={96} />) || (
								<div className='h-24 w-24 bg-primary-50'></div>
							)}
						</div>
						<Input className='hidden bg-primary-50' type='file' accept='.png,.jpg,.jpeg,.webp' onChange={handleSetImage} />
					</Label>
				</Label>
			</div>
			<HeaderNameInput value={HeaderJson.name} onChange={handleNameChange} />
			{HeaderJson.content.map((item, i) => {
				const handlers = contentHandlers[i];
				if (!handlers) return null;
				return (
					<HeaderContentItem
						key={item.id}
						index={i}
						item={item}
						{...handlers}
					/>
				);
			})}
			<button className={cn('h-10 w-full rounded-md border bg-body-50 text-primary-500')} onClick={handleAddContent}>
				ADD
			</button>
		</div>
	);
}
