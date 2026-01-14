'use client';
import React from 'react';
import { ButtonHTMLAttributes, Dispatch, SetStateAction, useState } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';

import GlobalSettings from '@/components/Settings/globalSettings';
import HeaderSettings from '@/components/Settings/headerSettings';
import SidebarSettings from '@/components/Settings/sidebarSettings';
import MainSectionSettings from '@/components/Settings/mainSectionSettings';

import { TGlobal, useGlobalJsonContext } from '@/context/globalContext';
import { THeader, useHeaderJsonContext } from '@/context/headerContext';
import { TSidebar, useSidebarJsonContext } from '@/context/sidebarContext';
import { TMainSection, useMainSectionJsonContext } from '@/context/mainSectionContext';
import { ReadFile } from '@/components/readFile';
import { Label } from '@/components/ui/label';

const Tabs = ['Global', 'Header', 'Sidebar', 'MainSection'];
type TTab = typeof Tabs[number];
type TTabBtn = ButtonHTMLAttributes<HTMLButtonElement> & {
	str: TTab,
	currentTab: string,
	setCurrentTab: Dispatch<SetStateAction<string>>
};

function TabBtn({ str, currentTab, setCurrentTab, ...props }: TTabBtn) {
	return (
		<button
			className={cn(
				'font-semibold text-sm text-text-600 bg-body-100 p-3 border border-body-200 rounded-md',
				currentTab !== str && 'cursor-pointer',
				currentTab === str && 'bg-primary-500 text-primary-50 border-primary-400'
			)}
			disabled={currentTab === str}
			onClick={() => setCurrentTab(str)}
			{...props}
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

export default function Settings() {
	const [currentTab, setCurrentTab] = useState<TTab>(Tabs[0]);
	const { GlobalJson, setGlobalJson } = useGlobalJsonContext();
	const { HeaderJson, setHeaderJson } = useHeaderJsonContext();
	const { SidebarJson, setSidebarJson } = useSidebarJsonContext();
	const { MainSectionJson, setMainSectionJson } = useMainSectionJsonContext();

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

	function handleDownload() {
		const jsonData = {
			Global: GlobalJson,
			Header: HeaderJson,
			Sidebar: SidebarJson,
			MainSection: MainSectionJson,
		};
		const blob = new Blob([JSON.stringify(jsonData, undefined, 4)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);

		const link = document.createElement('a');
		link.href = url;
		link.download = `${formattedDate()}.json`;
		link.click();
	}

	return (
		<>
			<div className='grid gap-3'>
				<div className='grid grid-cols-[repeat(auto-fit,minmax(0,1fr))] gap-3'>
					{Tabs.map((str, i) => <TabBtn key={i} str={str} currentTab={currentTab} setCurrentTab={setCurrentTab} />)}
				</div>
				<GlobalSettings className={currentTab === 'Global' ? 'contents' : 'hidden'} />
				<HeaderSettings className={currentTab === 'Header' ? 'contents' : 'hidden'} />
				<SidebarSettings className={currentTab === 'Sidebar' ? 'contents' : 'hidden'} />
				<MainSectionSettings className={currentTab === 'MainSection' ? 'contents' : 'hidden'} />
				<hr className='mb-2 mt-3 border-border' />
				<Label>
					Import Settings
					<Input className='cursor-pointer' type='file' accept='.json' onChange={(event) => ReadFile(event, setSettings)} />
				</Label>
				<Label>
					Export Settings
					<button
						className='cursor-pointer text-sm text-left bg-body-100 p-3 rounded-md border border-body-200'
						onClick={handleDownload}
					>
						Export Settings
					</button>
				</Label>
			</div>
		</>
	);
}
