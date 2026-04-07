import { test, expect } from '@playwright/test';

test('Starbucks Thailand - Find Store and Click to View on Map', async ({ page }) => {
  test.setTimeout(120000);

  // 1. ไปหน้าแรก และคลิกเมนู
  await page.goto('https://www.starbucks.co.th/', { waitUntil: 'networkidle' });
  await page.getByRole('navigation').getByRole('link', { name: 'Find a Store' }).click();

  // 2. ค้นหาสาขา
  const searchInput = page.getByRole('textbox', { name: 'Find a Store' });
  await searchInput.fill('Siam Paragon');
  await searchInput.press('Enter');

  // 3. คลิกเลือกสาขาแรก
  const firstResult = page.getByRole('link', { name: /Siam Paragon/i }).first();
  await firstResult.click();

  // 4. ตรวจสอบว่าแผนที่โหลดขึ้นมา (ตรวจสอบจากขอบเขตของ Region)
  const mapRegion = page.getByRole('region', { name: 'Map' });
  await expect(mapRegion).toBeVisible();

  // 5. วิธีที่ถูกต้อง: เช็ครายละเอียดสาขาใน "Side Panel" หรือ "Active State"
  // จาก snapshot ลิงก์ที่ถูกคลิกจะมีสถานะ [active] [ref=e171]
  await expect(firstResult).toHaveAttribute('class', /active/i);

  // 6. ตรวจสอบว่า Google Maps พร้อมใช้งาน (เช็คผ่านปุ่มควบคุมที่ต้องมีบน Map)
  // วิธีนี้ยืนยันได้ว่าแผนที่ Interactive แล้วจริงๆ
  await expect(page.getByRole('button', { name: 'Zoom in' })).toBeVisible({ timeout: 10000 });
  
  // (Alternative) ถ้าต้องการเช็คว่ามีรายละเอียดสาขาขึ้นมาจริงๆ 
  // ให้ลองหาจาก Selector ที่ระบุรายละเอียดที่เพิ่งปรากฏขึ้นมาใหม่หลังคลิก
  const storeDetailHeader = page.locator('h2, h3').filter({ hasText: /Siam Paragon/i }).first();
  await expect(storeDetailHeader).toBeVisible();
});