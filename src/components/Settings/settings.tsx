'use client';
import React from 'react';
import { ButtonHTMLAttributes, Dispatch, SetStateAction, useState } from 'react';
import { cn, tryCatch } from '@/lib/util';
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
import { migrateGlobal, migrateHeader, migrateSidebar, migrateMainSection } from '@/lib/migrateData';
import { LinkButton } from '@/components/ui/link';
import { whenHoveringButton } from '@/lib/util';

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
				'font-semibold text-text-600 bg-body-100 px-3 py-2 border border-body-200 rounded-md',
				currentTab !== str && 'cursor-pointer',
				currentTab === str && 'bg-primary-500 text-primary-50 border-primary-400 dark:border-primary-600'
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
		const [error] = tryCatch(() => {
			setGlobalJson(migrateGlobal(Json.Global));
			setHeaderJson(migrateHeader(Json.Header));
			setSidebarJson(migrateSidebar(Json.Sidebar));
			setMainSectionJson(migrateMainSection(Json.MainSection));
		});

		if (error) {
			alert(error.message);
			window.location.reload();
		}
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
					<Input className={cn('cursor-pointer', whenHoveringButton)} type='file' accept='.json' onChange={(event) => ReadFile(event, setSettings)} />
				</Label>
				<Label>
					Export Settings
					<LinkButton className='cursor-pointer text-left bg-body-100 px-3 py-2 border border-body-200 rounded-md' onClick={handleDownload}>
						Export Settings
					</LinkButton>
				</Label>
			</div>
		</>
	);
}
