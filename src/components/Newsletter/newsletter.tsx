'use client';

import { useEffect, useRef, useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { LinkButton } from '@/components/ui/link';
import { getUnseenNews, markNewsAsSeen } from '@/lib/localStorage';
import { GetNewsData } from '@/app/api/news/main';
import { tryCatch } from '@/lib/util';

type NewsItem = {
	date: string;
	title: string;
	description: string;
};

export default function Newsletter() {
	const [isMounted, setIsMounted] = useState(false);
	const [unseenNews, setUnseenNews] = useState<NewsItem[]>([]);
	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		setIsMounted(true);

		async function loadNews() {
			const [error, response] = await tryCatch(GetNewsData());
			if (error && !response) {
				return;
			}

			const unseen = getUnseenNews(response.items);
			setUnseenNews(unseen);

			if (unseen.length > 0 && dialogRef.current) {
				dialogRef.current.showModal();
			}
		}

		loadNews();
	}, [isMounted]);

	function handleDismiss() {
		if (unseenNews.length === 0) {
			return;
		}

		// Find the latest date from unseen news
		const dates = unseenNews.map((item) => new Date(item.date + 'T00:00:00.000Z'));
		const latestDate = new Date(Math.max(...dates.map((d) => d.getTime())));
		const latestDateString = latestDate.toISOString().split('T')[0]; // Get YYYY-MM-DD format

		markNewsAsSeen(latestDateString);
		setUnseenNews([]);

		if (dialogRef.current) {
			dialogRef.current.close();
		}
	}

	if (!isMounted || unseenNews.length === 0) {
		return null;
	}

	return (
		<Dialog ref={dialogRef} className="grid gap-4 max-w-2xl">
			<h1 className="text-2xl font-bold">What{"'"}s New</h1>
			{unseenNews.map((item) => (
				<div key={`${item.date}`} className="grid pb-4 border-b border-body-200 nth-last-[2]:border-b-0 nth-last-[2]:pb-0">
					<div className="flex justify-between gap-2 w-full">
						<h2 className="text-lg font-semibold">{item.title}</h2>
						<span className="text-sm text-text-400 whitespace-nowrap">{item.date}</span>
					</div>
					<p className="text-text-500">{item.description}</p>
				</div>
			))}
			<LinkButton
				onClick={handleDismiss}
				className="justify-self-end bg-primary-500 text-white px-3 py-2 rounded-md"
			>
				Dismiss
			</LinkButton>
		</Dialog>
	);
}
