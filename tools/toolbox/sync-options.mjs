// Sync machine flags from the Toolbox binary's own catalog. Website prose stays in toolbox.ts.
// Since 1.2.0 the app is Rust (no TypeScript catalog to read), so this asks the binary: `toolbox
// list` for each option's schema, and `toolbox <tool> --help` for which options are required and
// which one takes bare arguments. Both print and exit with no window. (Run bare, the binary opens
// the app; this script never does that.)
//
//   node tools/toolbox/sync-options.mjs /path/to/Toolbox/app     uses its target/release/toolbox
//   node tools/toolbox/sync-options.mjs /path/to/toolbox         an installed or built binary
import { execFileSync } from 'node:child_process';
import { existsSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const arg = process.argv[2];
if (!arg) throw new Error('Usage: node tools/toolbox/sync-options.mjs /path/to/Toolbox/app | /path/to/toolbox');
const bin = existsSync(arg) && statSync(arg).isDirectory() ? join(arg, 'target/release/toolbox') : arg;
if (!existsSync(bin)) throw new Error(`No binary at ${bin}. Build it in the app repo: cargo build --release -p toolbox`);
const ask = (...args) => execFileSync(bin, args, { encoding: 'utf8', timeout: 60_000, stdio: ['ignore', 'pipe', 'pipe'] });

const catalog = JSON.parse(ask('list'));

/** `toolbox <tool> --help`: the options marked (required), and the one bare arguments go to. */
function helpOf(tool) {
  const required = new Set();
  let current = null;
  const text = ask(tool, '--help');
  for (const line of text.split('\n')) {
    const flag = /^ {2}--([A-Za-z]+)\b/.exec(line);
    if (flag) current = flag[1];
    else if (!line.startsWith(' ')) current = null;
    if (current && /\(required\)\s*$/.test(line)) required.add(current);
  }
  return { required, primary: /Bare arguments are taken as --([A-Za-z]+)\./.exec(text)?.[1] };
}

/** One option, in the website's Param shape (src/lib/toolbox.ts), from its JSON Schema. */
function param(name, schema, help) {
  const items = schema.items ?? {};
  const type = schema.type === 'array' ? (items.type === 'object' ? 'json' : 'string[]')
    : schema.type === 'integer' || schema.type === 'number' ? 'number'
    : schema.type === 'object' ? 'json' : schema.type;
  const p = { name, type };
  const choices = schema.enum ?? items.enum;
  if (choices) p.choices = choices;
  if (schema.default !== undefined) p.default = schema.default;
  if (schema.minimum !== undefined) p.min = schema.minimum;
  if (schema.maximum !== undefined) p.max = schema.maximum;
  p.description = schema.description;
  if (help.required.has(name)) p.required = true;
  if (help.primary === name) p.primary = true;
  return p;
}

const params = Object.fromEntries(catalog.tools.map((tool) => {
  const help = helpOf(tool.id);
  return [tool.id, Object.entries(tool.inputSchema.properties).map(([name, schema]) => param(name, schema, help))];
}));
writeFileSync(resolve('src/lib/toolbox-options.ts'), `// Generated from Toolbox ${catalog.version}'s tool catalog (toolbox list). Run tools/toolbox/sync-options.mjs to update.\nimport type { Param } from "./toolbox";\nexport const machineParams: Record<string, Param[]> = ` + JSON.stringify(params, null, 2) + ';\n');
console.log('Synced', catalog.tools.length, 'tools and', Object.values(params).flat().length, 'options from Toolbox', catalog.version);
