import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { root, buildDocument } from './build-preview.mjs';

export const demoTarget = resolve(root, 'workflow-demo.html');
// Compatibility API/command: there is now only one canonical website build.
export function buildWorkflowDemo() { return buildDocument(); }

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  execFileSync(process.execPath, [resolve(root, 'scripts/build-preview.mjs'), ...process.argv.slice(2)], { stdio: 'inherit' });
}
