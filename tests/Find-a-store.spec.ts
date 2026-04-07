import { test, expect } from '@playwright/test';

test('Starbucks Thailand - Journey from Home to Find Store', async ({ page }) => {
  // ขยาย Timeout สำหรับขั้นตอนที่อาจใช้เวลานาน
  test.setTimeout(180000);

  // 1. ไปที่หน้า Home ก่อน
  await page.goto('https://www.starbucks.co.th/', { waitUntil: 'networkidle' });

  // 2. คลิกเมนู "Find a Store" ใน Navigation Bar
  // ใช้ getByRole เพื่อให้ตรงตามมาตรฐาน Accessibility
  const findStoreMenu = page.getByRole('navigation').getByRole('link', { name: 'Find a Store' });
  await findStoreMenu.click();

  // ตรวจสอบว่า URL เปลี่ยนไปหน้า find-a-store จริง
  await expect(page).toHaveURL(/.*find-a-store/);

  // 3. ค้นหาสาขา (เช่น Siam Paragon)
  const searchInput = page.getByRole('textbox', { name: 'Find a Store' });
  
  // แนะนำให้รอจนกว่าช่องค้นหาจะพร้อมพิมพ์
  await searchInput.waitFor({ state: 'visible' });
  await searchInput.fill('Siam Paragon');
  await searchInput.press('Enter');

  // 4. รอผลลัพธ์ที่เกี่ยวข้องปรากฏขึ้นมา
  // ใช้ regex /Siam Paragon/i เพื่อให้หาได้ครอบคลุม (Case-insensitive)
  const firstResult = page.getByRole('link', { name: /Siam Paragon/i }).first();
  
  await expect(firstResult).toBeVisible({ timeout: 15000 });
  await firstResult.click();

  // 5. ตรวจสอบว่าแผนที่ (Map Region) แสดงผล
  const googleMap = page.getByRole('region', { name: 'Map' });
  await expect(googleMap).toBeVisible({ timeout: 20000 });

  // (Optional) ถ่าย Screenshot ผลลัพธ์
  await page.screenshot({ path: 'test-results/starbucks-find-store.png', fullPage: true });
});