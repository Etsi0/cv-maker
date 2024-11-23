'use client';
import { useState } from 'react';

import { cn } from '@/lib/utils';

import { Input } from '../ui/shadcn/input';

import GlobalSettings from '@/components/Settings/globalSettings';
import HeaderSettings from '@/components/Settings/headerSettings';
import SidebarSettings from '@/components/Settings/sidebarSettings';
import MainSectionSettings from '@/components/Settings/mainSectionSettings';

import { TGlobal, useGlobalJsonContext } from '@/context/globalContext';
import { THeader, useHeaderJsonContext } from '@/context/headerContext';
import { TSidebar, useSidebarJsonContext } from '@/context/sidebarContext';
import { TMainSection, useMainSectionJsonContext } from '@/context/mainSectionContext';
import { ReadFile } from '@/components/readFile';
import { DoneLabel } from '@/components/ui/elements/label';

export default function Home() {
	const [currentTab, setCurrentTab] = useState<'' | TTab>('');
	const { GlobalJson, setGlobalJson } = useGlobalJsonContext();
	const { HeaderJson, setHeaderJson } = useHeaderJsonContext();
	const { SidebarJson, setSidebarJson } = useSidebarJsonContext();
	const { MainSectionJson, setMainSectionJson } = useMainSectionJsonContext();

	type TTab = 'Global' | 'Header' | 'Sidebar' | 'MainSection';
	function TabBtn({ str }: { str: TTab }) {
		return (
			<button
				className={cn('rounded-md border bg-body-50 p-3 text-sm font-semibold text-primary-500', currentTab === str && 'border-0 bg-primary-500 text-input')}
				onClick={() => setCurrentTab(str !== currentTab ? str : '')}
			>
				{str}
			</button>
		);
	}

	type TSettings = {
		Global: TGlobal;
		Header: THeader;
		Sidebar: TSidebar[];
		MainSection: TMainSection[];
	};
	function setSettings(Json: TSettings) {
		setGlobalJson(Json.Global);
		setHeaderJson(Json.Header);
		setSidebarJson(Json.Sidebar);
		setMainSectionJson(Json.MainSection);
	}

	function formattedDate() {
		const date = new Date();
		const year = date.getFullYear();
		const month = `${date.getMonth() + 1}`.padStart(2, '0');
		const day = `${date.getDate()}`.padStart(2, '0');
		const hours = `${date.getHours()}`.padStart(2, '0');
		const minutes = `${date.getMinutes()}`.padStart(2, '0');
		return `CV Maker - ${year}-${month}-${day} ${hours}.${minutes}`;
	}

	return (
		<>
			<div className='grid gap-3'>
				<div className='grid grid-cols-[repeat(auto-fit,_minmax(0,_1fr))] gap-3'>
					<TabBtn str='Global' />
					<TabBtn str='Header' />
					<TabBtn str='Sidebar' />
					<TabBtn str='MainSection' />
				</div>
				<GlobalSettings className={currentTab === 'Global' ? 'contents' : 'hidden'} />
				<HeaderSettings className={currentTab === 'Header' ? 'contents' : 'hidden'} />
				<SidebarSettings className={currentTab === 'Sidebar' ? 'contents' : 'hidden'} />
				<MainSectionSettings className={currentTab === 'MainSection' ? 'contents' : 'hidden'} />
				<hr className='mb-2 mt-3 border-border' />
				<DoneLabel>
					Import Settings
					<Input type='file' accept='.json' onChange={(event) => ReadFile(event, setSettings)} />
				</DoneLabel>
				<DoneLabel>
					Export Settings
					<a
						className='rounded-md border bg-body-50 p-3 text-sm'
						href={`data:text/json;charset=utf-8,${encodeURIComponent(
							JSON.stringify(
								{
									Global: GlobalJson,
									Header: HeaderJson,
									Sidebar: SidebarJson,
									MainSection: MainSectionJson,
								},
								undefined,
								4,
							),
						)}`}
						download={`${formattedDate()}.json`}
					>
						Export Settings
					</a>
				</DoneLabel>
			</div>
		</>
	);
}
