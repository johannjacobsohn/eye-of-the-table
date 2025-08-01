import { test, expect } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:4173'; // default vite port https://vite.dev/config/preview-options#preview-host

test.describe('Basic E2E', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.getByRole('heading', { name: /some dashboard/i })).toBeVisible();
  });
});
