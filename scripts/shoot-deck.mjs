// 발표(정적 HTML) 슬라이드 캡처. notion 정적 서버(3033)가 떠 있어야 함.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const OUT = 'C:/hakathon/.shots/deck';
mkdirSync(OUT, { recursive: true });
const URL = 'http://localhost:3033/static/presentation.html';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const run = async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await wait(700);
  for (let i = 1; i <= 10; i++) {
    await page.screenshot({ path: `${OUT}/slide-${String(i).padStart(2, '0')}.png` });
    await page.keyboard.press('ArrowRight');
    await wait(450);
  }
  await browser.close();
  console.log('done ->', OUT);
};
run().catch((e) => { console.error(e); process.exit(1); });
