'use client';
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useMemo, useState } from 'react';

export type TGlobal = {
	color: number;
	blackWhite: 1 | 0;
	darkMode: 1 | 0;
	pages: number;
};
type TGlobalState = {
	GlobalJson: TGlobal;
	setGlobalJson: Dispatch<SetStateAction<TGlobal>>;
};

const startData: TGlobal = {
	color: 277,
	blackWhite: 0,
	darkMode: 0,
	pages: 1,
};

export const GlobalJsonContext = createContext<TGlobalState | null>(null);

export default function GlobalContext({ children }: { children: ReactNode }) {
	const [GlobalJson, setGlobalJson] = useState<TGlobal>(startData);

	const value = useMemo(
		() => ({
			GlobalJson,
			setGlobalJson,
		}),
		[GlobalJson],
	);

	return (
		<GlobalJsonContext.Provider value={value}>
			{children}
		</GlobalJsonContext.Provider>
	);
}

export function useGlobalJsonContext() {
	const context = useContext(GlobalJsonContext);
	if (!context) {
		throw new Error('useGlobalJsonContext must be used within a GlobalJsonContext');
	}
	return context;
}
