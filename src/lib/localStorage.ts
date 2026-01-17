import { tryCatch } from './util';

type NewsItem = {
	date: string;
	title: string;
	description: string;
};

const INTRO_KEY = 'intro';
const NEWS_KEY = 'news';

/**
 * Get the date when the user first saw the welcome screen
 * @returns ISO date string or null if not set
 */
export function hasUserWelcomed(): string | null {
	if (typeof window === 'undefined') {
		return null;
	}

	const value = localStorage.getItem(INTRO_KEY);
	return value || null;
}

/**
 * Mark the user as having seen the welcome screen
 * Stores the current date in ISO format
 */
export function markUserAsWelcomed(): void {
	if (typeof window === 'undefined') {
		return;
	}

	const now = new Date().toISOString();
	localStorage.setItem(INTRO_KEY, now);
}

/**
 * Get the latest news date the user has seen
 * @returns ISO date string or null if not set
 */
export function getLatestSeenNewsDate(): string | null {
	if (typeof window === 'undefined') {
		return null;
	}

	const value = localStorage.getItem(NEWS_KEY);
	return value || null;
}

/**
 * Mark news up to a specific date as seen
 * @param date - The date to mark as seen (ISO string or date string from news.json)
 */
export function markNewsAsSeen(date: string): void {
	if (typeof window === 'undefined') {
		return;
	}

	// Convert the date to ISO format for consistency
	// If it's already ISO, use it; otherwise parse it
	let isoDate: string;

	// Try to parse as ISO first
	const [parseError, parsed] = tryCatch(() => new Date(date));
	if (!parseError && parsed && !isNaN(parsed.getTime())) {
		isoDate = parsed.toISOString();
		localStorage.setItem(NEWS_KEY, isoDate);
		return;
	}

	// If parsing fails, try to convert YYYY-MM-DD to ISO
	const [convertError, converted] = tryCatch(() => new Date(date + 'T00:00:00.000Z'));
	if (!convertError && converted && !isNaN(converted.getTime())) {
		isoDate = converted.toISOString();
		localStorage.setItem(NEWS_KEY, isoDate);
		return;
	}

	// Fallback: use current date if parsing fails
	isoDate = new Date().toISOString();
	localStorage.setItem(NEWS_KEY, isoDate);
}

/**
 * Returns unseen news items that are newer than the latest seen news date
 * If no news has been seen, falls back to comparing with the welcome date
 * Returns empty array if user welcomed today (same day as first visit)
 * Assumes newsItems is sorted with latest news first (index 0) and oldest last
 * @param newsItems - Array of news items from news.json (sorted: latest first, oldest last)
 * @returns Array of unseen news items that are newer than the latest seen date (or welcome date if none seen)
 */
export function getUnseenNews(newsItems: NewsItem[]): NewsItem[] {
	if (typeof window === 'undefined') {
		return [];
	}

	const welcomeDate = hasUserWelcomed();
	if (!welcomeDate) {
		return [];
	}

	// Check if user welcomed today (same day as first visit)
	const welcome = new Date(welcomeDate);
	const today = new Date();
	const welcomeDay = new Date(welcome.getFullYear(), welcome.getMonth(), welcome.getDate());
	const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
	if (welcomeDay.getTime() === todayDay.getTime()) {
		return [];
	}

	const latestSeenDate = getLatestSeenNewsDate();
	const latestSeen = new Date(latestSeenDate ?? welcomeDate);
	if (!latestSeen) {
		return [];
	}


	const unseen: NewsItem[] = [];
	for (const item of newsItems) {
		const itemDate = new Date(item.date + 'T00:00:00.000Z');
		if (itemDate > latestSeen) {
			unseen.push(item);
		} else {
			// Since items are sorted latest to oldest, we can stop here
			break;
		}
	}

	return unseen;
}
