const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

// Regression check for the real handoff artifact, not a localhost substitute.
const root = path.resolve(__dirname, '..');
const evidence = path.resolve(root, '..', 'reviews', 'ai-consulting-preview');

(async () => {
  execFileSync(process.execPath, [path.join(__dirname, 'build-preview.mjs'), '--check'], { stdio: 'inherit' });
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, offline: true });
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    const errors = [], network = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('request', request => { if (/^https?:/.test(request.url())) network.push(request.url()); });
    // setContent has no file-directory base URL. Relative resources would fail here.
    await page.setContent(fs.readFileSync(path.join(root, 'index.html'), 'utf8'), { waitUntil: 'load' });
    await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('.hero').evaluate(element => getComputedStyle(element).backgroundColor), 'rgb(23, 43, 35)', 'Index styles did not load');
    assert(await page.evaluate(() => document.fonts.check('700 108px Inter')), 'Embedded font did not load');
    assert.deepEqual(await page.locator('#process .stage-label').allTextContents(), ['AI audit & consulting', 'Implementation', 'Handover & support']);
    assert.deepEqual(await page.locator('#process .step-deliverable').allTextContents(), [
      'You receive: a prioritised list of AI opportunities and a roadmap for what to do next.',
      'You receive: a working workflow, tested against agreed examples.',
      'You receive: the handover materials and support arrangements agreed in your build scope.'
    ]);
    assert.match(await page.locator('#process .section-intro').innerText(), /scoped separately.*deliverables and fees agreed before each begins/i);
    assert.doesNotMatch(await page.locator('#process').innerText(), /\bpaid\b/i);
    await page.locator('#about').scrollIntoViewIfNeeded();
    await page.locator('.about-image').evaluate(image => image.decode());
    assert.equal(await page.locator('img').evaluateAll(images => images.filter(image => !image.complete || !image.naturalWidth).length), 0, 'Index has broken embedded images');
    assert(await page.locator('img').evaluateAll(images => images.every(image => image.src.startsWith('data:'))), 'Index depends on a separate image');
    fs.mkdirSync(evidence, { recursive: true });
    await page.locator('#about').screenshot({ path: path.join(evidence, 'index-about.png') });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: path.join(evidence, 'index-desktop.png'), fullPage: true });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: path.join(evidence, 'index-hero.png') });

    await page.locator('.hero [data-open="example-dialog"]').click();
    await page.locator('#tab-documents').click();
    await page.locator('#sample-approve').click();
    assert.match(await page.locator('#sample-status').innerText(), /No invoice was posted/);
    await page.keyboard.press('Escape');
    await page.locator('.hero [data-open="contact-dialog"]').click();
    assert.match(await page.locator('.engagement-note').innerText(), /scoped separately.*fees agreed before work begins/i);
    await page.locator('#brief-task').fill('Assess the repeated entry between our inbox and spreadsheet.');
    await page.locator('#brief-form button[type=submit]').click();
    assert.match(await page.locator('#prepared-brief').inputValue(), /Assess the repeated entry/);
    await page.locator('#copy-brief').click();
    await page.waitForFunction(() => /Brief copied|Copy is unavailable/.test(document.getElementById('brief-status').textContent));
    await page.keyboard.press('Escape');

    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Horizontal overflow at ' + width);
      if (width === 390) {
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({ path: path.join(evidence, 'index-mobile.png'), fullPage: true });
        await page.screenshot({ path: path.join(evidence, 'index-mobile-hero.png') });
        await page.locator('.menu-toggle').click();
        assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
        await page.locator('#main-navigation a[href="#process"]').click();
        assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
      }
    }
    assert.deepEqual(errors, [], 'Index produced browser errors');
    assert.deepEqual(network, [], 'Index attempted to load external resources');
    console.log(JSON.stringify({ result: 'passed', artifact: 'index.html', isolated: true, networking: 'disabled', missingImages: 0, consoleErrors: errors, externalRequests: network, screenshots: evidence }, null, 2));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exit(1); });
