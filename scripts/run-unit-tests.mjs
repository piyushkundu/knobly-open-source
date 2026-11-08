import {readdirSync} from 'node:fs';import {spawnSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
const files=readdirSync(new URL('../tests/',import.meta.url)).filter(f=>f.endsWith('.test.mjs')).map(f=>fileURLToPath(new URL('../tests/'+f,import.meta.url)));
const result=spawnSync(process.execPath,['--test','--test-concurrency=2',...files],{stdio:'inherit'});process.exit(result.status??1);
