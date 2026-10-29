<script lang="ts" module>
  // What the diagram shows: the styles that went in and the sheet Toolbox set them on
  // (`specimen-sample.json`, tools/toolbox/samples.mjs).
  import sample from './specimen-sample.json';

  const FILES = sample.files.map((f) => f.name.split('.').pop()!.toUpperCase());
  const face = (r: (typeof sample.roles)[number]) => `${r.label} in ${r.family.replace('_', ' ')} ${r.face} at ${r.size} pt`;
</script>
<script lang="ts">
  // Specimen in one line (PX-131): three type styles go in, each shown in its own face (the site's:
  // PARC Pixel Bold, PARC Pixel and Jersey 15), and Toolbox sets them on one sheet, a PDF and a
  // PNG. The sheet is the PNG it wrote and the download is both files. The layout is in demo.css
  // (the flow).
  import Arrow from '$lib/components/Arrow.svelte';
  import { fileSize } from './plan';
  const { roles, sheet, zip } = sample;
</script>
<figure class="flow">
  <div class="flow-row">
    <div class="flow-in">
      <span class="flow-roles" aria-hidden="true">
        {#each roles as r (r.label)}<span class="flow-box flow-role {r.label.toLowerCase()}">{r.label}</span>{/each}
      </span>
    </div>
    <span class="flow-to"><Arrow /></span>
    <div class="flow-out">
      <span class="artboard plate-light flow-sheet"><img src={sheet.href} alt="The Acme type sheet: “Make something good.” set in each style, each labelled with its face and size" width={sheet.px[0]} height={sheet.px[1]} decoding="async" /></span>
      <span class="flow-to"><Arrow /></span>
      <span class="flow-kinds" aria-hidden="true">
        {#each FILES as k (k)}<span class="flow-box lbl">{k}</span>{/each}
      </span>
    </div>
  </div>
  <figcaption class="flow-foot">
    <span class="lbl dim flow-count">{roles.length} styles <Arrow /> 1 sheet<span class="sr-only">: {roles.map(face).join(', ')}, set on one sheet as a PDF and a PNG.</span></span>
    <a class="quiet-link lbl" href={zip.href} download>Download the zip · <span class="flow-keep">{fileSize(zip.bytes)} <Arrow /></span></a>
  </figcaption>
</figure>
