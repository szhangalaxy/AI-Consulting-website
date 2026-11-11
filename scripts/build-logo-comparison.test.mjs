import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { root, assertSelfContained, buildDocument } from './build-preview.mjs';
import { buildLogoComparison } from './build-logo-comparison.mjs';
import { buildWorkflowDemo } from './build-workflow-demo.mjs';

test('comparison is deterministic, self-contained and current', () => {
  const html = buildLogoComparison();
  assert.equal(html, buildLogoComparison());
  assert.equal(readFileSync(resolve(root, 'logo-comparison.html'), 'utf8'), html);
  assertSelfContained(html);
  assert(!html.includes('[Company Name]'));
  assert(html.includes('Noviqa home'));
  assert(html.includes('type="image/png"'));
  assert(html.includes('noindex,nofollow'));
});
test('comparison retains the real richer examples and honest enquiry boundary', () => {
  const html = buildLogoComparison();
  assert(html.includes('Local simulation only'));
  assert(html.includes('Preview clarification task'));
  assert(html.includes('It doesn’t send an enquiry'));
  assert(html.includes('data-logo-choice="current"'));
  assert(html.includes('data-logo-choice="converge"'));
  assert.equal([...html.matchAll(/data-logo-symbol alt=/g)].length, 8);
  assert(!html.includes('formspree.io'));
});
test('website aliases share one build and the comparison stays separate', () => {
  assert.equal(readFileSync(resolve(root, 'index.html'), 'utf8'), buildDocument());
  assert.equal(readFileSync(resolve(root, 'preview.html'), 'utf8'), buildDocument());
  assert.equal(readFileSync(resolve(root, 'workflow-demo.html'), 'utf8'), buildWorkflowDemo());
  assert.notEqual(buildLogoComparison(), buildDocument());
});
