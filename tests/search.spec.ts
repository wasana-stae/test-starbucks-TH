import { test, expect } from '@playwright/test';

test('Navigate to Menu - Starbucks Thailand', async ({ page }) => {
  await page.goto('https://starbucks.co.th/');
  
  // 1. ไปที่หน้าเมนู
  await page.getByRole('link', { name: 'Menu', exact: true }).click();
  await expect(page).toHaveURL(/menu/);

  // 2. ระบุช่องค้นหาและพิมพ์คำค้นหา
  const searchInput = page.getByRole('searchbox', { name: 'Search' });
  await searchInput.fill('coffee');
  
  // กด Enter เพื่อความมั่นใจว่าระบบ Search ทำงาน
  await searchInput.press('Enter');

  // 3. ตรวจสอบผลลัพธ์
  // จาก Snapshot สินค้าจะอยู่ในรูปของ Link ที่มีชื่อสินค้า
  // เราจะหาทุกลิงก์ที่อยู่ในส่วนของเมนูสินค้า
  const products = page.locator('main >> role=link');
  
  // ใช้ Web-first Assertions (expect.toCount) 
  // ระบบจะรอ (Retry) จนกว่าสินค้าจะปรากฏขึ้นมาเองโดยไม่ต้อง waitForTimeout
  await expect(products.filter({ hasText: /coffee/i }).first()).toBeVisible();
  
  // ตรวจสอบว่ามีจำนวนสินค้าที่ค้นพบมากกว่า 0
  const count = await products.filter({ hasText: /coffee/i }).count();
  expect(count).toBeGreaterThan(0);
});