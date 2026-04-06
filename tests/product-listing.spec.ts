import { test, expect } from '@playwright/test';
//TS01 scenario for show the product listing page of starbucks website.
test('test', async ({ page }) => {
  await page.goto('https://starbucks.co.th/');
//click menu button
  await page.getByRole('link', { name: 'Menu' }).click();
//wait for manu laod
  await page.waitForLoadState('load');
  await page.waitForTimeout(2000);
//get page height
let lastHeight = await page.evaluate(() => document.body.scrollHeight);
// Scroll gradually from header to footer
  while (true) {
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(1000);
    
    let newHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    if (newHeight === lastHeight) break; // Reached footer
    lastHeight = newHeight;
  }
//scrool ที่ html element เพื่อให้โหลดรูปภาพของสินค้า
  await page.locator('html').evaluate(el => el.scrollTop = el.scrollHeight);
// Wait ให้ lazy load images
  await page.waitForTimeout(3000);
// scroll down to product listing
  await page.evaluate(() => window.scrollBy(0, 1000));
//wait  for image load
  await page.waitForTimeout(3000);
//take screenshot of product listing page
  await page.screenshot({ path: 'test-results/product-listing.png', fullPage: true });
  console.log('✅ Screenshot taken'); 
});