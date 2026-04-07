import { test, expect } from '@playwright/test';

test('Product Detail - Accurate Report', async ({ page }) => {
  test.setTimeout(120000);

  await page.goto('https://starbucks.co.th/product/starbucks-via-iced-coffee', { waitUntil: 'networkidle' });

  // 1. ระบุชื่อสินค้า (H1)
  const productName = page.locator('h1');
  await expect(productName).toBeVisible({ timeout: 15000 });

  // 2. ระบุรายละเอียดสินค้า
  // จาก Snapshot: รายละเอียดอยู่ถัดจาก H1 ภายใน container (ref=e57) 
  // เราจะหา paragraph ทั้งหมดที่เกี่ยวข้อง
  const descriptionContainer = page.locator('h1 + div p, .product-details p'); 
  
  // 3. ตรวจสอบว่ารายละเอียดต้องปรากฏอย่างน้อย 1 ย่อหน้า
  await expect(descriptionContainer.first()).toBeVisible();

  // 4. ดึงข้อมูลมาทำ Report
  const nameText = await productName.innerText();
  // รวบรวมข้อความจากทุกย่อหน้ามาต่อกัน
  const descriptionTexts = await descriptionContainer.allInnerTexts();
  const fullDescription = descriptionTexts.join('\n').trim();

  console.log('--- Product Report ---');
  console.log('Name:', nameText);
  console.log('Description:', fullDescription);

  // 5. Assertion
  expect(nameText.length).toBeGreaterThan(0);
  expect(fullDescription.length).toBeGreaterThan(0);
  
  await page.screenshot({ path: 'test-results/product-detail-success.png', fullPage: true });
});