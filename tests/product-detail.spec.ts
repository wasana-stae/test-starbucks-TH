import {test, expect} from '@playwright/test';

test('Product Detail - Accurate Report', async ({page}) => {
  test.setTimeout(120000);

  await page.goto('https://starbucks.co.th/product/Starbucks VIA™ Iced Coffee', {waitUntil: 'networkidle'});

  // 1. รอให้ชื่อสินค้าและรายละเอียดปรากฏขึ้นมา
  const productName = page.getByRole('heading', {name: /product name/i});
  const productDescription = page.getByText(/product description/i);
  
  await expect(productName).toBeVisible({timeout: 10000});
  await expect(productDescription).toBeVisible({timeout: 10000});

  // 2. เก็บข้อมูลชื่อสินค้าและรายละเอียด
  const nameText = await productName.innerText();
  const descriptionText = await productDescription.innerText();

  // 3. แสดงผล Report ใน Console เพื่อตรวจสอบ
  console.log('Product Name:', nameText);
  console.log('Product Description:', descriptionText);

  // 4. Assertion เพื่อให้เทสผ่าน/ตก ตามจริง
  expect(nameText).not.toBe('');
  expect(descriptionText).not.toBe('');

  // 5. ถ่ายรูปยืนยัน
  await page.screenshot({path: 'test-results/product-detail-report.png', fullPage: true});
});