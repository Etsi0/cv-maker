'use client';
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useMemo, useState } from 'react';
import { SvgList } from '@/components/SVGs';

export const mainTypes = ['default', 'card'] as const;
export type TMainSection = {
	id: string;
	content: {
		id: string;
		subTitle: string;
		text: string;
		title: string;
	}[];
	hidden: boolean;
	icon: keyof typeof SvgList | '';
	title: string;
	type: (typeof mainTypes)[number];
};
type TMainSectionState = {
	MainSectionJson: TMainSection[];
	setMainSectionJson: Dispatch<SetStateAction<TMainSection[]>>;
};

const startData: TMainSection = {
	id: crypto.randomUUID(),
	content: [
		{
			id: crypto.randomUUID(),
			subTitle: '',
			text: '',
			title: '',
		},
	],
	hidden: false,
	icon: '',
	title: '',
	type: 'default',
};

export const MainSectionJsonContext = createContext<TMainSectionState | null>(null);

export default function MainSectionContext({ children }: { children: ReactNode }) {
	const [MainSectionJson, setMainSectionJson] = useState<TMainSection[]>([startData]);

	const value = useMemo(
		() => ({
			MainSectionJson,
			setMainSectionJson,
		}),
		[MainSectionJson],
	);

	return (
		<MainSectionJsonContext.Provider value={value}>
			{children}
		</MainSectionJsonContext.Provider>
	);
}

export function useMainSectionJsonContext() {
	const context = useContext(MainSectionJsonContext);
	if (!context) {
		throw new Error('useMainSectionJsonContext must be used within a MainSectionJsonContext');
	}
	return context;
}
