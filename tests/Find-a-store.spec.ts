import { test, expect } from '@playwright/test';

test('Product Detail - Accurate Report with Smooth Scroll', async ({ page }) => {
  test.setTimeout(180000); // เผื่อเวลารอโหลดและเลื่อนหน้าจอ

  // 1. ค้นหาชื่อสินค้า (Search)
  await page.goto('https://starbucks.co.th/menu/', { waitUntil: 'networkidle' });
  const searchInput = page.getByRole('searchbox', { name: 'Search' });
  await searchInput.fill('VIA'); // ตัวอย่างสินค้า VIA™ Iced Coffee
  await searchInput.press('Enter');

  // 2. เจอรายการสินค้าและคลิกตัวแรก (Select)
  const productLink = page.locator('main a[href*="/product/"]').first();
  await expect(productLink).toBeVisible({ timeout: 10000 });
  
  // ใช้ page.goto จาก href เพื่อเลี่ยงปัญหา Overlay บดบังปุ่มคลิก
  const productUrl = await productLink.getAttribute('href');
  if (!productUrl) throw new Error('Product URL not found');
  await page.goto(productUrl, { waitUntil: 'networkidle' });

  // 3. เลื่อนหน้าจอทีละนิด (Header -> Body -> Footer)
  // เพื่อแสดงผลทุก Section และแก้ปัญหารูปภาพสีเทา (Lazy Loading)
  await page.setViewportSize({ width: 1280, height: 800 });
  
  const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
  for (let i = 0; i < scrollHeight; i += 350) { // เลื่อนทีละ 350px
    await page.mouse.wheel(0, 350);
    await page.waitForTimeout(600); // รอให้ภาพ Render
  }

  // 4. ดึงข้อมูลรายละเอียดสินค้า
  const productName = page.locator('h1');
  // หา Paragraph ทั้งหมดที่เป็นรายละเอียดต่อจากชื่อสินค้า
  const productDescription = page.locator('h1 + div p, .product-details p');

  await expect(productName).toBeVisible();
  const nameText = await productName.innerText();
  const descText = (await productDescription.allInnerTexts()).join('\n');

  console.log('--- Product Details ---');
  console.log('Name:', nameText);
  console.log('Description:', descText);

  // 5. ถ่ายรูปหน้าจอแบบเต็ม (Full Page) ให้เห็นทุก Section พร้อมรูปภาพ
  await page.screenshot({ 
    path: `test-results/accurate-product-report.png`, 
    fullPage: true 
  });

  expect(nameText.length).toBeGreaterThan(0);
});