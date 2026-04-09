import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { PracticeFormPage } from '../pages/practice-form.page';

type FrameworkFixtures = {
  loginPage: LoginPage;
  practiceFormPage: PracticeFormPage;
};

export const test = base.extend<FrameworkFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  practiceFormPage: async ({ page }, use) => {
    await use(new PracticeFormPage(page));
  },
});

export { expect };
