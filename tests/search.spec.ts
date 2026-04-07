import { test, expect } from '@playwright/test';

test('Navigate to Menu - Starbucks Thailand', async ({ page }) => {
  await page.goto('https://starbucks.co.th/');
//Given go to click menu to shearch list of product
  await page.getByRole('link', { name: 'Menu' }).click();
  await expect(page).toHaveURL(/menu/);
//When click on search box and type "coffee"
  await page.getByPlaceholder('searchbox').click();
  await page.getByPlaceholder('searchbox').fill('coffee');
//Then show list of product that have "coffee" in name
  const productNames = await page.locator('.product-name').allTextContents();
  const filteredProducts = productNames.filter(name => name.toLowerCase().includes('coffee'));
  expect(filteredProducts.length).toBeGreaterThan(0);
});