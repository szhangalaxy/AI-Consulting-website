import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildDocument, assertSelfContained, root } from './build-preview.mjs';
import { buildWorkflowDemo, demoTarget } from './build-workflow-demo.mjs';

test('legacy workflow entry and API are exact aliases of the canonical website', () => {
  const original = readFileSync(resolve(root, 'index.html'), 'utf8');
  const demo = buildWorkflowDemo();
  assert.equal(readFileSync(demoTarget, 'utf8'), demo);
  assertSelfContained(demo);
  assert.equal(original, buildDocument());
  assert.equal(readFileSync(resolve(root, 'index.html'), 'utf8'), original);
  assert.equal(demo, original);
});

test('canonical explorer preserves shared actions and initializes once', () => {
  const demo = buildWorkflowDemo();
  assert.equal((demo.match(/id="example-dialog"/g) || []).length, 1);
  assert.equal((demo.match(/<script>/g) || []).length, 1);
  assert(demo.indexOf('<script>') > demo.indexOf('id="contact-dialog"'));
  assert(demo.includes('function reportingView('));
  assert(!demo.includes('const samples ='));
  assert(demo.includes("briefForm.addEventListener('submit'"));
  assert(demo.includes('Consulting and implementation are scoped separately'));
  assert(!demo.includes('wf-rail'));
  assert(!demo.includes('updateRail'));
});

test('website copy avoids decorative em dashes while preserving useful identifiers', () => {
  for (const name of ['app.html', 'script.js', 'workflow-demo/workflows.js']) {
    assert.doesNotMatch(readFileSync(resolve(root, name), 'utf8'), /—/, name);
  }
  const demo = buildWorkflowDemo();
  assert(demo.includes('medium-sized'));
  assert(demo.includes('follow-up'));
  assert(demo.includes('INV-1042'));
});
