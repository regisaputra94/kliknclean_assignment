import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

/**
 * Converts a human-readable product name into the slug saucedemo uses in
 * its data-test attributes, e.g. "Sauce Labs Backpack" -> "sauce-labs-backpack".
 * Centralizing this means tests can keep referring to products by their
 * visible name (less brittle, reads better) instead of hardcoding slugs
 * all over the spec files.
 */
function toSlug(productName: string): string {
  return productName
    .toLowerCase()
    .replace(/\(|\)/g, '')
    .replace(/\./g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export class InventoryPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  readonly inventoryItems = this.page.locator('.inventory_item');
  readonly sortDropdown = this.page.locator('[data-test="product_sort_container"]');
  readonly cartBadge = this.page.locator('.shopping_cart_badge');
  readonly cartLink = this.page.locator('.shopping_cart_link');
  readonly itemNames = this.page.locator('.inventory_item_name');
  readonly itemPrices = this.page.locator('.inventory_item_price');

  async open() {
    await this.goto('/inventory.html');
  }

  isLoaded() {
    return this.page.locator('.inventory_list').isVisible();
  }

  private addButton(productName: string) {
    return this.page.locator(`[data-test="add-to-cart-${toSlug(productName)}"]`);
  }

  private removeButton(productName: string) {
    return this.page.locator(`[data-test="remove-${toSlug(productName)}"]`);
  }

  async addProductToCart(productName: string) {
    await this.addButton(productName).click();
  }

  async removeProductFromCart(productName: string) {
    await this.removeButton(productName).click();
  }

  async isProductInCart(productName: string): Promise<boolean> {
    return this.removeButton(productName).isVisible();
  }

  async getCartBadgeCount(): Promise<number> {
    if (!(await this.cartBadge.isVisible())) return 0;
    return Number(await this.cartBadge.textContent());
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async sortBy(option: SortOption) {
    await this.sortDropdown.selectOption(option);
  }

  async getDisplayedProductNames(): Promise<string[]> {
    return this.itemNames.allTextContents();
  }

  async getDisplayedPrices(): Promise<number[]> {
    const texts = await this.itemPrices.allTextContents();
    return texts.map((t) => Number(t.replace('$', '')));
  }
}
