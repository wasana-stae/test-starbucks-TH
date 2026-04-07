import { test, expect } from '@playwright/test';

test('Starbucks Flow - Search and Smooth Detail View', async ({ page }) => {
  test.setTimeout(180000); // เผื่อเวลาสำหรับการเลื่อนหน้าจอ

  // 1. ไปหน้าเมนูและค้นหาสินค้า
  await page.goto('https://starbucks.co.th/menu/', { waitUntil: 'networkidle' });
  const searchInput = page.getByRole('searchbox', { name: 'Search' });
  await searchInput.fill('coffee');
  await searchInput.press('Enter');

  // 2. รอผลลัพธ์รายการสินค้า และเลือกสินค้าตัวแรก
  const productLink = page.locator('main a[href*="/product/"]').first();
  await expect(productLink).toBeVisible({ timeout: 10000 });
  
  // เก็บชื่อไว้เช็ค และดึง URL เพื่อ Navigate ตรงๆ (เสถียรกว่าการคลิกผ่าน Overlay)
  const productUrl = await productLink.getAttribute('href');
  if (!productUrl) throw new Error('Product URL not found');
  await page.goto(productUrl, { waitUntil: 'networkidle' });

  // 3. เริ่มขั้นตอนการเลื่อนหน้าจอทีละนิด (ตั้งแต่ Header ถึง Footer)
  // วิธีนี้จะช่วยกระตุ้น Lazy Loading ให้รูปภาพแสดงผล ไม่เป็นสีเทา
  console.log('Scrolling through product details...');
  
  // ตั้งค่าขนาดหน้าจอให้เต็มมาตรฐาน
  await page.setViewportSize({ width: 1280, height: 800 });

  // เลื่อนลงทีละ 400px และหยุดรอเพื่อให้ Render รูปภาพและ Section ต่างๆ
  const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
  for (let i = 0; i < scrollHeight; i += 400) {
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(800); // รอให้ Content/รูปภาพ โหลดตามทัน
  }

  // 4. Assertion & Report
  const productTitle = page.locator('h1');
  await expect(productTitle).toBeVisible();
  
  const titleText = await productTitle.innerText();
  const descriptionTexts = await page.locator('h1 + div p, .product-details p').allInnerTexts();
  
  console.log('--- Product Detail Report ---');
  console.log(`Title: ${titleText}`);
  console.log(`Description: ${descriptionTexts.join(' ')}`);

  // 5. ถ่ายรูปหน้าจอแบบเต็มหน้าจอ (Full Page) เพื่อดูทุก Section
  // รูปภาพที่ได้จะเห็นตั้งแต่ Header, Body สินค้า จนถึง Footer
  await page.screenshot({ 
    path: `test-results/detail-${Date.now()}.png`, 
    fullPage: true 
  });
});