import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { root, assertSelfContained, buildDocument } from './build-preview.mjs';

export const demoTarget = resolve(root, 'workflow-demo.html');
const marker = '<!-- Alternate workflow demo. Edit workflow-demo/ sources, then run scripts/build-workflow-demo.mjs --apply. -->';
const source = name => readFileSync(resolve(root, 'workflow-demo', name), 'utf8');

export function buildWorkflowDemo() {
  let html = buildDocument();
  const sharedScript = readFileSync(resolve(root, 'script.js'), 'utf8');
  const boundary = sharedScript.indexOf('const menuToggle =');
  if (boundary < 0 || boundary !== sharedScript.lastIndexOf('const menuToggle =')) throw new Error('Shared script boundary changed; review alternate demo integration.');
  const dialogPattern = /  <dialog class="example-dialog"[\s\S]*?<\/dialog>/g;
  if ([...html.matchAll(dialogPattern)].length !== 1) throw new Error('Expected exactly one original workflow dialog.');
  html = html.replace(dialogPattern, () => source('dialog.html').trimEnd());
  html = html.replace('</head>', '<style>\n' + source('styles.css') + '\n</style>\n</head>');
  // Native dialogs can restore the last focused descendant on reopening. Start
  // every explorer visit at its heading, rather than the previous result card.
  const sharedActions = sharedScript.slice(boundary).replace('dialog.showModal();', `dialog.showModal();
  if (id === 'example-dialog') {
    dialog.querySelector('[data-close]').focus({ preventScroll: true });
    dialog.querySelector('.wf-scroll').scrollTop = 0;
  }`);
  const javascript = source('workflows.js') + '\n' + sharedActions;
  html = html.replace(/<script>[\s\S]*?<\/script>/, () => '<script>\n' + javascript.replace(/<\/script/gi, '<\\/script') + '\n</script>');
  html = html.replace('<title>', '<title>Workflow demo | ');
  html = html.replace('>Explore an example</button>', '>Try a workflow</button>');
  html = html.replaceAll('>Explore the example <img', '>Try the workflow <img');
  html = html.replace('<!-- Generated self-contained website. Edit app.html, styles.css, or script.js, then regenerate. -->', marker);
  assertSelfContained(html);
  return html;
}

function main() {
  const html = buildWorkflowDemo();
  const previous = existsSync(demoTarget) ? readFileSync(demoTarget, 'utf8') : null;
  if (process.argv.includes('--check')) {
    if (previous !== html) throw new Error('workflow-demo.html is stale. Run node scripts/build-workflow-demo.mjs --apply.');
    process.stdout.write('PASS: workflow-demo.html is current and self-contained.\n');
  } else if (process.argv.includes('--apply')) {
    if (previous === html) return process.stdout.write('Alternate demo is already up to date.\n');
    if (previous !== null && !previous.includes(marker)) throw new Error('Refusing to overwrite an unrelated workflow-demo.html');
    const lines = value => value.trimEnd().split('\n');
    const operation = previous === null ? '*** Add File: ' + demoTarget + '\n' : '*** Update File: ' + demoTarget + '\n@@\n' + lines(previous).map(line => '-' + line).join('\n') + '\n';
    const patch = '*** Begin Patch\n' + operation + lines(html).map(line => '+' + line).join('\n') + '\n*** End Patch\n';
    execFileSync('apply_patch', [], { input: patch, stdio: ['pipe', 'inherit', 'inherit'] });
  } else process.stdout.write(html);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
