import { test, expect } from '@playwright/test';

test('Product Detail - Accurate Report', async ({ page }) => {
  test.setTimeout(120000);

  // 1. ไปหน้าเมนู
  await page.goto('https://starbucks.co.th/menu/', { waitUntil: 'networkidle' });

  // 2. ระบุลิงก์สินค้าตัวแรก
  const firstProductLink = page.locator('main a[href*="/product/"]').first();
  await expect(firstProductLink).toBeVisible();

  // 3. แก้ไขจุดที่พัง: แทนที่จะคลิก (ซึ่งถูกบดบัง) ให้ดึง URL มาเปิดตรงๆ
  const productUrl = await firstProductLink.getAttribute('href');
  if (productUrl) {
    await page.goto(productUrl, { waitUntil: 'networkidle' });
  } else {
    throw new Error('Could not find product URL');
  }

  // 4. รอให้ชื่อสินค้าในหน้า Detail ปรากฏ (ใช้ Selector ที่ครอบคลุม)
  const productTitle = page.locator('h1, .product_title');
  await expect(productTitle).toBeVisible({ timeout: 20000 });

  // 5. เก็บข้อมูล
  const titleText = await productTitle.innerText();
  
  // ปรับการหา Description ให้ยืดหยุ่น (หา p ภายใน container หลักของ Detail)
  const descriptionLocator = page.locator('h1 + div p, .product-details p');
  const descriptionTexts = await descriptionLocator.allInnerTexts();
  const fullDescription = descriptionTexts.join(' ').trim();

  // 6. Report & Assertion
  console.log(`Product Title: ${titleText}`);
  console.log(`Description: ${fullDescription}`);

  expect(titleText.length).toBeGreaterThan(0);
  await page.screenshot({ path: 'test-results/product-detail-report.png', fullPage: true });
});