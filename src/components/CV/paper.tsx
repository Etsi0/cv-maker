'use client';
import { ReactNode, useState, memo } from 'react';
import Image from 'next/image';

// setting JSON
import { useGlobalJsonContext } from '@/context/globalContext';
import { useHeaderJsonContext } from '@/context/headerContext';
import { useSidebarJsonContext } from '@/context/sidebarContext';
import { TMainSection, useMainSectionJsonContext } from '@/context/mainSectionContext';

import { SvgList } from '@/components/SVGs';
import { cn } from '@/lib/util';
import { CreditLink } from './creditLine';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

type TAchievementDetails = {
	title?: string;
	subTitle?: string;
	text?: string;
};
type TWrapperProps = {
	data: TMainSection;
	children: ReactNode;
};
type TStrToImg = {
	str: keyof typeof SvgList | '';
	className?: string;
};

const pseudoClasses = 'before:absolute before:w-[2px] before:h-full before:top-0 before:rounded-full before:translate-x-[-50%]';

const StrToImg = memo(function StrToImg({ str, className }: TStrToImg) {
	if (str === '') {
		return null;
	}

	const Component = SvgList[str];
	return <Component className={cn('w-5 text-primary-500', className)} />;
});

const HeaderSection = memo(function HeaderSection() {
	const { HeaderJson } = useHeaderJsonContext();

	return (
		<div className='flex flex-col items-center gap-2'>
			{HeaderJson.img && <Image className='mb-2 aspect-square rounded-lg object-cover' src={HeaderJson.img} alt='Your profile picture' width={80} height={80} />}
			<h1 className='uppercase'>{HeaderJson.name || 'Undefined'}</h1>
			<ul className='flex flex-wrap gap-3'>
				{HeaderJson.content.map((item) => (
					<li key={item.id} className='flex items-center gap-1'>
						<StrToImg str={item.icon} className='mx-0' />
						{item.text}
					</li>
				))}
			</ul>
		</div>
	);
});

const SidebarSection = memo(function SidebarSection() {
	const { SidebarJson } = useSidebarJsonContext();

	return (
		<div className='grid shrink grow-0 basis-auto gap-3 self-start text-center'>
			{SidebarJson.map((item) => (
				<div key={item.id}>
					<h2 className='uppercase'>{item.title}</h2>
					<div className='grid justify-center'>
						{item.content.map((contentItem) => {
							switch (contentItem.type) {
								case 'text':
									return <p key={contentItem.id}>{contentItem.content}</p>;
								case 'link':
									return (
										<a key={contentItem.id} className='underline' href={contentItem.content.href}>
											{contentItem.content.text}
										</a>
									);
								case 'grid':
									return (
										<ul key={contentItem.id} className={cn('relative grid grid-cols-2 gap-x-3 before:left-1/2 before:bg-primary-100 dark:before:bg-primary-900', pseudoClasses)}>
											{contentItem.content.map((gridItem) => (
												<li key={gridItem.id} className='odd:justify-self-end even:justify-self-start'>
													{gridItem.value}
												</li>
											))}
										</ul>
									);
								default:
									return null;
							}
						})}
					</div>
				</div>
			))}
		</div>
	);
});

const MainCard = memo(function MainCard({ title, subTitle, text }: TAchievementDetails) {
	const { GlobalJson } = useGlobalJsonContext();

	return (
		<div
			className={cn(
				'space-y-1 rounded-md bg-body-50 p-3 shadow-[10px_10px_15px_-3px_rgb(0_0_0/0.1),4px_4px_6px_-4px_rgb(0_0_0/0.1),-10px_-10px_15px_-3px_rgb(255_255_255),-4px_-4px_6px_-4px_rgb(255_255_255)]',
				GlobalJson.darkMode && 'shadow-none',
			)}
		>
			{(title || subTitle) && (
				<div>
					{title && <h3 dangerouslySetInnerHTML={{ __html: title }}></h3>}
					{subTitle && <h4 className='text-text-700 opacity-45' dangerouslySetInnerHTML={{ __html: subTitle }}></h4>}
				</div>
			)}
			{text && <p dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, '<br />') }}></p>}
		</div>
	);
});

const MainDefault = memo(function MainDefault({ title, subTitle, text }: TAchievementDetails) {
	return (
		<div className='space-y-1'>
			{(title || subTitle) && (
				<div>
					{title && <h3 dangerouslySetInnerHTML={{ __html: title }}></h3>}
					{subTitle && <h4 className='text-text-700 opacity-45' dangerouslySetInnerHTML={{ __html: subTitle }}></h4>}
				</div>
			)}
			{text && (
				<p
					dangerouslySetInnerHTML={{
						__html: text.replace(/\n/g, '<br />'),
					}}
				></p>
			)}
		</div>
	);
});

const MainSectionWrapper = memo(function MainSectionWrapper({ data, children }: TWrapperProps) {
	return (
		<div className='grid gap-1'>
			<div className='flex items-center'>
				<StrToImg str={data.icon} className='mx-2.5' />
				<h2 className='z-10 uppercase'>{data.title}</h2>
			</div>
			<div className={cn('relative ml-10 grid gap-4 before:left-[calc((10rem-2px)/2/4*-1)] before:bg-primary-300 dark:before:bg-primary-700', pseudoClasses, data.type === 'card' && 'grid-cols-3')}>{children}</div>
		</div>
	);
});

const MainSectionContent = memo(function MainSectionContent() {
	const { MainSectionJson } = useMainSectionJsonContext();

	return (
		<div className='grid shrink grow basis-0 gap-4 self-start'>
			{MainSectionJson.map((category) => (
				<MainSectionWrapper key={category.id} data={category}>
					{!category.hidden ? (
						category.content.map((item) => {
							if (category.type === 'default') {
								return <MainDefault key={item.id} {...item} />;
							} else if (category.type === 'card') {
								return <MainCard key={item.id} {...item} />;
							}
						})
					) : (
						<p className='whitespace-nowrap'>{category.title}(s) are provided on request</p>
					)}
				</MainSectionWrapper>
			))}
		</div>
	);
});

export default function Paper() {
	const [isGrayscale, setIsGrayscale] = useState<boolean>(false);

	return (
		<div className={cn('paper relative flex h-[calc(297mm*var(--pages))] w-[210mm] flex-col items-center gap-2 bg-body-50 p-8', isGrayscale && 'saturate-0')}>
			<div className='absolute left-4 top-3 flex justify-start gap-1 print:hidden'>
				<Label className='shrink-0' htmlFor='grayScaleSim'>
					Simulate Grayscale
				</Label>
				<Input id='grayScaleSim' className='h-auto' type='checkbox' value={isGrayscale.toString()} onChange={(event) => setIsGrayscale(event.target.checked)} />
			</div>
			<HeaderSection />
			<div className='flex w-full grow'>
				<SidebarSection />
				<MainSectionContent />
			</div>
			<CreditLink />
		</div>
	);
}
