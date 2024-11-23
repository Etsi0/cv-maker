'use client';

import Paper from '@/components/CV/paper';
import Settings from '@/components/Settings/settings';

import { useGlobalJsonContext } from '@/context/globalContext';
import { useEffect } from 'react';

export default function Home() {
	const { GlobalJson } = useGlobalJsonContext();

	useEffect(() => {
		document.documentElement.style.setProperty('--hue-color', String(GlobalJson.color));
		document.documentElement.style.setProperty('--dark-mode', String(GlobalJson.darkMode));
		document.documentElement.style.setProperty('--blackWhite-mode', String(GlobalJson.blackWhite));
	}, [GlobalJson]);

	return (
		<>
			<div className='sticky top-0 h-screen w-[42rem] overflow-y-scroll bg-body-100 p-3 print:hidden'>
				<Settings />
			</div>
			<div className='grid grow justify-items-center'>
				<Paper />
			</div>
		</>
	);
}
