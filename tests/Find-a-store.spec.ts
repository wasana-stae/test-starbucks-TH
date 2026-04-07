import { test, expect } from '@playwright/test';

test('Starbucks Thailand - Find Store and Click to View on Map', async ({ page }) => {
  // ขยาย Timeout สำหรับการโหลดแผนที่ Google Maps
  test.setTimeout(120000);

  // 1. ไปที่หน้า Home
  await page.goto('https://www.starbucks.co.th/', { waitUntil: 'networkidle' });

  // 2. คลิกเมนู "Find a Store" จาก Navigation
  const findStoreMenu = page.getByRole('navigation').getByRole('link', { name: 'Find a Store' });
  await findStoreMenu.click();

  // 3. ค้นหาสาขา "Siam Paragon"
  const searchInput = page.getByRole('textbox', { name: 'Find a Store' });
  await searchInput.fill('Siam Paragon');
  await searchInput.press('Enter');

  // 4. เลือกสาขาจากรายการ (เช่น สาขาแรกที่เจอ)
  // การกดตรงนี้จะทำให้แผนที่ Focus ไปที่ตำแหน่งของสาขานั้น
  const firstResultLink = page.getByRole('link', { name: /Siam Paragon/i }).first();
  await expect(firstResultLink).toBeVisible();
  await firstResultLink.click();

  // 5. ตรวจสอบว่าหน้าจอแผนที่ (Map Region) อัปเดตและแสดงผล
  const mapRegion = page.getByRole('region', { name: 'Map' });
  await expect(mapRegion).toBeVisible({ timeout: 15000 });

  // 6. ตรวจสอบว่า "หมุด" หรือ "รายละเอียดสาขา" แสดงบนแผนที่
  // ปกติเมื่อคลิกสาขา แผนที่มักจะแสดงชื่อสาขาซ้ำอีกครั้งในรูปแบบ Info Window หรือ Marker
  // เราสามารถเช็คได้ว่ามีข้อความชื่อสาขาปรากฏอยู่ในส่วนของ Map หรือไม่
  const mapInfoContent = mapRegion.getByText(/Siam Paragon/i).first();
  await expect(mapInfoContent).toBeVisible();

  // (Optional) ตรวจสอบปุ่มนำทางหรือปุ่มขยายแผนที่เพื่อให้มั่นใจว่า Map โหลดเสร็จสมบูรณ์
  const zoomInButton = page.getByRole('button', { name: 'Zoom in' });
  await expect(zoomInButton).toBeVisible();
});