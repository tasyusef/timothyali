<script lang="ts">
  // The command line and MCP. Every command here is copied from the app's own
  // docs/AGENTS.md, so the site cannot document an interface the binary does not have.
  import Decode from '$lib/components/Decode.svelte';
  import Code from '$lib/components/Code.svelte';
  import PageFoot from '$lib/components/PageFoot.svelte';
  import QuietLink from '$lib/components/QuietLink.svelte';
  import { binaries, tools } from '$lib/toolbox';
  import { STEP } from '$lib/tokens';
  const description = 'Toolbox is also its own command-line tool and MCP server. The same binary that draws the windows will describe its tools, run one, or serve them to an agent over the Model Context Protocol.';
  const link = 'sudo ln -s "/Applications/Toolbox.app/Contents/MacOS/Toolbox" /usr/local/bin/toolbox';
  const commands = ['toolbox                                   # what tools exist', 'toolbox convert --help                    # the options for one tool', '', ...tools.map((t) => t.command)].join('\n');
  const run = `toolbox --run '{"tool":"convert","args":{
  "input":["/Users/me/Pictures/IMG_0001.heic"],
  "formats":["webp"],
  "compression":40,
  "out":"/Users/me/Desktop"
}}'`;
  const result = `{
  "ok": true,
  "tool": "convert",
  "outputDir": "/Users/me/Desktop/Converted",
  "files": ["IMG_0001.webp"],
  "warnings": []
}`;
  const mcp = `{
  "mcpServers": {
    "toolbox": {
      "command": "/Applications/Toolbox.app/Contents/MacOS/Toolbox",
      "args": ["--mcp"]
    }
  }
}`;
</script>
<svelte:head><title>Without the window — Toolbox — Timothy Ali</title><meta name="description" content={description} /></svelte:head>
<main class="inner-page agents" id="main" tabindex="-1">
  <section class="head">
    <QuietLink href="/toolbox/" label="Toolbox" dir="left" pad class="lbl" />
    <span class="lbl">Toolbox / the command line and MCP</span>
    <h1 class="display title"><Decode text="Without the window" step={STEP} /></h1>
    <p class="lead">{description}</p>
    <p class="body">The tools do their work with canvas and the DOM, so a headless run still starts a renderer: hidden, never shown, torn down when the run ends. That is deliberate. A job and a click take the identical code path, so the files a script gets are the files the app would have produced.</p>
  </section>

  <section class="text">
    <h2 class="display-s">The binary</h2>
    <div class="paras">
      <dl class="meta">{#each binaries as b}<div><dt class="lbl dim">{b.os}</dt><dd class="body">{b.path}</dd></div>{/each}</dl>
      <p class="body">From a checkout, build once, then run the built entry point in place of the binary. On macOS call it directly rather than through open, which detaches the process and loses stdout.</p>
      <p class="body">Link it once so it works from any shell:</p>
      <Code label="Put it on your PATH" text={link} />
    </div>
  </section>

  <section class="text">
    <h2 class="display-s">The command line</h2>
    <div class="paras">
      <Code label="Commands" text={commands} />
      <ul class="rules body">
        <li>Bare arguments go to the tool's main input: files for convert and lockup, hex colours for palette.</li>
        <li>Relative paths resolve against your working directory, and ~ expands.</li>
        <li>Lists take several values or a comma list. Pass none to select nothing.</li>
        <li>Switches are --social and --no-social. --json prints the machine-readable result instead of prose.</li>
        <li>Exit codes: 0 done, 1 the job failed, 2 the command was wrong. Results to stdout, failures to stderr.</li>
      </ul>
    </div>
  </section>

  <section class="text">
    <h2 class="display-s">Three machine modes</h2>
    <div class="paras">
      <p class="lbl">--list</p>
      <Code label="List" text="toolbox list" />
      <p class="body">One JSON document: every tool with its summary, when to use it, what it produces, a JSON Schema for its arguments, and worked examples. This is the whole contract. Anything that can read it can drive the app.</p>
      <p class="lbl">--run</p>
      <Code label="Run one job" text={run} />
      <Code label="The result" text={result} />
      <p class="body">Arguments are checked before any window opens, so a typo comes back immediately and says what was expected.</p>
      <p class="lbl">--mcp</p>
      <Code label="Serve the tools" text="toolbox --mcp" />
      <p class="body">Speaks MCP over stdio. Each tool in the catalog becomes an MCP tool with its description and schema, so an agent discovers what exists and when to use it without being told. For Claude Code, add it to .mcp.json in your project:</p>
      <Code label="Claude Code configuration" text={mcp} />
      <p class="body">Then ask in plain language: convert these screenshots to WebP under 2000px, build a logo package from these SVGs, pull the palette out of this artwork and give me CSS variables.</p>
    </div>
  </section>

  <section class="text">
    <h2 class="display-s">One rule for output</h2>
    <div class="paras"><p class="body">Every tool takes out, a folder to write into. A fresh subfolder is always created inside it, so a job never overwrites existing work.</p></div>
  </section>

  <section><PageFoot note="Toolbox / agents" href="/toolbox/" label="All four tools" /></section>
</main>
<style>
.head{display:flex;flex-direction:column;gap:var(--s2);padding-top:var(--s4)}
.title{margin-top:var(--s2)}
.title :global(.decode){display:inline;white-space:normal} /* the title may wrap between words */
.head .lead{max-width:30ch;margin-top:var(--s2)}
.head .body{max-width:64ch}
/* one third / two thirds, not halves: the commands need the width more than the titles do */
.text{padding-top:var(--s8);display:grid;grid-template-columns:round(down,calc((100% - 32px) / 3),8px) 1fr;gap:var(--s4);align-items:start}
.paras{display:flex;flex-direction:column;gap:var(--s3);min-width:0}
.meta{display:flex;flex-direction:column;gap:var(--s2);margin:0}
.meta dt{margin-bottom:var(--s1)}.meta dd{margin:0;overflow-wrap:anywhere}
.rules{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:var(--s1)}
@media(max-width:900px){.text{grid-template-columns:100%}}
@media(max-width:700px){.head{padding-top:var(--s3)}.text{padding-top:var(--s6)}}
</style>
