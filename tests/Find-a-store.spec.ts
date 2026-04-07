import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://starbucks.co.th/');
  await page.getByRole('link', { name: 'Find a Store' }).click();
});