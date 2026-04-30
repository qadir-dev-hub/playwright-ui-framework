import path from 'path';
import { test } from '@playwright/test';
import { LoggedInSuccessPage } from '../../pages/web/logged-in-success.page';

const authFile = path.resolve(__dirname, '../playwright/.auth/student.json');

test.use({ storageState: authFile });

test('user can open the logged-in page using saved storage state', async ({ page }, testInfo) => {
  const loggedInSuccessPage = new LoggedInSuccessPage(page);

  await loggedInSuccessPage.goto();
  await loggedInSuccessPage.expectLoaded();

  if (testInfo.project.use.isMobile) {
    await loggedInSuccessPage.openMobileMenu();
  }

  await loggedInSuccessPage.clickHome();
  await loggedInSuccessPage.expectHomePageLoaded();
  await loggedInSuccessPage.goBack();
  await loggedInSuccessPage.expectLoaded();
  await page.waitForTimeout(3000); // just to visually confirm that the user is still logged in before logging out
  await loggedInSuccessPage.logout();
  await loggedInSuccessPage.expectLoggedOut();
});
