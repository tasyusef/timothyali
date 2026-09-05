<script lang="ts">
	// The three PARC masters as inline SVG: the wide box logo, the square 2×2 lockup,
	// and the oar badge. Path data is the traced masters (five merged paths, never
	// abutting cells). `grid` overlays the master's own pixel cell so the notch,
	// margins and strokes can be read against it.
	import { PARC } from './parcBrand';

	interface Props {
		variant: 'wide' | 'square' | 'oar';
		grid?: boolean;
		label: string;
		class?: string;
	}

	let { variant, grid = false, label, class: className = '' }: Props = $props();

	const id = $props.id();

	// viewBox, cell size, and the grid origin (where the badge silhouette starts) per master
	const SPEC = {
		wide: { box: '0 0 3000 936', cell: 98.7, ox: 19, oy: 24 },
		square: { box: '0 0 936 936', cell: 55.5, ox: 24, oy: 24 },
		oar: { box: '0 0 2566.2 690.9', cell: 98.7, ox: 0, oy: 0 }
	} as const;

	const spec = $derived(SPEC[variant]);
</script>

<svg
	viewBox={spec.box}
	role="img"
	aria-label={label}
	class={className}
	fill-rule="evenodd"
	shape-rendering="crispEdges"
>
	{#if variant === 'wide'}
		<path
			fill={PARC.white}
			d="M2882.2,24v98.7h98.7v690.6h-98.7v98.7H117.8v-98.7H19V122.7h98.8V24h2764.4Z"
		/>
		<path
			fill={PARC.orange}
			d="M315.2,517.3h296.2v98.7h-296.2v98.7h-98.7V221.4h395v98.7h-296.2v197.3ZM611.5,517.3v-197.3h98.7v197.3h-98.7Z"
		/>
		<path
			fill={PARC.blue}
			d="M1006.3,517.3h296.2v-197.3h98.7v394.6h-98.7v-98.7h-296.2v98.7h-98.7v-394.6h98.7v197.3ZM1006.3,320v-98.7h296.2v98.7h-296.2Z"
		/>
		<path
			fill={PARC.green}
			d="M2092.4,517.3h-98.7v-197.3h98.7v197.3ZM1993.6,517.3v98.7h-296.2v98.7h-98.7V221.4h394.9v98.7h-296.2v197.3h296.2ZM1993.6,616h98.7v98.7h-98.7v-98.7Z"
		/>
		<path
			fill={PARC.yellow}
			d="M2388.6,616h-98.8v-295.9h98.8v295.9ZM2684.8,517.3h98.7v98.7h-98.7v-98.7ZM2684.8,616v98.7h-296.2v-98.7h296.2ZM2684.8,221.4v98.7h-296.2v-98.7h296.2ZM2684.8,320h98.7v98.7h-98.7v-98.7Z"
		/>
	{:else if variant === 'square'}
		<path
			fill={PARC.white}
			d="M856.5,24v55.5h55.5v776.9h-55.5v55.5H79.5v-55.5H24V79.6h55.5V24h776.9Z"
		/>
		<path
			fill={PARC.orange}
			d="M190.5,301.5h166.5v55.5h-166.5v55.5h-55.5V135h222v55.5h-166.5v111ZM357,301.5v-111h55.5v111h-55.5Z"
		/>
		<path
			fill={PARC.blue}
			d="M579,301.5h166.5v-111h55.5v222h-55.5v-55.5h-166.5v55.5h-55.5v-222h55.5v111ZM579,190.5v-55.5h166.5v55.5h-166.5Z"
		/>
		<path
			fill={PARC.green}
			d="M412.5,690h-55.5v-111h55.5v111ZM357,690v55.5h-166.5v55.5h-55.5v-277.5h222v55.5h-166.5v111h166.5ZM357,745.5h55.5v55.5h-55.5v-55.5Z"
		/>
		<path
			fill={PARC.yellow}
			d="M523.5,579h55.5v166.5h-55.5v-166.5ZM579,579v-55.5h166.5v55.5h-166.5ZM745.5,745.5v55.5h-166.5v-55.5h166.5ZM745.5,579h55.5v55.5h-55.5v-55.5ZM745.5,745.5v-55.5h55.5v55.5h-55.5Z"
		/>
	{:else}
		<path
			fill={PARC.white}
			d="M2467.5 0V98.7H2566.2V592.2H2467.5V690.9H98.7V592.2H0V98.7H98.7V0Z"
		/>
		<path
			fill={PARC.green}
			d="M2270.1 197.4V296.1H2368.8V394.8H2270.1V493.5H1579.2V394.8H296.1V493.5H197.4V197.4H296.1V296.1H1579.2V197.4Z"
		/>
	{/if}

	{#if grid}
		<defs>
			<pattern
				id="{id}-cell"
				x={spec.ox}
				y={spec.oy}
				width={spec.cell}
				height={spec.cell}
				patternUnits="userSpaceOnUse"
			>
				<path
					d="M {spec.cell} 0 L 0 0 0 {spec.cell}"
					fill="none"
					stroke={PARC.blue}
					stroke-width={spec.cell / 22}
				/>
			</pattern>
		</defs>
		<rect width="100%" height="100%" fill="url(#{id}-cell)" opacity="0.55" />
	{/if}
</svg>
