import { test, expect } from '@playwright/test';

test('Starbucks Menu - Fix Gray Images and Search', async ({ page }) => {
  test.setTimeout(180000); // ขยายเวลาเป็น 3 นาที

  // 1. ตั้งขนาดหน้าจอมาตรฐาน 1280x800
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('https://starbucks.co.th/menu/', { waitUntil: 'networkidle' });

  // 2. วิธีแก้ภาพสีเทา: ค่อยๆ เลื่อนลงและ "หยุดแช่"
  console.log('Scrolling to trigger all images...');
  const scrollSteps = 15; 
  for (let i = 0; i < scrollSteps; i++) {
    await page.mouse.wheel(0, 800); // เลื่อนลงทีละช่วง
    
    // สำคัญมาก: หยุดรอ 2 วินาทีเพื่อให้รูปเปลี่ยนจากสีเทาเป็นรูปจริง
    await page.waitForTimeout(2000); 
  }

  // 3. เริ่มขั้นตอนการค้นหา
  const searchInput = page.getByRole('searchbox', { name: 'Search' });
  await searchInput.fill('coffee');
  await searchInput.press('Enter');

  // 4. รอผลลัพธ์การค้นหา
  await page.waitForTimeout(2000);

  // 5. ถ่ายรูปหน้าจอแบบ Full Page
  // หมายเหตุ: จังหวะนี้วิดีโออาจจะมีการกระตุกเล็กน้อยเพราะ Playwright กำลังต่อภาพ
  const screenshotPath = `test-results/starbucks-search-result.png`;
  await page.screenshot({ path: screenshotPath, fullPage: true });

  console.log(`✅ Success! Please check the image: ${screenshotPath}`);
});