import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { root, assertSelfContained, websiteMarker } from './build-preview.mjs';
import { buildWorkflowDemo } from './build-workflow-demo.mjs';

export const comparisonTarget = resolve(root, 'logo-comparison.html');
const marker = '<!-- Generated logo comparison. Edit brand-preview/ and assets/brand/, then run scripts/build-logo-comparison.mjs --apply. -->';
const source = name => readFileSync(resolve(root, 'brand-preview', name), 'utf8');
const uri = name => 'data:image/png;base64,' + readFileSync(resolve(root, 'assets/brand', name + '.png')).toString('base64');

export function buildLogoComparison() {
  const assets = {
    current: { name: 'Current', lockup: uri('current-lockup'), symbol: uri('current-symbol'), width: 2172, bounds: [145, 164, 1884, 404] },
    converge: { name: 'Converge', lockup: uri('converge-lockup'), symbol: uri('converge-symbol'), width: 2172, bounds: [105, 127, 1966, 474] }
  };
  let html = buildWorkflowDemo().replaceAll('[Company Name]', 'Noviqa').replaceAll('Company Name home', 'Noviqa home');
  // Keep an immediate header image, then reuse the embedded asset registry in
  // every other slot. Avoid repeating several megabytes of icon data eight times.
  const art = (reverse, initial = false) => `<span class="brand-art${reverse ? ' brand-reverse' : ''}" style="--art-width:115.2866%;--art-left:-7.6964%;--art-top:-27.7070%"><img${initial ? ` src="${assets.current.lockup}"` : ''} alt="Noviqa Current logo" width="2172" height="724"></span>`;
  const logoLinks = /<a class="wordmark logo-wordmark" href="#" aria-label="Noviqa home">[\s\S]*?<\/a>/g;
  if ([...html.matchAll(logoLinks)].length !== 2) throw new Error('Homepage brand placements changed; review comparison integration.');
  let logoSlot = 0;
  html = html.replace(logoLinks, () => `<a class="wordmark logo-wordmark" href="#" aria-label="Noviqa home">${art(false, logoSlot++ === 0)}</a>`);
  html = html.replace(/<link rel="icon"[^>]+>/, `<link rel="icon" href="${assets.current.symbol}" type="image/png">`);
  html = html.replace('<title>Noviqa | Less admin. More time for your business.</title>', '<title>Noviqa | Current logo comparison</title>');
  html = html.replace('</head>', `<meta name="robots" content="noindex,nofollow">\n<style>\n${source('styles.css')}\n</style>\n</head>`);
  html = html.replace('<header class="site-header">', `<aside class="logo-review-bar" aria-label="Logo comparison controls"><div class="container logo-review-inner"><p><strong>Noviqa logo preview</strong><span class="logo-review-safety"> · Main website unchanged</span></p><div class="logo-review-controls" role="group" aria-label="Choose a logo to preview"><button type="button" data-logo-choice="current" aria-pressed="true">Current</button><button type="button" data-logo-choice="converge" aria-pressed="false">Converge</button></div><a class="logo-review-link" href="#logo-size-tests">Icon sizes</a><span class="logo-review-status" id="logo-review-status" role="status" aria-live="polite"></span></div></aside>\n<noscript><p class="container">This comparison needs JavaScript to switch designs. The header shows Current.</p></noscript>\n<header class="site-header">`);
  const samples = reverse => `<div class="logo-specimen${reverse ? ' logo-specimen-dark brand-reverse' : ''}"><h3>${reverse ? 'Reversed on forest' : 'On paper'} · <span data-logo-name>Current</span></h3>${art(false)}<div class="logo-icon-sizes">${[16, 24, 32, 48].map(size => `<figure><img data-logo-symbol alt="Noviqa Current symbol" width="${size}" height="${size}"><figcaption>${size} px</figcaption></figure>`).join('')}</div></div>`;
  html = html.replace('</footer>', `</footer>\n<section class="logo-specimens" id="logo-size-tests" aria-labelledby="logo-size-heading"><div class="container"><h2 id="logo-size-heading">A closer look at the identity.</h2><p>Switch between Current and Converge above. The header, footer, browser icon and these samples update together. The website content and workflow examples stay the same.</p><div class="logo-specimen-grid">${samples(false)}${samples(true)}</div><p class="logo-limits">Design comparison only. Raster artwork, not final vector masters. Enquiry delivery is still unconnected. Trademark clearance is not included.</p></div></section>`);
  html = html.replace('</body>', `<script type="application/json" id="brand-preview-assets">${JSON.stringify(assets)}</script>\n<script>\n${source('script.js')}\n</script>\n</body>`);
  html = html.replace(websiteMarker, marker);
  assertSelfContained(html);
  return html;
}

function main() {
  const html = buildLogoComparison();
  const previous = existsSync(comparisonTarget) ? readFileSync(comparisonTarget, 'utf8') : null;
  if (process.argv.includes('--check')) {
    if (previous !== html) throw new Error('logo-comparison.html is stale. Regenerate with --apply.');
    return process.stdout.write('PASS: logo-comparison.html is current and self-contained.\n');
  }
  if (!process.argv.includes('--apply')) return process.stdout.write(html);
  if (previous === html) return process.stdout.write('Logo comparison is already current.\n');
  if (previous && !previous.includes(marker)) throw new Error('Refusing to overwrite an unrelated file.');
  const lines = value => value.trimEnd().split('\n');
  const operation = previous === null ? '*** Add File: ' + comparisonTarget + '\n' : '*** Update File: ' + comparisonTarget + '\n@@\n' + lines(previous).map(line => '-' + line).join('\n') + '\n';
  const patch = '*** Begin Patch\n' + operation + lines(html).map(line => '+' + line).join('\n') + '\n*** End Patch\n';
  execFileSync('apply_patch', [], { input: patch, stdio: ['pipe', 'inherit', 'inherit'] });
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
