const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const evidence = path.resolve(root, '..', 'reviews', 'workflow-demo');

(async () => {
  execFileSync(process.execPath, [path.join(__dirname, 'build-workflow-demo.mjs'), '--check'], { stdio: 'inherit' });
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
  try {
    fs.mkdirSync(evidence, { recursive: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 1100 }, offline: true, reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.setDefaultTimeout(10000);
    const errors = [], network = [], accessibility = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('request', request => { if (/^https?:/.test(request.url())) network.push(request.url()); });
    await page.setContent(fs.readFileSync(path.join(root, 'workflow-demo.html'), 'utf8'), { waitUntil: 'load' });
    await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('.hero').evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(23, 43, 35)');
    await page.locator('#about').scrollIntoViewIfNeeded();
    await page.locator('.about-image').evaluate(img => img.decode());
    assert.equal(await page.locator('img').evaluateAll(images => images.filter(img => !img.complete || !img.naturalWidth).length), 0);
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: path.join(evidence, 'homepage-desktop.png'), fullPage: true });
    if (fs.existsSync('/tmp/consulting-axe.min.js')) await page.addScriptTag({ content: fs.readFileSync('/tmp/consulting-axe.min.js', 'utf8') });
    async function axe(name) {
      if (!(await page.evaluate(() => !!window.axe))) return;
      const result = await page.evaluate(() => window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } }));
      accessibility.push({ name, violations: result.violations.map(item => ({ id: item.id, impact: item.impact, nodes: item.nodes.map(node => ({ target: node.target, summary: node.failureSummary })) })) });
    }
    const expected = {
      enquiries: ['Follow-up task created', 'Clarification task created'],
      documents: ['Draft accounting entry prepared', 'Invoice held in review'],
      reports: ['Weekly report preview ready', 'Report held · data needs attention']
    };
    const expectedButtons = {
      enquiries: ['Preview follow-up task', 'Preview clarification task'],
      documents: ['Preview entry draft', 'Preview review queue'],
      reports: ['Preview weekly report', 'Preview held report']
    };
    for (const key of ['enquiries', 'documents', 'reports']) {
      const trigger = page.locator(`[data-example-link="${key}"]`);
      await trigger.click();
      assert.equal(await page.locator(`#tab-${key}`).getAttribute('aria-selected'), 'true');
      for (const [index, scenario] of ['complete', 'exception'].entries()) {
        await page.locator(`[data-scenario="${scenario}"]`).click();
        assert.equal(await page.locator(`[data-scenario="${scenario}"]`).getAttribute('aria-pressed'), 'true');
        assert.equal(await page.locator('#sample-approve').isEnabled(), true);
        assert.equal(await page.locator('#sample-approve').innerText(), expectedButtons[key][index]);
        if (key === 'documents') {
          assert.deepEqual(await page.locator('.wf-source-link small').allTextContents(), ['Show in invoice', 'Show in invoice', 'Show invoice total']);
          const total = page.locator('[data-source="invoice-total"]');
          await total.focus();
          await page.keyboard.press('Enter');
          assert.equal(await page.locator('[data-source-id="invoice-total"]').evaluate(el => el.classList.contains('wf-spotlight') && el === document.activeElement), true);
          assert.match(await page.locator('#wf-prepared-body').innerText(), /528\.00/);
        }
        if (key === 'reports') {
          assert.equal(await page.locator('.wf-stat').nth(1).locator('span').innerText(), 'Accepted quotes matched');
          assert.equal(await page.locator('.wf-stat').nth(1).locator('strong').innerText(), '2 of 2');
          assert.equal(await page.locator('.wf-stat').nth(1).locator('small').innerText(), 'to confirmed jobs');
          const prepared = await page.locator('#wf-prepared-body').innerText();
          if (scenario === 'complete') { assert.match(prepared, /3,050/); assert.match(prepared, /450/); assert.match(prepared, /17\.3%/); }
          else { assert.match(prepared, /Incomplete/); assert.doesNotMatch(prepared, /3,050|17\.3%/); }
        }
        await axe(`${key}-${scenario}`);
        await page.locator('#sample-approve').click();
        assert.equal(await page.locator('#wf-result-title').innerText(), expected[key][index]);
        assert.equal(await page.locator('#sample-approve').isDisabled(), true);
        assert.equal(await page.locator('#wf-result').evaluate(el => el === document.activeElement), true);
        assert.match(await page.locator('#wf-result-body').innerText(), /Local simulation only/);
        assert.equal(await page.locator('.wf-rail').count(), 0, 'Removed progress strip must not return');
        if (key === 'reports' && scenario === 'exception') assert.doesNotMatch(await page.locator('#wf-result-body').innerText(), /3,050|17\.3%/);
        await page.locator('#example-dialog').screenshot({ path: path.join(evidence, `${key}-${scenario}-result.png`) });
        await page.locator('#sample-reset').click();
        assert.equal(await page.locator('#sample-approve').isEnabled(), true);
        assert.equal(await page.locator('#wf-result-title').innerText(), 'What happens next');
      }
      await page.keyboard.press('Escape');
      assert.equal(await trigger.evaluate(el => el === document.activeElement), true);
    }
    await page.locator('.hero [data-open="example-dialog"]').click();
    await page.locator('#tab-enquiries').focus();
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.locator('#tab-documents').evaluate(el => el === document.activeElement), true);
    await page.keyboard.press('End');
    assert.equal(await page.locator('#tab-reports').getAttribute('aria-selected'), 'true');
    await page.keyboard.press('Home');
    assert.equal(await page.locator('#tab-enquiries').getAttribute('aria-selected'), 'true');
    await page.keyboard.press('Escape');
    for (const width of [1024, 768, 700, 390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Page overflows at ' + width);
      for (const key of ['enquiries', 'documents', 'reports']) {
        await page.locator(`[data-example-link="${key}"]`).click();
        assert.equal(await page.locator('.wf-scroll').evaluate(el => el.scrollTop), 0, 'Reopened explorer should start at its introduction');
        assert(await page.locator('.wf-scroll').evaluate(el => el.scrollWidth <= el.clientWidth + 1), `Dialog overflows at ${width} in ${key}`);
        const box = await page.locator('#sample-approve').boundingBox();
        assert(box && box.y >= 0 && box.y + box.height <= 844, `Action is offscreen at ${width} in ${key}`);
        if (width <= 700) assert.equal(await page.locator('.wf-source-details').getAttribute('open'), null);
        if (width === 390) {
          await page.screenshot({ path: path.join(evidence, `mobile-${key}-review.png`) });
          await page.locator('[data-scenario="exception"]').click();
          await page.locator('#sample-approve').click();
          await page.screenshot({ path: path.join(evidence, `mobile-${key}-exception.png`) });
          await axe(`mobile-${key}-exception`);
        }
        await page.keyboard.press('Escape');
      }
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => scrollTo(0, 0));
    await page.locator('.menu-toggle').click();
    await page.locator('#main-navigation a[href="#process"]').click();
    assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
    await page.locator('.hero [data-open="contact-dialog"]').click();
    await page.locator('#brief-task').fill('Review our invoice entry workflow.');
    await page.locator('#brief-form button[type=submit]').click();
    assert.match(await page.locator('#prepared-brief').inputValue(), /invoice entry workflow/);
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Privacy', exact: true }).click();
    assert.match(await page.locator('#policy-heading').innerText(), /Privacy/);
    await page.keyboard.press('Escape');
    assert.deepEqual(errors, [], 'Browser errors');
    assert.deepEqual(network, [], 'External resource requests');
    assert(accessibility.every(item => !item.violations.length), JSON.stringify(accessibility.filter(item => item.violations.length), null, 2));
    const result = { result: 'passed', artifact: 'workflow-demo.html', isolated: true, networking: 'disabled', scenarios: 6, widths: [1440, 1024, 768, 700, 390, 320], accessibility: accessibility.length ? accessibility : 'axe unavailable', errors, network, screenshots: evidence };
    fs.writeFileSync(path.join(evidence, 'checks.json'), JSON.stringify(result, null, 2));
    console.log(JSON.stringify(result, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
