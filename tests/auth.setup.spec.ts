import fs from 'fs';
import path from 'path';
import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

const authFile = path.resolve(__dirname, '../playwright/.auth/student.json');

setup('authenticate as student and save storage state', async ({ page }) => {
  fs.mkdirSync(path.dirname(authFile), { recursive: true });

  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.loginAsStudent();
  await loginPage.expectLoginSuccess();

  await page.context().storageState({ path: authFile });
});
