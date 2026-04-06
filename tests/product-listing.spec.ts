import { test, expect, Page } from '@playwright/test'; // เพิ่ม Page เข้ามาใน import

test('Test Scroll Menu - Stable Version', async ({ page }) => {
  test.setTimeout(180000);

  await page.goto('https://starbucks.co.th/menu/', { waitUntil: 'networkidle' });
  console.log('Page loaded, starting controlled scroll...');

  // ระบุประเภทให้ page เป็น Page
  async function scrollPageWithPause(page: Page) {
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
    
    let currentPos = 0;
    const step = 400; 

    while (currentPos < bodyHeight) {
      currentPos += step;
      
      // ระบุประเภทให้ y เป็น number
      await page.evaluate((y: number) => {
        window.scrollTo({ top: y, behavior: 'smooth' });
      }, currentPos);

      await page.waitForTimeout(800); 
    }
  }

  await scrollPageWithPause(page);

  // เลื่อนกลับไปบนสุดแล้วลงมาล่างสุดอีกรอบเพื่อกระตุ้นรูปภาพ
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  
  await page.waitForTimeout(3000);

  const screenshotPath = `test-results/starbucks-menu-fixed.png`;
  await page.screenshot({ path: screenshotPath, fullPage: true });
  
  console.log(`✅ Success! Screenshot saved: ${screenshotPath}`);
});