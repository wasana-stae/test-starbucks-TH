import { test, expect } from '@playwright/test';

test('Starbucks Thailand - Find Store and View Map', async ({ page }) => {
  // 1. ขยาย Timeout สำหรับการโหลดแผนที่
  test.setTimeout(180000);

  // 2. ไปที่หน้า Find a Store โดยตรง
  await page.goto('https://www.starbucks.co.th/find-a-store/', { waitUntil: 'networkidle' });

  // 3. Search for a store
  // Using user-facing locator for better stability
  const storeSearchInput = page.getByPlaceholder('Find a Store');
  await storeSearchInput.fill('Siam Paragon');
  await storeSearchInput.press('Enter');

  // 4. รอให้ผลลัพธ์ปรากฏและคลิกเลือกสาขาที่เจอ
  const firstStoreCard = page.locator('.store-item, [class*="storeCard"]').first();
  await expect(firstStoreCard).toBeVisible({ timeout: 15000 });
  await firstStoreCard.click();

  // 5. วิธีแก้ปัญหาแผนที่ไม่ขึ้น (สีเทา): เลื่อนหน้าจอแบบละเอียด (Header -> Body -> Footer)
  await page.setViewportSize({ width: 1280, height: 1000 });
  
  console.log('Scrolling to trigger Map rendering...');
  const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
  for (let i = 0; i < scrollHeight; i += 300) {
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(700); // หยุดรอให้ Tiles ของแผนที่โหลด
  }

  // 6. เจาะจงรอให้ Google Maps แสดงผล (gm-style คือ class มาตรฐานของ Google Maps)
  const googleMap = page.locator('.gm-style, iframe[title*="Map"]');
  await expect(googleMap.first()).toBeVisible({ timeout: 20000 });
  
  // รอ Network นิ่งอีกครั้งเพื่อให้ Pin และแผนที่แสดงครบ
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  // 7. เก็บข้อมูลชื่อสาขามาแสดงใน Report
  const storeTitle = await page.locator('h1, h2').first().innerText();
  console.log(`--- Store Locator Report ---`);
  console.log(`Target Store: ${storeTitle}`);

  // 8. ถ่ายรูป Full Page ให้เห็นทุก Section รวมถึงแผนที่ที่โหลดเสร็จแล้ว
  await page.screenshot({ 
    path: `test-results/store-locator-map.png`, 
    fullPage: true 
  });
});