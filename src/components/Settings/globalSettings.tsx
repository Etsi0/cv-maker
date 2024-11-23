import { useGlobalJsonContext } from '@/context/globalContext';

import { Input } from '@/components/ui/shadcn/input';
import { DoneLabel } from '@/components/ui/elements/label';

export default function GlobalSettings({ className }: { className?: string }) {
	const { GlobalJson, setGlobalJson } = useGlobalJsonContext();

	return (
		<div className={className}>
			<DoneLabel>
				Color Hue
				<Input
					inputMode='numeric'
					onChange={(event) => {
						const temp = structuredClone(GlobalJson);
						const inputInt = parseFloat(event.target.value);
						temp.color = inputInt ? (inputInt > 360 ? 360 : inputInt < 0 ? 0 : inputInt) : 0;
						setGlobalJson(temp);
					}}
					title='Enter a number between 0 and 360'
					type='text'
					value={GlobalJson.color}
				/>
			</DoneLabel>
			<DoneLabel>
				Black and white
				<Input
					className='w-10'
					onChange={(event) => {
						const temp = structuredClone(GlobalJson);
						temp.blackWhite = event.target.checked ? 1 : 0;
						setGlobalJson(temp);
					}}
					type='checkbox'
					value={GlobalJson.blackWhite ? 'true' : 'false'}
				/>
			</DoneLabel>
			<DoneLabel>
				DarkMode
				<Input
					className='w-10'
					onChange={(event) => {
						const temp = structuredClone(GlobalJson);
						temp.darkMode = event.target.checked ? 1 : 0;
						setGlobalJson(temp);
					}}
					type='checkbox'
					value={GlobalJson.darkMode ? 'true' : 'false'}
				/>
			</DoneLabel>
		</div>
	);
}
