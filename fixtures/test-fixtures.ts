import { test as base, expect } from '@playwright/test';
import { BrowserWindowsPage } from '../pages/web/browser-windows.page';
import { CoursesPage } from '../pages/web/courses.page';
import { LoginPage } from '../pages/web/login.page';
import { OtherPageElementsPage } from '../pages/web/other-page-elements.page';
import { PracticeFormPage } from '../pages/web/practice-form.page';

type FrameworkFixtures = {
  browserWindowsPage: BrowserWindowsPage;
  coursesPage: CoursesPage;
  loginPage: LoginPage;
  otherPageElementsPage: OtherPageElementsPage;
  practiceFormPage: PracticeFormPage;
};

export const test = base.extend<FrameworkFixtures>({
  browserWindowsPage: async ({ page }, use) => {
    await use(new BrowserWindowsPage(page));
  },

  coursesPage: async ({ page }, use) => {
    await use(new CoursesPage(page));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  otherPageElementsPage: async ({ page }, use) => {
    await use(new OtherPageElementsPage(page));
  },

  practiceFormPage: async ({ page }, use) => {
    await use(new PracticeFormPage(page));
  },
});

export { expect };
