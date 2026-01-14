'use client';

import Paper from '@/components/CV/paper';
import Settings from '@/components/Settings/settings';

import { useGlobalJsonContext } from '@/context/globalContext';
import { useEffect, useState } from 'react';

export default function Home() {
	const [isMounted, setIsMounted] = useState<boolean>(false);
	const { GlobalJson } = useGlobalJsonContext();

	useEffect(() => {
		if (!isMounted) {
			setIsMounted(true);
		}
	}, [isMounted])

	useEffect(() => {
		document.documentElement.style.setProperty('--hue-color', String(GlobalJson.color));
		document.documentElement.style.setProperty('--isDarkMode', String(GlobalJson.darkMode));
		document.documentElement.style.setProperty('--blackWhite-mode', String(GlobalJson.blackWhite));
	}, [GlobalJson]);

	return (
		isMounted ? (
			<>
				<div className='sticky top-0 h-screen w-2xl overflow-y-scroll bg-body-50 p-3 print:hidden'>
					<Settings />
				</div>
				<div className='grid grow justify-items-center'>
					<Paper />
				</div>
			</>
		) : <noscript className='text-white mx-auto'>You need to have js enabled to run this application</noscript>
	);
}
