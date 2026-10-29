<script lang="ts" module>
  // What the diagram measures: the poster's PNG and what Convert made of it, in the formats it was
  // asked for (`convert-sample.json`, tools/toolbox/samples.mjs). Every size is a real file's.
  import sample from './convert-sample.json';
  import { changePercent, fileSize } from './plan';

  const { source, settings } = sample;
  const OUTS = settings.formats.map((k) => sample.outputs.find((o) => o.kind === k)!).map((o) => ({ ...o, size: fileSize(o.bytes), change: changePercent(source.bytes, o.bytes)!.text }));
  const NAME: Record<string, string> = { webp: 'WebP', jpeg: 'JPEG' };
</script>
<script lang="ts">
  // Convert in one line (PX-131): the poster goes in as a PNG and comes out as WebP and JPEG, the
  // same picture each time; under each, a bar is its file's size against the PNG's. The download
  // is what Convert wrote. The layout is in demo.css (the flow).
  import Arrow from '$lib/components/Arrow.svelte';
  const pic = source.picture;
</script>
<figure class="flow">
  <div class="flow-row flow-top">
    <div class="flow-in flow-copy">
      <span class="artboard flow-poster"><img src={pic.href} alt="The Acme poster: an orange and a green circle and a yellow bar on cream, with the logo" width={pic.px[0]} height={pic.px[1]} decoding="async" /><span class="flow-box lbl flow-tag" aria-hidden="true">PNG</span></span>
      <span class="flow-bar" style:--part="1" aria-hidden="true"></span>
      <span class="lbl flow-size" aria-hidden="true">{fileSize(source.bytes)}</span>
    </div>
    <span class="flow-to"><Arrow /></span>
    <div class="flow-out flow-top" aria-hidden="true">
      {#each OUTS as o (o.kind)}
        <span class="flow-copy">
          <span class="artboard flow-poster"><img src={pic.href} alt="" width={pic.px[0]} height={pic.px[1]} decoding="async" /><span class="flow-box lbl flow-tag">{o.kind}</span></span>
          <span class="flow-bar" style:--part={o.bytes / source.bytes}></span>
          <span class="lbl flow-size">{o.size} <span>{o.change}</span></span>
        </span>
      {/each}
    </div>
  </div>
  <figcaption class="flow-foot">
    <span class="lbl dim flow-count">1 poster <Arrow /> {OUTS.length} formats<span class="sr-only">: a {fileSize(source.bytes)} PNG, {source.px[0]} by {source.px[1]}, converted to {OUTS.map((o) => `${NAME[o.kind]} at ${o.size} (${o.change})`).join(' and ')}, the same picture.</span></span>
    <a class="quiet-link lbl" href={sample.zip.href} download>Download the zip · <span class="flow-keep">{fileSize(sample.zip.bytes)} <Arrow /></span></a>
  </figcaption>
</figure>
