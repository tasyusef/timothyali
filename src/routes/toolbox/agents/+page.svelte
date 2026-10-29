<script lang="ts">
  // The command line and MCP. Every command here is copied from the app's own
  // docs/AGENTS.md, so the site cannot document an interface the binary does not have.
  import Decode from '$lib/components/Decode.svelte';
  import Code from '$lib/components/Code.svelte';
  import PageFoot from '$lib/components/PageFoot.svelte';
  import QuietLink from '$lib/components/QuietLink.svelte';
  import { binaries, tools } from '$lib/toolbox';
  import { STEP } from '$lib/tokens';
  const jumps = [['setup', 'Set up'], ['command-line', 'Command line'], ['advanced', 'Advanced'], ['options', 'Options'], ['list', 'List'], ['run', 'Run'], ['serve', 'Serve'], ['organize', 'Organize']];
  const link = 'sudo ln -s "/Applications/Toolbox.app/Contents/MacOS/Toolbox" /usr/local/bin/toolbox';
  // `toolbox` alone opens the app, as a double-click would; listing is `list` or `help`
  const commands = ['toolbox help                              # show tools and usage', 'toolbox convert --help                    # show Convert options', 'toolbox --version                         # show the version', '', ...tools.map((t) => t.command)].join('\n');
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
toolbox specimen --title "Acme type" --out ./exports --roles '[{"label":"Heading","family":"Helvetica","face":"Bold","size":40}]'

toolbox lockup logo.svg --edgeSmoothing hard --out ./exports`;
  const library = `toolbox lockup logo.svg --print none --save --out ./exports --json
toolbox lockup --action library-list --json
toolbox lockup --saved RECORD_ID --action inspect --json
toolbox lockup --saved RECORD_ID --padding 0.15 --save --out ./exports --json`;
  // the organizer's four steps (docs/AGENTS.md, "Organize a folder"; 1.2.0)
  const organize = `toolbox organize scan ~/Clients/Acme

toolbox organize apply ~/Clients/Acme --dryRun \\
  --moves '[{"from":"IMG_0042.jpg","to":"Photos/IMG_0042.jpg"}]' \\
  --keep '[{"path":"logo.svg"}]'

toolbox organize apply ~/Clients/Acme \\
  --moves '[{"from":"IMG_0042.jpg","to":"Photos/IMG_0042.jpg"}]' \\
  --keep '[{"path":"logo.svg"}]'

toolbox organize history ~/Clients/Acme
toolbox organize undo JOURNAL_ID`;
  const mcp = `{
  "mcpServers": {
    "toolbox": {
      "command": "/Applications/Toolbox.app/Contents/MacOS/Toolbox",
      "args": ["--mcp"]
    }
  }
}`;
</script>
<main class="inner-page agents" id="main" tabindex="-1">
  <section class="head">
    <h1 class="display-title lesser"><Decode text="CLI & MCP" step={STEP} /></h1>
    <div class="intro">
      <div class="paras">
        <p class="lead">Use Toolbox from a terminal or an AI assistant.</p>
        <p class="body long">Toolbox includes a command-line interface (CLI) and an MCP server. Use the CLI in your terminal or scripts. MCP (Model Context Protocol) lets an AI assistant find and run the tools. Both work without opening an app window.</p>
      </div>
      <!-- a long page on a phone (9 screens at 390): its sections, one tap away (0206) -->
      <nav class="jump" aria-label="On this page">{#each jumps as [id, name] (id)}<a class="lbl" href={`#${id}`}>{name}</a>{/each}</nav>
      <dl class="meta">{#each binaries as b}<div><dt class="lbl dim">{b.os}</dt><dd class="body">{#each b.path.split(/(?<=\/)/) as part, k}{#if k}<wbr />{/if}{part}{/each}</dd></div>{/each}</dl>
    </div>
  </section>

  <section class="text" id="setup">
    <div class="side"><h2 class="display-s">Set up the command</h2><p class="body long">Install Toolbox first. You can run it from the full executable path shown above, or set up the toolbox shortcut these examples use. On macOS, the command here creates that shortcut. Run the executable directly. The macOS open command won’t send results back to your terminal.</p></div>
    <div class="paras"><Code label="macOS shortcut" text={link} /></div>
  </section>

  <section class="text" id="command-line">
    <div class="side"><h2 class="display-s">The command line</h2><p class="body long">Choose a tool, add your inputs and options, and set an output folder. Running toolbox without arguments opens the app. The CLI and MCP support all four tools and the same export settings.</p></div>
    <div class="paras">
      <Code label="Commands" text={commands} />
      <!-- three notes where there were seven (0199) -->
      <dl class="rules">
        <div><dt class="lbl dim">Inputs</dt><dd class="body long">Pass file paths to convert and lockup, or hex colors to palette, without a flag. Relative paths start from your current folder. Put quotes around paths with spaces.</dd></div>
        <div><dt class="lbl dim">Lists and switches</dt><dd class="body long">Separate values with spaces or commas: --formats webp png or --formats=webp,png. Use none to skip a group (--print none) and --no- to turn a switch off (--no-social).</dd></div>
        <div><dt class="lbl dim">Output</dt><dd class="body long">--out writes into a new folder inside the destination, leaving existing files alone. Add --json for a JSON result. Exit codes: 0 success, 1 failed, 2 invalid; errors go to stderr.</dd></div>
      </dl>
    </div>
  </section>

  <section class="text" id="advanced">
    <div class="side"><h2 class="display-s">Advanced</h2><p class="body long">From version 1.1.0 you can also assign print colors, adjust logo variations, and set font roles. Structured flags like --palette and --roles take a JSON array in quotes. Over MCP, pass the same arrays without quotes. Use inspect to find the colors in your artwork and fonts to list installed families.</p><p class="body long">--action inspect shows what will be exported without writing files. --action preview with --out saves previews. Add --save to keep the settings in the app’s library, then reopen them with the savedID in the result.</p><p class="body long">Version 1.2.0 adds --edgeSmoothing to every tool. hard turns off anti-aliasing in the raster files, so every pixel is fully in or out. Vector files don’t change. smooth is the default.</p></div>
    <div class="paras"><Code label="Print colors, type, edges, and saved work" text={advanced + '\n' + library} /></div>
  </section>

  <section class="text" id="options">
    <div class="side"><h2 class="display-s">Options</h2><p class="body long">Each tool’s page lists its flags and defaults. To check your installed version, run toolbox &lt;tool&gt; --help, or toolbox list for the option schemas as JSON.</p></div>
    <!-- links, not the four tables again: each table is on its tool's page (0199) -->
    <ul class="paras option-links">{#each tools as t (t.slug)}<li><QuietLink href={`/toolbox/${t.slug}/#cli`} label={`${t.name} options`} pad /></li>{/each}</ul>
  </section>

  <section class="text" id="list">
    <div class="side"><h2 class="display-s">List</h2><p class="body long">Run toolbox list to get a JSON catalog of all four tools and the organize steps, with descriptions, argument schemas, and examples. For one tool, run toolbox describe and the tool’s name.</p></div>
    <div class="paras"><Code label="List" text={list} /></div>
  </section>

  <section class="text" id="run">
    <div class="side"><h2 class="display-s">Run</h2><p class="body long">Pass the tool name and arguments to --run as a JSON object. Toolbox returns the output folder, file names, and any warnings. A failed job returns "ok": false with an error message and exits with code 1. Replace the example paths with your own.</p></div>
    <div class="paras"><Code label="Run one job" text={run} /><Code label="The result" text={result} /></div>
  </section>

  <section class="text" id="serve">
    <div class="side"><h2 class="display-s">Serve</h2><p class="body long">To connect an AI assistant, add this server configuration to its MCP settings, using the executable path for your platform. --mcp serves the tools over standard input and output. Claude Code reads project settings from .mcp.json.</p><p class="body long">Then ask your assistant to convert screenshots to WebP, package logo SVGs, pull colors from artwork, or tidy a client folder. Tell it where the source files are and which folder to save to.</p></div>
    <div class="paras"><Code label="Serve the tools" text="toolbox --mcp" /><Code label=".mcp.json" text={mcp} /></div>
  </section>

  <section class="text" id="organize">
    <div class="side"><h2 class="display-s">Organize a folder</h2><p class="body long">Toolbox can sort a client folder, but it doesn’t decide where things go. Your assistant plans the moves. Toolbox lists the folder, checks the plan, moves the files, and keeps a record so you can undo it. Over MCP the steps are organize_scan, organize_apply, organize_undo, and organize_history. In a terminal they’re toolbox organize scan, apply, undo, and history. Each one prints JSON.</p></div>
    <div class="paras">
      <Code label="Scan, dry run, apply, undo" text={organize} />
      <dl class="rules">
        <div><dt class="lbl dim">1. Scan</dt><dd class="body long">Lists what’s in the folder, numbered, with duplicate files grouped. Nothing moves.</dd></div>
        <div><dt class="lbl dim">2. Dry run</dt><dd class="body long">Send the planned moves with --dryRun, or dryRun: true over MCP. Toolbox checks them and changes nothing. Show the user the result.</dd></div>
        <div><dt class="lbl dim">3. Apply</dt><dd class="body long">Only after they agree, send the same plan without --dryRun. Toolbox checks the folder again first and leaves out any unsafe move, with the reason. Duplicate copies go to a .toolbox-recovery folder inside it. Nothing is deleted.</dd></div>
        <div><dt class="lbl dim">4. Undo</dt><dd class="body long">Every apply returns a journal ID. toolbox organize undo with that ID puts everything back, and history lists past runs. Undo the newest first.</dd></div>
      </dl>
    </div>
  </section>

  <section><PageFoot note="" href="/toolbox/" label="All four tools" /></section>
</main>
<style>
.intro .lead{max-width:24ch}.intro .body{max-width:60ch}
.jump{display:flex;flex-wrap:wrap;gap:0 var(--s3);margin-top:var(--s1)}.jump a{padding:14px 0 14px;text-decoration:underline;text-underline-offset:4px}
@media(hover:hover){.jump a:hover{color:var(--accent-text)}}
.jump a:active{background:var(--accent);color:var(--on-accent);box-shadow:var(--s1) 0 0 var(--accent),calc(-1 * var(--s1)) 0 0 var(--accent)} /* the press (0099), which these had not (PX-125) */
.text{scroll-margin-top:var(--s4)}
.meta dd{overflow-wrap:break-word} /* the path breaks after a slash (0206) */
/* one column (0200): the heading and its explanation, then the commands at full width under
   them; side by side, the shorter column left a hole and the commands ran off the side */
.text{padding-top:var(--s8);display:flex;flex-direction:column;gap:var(--s3)}
.side{display:flex;flex-direction:column;gap:var(--s2);max-width:64ch}.side h2{margin-bottom:var(--s1)}
.rules{display:grid;grid-template-columns:minmax(0,1fr);gap:var(--s3);margin:0;max-width:72ch}
.rules dt{margin-bottom:var(--s1)}.rules dd{margin:0}
.option-links{list-style:none;margin:0;padding:0;gap:0}
@media(max-width:700px){.text{padding-top:var(--s6)}}
</style>