import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private readonly usernameInput = this.page.locator('[data-test="username"]');
  private readonly passwordInput = this.page.locator('[data-test="password"]');
  private readonly loginButton = this.page.locator('[data-test="login-button"]');
  private readonly errorMessage = this.page.locator('[data-test="error"]');
  private readonly errorCloseButton = this.page.locator('.error-button');

  async open() {
    await this.goto('/');
  }

  async login(username: string, password: string) {
    // .fill() clears first, which avoids leftover characters from a
    // previous test bleeding into the next assertion.
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent())?.trim() ?? '';
  }

  async isErrorVisible(): Promise<boolean> {
    return this.errorMessage.isVisible();
  }

  async dismissError() {
    await this.errorCloseButton.click();
  }
}
