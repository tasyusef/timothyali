<script lang="ts">
  // The command line and MCP. Every command here is copied from the app's own
  // docs/AGENTS.md, so the site cannot document an interface the binary does not have.
  import Decode from '$lib/components/Decode.svelte';
  import Code from '$lib/components/Code.svelte';
  import PageFoot from '$lib/components/PageFoot.svelte';
  import QuietLink from '$lib/components/QuietLink.svelte';
  import Options from '$lib/components/toolbox/Options.svelte';
  import { binaries, tools } from '$lib/toolbox';
  import { STEP } from '$lib/tokens';
  const description = 'Toolbox is also its own command-line tool and MCP server. The same binary that draws the windows will describe its tools, run one, or serve them to an agent over the Model Context Protocol.';
  const link = 'sudo ln -s "/Applications/Toolbox.app/Contents/MacOS/Toolbox" /usr/local/bin/toolbox';
  // `toolbox` alone opens the app, as a double-click would; listing is `list` or `help`
  const commands = ['toolbox help                              # the tools and the modes', 'toolbox convert --help                    # the options for one tool', '', ...tools.map((t) => t.command)].join('\n');
  const checkout = 'npm run build                             # once\nnpx electron out/main/index.js            # in place of the binary';
  const list = 'toolbox list                              # every tool, as JSON\ntoolbox describe convert                  # one tool, as JSON';
  const run = `toolbox --run '{"tool":"convert","args":{
  "input":["/Users/me/Pictures/IMG_0001.heic"],
  "formats":["webp"],
  "compression":40,
  "longestEdge":2000,
  "out":"/Users/me/Desktop"
}}'`;
  const result = `{
  "ok": true,
  "tool": "convert",
  "outputDir": "/Users/me/Desktop/Converted",
  "files": ["IMG_0001.webp"],
  "warnings": []
}`;
  const failed = `{
  "ok": false,
  "tool": "convert",
  "error": "Could not read /Users/me/Pictures/IMG_0001.heic"
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
    <div class="intro">
      <div class="paras">
        <p class="lead">Toolbox is also its own command-line tool and MCP server.</p>
        <p class="body">The same binary that draws the windows will describe its tools, run one, or serve them to an agent over the Model Context Protocol. The tools do their work with canvas and the DOM, so a headless run still starts a renderer: hidden, never shown, torn down when the run ends. A job and a click take the identical code path, so the files a script gets are the files the app would have produced.</p>
      </div>
      <dl class="meta">{#each binaries as b}<div><dt class="lbl dim">{b.os}</dt><dd class="body">{b.path}</dd></div>{/each}</dl>
    </div>
  </section>

  <section class="text">
    <div class="side"><h2 class="display-s">The binary</h2><p class="body">Link it once so toolbox works from any shell; everything below assumes that link. On macOS call it directly rather than through open, which detaches the process and loses stdout. From a checkout, build once and run the built entry point instead.</p></div>
    <div class="paras"><Code label="Put it on your PATH" text={link} /><Code label="From a checkout" text={checkout} /></div>
  </section>

  <section class="text">
    <div class="side"><h2 class="display-s">The command line</h2><p class="body">Four tools, the same settings the app's rail shows, the same files it writes. With no arguments, toolbox opens the app.</p></div>
    <div class="paras">
      <Code label="Commands" text={commands} />
      <dl class="rules">
        <div><dt class="lbl dim">Arguments</dt><dd class="body">Bare arguments go to the tool's main input: files for convert and lockup, hex colours for palette.</dd></div>
        <div><dt class="lbl dim">Paths</dt><dd class="body">Relative paths resolve against your working directory, and ~ expands.</dd></div>
        <div><dt class="lbl dim">Lists</dt><dd class="body">Several values or a comma list. Pass none to select nothing.</dd></div>
        <div><dt class="lbl dim">Switches</dt><dd class="body">--social and --no-social.</dd></div>
        <div><dt class="lbl dim">JSON</dt><dd class="body">Add --json to any run to get the result as JSON instead of prose.</dd></div>
        <div><dt class="lbl dim">Output</dt><dd class="body">Every tool takes out, a folder to write into. A fresh subfolder is always created inside it, so a job never overwrites existing work.</dd></div>
        <div><dt class="lbl dim">Exit codes</dt><dd class="body">0 done, 1 the job failed, 2 the command was wrong. Results to stdout, failures to stderr.</dd></div>
      </dl>
    </div>
  </section>

  <section class="text">
    <div class="side"><h2 class="display-s">The options</h2><p class="body">Every flag each tool takes, with its default. This is what toolbox &lt;tool&gt; --help prints, and what --list describes as a schema.</p></div>
    <div class="paras options">{#each tools as t (t.slug)}<Options tool={t} />{/each}</div>
  </section>

  <section class="text">
    <div class="side"><span class="lbl dim">Machine mode 01</span><h2 class="display-s">List</h2><p class="body">One JSON document: every tool with its summary, when to use it, what it produces, a JSON Schema for its arguments, and worked examples. This is the whole contract. Anything that can read it can drive the app. describe gives the same for one tool.</p></div>
    <div class="paras"><Code label="List" text={list} /></div>
  </section>

  <section class="text">
    <div class="side"><span class="lbl dim">Machine mode 02</span><h2 class="display-s">Run</h2><p class="body">One job as JSON in, one result as JSON out: where the files landed, their names, any warnings. Exit 0 on success, 1 on failure with the reason in error. Arguments are checked before any window opens, so a typo comes back immediately and says what was expected.</p></div>
    <div class="paras"><Code label="Run one job" text={run} /><Code label="The result" text={result} /><Code label="A failure" text={failed} /></div>
  </section>

  <section class="text">
    <div class="side"><span class="lbl dim">Machine mode 03</span><h2 class="display-s">Serve</h2><p class="body">Speaks MCP over stdio. Each tool in the catalog becomes an MCP tool with its description and schema, so an agent discovers what exists and when to use it without being told. stdout carries protocol traffic only; logs go to stderr. For Claude Code, add it to .mcp.json in your project, or to your user config.</p><p class="body">Then ask in plain language: convert these screenshots to WebP under 2000px, build a logo package from these SVGs, pull the palette out of this artwork and give me CSS variables.</p></div>
    <div class="paras"><Code label="Serve the tools" text="toolbox --mcp" /><Code label=".mcp.json" text={mcp} /></div>
  </section>

  <section><PageFoot note="Toolbox / agents" href="/toolbox/" label="All four tools" /></section>
</main>
<style>
.head{display:flex;flex-direction:column;gap:var(--s2);padding-top:var(--s4)}
.title{font-size:82.5px;line-height:88px;margin-top:var(--s2)}
.title :global(.decode){display:inline;white-space:normal} /* the title may wrap between words */
.intro{display:grid;grid-template-columns:round(down,calc((100% - 32px) * 2 / 3),8px) 1fr;gap:var(--s4);margin-top:var(--s4);align-items:start}
.intro .lead{max-width:24ch}.intro .body{max-width:60ch}
.meta{display:flex;flex-direction:column;gap:var(--s2);margin:0;padding-top:var(--s1)}
.meta dt{margin-bottom:var(--s1)}.meta dd{margin:0;overflow-wrap:anywhere}
/* one third / two thirds: the explanation on the left, the commands on the right, which need the width */
.text{padding-top:var(--s8);display:grid;grid-template-columns:round(down,calc((100% - 32px) / 3),8px) 1fr;gap:var(--s4);align-items:start}
.side{display:flex;flex-direction:column;gap:var(--s2)}.side h2{margin-bottom:var(--s1)}
.paras{display:flex;flex-direction:column;gap:var(--s3);min-width:0}
.rules{display:grid;grid-template-columns:1fr 1fr;gap:var(--s3) var(--s4);margin:0}
.rules dt{margin-bottom:var(--s1)}.rules dd{margin:0}
.options{gap:var(--s4)}
@media(max-width:1100px){.title{font-size:55px;line-height:56px}}
@media(max-width:900px){.intro,.text{grid-template-columns:100%}.rules{grid-template-columns:1fr}}
@media(max-width:700px){.head{padding-top:var(--s3)}.title{font-size:41.25px;line-height:48px}.text{padding-top:var(--s6)}}
</style>