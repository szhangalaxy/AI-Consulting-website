const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const evidence = path.resolve(root, '..', 'reviews', 'noviqa-converge-selected-2026-11-11');
const uri = file => 'data:image/png;base64,' + fs.readFileSync(file).toString('base64');

(async () => {
  fs.mkdirSync(evidence, { recursive: true });
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
  const errors = [], network = [], layouts = [];
  try {
    for (const javaScriptEnabled of [true, false]) {
      const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, offline: true, reducedMotion: 'reduce', javaScriptEnabled });
      for (const entry of ['index.html', 'preview.html', 'workflow-demo.html']) {
        // A fresh window avoids lexical declarations from one standalone
        // document surviving document.write() into the next test document.
        const page = await context.newPage();
        page.on('pageerror', error => errors.push(error.message));
        page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
        page.on('request', request => { if (/^https?:/.test(request.url())) network.push(request.url()); });
        await page.setContent(fs.readFileSync(path.join(root, entry), 'utf8'), { waitUntil: 'load' });
        await page.evaluate(() => document.fonts.ready);
        assert.equal(await page.getByRole('link', { name: 'Noviqa home', exact: true }).count(), 2);
        assert.equal(await page.locator('.brand-logo-image').count(), 2);
        const expectedLogo = uri(path.join(root, 'assets/brand/converge-lockup.png'));
        const expectedIcon = uri(path.join(root, 'assets/brand/converge-symbol.png'));
        assert.deepEqual(await page.locator('.brand-logo-image').evaluateAll(images => images.map(img => img.src)), [expectedLogo, expectedLogo]);
        assert.equal(await page.locator('link[rel="icon"]').getAttribute('href'), expectedIcon);
        assert.equal(await page.locator('.logo-review-bar').count(), 0);
        for (const width of [1440, 1024, 900, 768, 700, 390, 320]) {
          await page.setViewportSize({ width, height: width <= 700 ? 844 : 1000 });
          await page.evaluate(() => scrollTo(0, 0));
          await page.locator('.site-header .brand-logo-image').evaluate(img => img.decode());
          assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${entry} overflow ${width}`);
          const frame = await page.locator('.site-header .brand-logo-frame').boundingBox();
          const home = await page.locator('.site-header .logo-wordmark').boundingBox();
          assert(home.height >= 44 && frame.x >= 0 && frame.x + frame.width <= width);
          if (width <= 700) {
            const menu = await page.locator('.menu-toggle').boundingBox();
            assert(frame.x + frame.width < menu.x);
          }
          layouts.push({ entry, javaScriptEnabled, width, frame, homeHeight: home.height });
          if (javaScriptEnabled && ['index.html', 'workflow-demo.html'].includes(entry) && [1440, 390, 320].includes(width)) {
            const stem = entry.replace('.html', '') + '-' + width;
            await page.screenshot({ path: path.join(evidence, stem + '.png') });
            await page.locator('.site-header .brand-logo-frame').screenshot({ path: path.join(evidence, stem + '-logo.png') });
          }
        }
        if (javaScriptEnabled && entry === 'index.html') {
          await page.locator('.site-footer').screenshot({ path: path.join(evidence, 'index-footer-mobile.png') });
          await page.setViewportSize({ width: 1440, height: 1000 });
          await page.locator('.site-footer').screenshot({ path: path.join(evidence, 'index-footer.png') });
        }
        await page.close();
      }
      await context.close();
    }
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, offline: true, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.setContent(fs.readFileSync(path.join(root, 'logo-comparison.html'), 'utf8'), { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.locator('[data-logo-choice="converge"]').click();
    await page.addStyleTag({ content: '.logo-review-bar{display:none!important}html{scroll-behavior:auto!important}' });
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: width <= 700 ? 844 : 1000 });
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: path.join(evidence, 'source-converge-' + width + '.png') });
      await page.locator('.site-header .brand-art').screenshot({ path: path.join(evidence, 'source-converge-' + width + '-logo.png') });
    }
    await page.setViewportSize({ width: 1440, height: 760 });
    await page.setContent(`<html><body style="margin:0;padding:24px;background:#e5eadb;color:#17211f;font:16px Arial"><h1 style="font-size:22px">Selected Converge testbed / main website / richer demo</h1><div style="display:flex;gap:12px">${['source-converge-1440', 'index-1440', 'workflow-demo-1440'].map(name => `<figure style="margin:0;width:456px"><figcaption style="margin-bottom:12px">${name}</figcaption><img width="456" src="${uri(path.join(evidence, name + '.png'))}"></figure>`).join('')}</div><p>1440 × 1000 CSS/pixel captures, density 1. Uniformly scaled to 456px wide. Source review toolbar hidden for layout alignment only.</p></body></html>`);
    await page.locator('img').evaluateAll(images => Promise.all(images.map(img => img.decode())));
    await page.screenshot({ path: path.join(evidence, 'qa-full-comparison.png') });
    await page.setViewportSize({ width: 1000, height: 700 });
    await page.setContent(`<html><body style="margin:0;padding:32px;background:#f5f6f0;color:#17211f;font:16px Arial"><h1 style="font-size:22px">Converge header fidelity at native CSS size</h1>${[1440, 390, 320].map(width => `<h2 style="font-size:18px;margin-top:32px">${width}px viewport</h2><div style="display:flex;gap:48px">${['source-converge-' + width, 'index-' + width, 'workflow-demo-' + width].map(name => `<figure style="margin:0"><figcaption style="font-size:14px;margin-bottom:12px">${name}</figcaption><img src="${uri(path.join(evidence, name + '-logo.png'))}"></figure>`).join('')}</div>`).join('')}</body></html>`);
    await page.locator('img').evaluateAll(images => Promise.all(images.map(img => img.decode())));
    await page.screenshot({ path: path.join(evidence, 'qa-focused-comparison.png') });
    assert.deepEqual(errors, []);
    assert.deepEqual(network, []);
    const result = { result: 'passed', offline: true, entryFiles: 3, scriptModes: ['enabled', 'disabled'], widths: [1440, 1024, 900, 768, 700, 390, 320], cases: layouts.length, errors, network, layouts, evidence };
    fs.writeFileSync(path.join(evidence, 'checks.json'), JSON.stringify(result, null, 2));
    console.log(JSON.stringify({ ...result, layouts: 'see checks.json' }, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
