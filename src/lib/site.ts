import { imageUrl } from './images';

export const SITE_URL = 'https://www.timothyali.com';
export const SITE_NAME = 'Timothy Ali';
export const SITE_TITLE = 'Timothy Ali — Product Design, Brand Identity & Motion';
export const SITE_DESCRIPTION =
	'Portfolio of Timothy Ali — designer specializing in product/web design, brand identity, and motion design for startups and tech companies.';
export const X_HANDLE = '@twocakeS__';

export interface SocialLink {
	label: string;
	handle: string;
	href: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
	{ label: 'GitHub', handle: 'github.com/tasyusef', href: 'https://github.com/tasyusef' },
	{
		label: 'LinkedIn',
		handle: 'linkedin.com/in/timothyali',
		href: 'https://linkedin.com/in/timothyali'
	},
	{
		label: 'Substack',
		handle: 'substack.com/@timothyali',
		href: 'https://substack.com/@timothyali'
	},
	{ label: 'X', handle: 'x.com/twocakeS__', href: 'https://x.com/twocakeS__' }
];

/** Person entity without @context — embeddable in other schemas (ProfilePage). */
export const PERSON_ENTITY = {
	'@type': 'Person',
	name: 'Timothy Ali',
	url: SITE_URL,
	image: imageUrl('/images/about/headshot.jpg', SITE_URL),
	jobTitle: 'Product Designer',
	knowsAbout: ['Product Design', 'Brand Identity', 'Motion Design', 'Web Design', 'UI/UX Design'],
	address: {
		'@type': 'PostalAddress',
		addressLocality: 'Denver',
		addressRegion: 'CO',
		addressCountry: 'US'
	},
	sameAs: SOCIAL_LINKS.map((link) => link.href)
};

export const PERSON_JSON_LD = {
	'@context': 'https://schema.org',
	...PERSON_ENTITY
};

export const WEBSITE_JSON_LD = {
	'@context': 'https://schema.org',
	'@type': 'WebSite',
	name: SITE_NAME,
	url: SITE_URL,
	publisher: { '@type': 'Person', name: SITE_NAME, url: SITE_URL }
};
