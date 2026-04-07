import { test, expect } from '@playwright/test';

test('Product Detail - Accurate Report', async ({ page }) => {
  test.setTimeout(120000);

  // given: ไปที่หน้ารายละเอียดสินค้าตัวแรกในเมนู
  await page.goto('https://starbucks.co.th/menu/', { waitUntil: 'networkidle' });
  const firstProductLink = page.locator('main a[href*="/product/"]').first();
  await firstProductLink.click();

  // when: รอให้หน้ารายละเอียดโหลดและแสดงข้อมูลครบถ้วน
  const productTitle = page.locator('h1'); // สมมติว่าชื่อสินค้าจะอยู่ใน h1
  await expect(productTitle).toBeVisible({ timeout: 10000 });

  // then: เก็บข้อมูลชื่อสินค้าและรายละเอียดอื่นๆ ที่สำคัญ
  const titleText = await productTitle.innerText();
  const description = await page.locator('.product-description').innerText(); // สมมติว่าคำอธิบายอยู่ในคลาสนี้

  // แสดงผล Report ใน Console เพื่อตรวจสอบ
  console.log(`Product Title: ${titleText}`);
  console.log(`Description: ${description}`);

  // Assertion เพื่อให้เทสผ่าน/ตก ตามจริง
  expect(titleText.length).toBeGreaterThan(0);
  expect(description.length).toBeGreaterThan(0);

  // ถ่ายรูปยืนยัน
  await page.screenshot({ path: 'test-results/product-detail-success.png', fullPage: true });
});