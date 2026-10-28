<script lang="ts">
  import { below } from '$lib/tokens';
  // A looping, muted video at its own resolution. It plays only while on screen with
  // motion on and pauses otherwise, so reduced motion gets a still frame. The figure
  // sets an integer height from its width, floored to the 8px unit, like Picture.
  // The poster is that still until the first play (PX-49): with motion off, blocked
  // autoplay or no JavaScript the reader sees a chosen frame, not a blank first frame,
  // and nothing is fetched until the clip is on screen and allowed to play.
  // Mobile audit (0206): a play button sits on the still whenever the clip is not playing
  // (motion off, Save-Data, or autoplay refused, as in iOS Low Power Mode), so a reduced-motion
  // reader can still watch it; while it plays a pause button sits in the corner. A tap is the
  // reader's choice and overrides motion. The poster is the WebP derivative where there is one,
  // and at ≤700px the `small` encode plays instead of the full file (xrp.cafe 8.5 MB → 0.44 MB).
  import { onMount } from 'svelte';
  import { motion } from '$lib/motion.svelte';
  import PixelIcon from './PixelIcon.svelte';
  import { figure, type RowShare } from '$lib/figure';
  import manifest from '$lib/images.json';
  let { src, small, tap = false, label, width = 16, height = 9, row, poster }: { src: string; small?: string; tap?: boolean; label: string; width?: number; height?: number; row?: RowShare; poster?: string } = $props();
  const table = manifest as Record<string, { webp: number[] }>;
  // the poster's 1000px WebP (or its largest under that), else the original
  const still = $derived.by(() => {
    const ws = poster ? table[poster]?.webp : undefined; if (!poster || !ws?.length) return poster;
    const w = [...ws].filter((x) => x <= 1080).pop() ?? ws[0];
    return `${poster.replace(/\.[a-z]+$/i, '')}.${w}.webp`;
  });
  let host: HTMLElement; let video: HTMLVideoElement;
  let visible = $state(false), playing = $state(false), saveData = $state(false);
  let chosen = $state<boolean | null>(null); // the reader's tap, which wins over motion and Save-Data
  let phone = $state(false);
  const file = $derived(phone && small ? small : src);
  // `tap`: a long clip (PARC's is 2:24, 2.4 MB even as the phone encode) waits for a tap on phones
  const wanted = $derived(chosen ?? (motion.on && !saveData && !(tap && phone)));
  $effect(() => {
    if (!video) return;
    if (wanted && visible) video.play().catch(() => {}); // refused autoplay leaves the play button up
    else video.pause();
  });
  // play() inside the tap itself: after a refused autoplay `wanted` is already true, so the
  // effect would not run again, and the tap is the gesture the browser waits for
  function toggle() {
    chosen = !playing;
    if (chosen) video.play().catch(() => {}); else video.pause();
  }
  onMount(() => {
    saveData = !!(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    phone = matchMedia(below('phone')).matches;
    const io = new IntersectionObserver((entries) => entries.forEach((e) => { visible = e.isIntersecting; }), { rootMargin: '64px' });
    io.observe(host);
    return () => io.disconnect();
  });
</script>
<figure class="pic clip" bind:this={host} use:figure={{ ratio: () => height / width, row }} style:aspect-ratio={`${width} / ${height}`}>
  <video bind:this={video} src={file} poster={still} muted loop playsinline preload={poster ? 'none' : 'auto'} aria-label={label} onplay={() => (playing = true)} onpause={() => (playing = false)}></video>
  <!-- one button whose icon and name change, so keyboard focus survives the swap (PX-125) -->
  <button type="button" class:play={!playing} class:pause={playing} onclick={toggle} aria-label={`${playing ? 'Pause' : 'Play'} video: ${label}`}>
    {#if playing}<PixelIcon name="pause" />{:else}<PixelIcon name="play" size={24} />{/if}
  </button>
</figure>
<style>
/* a still that can play shows it: a 64px block in the middle; a playing clip keeps a 48px pause in its corner */
button{position:absolute;display:grid;place-items:center;border:0;padding:0;background:var(--fg);color:var(--paper);cursor:pointer}
.play{left:50%;top:50%;width:64px;height:64px;transform:translate(-50%,-50%)}
.pause{right:var(--s1);bottom:var(--s1);width:48px;height:48px;opacity:.8}
.play:hover,.play:focus-visible,.pause:focus-visible{background:var(--accent);color:var(--on-accent);opacity:1}
@media(hover:hover){.pause{opacity:0}.clip:hover .pause{opacity:.8}.pause:hover{opacity:1;background:var(--accent);color:var(--on-accent)}}
.pause:focus-visible{opacity:1}
</style>
