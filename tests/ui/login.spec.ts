import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { users, invalidLoginCases } from '../../fixtures/test-data';

test.describe('Authentication', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.open();
  });

  test('successful login navigates a standard user to the inventory page @smoke', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await loginPage.login(users.standard.username, users.standard.password);

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.inventoryItems.first()).toBeVisible();
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
  });

  for (const testCase of invalidLoginCases) {
    test(`invalid login is rejected: ${testCase.name} @smoke`, async ({ page }) => {
      await loginPage.login(testCase.username, testCase.password);

      await expect(loginPage.getErrorMessage()).resolves.toContain(testCase.expectedError);
      // User must stay on the login page; no session should be granted.
      await expect(page).toHaveURL('https://www.saucedemo.com/');
    });
  }

  test('error banner can be dismissed and does not block a subsequent valid login', async ({ page }) => {
    await loginPage.login('bad_user', 'bad_pass');
    expect(await loginPage.isErrorVisible()).toBe(true);

    await loginPage.dismissError();
    expect(await loginPage.isErrorVisible()).toBe(false);

    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory\.html/);
  });
});
