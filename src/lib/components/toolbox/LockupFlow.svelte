<script lang="ts" module>
  // What the diagram counts: the package's files by family and colourway, from the files Toolbox
  // wrote (`lockup-sample.json`, tools/toolbox/samples.mjs). One square is one file.
  import sample from './lockup-sample.json';

  type Treatment = 'Color' | 'Pantone' | 'Black' | 'White';
  const files = sample.files as { family: 'PRINT' | 'WEB' | null; treatment: Treatment | null }[];
  const ORDER: readonly Treatment[] = ['Color', 'Pantone', 'Black', 'White'];
  const BRANCHES = (['PRINT', 'WEB'] as const).map((family) => ({
    family,
    clusters: ORDER.map((t) => ({ t, n: files.filter((f) => f.family === family && f.treatment === t).length })).filter((c) => c.n)
  }));
  const TOTAL = files.length;
  const said = (b: (typeof BRANCHES)[number]) => `${b.clusters.reduce((n, c) => n + c.n, 0)} for ${b.family === 'WEB' ? 'web' : 'print'} (${b.clusters.map((c) => c.t.toLowerCase()).join(', ')})`;
</script>
<script lang="ts">
  // Lockup in one line (PX-131): one logo goes in, Toolbox sorts what it makes into PRINT and WEB,
  // and each square is a file it wrote, on its plate in its colourway. The logo is the real input
  // and the download is the real package. The layout is in demo.css (the flow).
  import Arrow from '$lib/components/Arrow.svelte';
  import { fileSize } from './plan';
  const [mark, word] = sample.palette.map((p) => p.hex);
</script>
<figure class="flow" style:--mark={mark} style:--word={word}>
  <div class="flow-row">
    <div class="flow-in">
      <span class="artboard plate-light flow-logo"><img src={sample.source.href} alt="The Acme logo" width={sample.source.px[0]} height={sample.source.px[1]} decoding="async" /></span>
    </div>
    <span class="flow-to"><Arrow /></span>
    <div class="flow-branches" aria-hidden="true">
      {#each BRANCHES as b (b.family)}
        <span class="flow-box lbl">{b.family}</span>
        <span class="flow-stub"></span>
        <span class="flow-files">
          {#each b.clusters as c (c.t)}<span class="flow-cluster">{#each { length: c.n }, i (i)}<i class="tile {c.t.toLowerCase()}"></i>{/each}</span>{/each}
        </span>
      {/each}
    </div>
  </div>
  <figcaption class="flow-foot">
    <span class="lbl dim flow-count">1 logo <Arrow /> {TOTAL} files<span class="sr-only">: {BRANCHES.map(said).join(', and ')}, plus a README.</span></span>
    <a class="quiet-link lbl" href={sample.zip.href} download>Download the zip · <span class="flow-keep">{fileSize(sample.zip.bytes)} <Arrow /></span></a>
  </figcaption>
</figure>
