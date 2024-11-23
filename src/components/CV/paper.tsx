'use client';
import { ReactNode, useState } from 'react';
import Image from 'next/image';

// setting JSON
import { useGlobalJsonContext } from '@/context/globalContext';
import { useHeaderJsonContext } from '@/context/headerContext';
import { useSidebarJsonContext } from '@/context/sidebarContext';
import { TMainSection, useMainSectionJsonContext } from '@/context/mainSectionContext';

import { SvgList } from '@/components/SVGs';
import { cn } from '@/lib/utils';
import { CreditLink } from './creditLine';
import { Input } from '../ui/shadcn/input';
import { DoneLabel } from '../ui/elements/label';

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

export default function Paper() {
	const [isGrayscale, setIsGrayscale] = useState<boolean>(false);
	const { GlobalJson } = useGlobalJsonContext();
	const { HeaderJson } = useHeaderJsonContext();
	const { SidebarJson } = useSidebarJsonContext();
	const { MainSectionJson } = useMainSectionJsonContext();
	const pseudoClasses = 'before:absolute before:w-[2px] before:h-full before:top-0 before:rounded-full before:translate-x-[-50%]';

	function MainSectionWrapper({ data, children }: TWrapperProps) {
		return (
			<div className='grid gap-1'>
				<div className='flex items-center'>
					<StrToImg str={data.icon} className='mx-[0.625rem]' />
					<h2 className='text-md z-10 uppercase'>{data.title}</h2>
				</div>
				<div className={cn('relative ml-10 grid gap-4 before:left-[calc((10rem-2px)/2/4*-1)] before:bg-primary-200', pseudoClasses, data.type === 'card' && 'grid-cols-3')}>{children}</div>
			</div>
		);
	}

	function MainDefault({ title, subTitle, text }: TAchievementDetails) {
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
	}

	function MainCard({ title, subTitle, text }: TAchievementDetails) {
		return (
			<div
				className={cn(
					'space-y-1 rounded-md bg-body-100 p-3 shadow-[10px_10px_15px_-3px_rgb(0_0_0_/_0.1),_4px_4px_6px_-4px_rgb(0_0_0_/_0.1),_-10px_-10px_15px_-3px_rgb(255_255_255),_-4px_-4px_6px_-4px_rgb(255_255_255)]',
					GlobalJson.darkMode && 'bg-body-200 shadow-none',
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
	}

	const StrToImg = ({ str, className }: TStrToImg) => {
		if (str === '') {
			return null;
		}

		const Component = SvgList[str];
		return <Component className={cn('w-5 text-primary-500', className)} />;
	};

	return (
		<div className={cn('relative flex h-[calc(297mm_*_2)] w-[210mm] flex-col items-center gap-2 bg-body-100 p-8', isGrayscale && 'saturate-0')}>
			<div className='absolute left-4 top-3 flex justify-start gap-1 print:hidden'>
				<DoneLabel className='shrink-0' htmlFor='grayScaleSim'>
					Simulate Grayscale
				</DoneLabel>
				<Input id='grayScaleSim' className='h-auto' type='checkbox' value={isGrayscale.toString()} onChange={(event) => setIsGrayscale(event.target.checked)} />
			</div>
			{/*==================================================
				Header
			==================================================*/}
			<div className='flex flex-col items-center gap-2'>
				{HeaderJson.img && <Image className='mb-2 aspect-square rounded-lg object-cover' src={HeaderJson.img} alt='Your profile picture' width={80} height={80} />}
				<h1 className='text-3xl uppercase'>{HeaderJson.name || 'Undefined'}</h1>
				<ul className='flex flex-wrap gap-3'>
					{HeaderJson.content.map((item, i) => (
						<li key={`header-${i}`} className='flex items-center gap-1'>
							<StrToImg str={item.icon} className='mx-0' />
							{item.text}
						</li>
					))}
				</ul>
			</div>
			{/*==================================================
				Sidebar & Main Section
			==================================================*/}
			<div className='flex w-full grow'>
				{/*==================================================
					Sidebar
				==================================================*/}
				<div className='grid flex-shrink flex-grow-0 basis-auto gap-3 self-start text-center'>
					{SidebarJson.map((item, i) => (
						<div key={`sidebar-${i}`}>
							<h2 className='text-md uppercase'>{item.title}</h2>
							<div className='grid justify-center'>
								{item.content.map((contentItem, j) => {
									const key = `sidebar-${i}-${j}`;
									switch (contentItem.type) {
										case 'text':
											return <p key={key}>{contentItem.content}</p>;
										case 'link':
											return (
												<a key={key} className='underline' href={contentItem.content.href}>
													{contentItem.content.text}
												</a>
											);
										case 'grid':
											return (
												<ul key={key} className={cn('relative grid grid-cols-2 gap-x-3 before:left-1/2 before:bg-primary-50', pseudoClasses)}>
													{contentItem.content.map((grid, x) => (
														<li key={`${key}-${x}`} className='odd:justify-self-end even:justify-self-start'>
															{grid}
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
				{/*==================================================
					Main timeline
				==================================================*/}
				<div className='grid flex-shrink flex-grow basis-0 gap-4 self-start'>
					{/*==================================================
						Profile
					==================================================*/}
					{MainSectionJson.map((category, i) => (
						<MainSectionWrapper key={`main-${i}`} data={category}>
							{!category.hidden ? (
								category.content.map((item, j) => {
									const key = `main-${i}-${j}`;
									if (category.type === 'default') {
										return <MainDefault key={key} {...item} />;
									} else if (category.type === 'card') {
										return <MainCard key={key} {...item} />;
									}
								})
							) : (
								<p className='whitespace-nowrap'>{category.title}(s) are provided on request</p>
							)}
						</MainSectionWrapper>
					))}
				</div>
			</div>
			<CreditLink />
		</div>
	);
}
