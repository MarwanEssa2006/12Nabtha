// Visual QA: serves nothing itself — expects Next.js running on http://localhost:3000/ (or QA_URL).
// Usage: node scripts/shoot.mjs [outDir]
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
let pw; try { pw = require('playwright'); } catch { pw = require('/opt/npm-tools/node_modules/playwright'); }
const out = process.argv[2] || 'qa';
const fs = require('node:fs'); fs.mkdirSync(out, { recursive: true });
const URL = process.env.QA_URL || 'http://localhost:3000/';
const browser = await pw.chromium.launch();
const errors = [];
const sections = ['top', 'pieces', 'make', 'story', 'process', 'impact', 'gallery', 'order'];
for (const [name, vp, mobile] of [['desktop', { width: 1440, height: 900 }, false], ['mobile', { width: 390, height: 844 }, true]]) {
  for (const lang of ['ar', 'en']) {
    const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile, reducedMotion: 'reduce' });
    await ctx.addInitScript(l => localStorage.setItem('nabta-lang', l), lang);
    const page = await ctx.newPage();
    page.on('pageerror', e => errors.push(`${name}/${lang}: ${e.message}`));
    page.on('console', m => { if (m.type() === 'error' && !/fonts\.g/.test(m.text())) errors.push(`${name}/${lang} console: ${m.text()}`); });
    await page.goto(URL, { waitUntil: 'networkidle' }).catch(() => {});
    await page.waitForTimeout(400);
    for (const s of sections) {
      if (s !== 'top') await page.evaluate(id => document.getElementById(id).scrollIntoView(), s);
      else await page.evaluate(() => scrollTo(0, 0));
      await page.waitForTimeout(250);
      await page.screenshot({ path: `${out}/${name}-${lang}-${s}.png` });
    }
    // horizontal overflow check
    const ov = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    if (ov > 0) errors.push(`${name}/${lang}: horizontal overflow ${ov}px`);
    // open a product
    await page.evaluate(() => document.getElementById('make').scrollIntoView());
    await page.click('#grid .tile');
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${out}/${name}-${lang}-detail.png` });
    await page.click('#dOrder');
    await page.waitForTimeout(300);
    await page.fill('[name=name]', lang === 'ar' ? 'سارة' : 'Sara');
    await page.fill('[name=contact]', '01000000000');
    await page.fill('[name=notes]', lang === 'ar' ? 'أريد ٢٠ قطعة باسم الشركة' : '20 pieces with our logo');
    await page.click('#orderForm [type=submit]');
    await page.waitForTimeout(300);
    await page.evaluate(() => document.getElementById('order').scrollIntoView());
    await page.screenshot({ path: `${out}/${name}-${lang}-order-ready.png` });
    if (mobile) {
      await page.evaluate(() => scrollTo(0, 0));
      await page.click('#menuBtn'); await page.waitForTimeout(300);
      await page.screenshot({ path: `${out}/${name}-${lang}-menu.png` });
    }
    await ctx.close();
  }
}
await browser.close();
console.log(errors.length ? errors.join('\n') : 'no errors');
