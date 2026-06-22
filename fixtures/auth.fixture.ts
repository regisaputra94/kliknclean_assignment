import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { users } from './test-data';

type AuthFixtures = {
  /** A page that is already logged in as standard_user and sitting on /inventory.html */
  loggedInPage: import('@playwright/test').Page;
};

export const test = base.extend<AuthFixtures>({
  loggedInPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory\.html/);
    await use(page);
  },
});

export { expect };
