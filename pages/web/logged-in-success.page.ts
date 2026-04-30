import { expect, Page } from '@playwright/test';

export class LoggedInSuccessPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto(
      'https://practicetestautomation.com/logged-in-successfully/',
    );
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/logged-in-successfully/);
    await expect(this.successMessage).toBeVisible();
    await expect(this.logoutLink).toBeVisible();
  }

  async openMobileMenu() {
    await this.mobileMenuButton.click();
    await expect(this.homeLink).toBeVisible();
  }

  async clickHome() {
    await this.homeLink.click();
  }

  async expectHomePageLoaded() {
    await expect(this.page).toHaveURL('https://practicetestautomation.com/');
  }

  async goBack() {
    await this.page.goBack();
  }

  async logout() {
    await this.logoutLink.click();
  }

  async expectLoggedOut() {
    await expect(this.page).toHaveURL(/practice-test-login/);
    await expect(
      this.page.getByRole('heading', { name: 'Test login' }),
    ).toBeVisible();
  }

  get successMessage() {
    return this.page.getByText(/Congratulations|successfully logged in/i);
  }

  get mobileMenuButton() {
    return this.page.getByRole('button', { name: 'open menu' });
  }

  get homeLink() {
    return this.page.getByRole('link', { name: 'Home', exact: true });
  }

  get logoutLink() {
    return this.page.getByRole('link', { name: /log out/i });
  }
}
