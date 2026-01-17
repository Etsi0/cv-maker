'use client';

import { useEffect, useRef, useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { LinkButton } from '@/components/ui/link';
import { hasUserWelcomed, markUserAsWelcomed } from '@/lib/localStorage';

export default function Welcome() {
	const [isMounted, setIsMounted] = useState(false);
	const [shouldShow, setShouldShow] = useState(false);
	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		setIsMounted(true);

		const hasWelcomed = hasUserWelcomed();
		if (!hasWelcomed) {
			setShouldShow(true);
			dialogRef.current?.showModal();
		}
	}, [isMounted]);

	function handleGetStarted() {
		markUserAsWelcomed();
		setShouldShow(false);
		dialogRef.current?.close();
	}

	if (!isMounted || !shouldShow) {
		return null;
	}

	return (
		<Dialog ref={dialogRef} className="max-w-3xl max-h-[90vh] overflow-y-auto">
			<h1 className="text-3xl font-bold mb-6">Welcome to CV Maker</h1>

			<div className="space-y-6">
				{/* Browser Recommendation Section */}
				<section className="space-y-2">
					<h2 className="text-xl font-semibold">Browser Recommendation</h2>
					<p className="text-text-700">
						We recommend using <strong>Firefox</strong> since this application has only been tested on Firefox.
					</p>
				</section>

				{/* Save/Load Data Section */}
				<section className="space-y-2">
					<h2 className="text-xl font-semibold">Save and Load Your Data</h2>
					<div className="space-y-2 text-text-700">
						<p>
							To save your data so you can continue working another time, press the <strong>export button</strong> at the bottom of the settings panel.
						</p>
						<p>
							You can import your data using the button right above the export button.
						</p>
					</div>
				</section>

				{/* PDF Export Instructions Section */}
				<section className="space-y-3">
					<h2 className="text-xl font-semibold">Export Your CV as PDF</h2>
					<div className="space-y-3 text-text-700">
						<p>To export your CV as a PDF, follow these steps:</p>
						<ol className="list-decimal list-inside space-y-2 ml-2">
							<li>
								Press <kbd className="px-2 py-1 bg-body-100 border border-body-200 rounded text-sm">Ctrl + P</kbd> (Windows/Linux) or <kbd className="px-2 py-1 bg-body-100 border border-body-200 rounded text-sm">⌘ + P</kbd> (macOS)
							</li>
							<li>Configure the following settings:
								<ul className="list-disc list-inside ml-6 mt-2 space-y-1">
									<li><strong>Destination:</strong> Save to PDF</li>
									<li><strong>Orientation:</strong> Portrait</li>
									<li><strong>Pages:</strong> All</li>
									<li><strong>Colour mode:</strong> Colour</li>
									<li><strong>Paper size:</strong> A4</li>
									<li><strong>Scale:</strong> 98</li>
									<li><strong>Pages per sheet:</strong> 1</li>
									<li><strong>Margins:</strong> None</li>
									<li><strong>Options:</strong>
										<ul className="list-disc list-inside ml-6 mt-1 space-y-1">
											<li>Print headers and footers: true or false</li>
											<li>Print backgrounds: true</li>
										</ul>
									</li>
								</ul>
							</li>
						</ol>
					</div>
				</section>
			</div>

			<div className="flex justify-end pt-6">
				<LinkButton
					onClick={handleGetStarted}
					className="bg-primary-500 text-white px-6 py-2 rounded-md hover:opacity-90 text-lg"
				>
					Get Started
				</LinkButton>
			</div>
		</Dialog>
	);
}
