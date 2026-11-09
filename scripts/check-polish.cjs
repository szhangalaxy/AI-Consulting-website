const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');

(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
  const measurements = [];
  try {
    const page = await browser.newPage({ offline: true, reducedMotion: 'reduce' });
    page.setDefaultTimeout(10000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const file of ['index.html', 'workflow-demo.html']) {
      // A fresh document also gives each standalone script a fresh JS realm.
      await page.goto('about:blank');
      await page.setContent(fs.readFileSync(path.join(root, file), 'utf8'));
      await page.evaluate(() => document.fonts.ready);
      for (const width of [1440, 1024, 768]) {
        await page.setViewportSize({ width, height: 1000 });
        for (const selector of ['.service .text-link', '.step-deliverable']) {
          const tops = await page.locator(selector).evaluateAll(es => es.map(e => e.getBoundingClientRect().top));
          assert(Math.max(...tops) - Math.min(...tops) <= 1, `${file} ${selector} not aligned at ${width}`);
        }
      }
    }
    for (const [width, height] of [[390, 844], [320, 568]]) {
      await page.setViewportSize({ width, height });
      for (const key of ['enquiries', 'documents', 'reports']) {
        await page.locator(`[data-example-link="${key}"]`).click();
        for (const scenario of ['complete', 'exception']) {
          await page.locator(`[data-scenario="${scenario}"]`).click();
          const metrics = await page.locator('#example-dialog').evaluate(dialog => {
            const visible = [...dialog.querySelectorAll('p,small,td,th,dt,dd,button,summary,span,caption')].filter(e => e.innerText.trim() && e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden');
            const panel = dialog.querySelector('.wf-prepared').getBoundingClientRect();
            const footer = dialog.querySelector('.wf-footer').getBoundingClientRect();
            return {
              minText: Math.min(...visible.map(e => parseFloat(getComputedStyle(e).fontSize))),
              fieldSize: getComputedStyle(dialog.querySelector('.wf-fields,.wf-draft p:last-child')).fontSize,
              headerHeight: dialog.querySelector('.wf-header').getBoundingClientRect().height,
              preparedVisible: panel.top < footer.top,
              firstPanel: dialog.querySelector('.wf-workspace').firstElementChild.className,
              scrollWidth: dialog.querySelector('.wf-scroll').scrollWidth,
              clientWidth: dialog.querySelector('.wf-scroll').clientWidth
            };
          });
          assert(metrics.minText >= 12, 'Small workflow text regressed');
          assert.equal(metrics.fieldSize, '14px');
          assert(metrics.headerHeight < 160, 'Mobile header is no longer compact');
          assert(metrics.preparedVisible, 'Prepared record is not introduced above the footer');
          assert.equal(metrics.firstPanel, 'wf-prepared');
          assert(metrics.scrollWidth <= metrics.clientWidth + 1, 'Mobile explorer overflows');
          measurements.push({ width, height, key, scenario, ...metrics });
          await page.locator('#sample-approve').click();
          assert.equal(await page.locator('#sample-approve').isDisabled(), true);
          assert.equal(await page.locator('#wf-result').evaluate(el => el === document.activeElement), true);
        }
        // A responsive layout change must not clear the chosen scenario/result.
        await page.setViewportSize({ width: 1024, height: 1000 });
        assert.equal(await page.locator('[data-scenario="exception"]').getAttribute('aria-pressed'), 'true');
        assert.equal(await page.locator('#sample-approve').isDisabled(), true);
        assert.equal(await page.locator('.wf-workspace').evaluate(el => el.firstElementChild.className), 'wf-source');
        await page.setViewportSize({ width, height });
        await page.keyboard.press('Escape');
      }
    }
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ result: 'passed', desktopRows: 'aligned', mobileScenarios: measurements.length, measurements }, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
