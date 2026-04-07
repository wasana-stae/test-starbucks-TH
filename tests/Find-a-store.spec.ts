import { test, expect } from '@playwright/test';

test('Starbucks Thailand - Find Store and View Map', async ({ page }) => {
  test.setTimeout(180000);

  // 1. Navigate directly to the store finder
  await page.goto('https://www.starbucks.co.th/find-a-store/', { waitUntil: 'networkidle' });

  // 2. Search for the store using the textbox accessibility role or placeholder
  const searchInput = page.getByRole('textbox', { name: 'Find a Store' });
  await searchInput.click(); // Ensure focus
  await searchInput.fill('Siam Paragon');
  await searchInput.press('Enter');

  // 3. Wait for the specific store result card to appear
  // Based on your snapshot, links like "SIAMSCAPE" are available
  const siamParagonResult = page.locator('link', { hasText: 'SIAMSCAPE' }).first();
  await expect(siamParagonResult).toBeVisible({ timeout: 15000 });
  await siamParagonResult.click();

  // ... rest of your map loading logic ...
});