'use client';
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';
import { SvgList } from '@/components/SVGs';

export type THeader = {
	content: {
		icon: keyof typeof SvgList | '';
		text: string;
	}[];
	img: string;
	name: string;
};
type THeaderState = {
	HeaderJson: THeader;
	setHeaderJson: Dispatch<SetStateAction<THeader>>;
};

const startData: THeader = {
	content: [
		{
			icon: '',
			text: '',
		},
	],
	img: '',
	name: '',
};

export const HeaderJsonContext = createContext<THeaderState | null>(null);

export default function HeaderContext({ children }: { children: ReactNode }) {
	const [HeaderJson, setHeaderJson] = useState<THeader>(startData);

	return (
		<HeaderJsonContext.Provider
			value={{
				HeaderJson,
				setHeaderJson,
			}}
		>
			{children}
		</HeaderJsonContext.Provider>
	);
}

export function useHeaderJsonContext() {
	const context = useContext(HeaderJsonContext);
	if (!context) {
		throw new Error('useHeaderJsonContext must be used within a HeaderJsonContext');
	}
	return context;
}
