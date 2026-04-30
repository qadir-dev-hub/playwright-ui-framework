import { expect, Page } from '@playwright/test';

export class OtherPageElementsPage {
  constructor(private readonly page: Page) {}

  async gotoUrl(url: string, headerText?: string) {
    await this.page.goto(`/${url}`);

    if (headerText) {
      await expect(
        this.page.getByRole('heading', { name: headerText }),
      ).toBeVisible();
    }
  }

  async clickLeftNavItem(itemText: string) {
    await this.page
      .getByRole('link', { name: itemText, exact: true })
      .click();
  }
}
