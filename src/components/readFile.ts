import { TGlobal } from '@/context/globalContext';
import { THeader } from '@/context/headerContext';
import { TMainSection } from '@/context/mainSectionContext';
import { TSidebar } from '@/context/sidebarContext';

export const ReadFile = (event: React.ChangeEvent<HTMLInputElement>, callback: (data: { Global: TGlobal; Header: THeader; Sidebar: TSidebar[]; MainSection: TMainSection[] }) => void) => {
	const file = event.target.files?.[0];
	if (!file) {
		console.log('No file selected', event);
		return;
	}

	const reader = new FileReader();
	reader.onload = (e: ProgressEvent<FileReader>) => {
		if (!e.target?.result) {
			console.error('File read result is null or undefined');
			return;
		}
		const result = e.target.result as string;
		try {
			const json = JSON.parse(result);
			callback(json);
		} catch (error) {
			console.error('Error parsing JSON:', error);
		}
	};

	reader.onerror = (error) => {
		console.error('Error reading file:', error);
	};

	reader.readAsText(file);
};
