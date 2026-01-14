'use client';
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useMemo, useState } from 'react';

export const sidebarType = ['text', 'link', 'grid'] as const;
export const sidebarContent = {
	text: '',
	link: { text: '', href: '' },
	grid: [{ id: crypto.randomUUID(), value: '' }],
};
export type TGridItem = {
	id: string;
	value: string;
};
export type TSidebarContent = {
	id: string;
	content: string;
	type: 'text';
} | {
	id: string;
	content: {
		text: string;
		href: string;
	};
	type: 'link';
} | {
	id: string;
	content: TGridItem[];
	type: 'grid';
};
export type TSidebar = {
	id: string;
	content: TSidebarContent[];
	title: string;
};
type TSidebarState = {
	SidebarJson: TSidebar[];
	setSidebarJson: Dispatch<SetStateAction<TSidebar[]>>;
};

const startData: TSidebar = {
	id: crypto.randomUUID(),
	content: [
		{
			id: crypto.randomUUID(),
			content: '',
			type: 'text',
		},
	],
	title: '',
};

export const SidebarJsonContext = createContext<TSidebarState | null>(null);

export default function SidebarContext({ children }: { children: ReactNode }) {
	const [SidebarJson, setSidebarJson] = useState<TSidebar[]>([startData]);

	const value = useMemo(
		() => ({
			SidebarJson,
			setSidebarJson,
		}),
		[SidebarJson],
	);

	return (
		<SidebarJsonContext.Provider value={value}>
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
