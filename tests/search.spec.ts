import { test, expect } from '@playwright/test';

test('Navigate to Menu and Search - Accurate Report', async ({ page }) => {
  test.setTimeout(120000);

  await page.goto('https://starbucks.co.th/menu/', { waitUntil: 'networkidle' });

  // 1. ระบุช่องค้นหาและพิมพ์คำว่า coffee
  const searchInput = page.getByRole('searchbox', { name: 'Search' });
  await searchInput.fill('coffee');
  await searchInput.press('Enter');

  // 2. --- จุดสำคัญ: รอให้ UI อัปเดตผลลัพธ์ ---
  // เราจะรอให้สินค้าตัวแรกที่มีคำว่า Coffee ปรากฏขึ้นมาก่อน
  // วิธีนี้จะช่วยให้มั่นใจว่าระบบ Search ทำงานเสร็จแล้วก่อนเก็บข้อมูล
  const productLinks = page.locator('main a[href*="/product/"]');
  await expect(productLinks.filter({ hasText: /coffee/i }).first()).toBeVisible({ timeout: 10000 });

  // 3. เก็บข้อมูลชื่อสินค้าทั้งหมดที่แสดงอยู่บนหน้าจอ ณ ตอนนั้น
  // ปรับ Selector ให้ดึงจาก text ภายในลิงก์สินค้าโดยตรง
  const allProductsOnPage = await productLinks.allInnerTexts();
  
  // 4. กรองข้อมูลเฉพาะตัวที่มีคำว่า "coffee" (Case-insensitive)
  const filteredReport = allProductsOnPage.filter(name => 
    name.toLowerCase().includes('coffee')
  );

  // 5. แสดงผล Report ใน Console เพื่อตรวจสอบ
  console.log(`Found ${filteredReport.length} products matching "coffee"`);
  console.log('Product List:', filteredReport);

  // 6. Assertion เพื่อให้เทสผ่าน/ตก ตามจริง
  expect(filteredReport.length).toBeGreaterThan(0);

  // 7. ถ่ายรูปยืนยัน
  await page.screenshot({ path: 'test-results/search-report.png', fullPage: true });
});