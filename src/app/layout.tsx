import type { Metadata } from 'next';
import '../output.css';

import GlobalContext from '@/context/globalContext';
import HeaderContext from '@/context/headerContext';
import SidebarContext from '@/context/sidebarContext';
import MainSectionContext from '@/context/mainSectionContext';

export const metadata: Metadata = {
	title: 'CV Maker - Phadonia',
	description: 'Create your perfect cv',
};

type childrenProp = {
	children: Readonly<React.ReactNode>;
};

export default function RootLayout(props: childrenProp) {
	const { children } = props;

	return (
		<html lang='en' suppressHydrationWarning>
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				<link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet" />
			</head>
			<body className='flex min-h-screen items-center justify-center bg-neutral-600 print:bg-body-100'>
				<main className='flex grow'>
					<GlobalContext>
						<HeaderContext>
							<SidebarContext>
								<MainSectionContext>{children}</MainSectionContext>
							</SidebarContext>
						</HeaderContext>
					</GlobalContext>
				</main>
			</body>
		</html>
	);
}
