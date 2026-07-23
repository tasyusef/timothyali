export const NAV_LINKS = [
	{ href: '/', label: 'Work' },
	{ href: '/about', label: 'About' },
	{ href: '/blog', label: 'Writing' }
] as const;

export const NAV_LINK_COLUMNS = ['md:col-start-7', 'md:col-start-9', 'md:col-start-11'] as const;

export function isActiveLink(href: string, pathname: string): boolean {
	if (href === '/') return pathname === '/' || pathname.startsWith('/work');
	return pathname.startsWith(href);
}
