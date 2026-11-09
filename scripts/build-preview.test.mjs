import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { assertSelfContained, buildDocument, root, targets } from './build-preview.mjs';

test('both actual entry files are current, identical, standalone documents', () => {
  const built = buildDocument();
  for (const target of targets) {
    const actual = readFileSync(resolve(root, target), 'utf8');
    assert.equal(actual, built, target + ' has stale content');
    assertSelfContained(actual);
  }
});

test('relative CSS, scripts, icons and images are rejected', () => {
  const valid = '<style>body{color:black}</style><script></script>';
  for (const resource of [
    '<link rel="stylesheet" href="styles.css">',
    '<script src="script.js"></script>',
    "<script src='script.js'></script>",
    '<script src=script.js></script>',
    '<img src="assets/workflow-architecture.webp">',
    "<img src='assets/workflow-architecture.webp'>",
    '<link rel="icon" href="assets/icons/mail.svg">',
    '<style>@font-face{src:url("assets/fonts/inter-latin-400.woff2")}</style>'
  ]) {
    assert.throws(() => assertSelfContained(valid + resource), /separate resource/);
  }
});

test('embedded resources and in-document navigation remain valid', () => {
  assert.doesNotThrow(() => assertSelfContained('<style>body{background:url("data:image/png;base64,AAAA")}</style><a href="#process">Approach</a><img src="data:image/png;base64,AAAA"><script></script>'));
});

test('script initialization follows the generated page markup', () => {
  const html = buildDocument();
  assert.equal((html.match(/<script>/g) || []).length, 1);
  assert(html.indexOf('<script>') > html.indexOf('id="contact-dialog"'));
  assert(!html.includes('<script src='));
});

test('approved homepage copy makes advisory and build services explicit', () => {
  const html = buildDocument();
  assert(html.includes('AI audits, consulting and automation for small and medium-sized businesses. Understand where AI is worth using, get a prioritised plan, and decide what to build.'));
  assert(html.includes('AI audits. Practical automation.'));
  assert(html.includes('Start with an AI audit to identify and prioritise worthwhile opportunities. Use the roadmap with your team, or engage us separately to build.'));
  assert(html.includes('Examples of what we can build'));
});

test('approved approach deliverables retain the independent audit and scoped support', () => {
  const html = buildDocument();
  for (const text of [
    'a prioritised list of AI opportunities and a roadmap for what to do next.',
    'a working workflow, tested against agreed examples.',
    'Handover &amp; support',
    'the handover materials and support arrangements agreed in your build scope.',
    'Consulting and implementation are scoped separately, with deliverables and fees agreed before each begins.',
    'You can use the roadmap independently; there’s no obligation to engage us for the build.'
  ]) assert(html.includes(text));
});
