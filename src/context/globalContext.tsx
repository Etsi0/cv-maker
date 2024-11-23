'use client';
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';

export type TGlobal = {
	color: number;
	blackWhite: 1 | 0;
	darkMode: 1 | 0;
};
type TGlobalState = {
	GlobalJson: TGlobal;
	setGlobalJson: Dispatch<SetStateAction<TGlobal>>;
};

const startData: TGlobal = {
	color: 277.12,
	blackWhite: 0,
	darkMode: 0,
};

export const GlobalJsonContext = createContext<TGlobalState | null>(null);

export default function GlobalContext({ children }: { children: ReactNode }) {
	const [GlobalJson, setGlobalJson] = useState<TGlobal>(startData);

	return (
		<GlobalJsonContext.Provider
			value={{
				GlobalJson,
				setGlobalJson,
			}}
		>
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
