import { test as base, expect } from '@playwright/test';
import { PracticeFormPage } from '../pages/practice-form.page';

type FrameworkFixtures = {
  practiceFormPage: PracticeFormPage;
};

export const test = base.extend<FrameworkFixtures>({
  practiceFormPage: async ({ page }, use) => {
    await use(new PracticeFormPage(page));
  },
});

export { expect };
