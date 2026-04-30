import { expect, Page } from '@playwright/test';

export class BrowserWindowsPage {
  constructor(private readonly page: Page) {}

  async clickButton(buttonText: string) {
    await this.page.getByRole('button', { name: buttonText, exact: true }).click();
  }

  async clickButtonAndSwitchToNewTab(buttonText: string) {
    const [newTab] = await Promise.all([
      this.page.waitForEvent('popup'),
      this.clickButton(buttonText),
    ]);

    await newTab.waitForLoadState();
    return newTab;
  }

  async expectSampleHeadingVisible(targetPage: Page) {
    await expect(targetPage.locator('#sampleHeading')).toHaveText(
      'This is a sample page',
    );
  }

  async expectBodyTextVisible(targetPage: Page, expectedText: string) {
    await expect(targetPage.locator('body')).toHaveText(expectedText);
  }
}
