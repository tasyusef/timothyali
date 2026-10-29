<script lang="ts" module>
  // What the diagram shows: the colours Toolbox found in the poster and the files it wrote for them
  // (`palette-sample.json`, tools/toolbox/samples.mjs), in the order the app lists them.
  import sample from './palette-sample.json';

  const KINDS = ['CSS', 'SCSS', 'JSON', 'ASE', 'PDF', 'PNG'];
  const kind = (name: string) => name.split('.').pop()!.toUpperCase();
  const FILES = sample.files.map((f) => kind(f.name)).sort((a, b) => KINDS.indexOf(a) - KINDS.indexOf(b));
</script>
<script lang="ts">
  // Palette in one line (PX-131): the poster goes in, Toolbox finds its colours, and writes them out
  // for code (CSS, SCSS, design tokens), for design apps (an ASE swatch file) and as a swatch sheet
  // (PDF and PNG). The poster is the real input, drawn by Convert, and the download is what Palette
  // wrote. The layout is in demo.css (the flow).
  import Arrow from '$lib/components/Arrow.svelte';
  import { fileSize } from './plan';
  const { colors, source, zip } = sample;
</script>
<figure class="flow">
  <div class="flow-row">
    <div class="flow-in" style:--in="12">
      <span class="artboard flow-poster"><img src={source.picture.href} alt="The Acme poster: an orange and a green circle and a yellow bar on cream, with the logo" width={source.picture.px[0]} height={source.picture.px[1]} decoding="async" /></span>
    </div>
    <span class="flow-to"><Arrow /></span>
    <div class="flow-out" aria-hidden="true">
      <span class="flow-swatches">
        {#each colors as c (c.hex)}<span class="flow-swatch"><i style:background={c.hex}></i><span class="lbl">{c.hex}</span></span>{/each}
      </span>
      <span class="flow-to"><Arrow /></span>
      <span class="flow-kinds" style:--cols="2">
        {#each FILES as k (k)}<span class="flow-box lbl">{k}</span>{/each}
      </span>
    </div>
  </div>
  <figcaption class="flow-foot">
    <span class="lbl dim flow-count">1 poster <Arrow /> {FILES.length} files<span class="sr-only">: the {colors.length} colours Toolbox found, {colors.map((c) => c.hex).join(', ')}, as CSS, SCSS, design tokens (JSON), an Adobe swatch file (ASE) and a swatch sheet as a PDF and a PNG.</span></span>
    <a class="quiet-link lbl" href={zip.href} download>Download the zip · <span class="flow-keep">{fileSize(zip.bytes)} <Arrow /></span></a>
  </figcaption>
</figure>
