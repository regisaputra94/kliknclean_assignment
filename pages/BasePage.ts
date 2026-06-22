import { Page } from '@playwright/test';

/**
 * BasePage holds behaviour every page object needs (navigation, the
 * hamburger menu, generic waits). Concrete page objects extend this so
 * common interactions aren't duplicated across the framework.
 */
export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path = '/') {
    await this.page.goto(path);
  }

  get burgerMenuButton() {
    return this.page.locator('#react-burger-menu-btn');
  }

  get logoutLink() {
    return this.page.locator('[data-test="logout-sidebar-link"]');
  }

  get resetAppStateLink() {
    return this.page.locator('[data-test="reset-sidebar-link"]');
  }

  async logout() {
    await this.burgerMenuButton.click();
    await this.logoutLink.click();
  }

  async resetAppState() {
    await this.burgerMenuButton.click();
    await this.resetAppStateLink.click();
    await this.page.locator('#react-burger-cross-btn').click();
  }
}
