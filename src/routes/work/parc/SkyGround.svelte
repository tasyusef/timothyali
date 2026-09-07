<script lang="ts">
	// The whole case study lives on parcxrpl.com's sky: the collections' gradient with
	// the site's two cloud layers drifting in hard steps. Fixed behind everything;
	// parc-theme.css lifts the content (.cs, nav, footer) above it.
</script>

<div class="sky fixed inset-0 z-0" aria-hidden="true">
	<div class="clouds ca"></div>
	<div class="clouds cb"></div>
</div>

<style>
	.sky {
		background: var(--parc-sky);
	}
	.clouds {
		position: absolute;
		inset: 0;
		background: url('/parc/clouds-tile.png');
	}
	.clouds.ca {
		background-size: 576px 384px;
		animation: drift-a 90s steps(96, end) infinite;
	}
	.clouds.cb {
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
