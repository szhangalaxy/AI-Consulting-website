const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const evidence = path.resolve(root, 'qa', '2026-11-12');

(async () => {
  fs.mkdirSync(evidence, { recursive: true });
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, offline: true, reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  const errors = [], requests = [], steps = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('request', request => { if (/^https?:/.test(request.url())) requests.push(request.url()); });
  async function capture(file, name, selector) {
    const target = selector ? page.locator(selector) : page;
    await target.screenshot({ path: path.join(evidence, file) });
    steps.push({ step: steps.length + 1, name, screenshot: file, result: 'passed' });
  }
  try {
    await page.setContent(fs.readFileSync(path.join(root, 'index.html'), 'utf8'), { waitUntil: 'load' });
    await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.title(), 'Noviqa | Less admin. More time for your business.');
    const semantics = await page.evaluate(() => {
      const ids = [...document.querySelectorAll('[id]')].map(el => el.id);
      const missing = [...document.querySelectorAll('[aria-controls],[aria-labelledby],[aria-describedby]')].flatMap(el => ['aria-controls', 'aria-labelledby', 'aria-describedby'].flatMap(attr => (el.getAttribute(attr) || '').split(/\s+/).filter(Boolean).filter(id => !document.getElementById(id))));
      return { duplicateIds: ids.filter((id, i) => ids.indexOf(id) !== i), missingReferences: missing, h1s: document.querySelectorAll('h1').length, brokenAnchors: [...document.querySelectorAll('a[href^="#"]')].filter(el => el.hash && !document.getElementById(el.hash.slice(1))).map(el => el.hash) };
    });
    assert.deepEqual(semantics, { duplicateIds: [], missingReferences: [], h1s: 1, brokenAnchors: [] });
    await page.keyboard.press('Tab');
    assert(await page.locator('.skip-link').evaluate(el => el === document.activeElement));
    await page.keyboard.press('Enter');
    await page.evaluate(() => scrollTo(0, 0));
    await capture('01-home-desktop.png', 'Desktop homepage, branding and navigation');
    const expected = { enquiries: ['Follow-up task created', 'Clarification task created'], documents: ['Draft accounting entry prepared', 'Invoice held in review'], reports: ['Weekly report preview ready', 'Report held · data needs attention'] };
    let number = 2;
    for (const workflow of ['enquiries', 'documents', 'reports']) {
      const trigger = page.locator(`[data-example-link="${workflow}"]`);
      await trigger.click();
      assert(await page.locator('#example-dialog').evaluate(el => el.open));
      for (const [index, scenario] of ['complete', 'exception'].entries()) {
        await page.locator(`[data-scenario="${scenario}"]`).click();
        await page.locator('#sample-approve').click();
        assert.equal(await page.locator('#wf-result-title').innerText(), expected[workflow][index]);
        assert.match(await page.locator('#wf-result-body').innerText(), /Local simulation only/);
        assert(await page.locator('#wf-result').evaluate(el => el === document.activeElement));
        await capture(`${String(number++).padStart(2, '0')}-${workflow}-${scenario}.png`, `${workflow}: ${scenario} result and human-review boundary`, '#example-dialog');
        await page.locator('#sample-reset').click();
      }
      await page.keyboard.press('Escape');
      assert(await trigger.evaluate(el => el === document.activeElement));
    }
    await capture('08-approach.png', 'Approach copy, scope and readable deliverables', '#process');
    await page.locator('#about .about-image').evaluate(img => img.decode());
    assert.equal(await page.locator('img').evaluateAll(images => images.filter(img => !img.complete || !img.naturalWidth).length), 0);
    await page.locator('.faq details summary').first().click();
    assert.notEqual(await page.locator('.faq details').first().getAttribute('open'), null);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => scrollTo(0, 0));
    await capture('09-home-mobile.png', 'Mobile homepage and Converge identity');
    await page.locator('.menu-toggle').click();
    assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
    await capture('10-menu-mobile.png', 'Mobile navigation expanded');
    await page.locator('#main-navigation a[href="#process"]').click();
    assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
    await page.locator('[data-example-link="reports"]').click();
    await page.locator('[data-scenario="exception"]').click();
    await capture('11-workflow-mobile.png', 'Mobile reporting exception, prepared-first layout', '#example-dialog');
    await page.keyboard.press('Escape');
    await page.locator('.hero [data-open="contact-dialog"]').click();
    assert.match(await page.locator('.preview-notice').innerText(), /doesn’t send an enquiry/);
    await page.locator('#brief-task').fill('   ');
    await page.locator('#brief-form button[type="submit"]').click();
    assert.equal(await page.locator('#brief-form').isVisible(), true);
    assert.equal(await page.locator('#brief-task').evaluate(el => el.checkValidity()), false);
    await page.locator('#brief-task').fill('Fictional example: assess repeated invoice entry.');
    await page.locator('#brief-tools').fill('Example inbox and spreadsheet');
    await capture('12-contact-mobile.png', 'Contact fields, validation and explicit local-only notice', '#contact-dialog');
    await page.locator('#brief-form button[type="submit"]').click();
    assert.match(await page.locator('#prepared-brief').inputValue(), /Fictional example/);
    assert.match(await page.locator('#brief-status').innerText(), /Nothing has been sent/);
    await capture('13-contact-prepared.png', 'Prepared local brief, no submission claim', '#contact-dialog');
    await page.locator('#edit-brief').click();
    assert(await page.locator('#brief-task').evaluate(el => el === document.activeElement));
    await page.keyboard.press('Escape');
    await page.locator('[data-policy="privacy"]').click();
    assert.match(await page.locator('#policy-copy').innerText(), /not stored or submitted/);
    await capture('14-privacy-mobile.png', 'Preview privacy notice', '#policy-dialog');
    await page.keyboard.press('Escape');
    await page.locator('[data-policy="terms"]').click();
    assert.match(await page.locator('#policy-heading').innerText(), /terms/i);
    await page.keyboard.press('Escape');
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    assert.deepEqual(errors, []);
    assert.deepEqual(requests, []);
    const result = { result: 'passed', date: '2026-11-12', timezone: 'Australia/Sydney', artifact: 'index.html', isolated: true, offline: true, desktopViewport: [1440, 1000], mobileViewport: [390, 844], semantics, steps, errors, externalRequests: requests, limits: ['No axe package available; not full accessibility certification.', 'Contact is a local brief composer; live enquiry delivery and final legal policies remain launch gaps.'] };
    fs.writeFileSync(path.join(evidence, 'checks.json'), JSON.stringify(result, null, 2));
    console.log(JSON.stringify(result, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
