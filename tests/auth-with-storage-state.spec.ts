import path from 'path';
import { expect, test } from '@playwright/test';

const authFile = path.resolve(__dirname, '../playwright/.auth/student.json');

test.use({ storageState: authFile });

test('user can open the logged-in page using saved storage state', async ({ page }) => {
  await page.goto('https://practicetestautomation.com/logged-in-successfully/');

  await expect(page).toHaveURL(/logged-in-successfully/);
  await expect(
    page.getByText(/Congratulations|successfully logged in/i),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: /log out/i }),
  ).toBeVisible();
});
