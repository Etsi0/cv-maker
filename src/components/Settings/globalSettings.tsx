import { useCallback, useEffect, useRef, useState } from 'react';

import { useGlobalJsonContext } from '@/context/globalContext';
import { clamp, cn, INPUT_DEBOUNCE_DELAY } from '@/lib/utils';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

function ColorHueInput({ value, onChange }: { value: number; onChange: (value: string) => void }) {
	const [localValue, setLocalValue] = useState(String(value));
	const isFocusedRef = useRef(false);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const onChangeRef = useRef(onChange);

	// Keep the ref updated with the latest onChange
	useEffect(() => {
		onChangeRef.current = onChange;
	}, [onChange]);

	useEffect(() => {
		if (!isFocusedRef.current) {
			setLocalValue(String(value));
		}
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

	const handleFocus = useCallback((isFocused: boolean) => {
		isFocusedRef.current = isFocused;
		if (isFocused) return;
		onChangeRef.current(localValue);
	}, [localValue]);

	return (
		<Label>
			Color Hue (Oklch)
			<Input
				inputMode='numeric'
				onBlur={() => handleFocus(false)}
				onChange={(event) => setLocalValue(event.target.value)}
				onFocus={() => handleFocus(true)}
				title='Enter a number between 0 and 360'
				type='text'
				value={localValue}
			/>
		</Label>
	);
}

export default function GlobalSettings({ className }: { className?: string }) {
	const { GlobalJson, setGlobalJson } = useGlobalJsonContext();

	const handleColorChange = useCallback((value: string) => {
		const parsedValue = parseFloat(value);
		const clampedValue = clamp(0, isNaN(parsedValue) ? 277 : parsedValue, 360);
		setGlobalJson((prev) => {
			const temp = structuredClone(prev);
			temp.color = clampedValue;
			return temp;
		});
	}, [setGlobalJson]);

	const handleBlackWhiteChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setGlobalJson((prev) => {
				const temp = structuredClone(prev);
				temp.blackWhite = event.target.checked ? 1 : 0;
				return temp;
			});
		},
		[setGlobalJson],
	);

	const handleDarkModeChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setGlobalJson((prev) => {
				const temp = structuredClone(prev);
				temp.darkMode = event.target.checked ? 1 : 0;
				return temp;
			});
		},
		[setGlobalJson],
	);

	if (!GlobalJson) return null;

	return (
		<div className={cn(className)}>
			<ColorHueInput value={GlobalJson.color} onChange={handleColorChange} />
			<Switch label='Black and white' className='text-sm!' checked={GlobalJson.blackWhite === 1} onChange={handleBlackWhiteChange} />
			<Switch label='DarkMode' className='text-sm!' checked={GlobalJson.darkMode === 1} onChange={handleDarkModeChange} />
		</div>
	);
}
