import { test, expect } from '@playwright/test';

test('test product listing with optimized scroll and image load', async ({ page }) => {
  // ขยายเวลา Timeout เฉพาะ Test นี้เป็น 3 นาที
  test.setTimeout(180000);

  await page.goto('https://starbucks.co.th/', { waitUntil: 'domcontentloaded' });
  await page.getByRole('link', { name: 'Menu' }).click();
  await page.waitForLoadState('networkidle'); // รอจนกว่า Network จะนิ่ง

  console.log('Starting optimized smooth scroll...');

  // ฟังก์ชัน Scroll ที่เร็วขึ้นแต่ยังเก็บ Lazy Load ได้
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      let distance = 500; // เพิ่มระยะการเลื่อนแต่ละครั้ง
      let timer = setInterval(() => {
        let scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve(true);
        }
      }, 200); // เลื่อนทุกๆ 0.2 วินาที
    });
  });

  console.log('Reached bottom. Checking images with timeout...');

  // รอให้รูปโหลดเสร็จแบบมีกำหนดเวลา (สูงสุด 10 วินาที) เพื่อไม่ให้ Test ค้าง
  await page.evaluate(async () => {
    const images = Array.from(document.querySelectorAll('img'));
    const imagePromises = images.map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(resolve => {
        img.addEventListener('load', resolve);
        img.addEventListener('error', resolve);
        setTimeout(resolve, 10000); // ถ้า 10 วิยังไม่มา ให้ไปต่อเลย
      });
    });
    await Promise.all(imagePromises);
  });

  // รอให้นิ่งสนิทอีก 2 วิ
  await page.waitForTimeout(2000);

  const screenshotPath = `test-results/product-listing-fixed-${Date.now()}.png`;
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`✅ Screenshot taken: ${screenshotPath}`);

  await expect(page.locator('img').first()).toBeVisible();
});