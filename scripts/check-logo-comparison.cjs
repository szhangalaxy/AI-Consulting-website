const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const evidence = path.resolve(root, '..', 'reviews', 'noviqa-logo-polish-2026-11-11');

(async () => {
  execFileSync(process.execPath, [path.join(__dirname, 'build-logo-comparison.mjs'), '--check'], { stdio: 'inherit' });
  fs.mkdirSync(evidence, { recursive: true });
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, offline: true, reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  const errors = [], network = [], layouts = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('request', request => { if (/^https?:/.test(request.url())) network.push(request.url()); });
  try {
    await page.setContent(fs.readFileSync(path.join(root, 'logo-comparison.html'), 'utf8'), { waitUntil: 'load' });
    await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
    await page.evaluate(() => document.fonts.ready);
    await page.locator('.about-image').evaluate(img => img.decode());
    for (const key of ['current', 'converge']) {
      for (const width of [1440, 1024, 900, 768, 700, 390, 320]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.evaluate(() => scrollTo(0, 0));
        const choice = page.locator(`[data-logo-choice="${key}"]`);
        await choice.click();
        assert.equal(await choice.getAttribute('aria-pressed'), 'true');
        assert.equal(await page.locator('html').getAttribute('data-logo'), key);
        await page.locator('.site-header .brand-art img').evaluate(img => img.decode());
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${key} overflows at ${width}`);
        const state = await page.evaluate(() => {
          const frame = document.querySelector('.site-header .brand-art').getBoundingClientRect();
          const link = document.querySelector('.site-header .logo-wordmark').getBoundingClientRect();
          const menu = document.querySelector('.menu-toggle').getBoundingClientRect();
          return { logo: { x: frame.x, y: frame.y, width: frame.width, height: frame.height }, linkHeight: link.height, menuX: menu.x, menuWidth: menu.width };
        });
        assert(state.logo.x >= 0 && state.logo.x + state.logo.width <= width, 'Logo clipped');
        assert(state.linkHeight >= 44, 'Home logo tap target too small');
        if (width <= 700) assert(state.logo.x + state.logo.width < state.menuX, 'Logo collides with menu');
        layouts.push({ key, width, ...state });
        if ([1440, 390, 320].includes(width)) {
          await page.screenshot({ path: path.join(evidence, `${key}-${width}-hero.png`) });
          await page.locator('.site-header').screenshot({ path: path.join(evidence, `${key}-${width}-header.png`) });
        }
      }
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.locator('.site-footer').screenshot({ path: path.join(evidence, `${key}-footer.png`) });
      await page.locator('.logo-specimens').screenshot({ path: path.join(evidence, `${key}-specimens.png`) });
      assert.equal(await page.locator('link[rel="icon"]').getAttribute('href'), await page.locator('[data-logo-symbol]').first().getAttribute('src'));
      const expected = { enquiries: ['Follow-up task created', 'Clarification task created'], documents: ['Draft accounting entry prepared', 'Invoice held in review'], reports: ['Weekly report preview ready', 'Report held · data needs attention'] };
      for (const workflow of ['enquiries', 'documents', 'reports']) {
        const trigger = page.locator(`[data-example-link="${workflow}"]`);
        await trigger.click();
        for (const [i, scenario] of ['complete', 'exception'].entries()) {
          await page.locator(`[data-scenario="${scenario}"]`).click();
          await page.locator('#sample-approve').click();
          assert.equal(await page.locator('#wf-result-title').innerText(), expected[workflow][i]);
          assert.match(await page.locator('#wf-result-body').innerText(), /Local simulation only/);
          await page.locator('#sample-reset').click();
        }
        await page.keyboard.press('Escape');
        assert(await trigger.evaluate(el => el === document.activeElement));
      }
    }
    // Keyboard selection and visible focus; keep selection in page memory only.
    await page.evaluate(() => scrollTo(0, 0));
    await page.locator('[data-logo-choice="current"]').focus();
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    assert(await page.locator('[data-logo-choice="converge"]').evaluate(el => el === document.activeElement));
    await page.keyboard.press('Space');
    assert.equal(await page.locator('html').getAttribute('data-logo'), 'converge');
    assert.match(await page.locator('#logo-review-status').innerText(), /Converge selected/);
    assert.notEqual(await page.locator('[data-logo-choice="converge"]').evaluate(el => getComputedStyle(el).outlineStyle), 'none');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => scrollTo(0, 0));
    await page.locator('.menu-toggle').click();
    await page.locator('#main-navigation a[href="#process"]').click();
    assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
    await page.locator('.hero [data-open="contact-dialog"]').click();
    await page.locator('#brief-task').fill('Assess repeated entry from our inbox.');
    await page.locator('#brief-form button[type=submit]').click();
    assert.match(await page.locator('#prepared-brief').inputValue(), /Assess repeated entry/);
    assert.match(await page.locator('#brief-status').innerText(), /Nothing has been sent/);
    await page.keyboard.press('Escape');
    await page.locator('button[data-policy="privacy"]').click();
    assert.match(await page.locator('#policy-heading').innerText(), /Privacy/);
    await page.keyboard.press('Escape');
    await page.locator('.faq details summary').first().click();
    assert(await page.locator('.faq details').first().getAttribute('open') !== null);
    assert.equal(await page.locator('img').evaluateAll(images => images.filter(img => !img.complete || !img.naturalWidth).length), 0);
    assert.deepEqual(errors, []);
    assert.deepEqual(network, []);
    const result = { result: 'passed', artifact: 'logo-comparison.html', isolated: true, offline: true, layouts, logoVariants: 2, workflowScenarios: 12, errors, externalRequests: network, screenshots: evidence };
    fs.writeFileSync(path.join(evidence, 'checks.json'), JSON.stringify(result, null, 2));
    console.log(JSON.stringify(result, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
