import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://starbucks.co.th');
  await page.getByRole('link', { name: 'Menu' }).click();
    await expect(page.getByRole('heading', { name: 'Menu' })).toBeVisible();

  test('Scroll product page by section', async ({ page }) => {
  await page.goto('https://your-product-page-url.com');

  // รอหน้าโหลด
  await page.waitForLoadState('load');

  // ===== HEADER =====
  const header = page.locator('header');
  await header.scrollIntoViewIfNeeded();
  console.log('Viewing HEADER');
  await page.waitForTimeout(9000); // 9 วินาที

  // ===== BODY =====
  const body = page.locator('main'); // หรือ div content หลัก
  await body.scrollIntoViewIfNeeded();
  console.log('Viewing BODY');
  await page.waitForTimeout(9000);

  // ===== FOOTER =====
  const footer = page.locator('footer');
  await footer.scrollIntoViewIfNeeded();
  console.log('Viewing FOOTER');
  await page.waitForTimeout(9000);
});
