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
  const description = 'Run Toolbox from a terminal, send jobs as JSON, or connect an AI assistant through MCP. Setup, commands, and options for all four tools.';
  const link = 'sudo ln -s "/Applications/Toolbox.app/Contents/MacOS/Toolbox" /usr/local/bin/toolbox';
  // `toolbox` alone opens the app, as a double-click would; listing is `list` or `help`
  const commands = ['toolbox help                              # show tools and usage', 'toolbox convert --help                    # show Convert options', '', ...tools.map((t) => t.command)].join('\n');
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
  const advanced = `toolbox lockup logo.svg --action inspect --json

toolbox lockup logo.svg --name Acme --out ./exports --palette '[{"sourceHex":"#D32F05","cmyk":[0,78,98,17],"pantone":"1665 C"}]'

toolbox specimen --action fonts --json
toolbox specimen --title "Acme type" --out ./exports --roles '[{"label":"Heading","family":"Helvetica","face":"Bold","size":40}]'`;
  const library = `toolbox lockup logo.svg --print none --save --out ./exports --json
toolbox lockup --action library-list --json
toolbox lockup --saved RECORD_ID --action inspect --json
toolbox lockup --saved RECORD_ID --padding 0.15 --save --out ./exports --json`;
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
<svelte:head><title>CLI & MCP / Toolbox / Timothy Ali</title><meta name="description" content={description} /></svelte:head>
<main class="inner-page agents" id="main" tabindex="-1">
  <section class="head">
    <QuietLink href="/toolbox/" label="Toolbox" dir="left" pad class="lbl" />
    <span class="lbl">Toolbox / the command line and MCP</span>
    <h1 class="display title"><Decode text="CLI & MCP" step={STEP} /></h1>
    <div class="intro">
      <div class="paras">
        <p class="lead">Use Toolbox from a terminal or an AI assistant.</p>
        <p class="body">The installed app includes a command-line interface (CLI) for scripts and an MCP server for AI assistants. MCP, the Model Context Protocol, lets an assistant discover and run the tools. Both use the app’s export engine without showing a window.</p>
      </div>
      <dl class="meta">{#each binaries as b}<div><dt class="lbl dim">{b.os}</dt><dd class="body">{b.path}</dd></div>{/each}</dl>
    </div>
  </section>

  <section class="text">
    <div class="side"><h2 class="display-s">Set up the command</h2><p class="body">Install Toolbox first. The paths above show where to find its executable. The examples below use toolbox as the command; you can substitute the full path. On macOS, the link shown here makes that shortcut available from your terminal. Run the executable directly: the macOS open command detaches it, so you won’t see the results in your terminal.</p></div>
    <div class="paras"><Code label="macOS shortcut" text={link} /></div>
  </section>

  <section class="text">
    <div class="side"><h2 class="display-s">The command line</h2><p class="body">Choose a tool, supply its inputs and options, and set an output folder. Running toolbox with no arguments opens the desktop app. All four tools support the same export settings through the app, CLI, and MCP, including print colors, per-variation settings, and custom font roles.</p></div>
    <div class="paras">
      <Code label="Commands" text={commands} />
      <dl class="rules">
        <div><dt class="lbl dim">Arguments</dt><dd class="body">Values without a flag become the main input: file paths for convert and lockup, hex colors for palette.</dd></div>
        <div><dt class="lbl dim">Paths</dt><dd class="body">Relative paths start from your current folder. Use ~ for your home folder, and quote paths that contain spaces.</dd></div>
        <div><dt class="lbl dim">Lists</dt><dd class="body">Separate values with spaces or commas: --formats webp png or --formats=webp,png. To skip an output group, use none, as in --print none.</dd></div>
        <div><dt class="lbl dim">Switches</dt><dd class="body">Use --social to include profile images and --no-social to leave them out.</dd></div>
        <div><dt class="lbl dim">JSON</dt><dd class="body">Add --json to a tool command to receive the result as JSON.</dd></div>
        <div><dt class="lbl dim">Output</dt><dd class="body">Export and preview require --out. Toolbox creates a new subfolder inside that destination and leaves existing files in place. Inspection, font discovery, and library queries need no destination.</dd></div>
        <div><dt class="lbl dim">Exit codes</dt><dd class="body">0 means success, 1 means the job failed, and 2 means the command is invalid. Normal CLI results go to stdout; errors go to stderr.</dd></div>
      </dl>
    </div>
  </section>

  <section class="text">
    <div class="side"><h2 class="display-s">Print colors & type</h2><p class="body">New in 1.1.0: assign print colors, set options for individual logo variations, name palette swatches, sample images, and define your own font roles. Use inspect to find source colors and fonts to list installed families and faces.</p><p class="body">Structured flags such as --palette and --roles take a quoted JSON array. Use the detected sourceHex from your artwork and font names installed on your computer. CMYK values are percentages from 0 to 100. MCP accepts the same arrays directly, without shell quoting.</p></div>
    <div class="paras"><Code label="Print colors and custom type" text={advanced} /></div>
  </section>

  <section class="text">
    <div class="side"><h2 class="display-s">Preview & saved work</h2><p class="body">Use --action inspect to see settings and planned files without writing anything. Convert also measures output sizes; Palette returns previews of its generated code. Use --action preview with --out to write previews you can open.</p><p class="body">Add --save to an export to make it available in the app’s library. The result includes a savedID. Replace RECORD_ID in these examples with that value to reopen the work. Explicit options override saved settings.</p><p class="body">Use library-get to read a saved record and library-remove to delete its library entry. Removing an entry leaves the exported files in place.</p></div>
    <div class="paras"><Code label="Save and reopen work" text={library} /></div>
  </section>

  <section class="text">
    <div class="side"><h2 class="display-s">The options</h2><p class="body">Supported flags and their defaults are listed below. Run toolbox &lt;tool&gt; --help for the options in your installed version, or toolbox list for their JSON schemas.</p></div>
    <div class="paras options">{#each tools as t (t.slug)}<Options tool={t} />{/each}</div>
  </section>

  <section class="text">
    <div class="side"><span class="lbl dim">Machine mode 01</span><h2 class="display-s">List</h2><p class="body">Run toolbox list to get the full tool catalog as JSON, including descriptions, argument schemas, and examples. Use toolbox describe followed by a tool name to inspect just that tool.</p></div>
    <div class="paras"><Code label="List" text={list} /></div>
  </section>

  <section class="text">
    <div class="side"><span class="lbl dim">Machine mode 02</span><h2 class="display-s">Run</h2><p class="body">Pass a JSON object with the tool name and its arguments to --run. Toolbox checks the arguments, runs the job, and returns JSON with the output folder, file names, and warnings. A successful job exits with code 0. A failed job exits with code 1 and includes an error message. Replace the example paths with your own. The examples use macOS paths and shell quoting; adjust both for your system.</p></div>
    <div class="paras"><Code label="Run one job" text={run} /><Code label="The result" text={result} /><Code label="A failure" text={failed} /></div>
  </section>

  <section class="text">
    <div class="side"><span class="lbl dim">Machine mode 03</span><h2 class="display-s">Serve</h2><p class="body">Start Toolbox with --mcp to expose the four tools to an MCP client over standard input and output. Add the example server configuration to your client’s MCP settings, using the executable path for your platform. For Claude Code, the project configuration file is .mcp.json. Protocol messages use stdout; logs use stderr.</p><p class="body">Once connected, ask your assistant to convert screenshots to WebP, package logo SVGs, or extract colors from artwork. Include the source files and destination folder in your request.</p></div>
    <div class="paras"><Code label="Serve the tools" text="toolbox --mcp" /><Code label=".mcp.json" text={mcp} /></div>
  </section>

  <section><PageFoot note="Toolbox / CLI & MCP" href="/toolbox/" label="All four tools" /></section>
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