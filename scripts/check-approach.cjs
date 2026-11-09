const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const evidence = path.resolve(root, '..', 'reviews', 'approach-type-updated');

(async () => {
  fs.mkdirSync(evidence, { recursive: true });
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage({ offline: true, reducedMotion: 'reduce' });
    const metrics = [];
    for (const file of ['index.html', 'workflow-demo.html']) {
      await page.setContent(fs.readFileSync(path.join(root, file), 'utf8'));
      await page.evaluate(() => document.fonts.ready);
      for (const width of [1440, 1024, 768, 390, 320]) {
        await page.setViewportSize({ width, height: 1000 });
        const sizes = await page.locator('#process').evaluate(section => {
          const size = selector => [...section.querySelectorAll(selector)].map(el => getComputedStyle(el).fontSize);
          return { section: size('.eyebrow'), stages: size('.stage-label'), deliverables: size('.step-deliverable'), casing: [...section.querySelectorAll('.stage-label')].map(el => getComputedStyle(el).textTransform) };
        });
        assert.deepEqual(sizes.section, ['14px']);
        assert.deepEqual(sizes.stages, ['14px', '14px', '14px']);
        assert.deepEqual(sizes.deliverables, ['16px', '16px', '16px']);
        assert.deepEqual(sizes.casing, ['none', 'none', 'none']);
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Overflow at ' + width);
        metrics.push({ file, width, ...sizes });
        if (width === 1440 || width === 390) await page.locator('#process').screenshot({ path: path.join(evidence, `${file.replace('.html', '')}-${width}.png`) });
      }
    }
    fs.writeFileSync(path.join(evidence, 'metrics.json'), JSON.stringify(metrics, null, 2));
    console.log('PASS: actual embedded approach fonts are 14px / 14px / 16px in both websites at all five viewport widths.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
