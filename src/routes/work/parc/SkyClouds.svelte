<script lang="ts">
	// The PARC site's default ground: the sky gradient with two tiled cloud layers
	// drifting at different speeds in hard 96-step animations. Same tile, sizes and
	// timings as parcxrpl.com's `.skyband` / `.clouds`.
	import { PARC_SKY } from './parcBrand';
</script>

<div
	class="sky relative h-52 overflow-hidden md:h-64"
	style:background={PARC_SKY}
	aria-hidden="true"
>
	<div class="clouds ca"></div>
	<div class="clouds cb"></div>
</div>

<style>
	.clouds {
		position: absolute;
		inset: 0;
		background: url('/parc/clouds-tile.png');
		pointer-events: none;
	}
	.ca {
		background-size: 576px 384px;
		animation: drift-a 90s steps(96, end) infinite;
	}
	.cb {
		background-size: 864px 576px;
		background-position: 300px 180px;
		opacity: 0.6;
		animation: drift-b 150s steps(96, end) infinite;
	}
	@keyframes drift-a {
		to {
			background-position: 576px 0;
		}
	}
	@keyframes drift-b {
		to {
			background-position: 1164px 180px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.clouds {
			animation: none;
		}
	}
</style>
