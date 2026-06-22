// 모바일 화면 캡처(Playwright). 개발서버(localhost:3000)가 떠 있어야 함.
// 사용: node scripts/shoot.mjs
import { chromium, devices } from 'playwright';
import { mkdirSync } from 'node:fs';

const OUT = 'C:/hakathon/.shots';
mkdirSync(OUT, { recursive: true });

const BASE = 'http://localhost:3000';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function clickText(page, text) {
  const btn = page.locator('button', { hasText: text }).first();
  await btn.click({ timeout: 5000 });
  await wait(300);
}

const run = async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices['iPhone 12'] });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await wait(800);

  // 1) 첫 화면(문진 + 음성)
  await page.screenshot({ path: `${OUT}/01-screening.png`, fullPage: true });

  // 문진 진행(탭)
  const seq = ['예, 65세 이상이에요', '혼자 살아요', '의료비 지원을 받아요', '예, 받아요', '조금 있어요', '적은 편이에요', '없어요', '아니요, 괜찮아요', '아니요'];
  for (const s of seq) {
    try { await clickText(page, s); } catch { /* skip */ }
  }
  await wait(1500);

  // 2) 문진 결과 + 본인인증 CTA
  await page.screenshot({ path: `${OUT}/02-screen-results.png`, fullPage: true });

  // 3) 본인인증 → 정확 패널
  try {
    await clickText(page, '본인인증하고 정확히 보기');
    await wait(400);
    await page.screenshot({ path: `${OUT}/03-auth-modal.png`, fullPage: true });
    await clickText(page, '네이버 인증서');
    await wait(2000);
    await page.screenshot({ path: `${OUT}/04-verified.png`, fullPage: true });
  } catch (e) { console.log('auth step skip', String(e).slice(0, 80)); }

  // 4) 끊김 점검(변동 문진)
  try {
    await clickText(page, '이어서');
    await wait(500);
    await page.screenshot({ path: `${OUT}/05-change-q.png`, fullPage: true });
    await clickText(page, '예, 그런 변화가');
    await clickText(page, '예, 그런 변화가');
    for (let i = 0; i < 4; i++) await clickText(page, '아니요, 없었어요');
    await wait(1300);
    await page.screenshot({ path: `${OUT}/06-change-results.png`, fullPage: true });
  } catch (e) { console.log('change step skip', String(e).slice(0, 80)); }

  await browser.close();
  console.log('done ->', OUT);
};

run().catch((e) => { console.error(e); process.exit(1); });
