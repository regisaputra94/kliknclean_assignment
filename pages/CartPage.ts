import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

function toSlug(productName: string): string {
  return productName
    .toLowerCase()
    .replace(/\(|\)/g, '')
    .replace(/\./g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  readonly cartItems = this.page.locator('.cart_item');
  readonly checkoutButton = this.page.locator('[data-test="checkout"]');
  readonly continueShoppingButton = this.page.locator('[data-test="continue-shopping"]');
  readonly itemNames = this.page.locator('.cart_item .inventory_item_name');

  async open() {
    await this.goto('/cart.html');
  }

  private removeButton(productName: string) {
    return this.page.locator(`[data-test="remove-${toSlug(productName)}"]`);
  }

  async removeProduct(productName: string) {
    await this.removeButton(productName).click();
  }

  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async getItemNames(): Promise<string[]> {
    return this.itemNames.allTextContents();
  }

  async goToCheckout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}
