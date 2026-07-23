import { getImage } from './images';

/**
 * Misc work — art, prints, photography — shown on /art and the homepage
 * teaser. Files live in src/lib/images/art/; adding a piece is one entry
 * here. Aspect ratios derive from the image manifest, so none are stored.
 */
export interface ArtPiece {
	src: string;
	alt: string;
	/** Optional — shown in the hover chin only when present. */
	title?: string;
	year?: string;
}

export const art: ArtPiece[] = [
	{
		src: '/images/art/cocodrillo-turbo-record.png',
		alt: 'Concept album cover for Action Bronson’s Cocodrillo Turbo: a halftone bust in dark glasses over an aerial New York night, tracklist down the right edge',
		title: 'Cocodrillo Turbo',
		year: '2022'
	},
	{
		src: '/images/art/parc-fiction.png',
		alt: 'Parc Fiction poster after the Pulp Fiction one-sheet: a halftone Mia Wallace figure with a milkshake and the quote Wen Mint',
		title: 'Parc Fiction',
		year: '2022'
	},
	{
		src: '/images/art/new-york-mag.png',
		alt: 'New York magazine cover mockup: a color-blocked grid of teal, green, red, and yellow woven through night photos of Manhattan',
		title: 'New York',
		year: '2022'
	},
	{
		src: '/images/art/typebook-01.png',
		alt: 'Type specimen poster for Ohno Type Co’s Degular: white letterforms extruded in stacked layers over black',
		title: 'Degular Specimen'
	},
	{
		src: '/images/art/dune-front-back.png',
		alt: 'Dune paperback redesign mockup, front and back covers: outlined display type over a teal moon and sand-colored dunes',
		title: 'Dune',
		year: '2022'
	},
	{
		src: '/images/art/typebook-02.png',
		alt: 'Degular specimen poster: the words global, recognizable, curvy, bold stacked in white over colored circles',
		title: 'Degular Specimen'
	},
	{
		src: '/images/art/vehicult-1.png',
		alt: 'Vehicult poster 00001: a black Porsche 911 at Cars and Coffee in Newport, Rhode Island',
		title: 'Vehicult 00001'
	},
	{
		src: '/images/art/vehicult-2.png',
		alt: 'Vehicult poster 00002: a slammed white Mercedes-Benz SL500 at a Boston city meet outside Government Center',
		title: 'Vehicult 00002'
	},
	{
		src: '/images/art/the-bakers.png',
		alt: 'The Bakers poster: a hand-drawn chef with a curled mustache on a field of yellow, red, and black zigzags',
		title: 'The Bakers'
	},
	{
		src: '/images/art/demon-ape-drift-club.png',
		alt: 'Demon Ape Drift Club sticker: a cutout Toyota Cressida with exposed engine over a red block with the kanji for demon',
		title: 'Demon Ape Drift Club'
	},
	{
		src: '/images/gridform/Poster_Frame_Mockup_2.png',
		alt: 'Studio Gridform Less Noise poster series displayed on an outdoor wall',
		title: 'Gridform Posters',
		year: '2023'
	},
	{
		src: '/images/art/vehicult-3.png',
		alt: 'Vehicult poster 00003: a blue Mk2 Volkswagen Golf on the road at Broke Meet 2017 in South Kingston Island, Rhode Island',
		title: 'Vehicult 00003'
	},
	{
		src: '/images/art/vehicult-4.png',
		alt: 'Vehicult poster 00004: a black Toyota Cressida with its turbo engine exposed at King of the Hill 2017, Diamond Hill State Park',
		title: 'Vehicult 00004'
	},
	{
		src: '/images/art/typebook-03.png',
		alt: 'Degular specimen poster number twelve: the word black repeated in rows of white type below a yellow half-circle',
		title: 'Degular Specimen'
	},
	{
		src: '/images/art/botted.png',
		alt: 'Botted: a hand-drawn robot bean character with a green pulse in one eye and sparking antennae',
		title: 'Botted',
		year: '2023'
	},
	{
		src: '/images/art/experimented.png',
		alt: 'Experimented: a stitched-together Frankenstein bean character with X eyes and neck bolts',
		title: 'Experimented',
		year: '2023'
	},
	{
		src: '/images/art/foiled.png',
		alt: 'Foiled: a slumped bean character with heavy eyelids and a drooping red mouth',
		title: 'Foiled',
		year: '2023'
	},
	{
		src: '/images/art/toasted.png',
		alt: 'Toasted: a heavy-lidded bean character smoking, wisps of smoke drifting up',
		title: 'Toasted',
		year: '2023'
	},
	{
		src: '/images/art/tweaked.png',
		alt: 'Tweaked: a furious bean character with X eyes and a jagged open mouth',
		title: 'Tweaked',
		year: '2023'
	},
	{
		src: '/images/art/vetoed.png',
		alt: 'Vetoed: a mustachioed bean character with angry brows and one cracked, starred eye',
		title: 'Vetoed',
		year: '2023'
	},
	{
		src: '/images/art/rusted.png',
		alt: 'Rusted: a drowsy bean character smoking a long pipe that rests on the ground',
		title: 'Rusted',
		year: '2023'
	}
];

/** Intrinsic aspect ratio from the build-time manifest. */
export function artAspect(src: string): number {
	const { w, h } = getImage(src).img;
	return w / h;
}
