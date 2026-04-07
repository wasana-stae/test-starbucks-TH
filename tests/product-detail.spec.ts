import { test, expect } from '@playwright/test';

test('Product Detail - Accurate Report', async ({ page }) => {
  test.setTimeout(120000);

  // 1. ไปหน้าเมนู
  await page.goto('https://starbucks.co.th/menu/', { waitUntil: 'networkidle' });

  // 2. ระบุลิงก์สินค้าตัวแรก
  const firstProductLink = page.locator('main a[href*="/product/"]').first();
  
  // 3. แก้ไขจุดที่พัง: ใช้ force: true เพื่อข้ามตัวบดบัง (image-zoom div)
  // และใช้ scrollIntoViewIfNeeded เพื่อความเสถียร
  await firstProductLink.scrollIntoViewIfNeeded();
  await firstProductLink.click({ force: true });

  // 4. รอให้หน้ารายละเอียดโหลด
  // จาก Snapshot: ชื่อสินค้าในหน้า detail คือ <h1> (ref=e56)
  const productTitle = page.locator('h1');
  await expect(productTitle).toBeVisible({ timeout: 20000 });

  // 5. เก็บข้อมูล (ปรับ Selector ตาม Snapshot จริง)
  const titleText = await productTitle.innerText();
  
  // รายละเอียดสินค้าใน Snapshot อยู่ใน paragraph (ref=e58, e59) ภายใต้ container ต่อจาก h1
  const descriptionLocator = page.locator('h1 + div p'); 
  const descriptionTexts = await descriptionLocator.allInnerTexts();
  const fullDescription = descriptionTexts.join(' ').trim();

  // 6. แสดงผล Report
  console.log(`Product Title: ${titleText}`);
  console.log(`Description: ${fullDescription}`);

  // 7. Assertions
  expect(titleText.length).toBeGreaterThan(0);
  expect(fullDescription.length).toBeGreaterThan(0);

  // ถ่ายรูปยืนยัน
  await page.screenshot({ path: 'test-results/product-detail-report.png', fullPage: true });
});