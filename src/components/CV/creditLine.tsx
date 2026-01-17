export function CreditLink({ className }: { className?: string }) {
	return (
		<span className={className}>
			Created using{' '}
			<a className='underline' href='https://github.com/Etsi0/cv_maker'>
				CV Maker
			</a>
			, developed by{' '}
			<a className='underline' href='https://www.phadonia.com'>
				Albin Karlsson
			</a>
			.
		</span>
	);
}
