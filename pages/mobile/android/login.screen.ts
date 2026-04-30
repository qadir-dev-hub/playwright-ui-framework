import { $ } from '@wdio/globals';

export class LoginScreen {
  async login(username: string, password: string) {
    await this.usernameInput.setValue(username);
    await this.passwordInput.setValue(password);
    await this.loginButton.click();
  }

  async loginAsStandardUser() {
    await this.login('standard_user', 'secret_sauce');
  }

  private get usernameInput() {
    return $('~test-Username');
  }

  private get passwordInput() {
    return $('~test-Password');
  }

  private get loginButton() {
    return $('~test-LOGIN');
  }
}
