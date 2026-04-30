import { expect, Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('https://practicetestautomation.com/practice-test-login/');
    await expect(
      this.page.getByRole('heading', { name: 'Test login' }),
    ).toBeVisible();
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async loginAsStudent() {
    await this.login('student', 'Password123');
  }

  async expectInvalidUsernameError() {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toHaveText('Your username is invalid!');
  }

  async expectInvalidPasswordError() {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toHaveText('Your password is invalid!');
  }

  async expectLoginSuccess() {
    await expect(this.page).toHaveURL(/logged-in-successfully/);
    await expect(
      this.page.getByText(/Congratulations|successfully logged in/i),
    ).toBeVisible();
    await expect(
      this.page.getByRole('link', { name: /log out/i }),
    ).toBeVisible();
  }

  get usernameInput() {
    return this.page.locator('#username');
  }

  get passwordInput() {
    return this.page.locator('#password');
  }

  get submitButton() {
    return this.page.locator('#submit');
  }

  get errorMessage() {
    return this.page.locator('#error');
  }
}
