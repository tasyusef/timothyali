// Sync machine flags from a local Toolbox checkout. Website prose stays in toolbox.ts.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import ts from 'typescript';
const root = process.argv[2];
if (!root) throw new Error('Usage: node tools/toolbox/sync-options.mjs /path/to/Toolbox/app');
const url = (source) => 'data:text/javascript;base64,' + Buffer.from(source).toString('base64');
const compile = (file) => ts.transpileModule(readFileSync(file, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
const schema = url(compile(join(root, 'src/shared/jobSchema.ts')));
const catalog = compile(join(root, 'src/shared/toolCatalog.ts')).replace("'./jobSchema'", JSON.stringify(schema));
const { toolCatalog } = await import(url(catalog));
const params = Object.fromEntries(toolCatalog.map((tool) => [tool.id, tool.params.map(({ schema: _schema, isPath: _path, ...param }) => param)]));
writeFileSync(resolve('src/lib/toolbox-options.ts'), '// Generated from Toolbox’s shared tool catalog. Run tools/toolbox/sync-options.mjs to update.\nimport type { Param } from "./toolbox";\nexport const machineParams: Record<string, Param[]> = '+JSON.stringify(params,null,2)+';\n');
console.log('Synced', toolCatalog.length, 'tools and', Object.values(params).flat().length, 'options');
