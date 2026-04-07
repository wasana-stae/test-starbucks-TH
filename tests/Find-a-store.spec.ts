import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://starbucks.co.th/');
  await page.getByRole('link', { name: 'Find a Store' }).click();
  await page.getByText('Lotus Phuket 07:00 to 21:').click();
  await page.getByRole('link', { name: 'Lotus Phuket' }).click();
  await page.locator('.gm-style > div > div:nth-child(2)').click();
  await page.locator('.gm-style > div > div:nth-child(2)').click();
});