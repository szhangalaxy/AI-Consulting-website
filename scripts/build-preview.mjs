import { readFileSync, existsSync } from 'node:fs';
import { dirname, extname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const targets = ['index.html', 'preview.html'];
const marker = '<!-- Generated self-contained website. Edit app.html, styles.css, or script.js, then regenerate. -->';
const mimeTypes = { '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webp': 'image/webp', '.png': 'image/png' };

function inlineAsset(path) {
  if (path.startsWith('data:')) return path;
  const absolute = resolve(root, path);
  if (relative(root, absolute).startsWith('..')) throw new Error('Asset outside the project: ' + path);
  const mime = mimeTypes[extname(path)];
  if (!mime) throw new Error('Unsupported asset type: ' + path);
  return 'data:' + mime + ';base64,' + readFileSync(absolute).toString('base64');
}

export function assertSelfContained(html) {
  const resourceTags = [...html.matchAll(/<(?:script|link|img)\b[^>]*>/gi)];
  const separateResources = resourceTags.flatMap(([tag]) => [...tag.matchAll(/\b(?:src|href)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi)]
    .map(match => match[1] ?? match[2] ?? match[3]))
    .filter(url => !url.startsWith('data:'));
  const separateCssUrls = [...html.matchAll(/url\(([^)]+)\)/g)]
    .filter(match => !match[1].trim().replace(/^['"]|['"]$/g, '').startsWith('data:'));
  if (separateResources.length || separateCssUrls.length) {
    throw new Error('Standalone document still references a separate resource');
  }
  if (!html.includes('<style>') || !html.includes('<script>')) {
    throw new Error('Standalone document must contain embedded CSS and JavaScript');
  }
}

export function buildDocument() {
  let html = readFileSync(resolve(root, 'app.html'), 'utf8');
  const css = readFileSync(resolve(root, 'styles.css'), 'utf8').replace(
    /url\(['"]?([^'"\)]+)['"]?\)/g,
    (_, path) => "url('" + inlineAsset(path) + "')"
  );
  const javascript = readFileSync(resolve(root, 'script.js'), 'utf8');
  html = html.replace('<!doctype html>', '<!doctype html>\n' + marker);
  html = html.replace(/\s*<link\b[^>]*rel="preload"[^>]*>/g, '');
  html = html.replace('<link rel="stylesheet" href="styles.css">', '<style>\n' + css + '\n</style>');
  html = html.replace(/\s*<script src="script.js" defer><\/script>/, '');
  html = html.replace(/\bsrc="([^"]+)"/g, (_, path) => 'src="' + inlineAsset(path) + '"');
  html = html.replace(/(<link rel="icon" href=")([^"]+)(")/, (_, before, path, after) => before + inlineAsset(path) + after);
  // Inline scripts do not honor defer; initialize only after the markup exists.
  html = html.replace('</body>', '<script>\n' + javascript.replace(/<\/script/gi, '<\\/script') + '\n</script>\n</body>');
  const licences = ['assets/icons/LICENSE', 'assets/fonts/LICENSE']
    .map(path => readFileSync(resolve(root, path), 'utf8')).join('\n\n');
  html = html.replace('</html>', '<!-- Embedded asset licences\n' + licences.replaceAll('-->', '-- >') + '\n-->\n</html>');
  assertSelfContained(html);
  return html;
}

function main() {
  const html = buildDocument();
  if (process.argv.includes('--check')) {
    for (const name of targets) {
      const path = resolve(root, name);
      if (!existsSync(path) || readFileSync(path, 'utf8') !== html) {
        throw new Error(name + ' is stale. Regenerate both standalone documents before handoff.');
      }
      assertSelfContained(readFileSync(path, 'utf8'));
    }
    process.stdout.write('PASS: index.html and preview.html are current, identical, and self-contained.\n');
  } else if (process.argv.includes('--patch') || process.argv.includes('--apply')) {
    const template = readFileSync(resolve(root, 'app.html'), 'utf8');
    const operations = [];
    const lines = value => value.trimEnd().split('\n');
    for (const name of targets) {
      const path = resolve(root, name);
      const previous = existsSync(path) ? readFileSync(path, 'utf8') : null;
      // Permit the initial index migration only when its contents match app.html.
      if (previous && !previous.includes('<!-- Generated self-contained') && previous !== template) {
        throw new Error('Refusing to overwrite an unrelated ' + name);
      }
      if (previous === html) continue;
      const operation = previous === null
        ? '*** Add File: ' + path + '\n'
        : '*** Update File: ' + path + '\n@@\n' + lines(previous).map(line => '-' + line).join('\n') + '\n';
      operations.push(operation + lines(html).map(line => '+' + line).join('\n') + '\n');
    }
    const patch = '*** Begin Patch\n' + operations.join('') + '*** End Patch\n';
    if (process.argv.includes('--apply')) {
      if (operations.length) execFileSync('apply_patch', [], { input: patch, stdio: ['pipe', 'inherit', 'inherit'] });
      else process.stdout.write('Standalone documents are already up to date.\n');
    } else process.stdout.write(patch);
  } else {
    process.stdout.write(html);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
