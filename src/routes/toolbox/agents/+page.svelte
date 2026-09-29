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
        <p class="body">Toolbox includes a command-line interface (CLI) and an MCP server. Use the CLI in your terminal or scripts. MCP (Model Context Protocol) lets an AI assistant find and run the tools. Both work without opening an app window.</p>
      </div>
      <dl class="meta">{#each binaries as b}<div><dt class="lbl dim">{b.os}</dt><dd class="body">{b.path}</dd></div>{/each}</dl>
    </div>
  </section>

  <section class="text">
    <div class="side"><h2 class="display-s">Set up the command</h2><p class="body">Install Toolbox first. You can run it using the full executable path shown above, or set up the toolbox shortcut used in these examples. On macOS, run the command here to create that shortcut. Run the executable directly rather than using the macOS open command, which won’t return results to your terminal.</p></div>
    <div class="paras"><Code label="macOS shortcut" text={link} /></div>
  </section>

  <section class="text">
    <div class="side"><h2 class="display-s">The command line</h2><p class="body">Choose a tool, add your inputs and options, and set an output folder. Running toolbox without arguments opens the app. The CLI and MCP support all four tools and the same export settings, including print colors, settings for individual logo variations, and custom font roles.</p></div>
    <div class="paras">
      <Code label="Commands" text={commands} />
      <dl class="rules">
        <div><dt class="lbl dim">Arguments</dt><dd class="body">Pass file paths directly to convert and lockup, or hex colors to palette. You don’t need a flag for these inputs.</dd></div>
        <div><dt class="lbl dim">Paths</dt><dd class="body">Relative paths start from your current folder. Use ~ for your home folder, and quote paths that contain spaces.</dd></div>
        <div><dt class="lbl dim">Lists</dt><dd class="body">Separate values with spaces or commas: --formats webp png or --formats=webp,png. To skip an output group, use none, as in --print none.</dd></div>
        <div><dt class="lbl dim">Switches</dt><dd class="body">Use --social to include profile images and --no-social to leave them out.</dd></div>
        <div><dt class="lbl dim">JSON</dt><dd class="body">Add --json to a tool command to receive the result as JSON.</dd></div>
        <div><dt class="lbl dim">Output</dt><dd class="body">Use --out for exports and previews. Toolbox creates a new folder inside that destination, leaving existing files untouched. Inspecting files, listing fonts, and reading library records don’t need an output folder.</dd></div>
        <div><dt class="lbl dim">Exit codes</dt><dd class="body">0 means success, 1 means the job failed, and 2 means the command is invalid. Normal CLI results go to stdout; errors go to stderr.</dd></div>
      </dl>
    </div>
  </section>

  <section class="text">
    <div class="side"><h2 class="display-s">Print colors & type</h2><p class="body">You can assign print colors, adjust individual logo variations, name swatches, sample images, and define font roles. These options are available from version 1.1.0. Use inspect to find the colors in your artwork and fonts to list installed font families and styles.</p><p class="body">Structured flags such as --palette and --roles take a quoted JSON array. Use the detected sourceHex from your artwork and font names installed on your computer. CMYK values are percentages from 0 to 100. MCP accepts the same arrays directly, without shell quoting.</p></div>
    <div class="paras"><Code label="Print colors and custom type" text={advanced} /></div>
  </section>

  <section class="text">
    <div class="side"><h2 class="display-s">Preview & saved work</h2><p class="body">Use --action inspect to check settings and see which files will be exported. It doesn’t write any files. Convert also reports output sizes, and Palette returns a preview of the generated code. To save previews you can open, use --action preview with --out.</p><p class="body">Add --save when exporting to keep the settings in the app’s library. The result includes a savedID; use that value in place of RECORD_ID to reopen the work. Any options you pass with the new command override the saved settings.</p><p class="body">Use library-get to read a saved record and library-remove to delete its library entry. Removing an entry leaves the exported files in place.</p></div>
    <div class="paras"><Code label="Save and reopen work" text={library} /></div>
  </section>

  <section class="text">
    <div class="side"><h2 class="display-s">Options</h2><p class="body">The tables below list supported flags and defaults. To check your installed version, run toolbox &lt;tool&gt; --help. Use toolbox list to get the option schemas as JSON.</p></div>
    <div class="paras options">{#each tools as t (t.slug)}<Options tool={t} />{/each}</div>
  </section>

  <section class="text">
    <div class="side"><span class="lbl dim">Machine mode 01</span><h2 class="display-s">List</h2><p class="body">Run toolbox list for a JSON catalog of all four tools, with descriptions, argument schemas, and examples. Use toolbox describe followed by a tool name for a single tool.</p></div>
    <div class="paras"><Code label="List" text={list} /></div>
  </section>

  <section class="text">
    <div class="side"><span class="lbl dim">Machine mode 02</span><h2 class="display-s">Run</h2><p class="body">Pass the tool name and arguments to --run as a JSON object. Toolbox returns the output folder, file names, and any warnings. Successful jobs exit with code 0; failed jobs exit with code 1 and an error message. Replace the example paths with your own and adjust the macOS paths and shell quoting for your system.</p></div>
    <div class="paras"><Code label="Run one job" text={run} /><Code label="The result" text={result} /><Code label="A failure" text={failed} /></div>
  </section>

  <section class="text">
    <div class="side"><span class="lbl dim">Machine mode 03</span><h2 class="display-s">Serve</h2><p class="body">To connect an AI assistant, add the server configuration shown here to its MCP settings. Use the executable path for your platform. The --mcp flag starts Toolbox’s server over standard input and output. Claude Code reads project settings from .mcp.json. Protocol messages go to stdout and logs go to stderr.</p><p class="body">Once connected, ask your assistant to convert screenshots to WebP, package logo SVGs, or extract colors from artwork. Include the source files and destination folder in your request.</p></div>
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