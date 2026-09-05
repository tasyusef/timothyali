<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import CaseStudy from '$lib/components/CaseStudy.svelte';
	import TextSection from '$lib/components/TextSection.svelte';
	import ResultsList from '$lib/components/ResultsList.svelte';
	import Gallery from '$lib/components/Gallery.svelte';
	import { getNextProject } from '$lib/projects';
	import { imageUrl } from '$lib/images';
	import { SITE_URL } from '$lib/site';

	const description =
		'A native pixel-art river runner for the PARCade: a generated island, synthesized sound, and a leaderboard that replays every run before it counts.';
</script>

<Seo
	title="Rowboat Racer — Game Design & Code"
	{description}
	ogKey="rowboat-racer"
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'CreativeWork',
		name: 'Rowboat Racer — Game Design & Code',
		description,
		author: { '@type': 'Person', name: 'Timothy Ali', url: SITE_URL },
		dateCreated: '2026-09-01',
		url: `${SITE_URL}/work/rowboat-racer`,
		image: imageUrl('/images/rowboat-racer/gameplay-early.png', SITE_URL)
	}}
/>

<CaseStudy
	title="Rowboat Racer"
	category="Game Design & Code"
	year="2026"
	role="Game Designer, Pixel Artist & Developer (sole creator)"
	timeline="Playable in a day, finished over four"
	tools="TypeScript, Canvas 2D, Web Audio, Svelte, Python (Pillow), Neon Postgres"
	heroImage="/images/rowboat-racer/gameplay-early.png"
	heroAlt="Rowboat Racer on the PARCade cabinet: the beach biome on one bank, jungle on the other, a coin line, obstacles in their lanes"
	nextProject={getNextProject('rowboat-racer')}
>
	{#snippet overview()}
		<p class="mb-4">
			The new PARC site had an arcade in it, a cabinet with a CRT and a deck of controls, and the
			club&rsquo;s game had to live inside that cabinet. It also had to be ours end to end: source
			we could change, art from the brand&rsquo;s own sprite pipeline, a leaderboard the community
			could trust, and a build small enough to boot instantly on a phone.
		</p>
		<p class="mb-4">
			The game itself is simple on purpose. An ape rows down an endless river. Obstacles come in
			rows. You dodge, you collect, you go faster until you can&rsquo;t. Everything interesting is
			in how that is built.
		</p>
		<ul class="space-y-2">
			<li>&mdash; Five lanes, discrete moves: keys, swipe, or the cabinet deck</li>
			<li>&mdash; A river that generates its own biomes from the run&rsquo;s seed</li>
			<li>&mdash; A deterministic engine, so the server replays every score</li>
			<li>
				&mdash; <a
					href="https://parcxrpl.com/parcade"
					target="_blank"
					rel="noopener noreferrer"
					class="hover-swiss underline underline-offset-4">Play it in the PARCade</a
				>
			</li>
		</ul>
	{/snippet}

	<TextSection title="Decisions Before Code">
		<p>
			The game is flat, top-down, and on the grid: a 2D scroller in the site&rsquo;s own pixel
			language, so every asset comes out of the same generators as the rest of the brand and the
			game reads as part of the island rather than a thing embedded in it. Steering is by lane, not
			free movement: five lanes across the river, and each tap moves one lane in the direction
			pressed. Arrow keys or WASD on desktop, swipe on phones, the joystick and buttons on the
			cabinet&rsquo;s deck. Discrete input made the game readable and, later, made it verifiable.
		</p>
		<p>
			The game runs in the PARCade page&rsquo;s CRT, canvas and TypeScript, a few hundred kilobytes,
			instant boot. The deck&rsquo;s yellow coin button starts a run and the red one fires. And it
			was deterministic from the first commit: a fixed sixty-steps-per-second simulation, one seeded
			random generator as the only source of chance, pooled entities and zero allocation inside the
			loop. I wanted it for smoothness on phones. It turned out to be the foundation for the
			leaderboard.
		</p>
	</TextSection>

	<Gallery
		items={[
			{
				type: 'image',
				src: '/images/rowboat-racer/boot-assemble.png',
				alt: 'The PARCade cabinet booting: a CRT power-on, then the PARC badge assembling pixel by pixel on the glass'
			},
			{
				type: 'image',
				src: '/images/rowboat-racer/boot-signal.png',
				alt: 'The PARCade cabinet boot, second stage: the badge lands, the signal bar fills, the wordmark types itself out'
			},
			{
				type: 'image',
				src: '/images/rowboat-racer/library.png',
				alt: 'The PARCade game library on the CRT: the Rowboat Racer cover with Press Fire, and two coming-soon cabinets'
			},
			{
				type: 'image',
				src: '/images/rowboat-racer/countdown.png',
				alt: 'Rowboat Racer at the start of a run: the boat at the bottom of an empty river between a town bank and a jungle bank'
			}
		]}
	/>

	<TextSection title="Where the First Version Went Wrong">
		<p>
			The first playable came together in an afternoon. It worked, and it looked like a proof of
			concept. From there the game got its character in a sequence of arguments with myself about
			what looked wrong. The obstacles were flat blocks; they became jointed stone with mortar lines
			and lit edges, a barked log with knots and growth rings, and a reef of five angular shards
			leaning together, each shaded from its apex, with three variants of each so a row never
			repeats.
		</p>
		<p>
			The water was blinking lines welded to the banks, so it could never flow. The rebuilt water
			has a base that scrolls with the banks, streaks that outrun it, and crests that outrun those,
			so the current visibly moves against the boat. The crests went through three versions before
			they stopped reading as bubbles: long flat swells, eight or twelve pixels wide, that lengthen,
			dip at the ends over a dark trough, and shorten again on a nine-frame cycle. Each obstacle got
			its own foam and a shadow cast from its real silhouette. The foam flickered until one look at
			the row keying explained why: the flank dashes were keyed to screen rows, so the pattern
			rippled along an obstacle&rsquo;s sides at river speed as it scrolled. Keying them to the
			sprite&rsquo;s own rows fixed it.
		</p>
		<p>
			The banks were a repeating strip. The finished banks are biomes: every 512 pixels of bank
			hashes from the run&rsquo;s seed into beach, jungle, rocky or town, independently per side, so
			a village can face a jungle. The ground is painted per pixel with value noise and a Bayer
			dither, so grass thins into ragged sandy holes rather than ending at a tile edge. Props place
			in clusters around an anchor with clearings between them, because a one-per-cell grid is
			exactly what the eye reads as programmatic. The shoreline wanders by up to three pixels along
			summed sine waves. The HUD digits are three-by-five bitmaps drawn with rectangles, because
			canvas text at eight pixels drops strokes. And the cover lost most of its props: one ziggurat,
			a coin line, the boat pulling through its wake, two palms and a bush, and a shell on the sand.
		</p>
	</TextSection>

	<Gallery
		items={[
			{
				type: 'image',
				src: '/images/rowboat-racer/obstacles.png',
				alt: 'Rowboat Racer obstacles at eight times: the jointed stone ziggurat, the barked log, and the reef of shards'
			},
			{
				type: 'image',
				src: '/images/rowboat-racer/banks-painted.png',
				alt: 'Rowboat Racer banks after the rebuild: rocky, town, jungle and beach biomes with clustered props and a wandering shoreline'
			},
			{
				type: 'image',
				src: '/images/rowboat-racer/foam-frames.png',
				alt: 'Three frames of Rowboat Racer foam: a solid contour on each obstacle’s upstream rim, flecks above, dashes down the flanks'
			},
			{
				type: 'image',
				src: '/images/rowboat-racer/obstacle-variants.png',
				alt: 'Rowboat Racer obstacles: three variants each of the ziggurat, log and reef'
			},
			{
				type: 'image',
				src: '/images/rowboat-racer/water-crests.png',
				alt: 'Three frames of the Rowboat Racer swell-crest cycle: flat swells lengthening and dipping over dark troughs'
			},
			{
				type: 'image',
				src: '/images/rowboat-racer/banks-early.png',
				alt: 'Rowboat Racer banks before the rebuild: tiled ground with props on a visible grid'
			},
			{
				type: 'image',
				src: '/images/rowboat-racer/shoreline.png',
				alt: 'The Rowboat Racer shoreline wandering by a few pixels along the river between a town bank and a beach'
			},
			{
				type: 'image',
				src: '/images/rowboat-racer/bank-props.png',
				alt: 'Rowboat Racer bank prop sheet: 31 kinds, from grass, seaweed and shells to dock, hut, canoe rack and lantern'
			},
			{
				type: 'image',
				src: '/images/rowboat-racer/covers.png',
				alt: 'The PARCade cover sheet: the Rowboat Racer cover beside two static-filled coming-soon covers'
			}
		]}
	/>

	<TextSection title="Difficulty and Power-ups">
		<p>
			The game is meant to end you. Speed grows linearly and then quadratically, and the cap is set
			by physics rather than taste: at 520 pixels per second an obstacle moves about 8.7 pixels per
			frame, and past roughly nine the shortest obstacle could pass through the hull&rsquo;s hitbox
			between two frames without touching it. The cap sits just under that. Row spacing tightens on
			a square-root curve over the first fifty seconds, so the early game teaches and the late game
			punishes.
		</p>
		<p>
			Three pickups spawn every sixteen seconds in the lane the engine knows is reachable, after
			players found them spawning behind obstacles. The coconut is a shield that absorbs one hit,
			with a foam bubble breathing around the hull while it is held. The star is ten seconds of
			invulnerability that smashes obstacles for bonus points. The gem is ten seconds of double
			points. They float on a four-frame lift and sit in a soft halo grown from their own silhouette
			in their own color, after a first attempt at a hard ring looked like a selection box.
		</p>
	</TextSection>

	<Gallery
		items={[
			{
				type: 'image',
				src: '/images/rowboat-racer/gameplay-mid.png',
				alt: 'Rowboat Racer mid-run: the boat approaching a reef and a ziggurat between a rocky bank and a beach'
			},
			{
				type: 'image',
				src: '/images/rowboat-racer/powerup-glow.png',
				alt: 'Rowboat Racer pickups on the water: coconut, star, gem and coin, each in a soft halo of its own color'
			},
			{
				type: 'image',
				src: '/images/rowboat-racer/game-over.png',
				alt: 'Rowboat Racer game over: score, best, an initials field and a submit button on a wooden plank panel'
			},
			{
				type: 'image',
				src: '/images/rowboat-racer/pickups.png',
				alt: 'Rowboat Racer pickup sprites after the hand-placed pass: coin, banana, coconut, star and gem'
			}
		]}
	/>

	<TextSection title="The Leaderboard">
		<p>
			A persistent board was the feature people asked for first, and the one most likely to be
			gamed. Because the engine is deterministic, the answer was to make the server replay every
			run. A run records the seed, the world size, and each lane move or resize as a frame number
			and a direction: not keystrokes, not timing, just what the engine consumed, capped at four
			thousand entries and thirty minutes. The server re-runs the recording through the same engine
			headlessly, in under twenty milliseconds even for a long run, and only stores the score if it
			reproduces. Duplicate seeds are rejected, so a replay cannot be farmed, and initials go
			through a filter.
		</p>
		<p>
			Scores live in a small Postgres table on Neon&rsquo;s free tier, with an in-memory fallback
			for local development. The board shows the top ten and tells you your rank when you land off
			it. A headless harness replays forty recorded runs, including window resizes across lane-width
			changes and star smashes at cap speed, and reports zero mismatches.
		</p>
	</TextSection>

	<TextSection title="Sound">
		<p>
			No audio files. A small Web Audio chiptune engine synthesizes pulse, triangle and noise voices
			and plays sixty-four-step patterns from a lookahead scheduler. Each track has sections that
			play in the order A, A, B, A, C, B, so it loops without repeating too soon: an ambient
			&ldquo;Boathouse&rdquo; at 84 beats per minute for the library and &ldquo;Row Row&rdquo; at
			150 for the game. The cabinet&rsquo;s boot has its own eight-bit cues: a relay click and
			warming hum, a rising sweep as the dot becomes a line, a chime per signal bar, a tick per
			typed letter, a jingle when the tagline lands. A pixel cog on the deck opens music and effects
			sliders; music starts at a quarter volume.
		</p>
	</TextSection>

	<TextSection title="The Art Pipeline">
		<p>
			Every sprite is generated by a Python script from rectangles on a grid, with a two percent
			per-pixel lightness grain rolled at save time. The obstacles, boat, pickups and cover come
			from one script; the bank props and their atlas from another. When a sprite needed a hand, it
			was loaded de-grained into a pixel editor, I placed the pixels, and the script took the grid
			back as an override so a regeneration keeps the edit. That is how the gem, star, coin and
			banana got their final shapes.
		</p>
	</TextSection>

	<Gallery
		items={[
			{
				type: 'image',
				src: '/images/rowboat-racer/sprite-sheet.png',
				alt: 'The full Rowboat Racer sprite sheet: boat, three ziggurats, three logs, three reefs, the pickups and the crashed boat'
			},
			{
				type: 'image',
				src: '/images/rowboat-racer/boat.png',
				alt: 'The Rowboat Racer boat sprite at eight times: a pixel ape at the oars'
			}
		]}
	/>

	<ResultsList
		title="Outcome"
		items={[
			'TypeScript and canvas, about 4,100 lines of engine, renderer and cabinet, a few hundred kilobytes',
			'60 fixed simulation steps per second, one seeded RNG, five lanes, zero allocation in the loop',
			'17 game sprites plus a 31-kind bank sheet, generated by 1,400 lines of Python',
			'Leaderboard replay-verified on the server, stored in Postgres, proven by a 40-run determinism harness',
			'Audio synthesized in the browser: two sectioned tracks and a boot sequence',
			'Plays with desktop keys, phone swipe, or the cabinet deck'
		]}
	/>
</CaseStudy>
