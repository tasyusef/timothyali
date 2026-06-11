import { error } from '@sveltejs/kit';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { read } from '$app/server';
import { ogCards } from '$lib/og';
import grotesk400 from '@fontsource/space-grotesk/files/space-grotesk-latin-400-normal.woff?url';
import grotesk500 from '@fontsource/space-grotesk/files/space-grotesk-latin-500-normal.woff?url';
import type { EntryGenerator, RequestHandler } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => Object.keys(ogCards).map((key) => ({ key }));

const WIDTH = 1200;
const HEIGHT = 630;

export const GET: RequestHandler = async ({ params }) => {
	const card = ogCards[params.key];
	if (!card) error(404, 'Unknown OG image');

	const [regular, medium] = await Promise.all([
		read(grotesk400).arrayBuffer(),
		read(grotesk500).arrayBuffer()
	]);

	const svg = await satori(
		{
			type: 'div',
			props: {
				style: {
					width: '100%',
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'flex-end',
					padding: '80px',
					backgroundColor: '#0a0a0a',
					fontFamily: 'Space Grotesk'
				},
				children: [
					{
						type: 'div',
						props: {
							style: {
								display: 'flex',
								fontSize: 20,
								fontWeight: 500,
								textTransform: 'uppercase',
								letterSpacing: '0.08em',
								color: '#888888',
								marginBottom: 24
							},
							children: 'Timothy Ali'
						}
					},
					{
						type: 'div',
						props: {
							style: {
								display: 'flex',
								fontSize: 64,
								fontWeight: 400,
								color: '#ededed',
								letterSpacing: '-0.025em',
								lineHeight: 1.1
							},
							children: card.title
						}
					},
					...(card.subtitle
						? [
								{
									type: 'div',
									props: {
										style: { display: 'flex', fontSize: 24, color: '#888888', marginTop: 20 },
										children: card.subtitle
									}
								}
							]
						: [])
				]
			}
		},
		{
			width: WIDTH,
			height: HEIGHT,
			fonts: [
				{ name: 'Space Grotesk', data: regular, weight: 400, style: 'normal' },
				{ name: 'Space Grotesk', data: medium, weight: 500, style: 'normal' }
			]
		}
	);

	const png = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } }).render().asPng();

	return new Response(new Uint8Array(png), {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=31536000, immutable'
		}
	});
};
