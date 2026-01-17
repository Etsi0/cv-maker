import type { Metadata } from 'next';
import { Inter } from 'next/font/google'
import '../output.css';

import GlobalContext from '@/context/globalContext';
import HeaderContext from '@/context/headerContext';
import SidebarContext from '@/context/sidebarContext';
import MainSectionContext from '@/context/mainSectionContext';

const inter = Inter({
	weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
	style: ['normal', 'italic'],
	display: 'swap',
	variable: '--font-inter',
	preload: true,
	subsets: ['cyrillic', 'cyrillic-ext', 'greek', 'greek-ext', 'latin', 'latin-ext', 'vietnamese'],
})

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
		<html lang='en' suppressHydrationWarning className={inter.variable}>
			<body className='flex min-h-screen items-center justify-center bg-neutral-600 print:bg-body-50'>
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
