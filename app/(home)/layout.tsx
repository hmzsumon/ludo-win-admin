import React from 'react';

const HomeLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<div className="app-shell min-h-screen">
			<div className='flex flex-col min-h-[53vh] md:min-h-[61vh] '>
				{children}
			</div>
			<footer className='border-t border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface))] py-4 text-center text-[rgb(var(--app-text-soft))]'>
				<p>© 2023 Your Company. All rights reserved.</p>
			</footer>
		</div>
	);
};

export default HomeLayout;
