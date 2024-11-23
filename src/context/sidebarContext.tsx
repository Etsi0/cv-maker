'use client';
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';

export const sidebarType = ['text', 'link', 'grid'] as const;
export const sidebarContent = {
	text: '',
	link: { text: '', href: '' },
	grid: [''],
};
type TSidebarContent =
	| { type: 'text'; content: string }
	| { type: 'link'; content: { text: string; href: string } }
	| { type: 'grid'; content: string[] };
export type TSidebar = {
	content: TSidebarContent[];
	title: string;
};
type TSidebarState = {
	SidebarJson: TSidebar[];
	setSidebarJson: Dispatch<SetStateAction<TSidebar[]>>;
};

const startData: TSidebar = {
	content: [
		{
			content: '',
			type: 'text',
		},
	],
	title: '',
};

export const SidebarJsonContext = createContext<TSidebarState | null>(null);

export default function SidebarContext({ children }: { children: ReactNode }) {
	const [SidebarJson, setSidebarJson] = useState<TSidebar[]>([startData]);

	return (
		<SidebarJsonContext.Provider
			value={{
				SidebarJson,
				setSidebarJson,
			}}
		>
			{children}
		</SidebarJsonContext.Provider>
	);
}

export function useSidebarJsonContext() {
	const context = useContext(SidebarJsonContext);
	if (!context) {
		throw new Error('useSidebarJsonContext must be used within a SidebarJsonContext');
	}
	return context;
}
