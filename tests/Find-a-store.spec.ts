import { test, expect } from '@playwright/test';

test('Starbucks Thailand - Find Store and Click to View on Map', async ({ page }) => {
  test.setTimeout(120000);

  // ขั้นตอนการนำทางและค้นหา (เหมือนเดิม)
  await page.goto('https://www.starbucks.co.th/', { waitUntil: 'networkidle' });
  await page.getByRole('navigation').getByRole('link', { name: 'Find a Store' }).click();

  const searchInput = page.getByRole('textbox', { name: 'Find a Store' });
  await searchInput.fill('Siam Paragon');
  await searchInput.press('Enter');

  // 1. ระบุ Locator ของสาขาเป้าหมาย
  const targetStoreLink = page.getByRole('link', { name: 'Siam Paragon-3rd fl.' }).first();
  await targetStoreLink.click();

  // 2. FIX: ตรวจสอบว่ารายละเอียดสาขาปรากฏขึ้น (ใช้ getByText แทน getByRole heading)
  // เราจะเช็คว่ามีข้อความ "Siam Paragon" ปรากฏอยู่ในหน้าจอ (มักจะอยู่ใน Store Info Panel)
  // ใช้ .first() หากมีข้อความซ้ำกันหลายจุด
  await expect(page.getByText('Siam Paragon-3rd fl.').first()).toBeVisible({ timeout: 10000 });

  // 3. ยืนยันการแสดงผลบนแผนที่ (ตรวจสอบจากปุ่มควบคุมแผนที่)
  // นี่คือวิธีที่ Playwright แนะนำในการเช็คว่า Content ภายนอก (Google Maps) โหลดเสร็จแล้ว
  const zoomInButton = page.getByRole('button', { name: 'Zoom in' });
  await expect(zoomInButton).toBeVisible();
  
  // 4. (Optional) เช็คสถานะเวลาเปิด-ปิด เพื่อยืนยันว่า Info Panel แสดงข้อมูลครบถ้วน
  await expect(page.getByText(/Closed|Open/i).first()).toBeVisible();
});