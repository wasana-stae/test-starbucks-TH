import { test, expect } from '@playwright/test';

test('Starbucks Thailand - Find Store and View Map', async ({ page }) => {
  test.setTimeout(180000);

  await page.goto('https://www.starbucks.co.th/find-a-store/', { waitUntil: 'networkidle' });

  // Search
  const searchInput = page.getByRole('textbox', { name: 'Find a Store' });
  await searchInput.fill('Siam Paragon');
  await searchInput.press('Enter');

  // Wait for the results to update - searching for the specific store link
  // Note: /Siam Paragon/i is a case-insensitive regex match
  const firstResult = page.getByRole('link', { name: /Siam Paragon/i }).first();
  
  // Verify visibility and click
  await expect(firstResult).toBeVisible({ timeout: 15000 });
  await firstResult.click();

  // Verify the map area updates (optional but recommended)
  await expect(page.getByRole('region', { name: 'Map' })).toBeVisible();
});