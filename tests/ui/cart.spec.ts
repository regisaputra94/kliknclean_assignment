import { test, expect } from '../../fixtures/auth.fixture';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { products } from '../../fixtures/test-data';

test.describe('Shopping Cart', () => {
  test('adding a product to the cart updates the button state and badge count @smoke', async ({ loggedInPage }) => {
    const inventoryPage = new InventoryPage(loggedInPage);

    expect(await inventoryPage.getCartBadgeCount()).toBe(0);

    await inventoryPage.addProductToCart(products.backpack);

    expect(await inventoryPage.isProductInCart(products.backpack)).toBe(true);
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);
  });

  test('adding multiple products accumulates the badge count correctly', async ({ loggedInPage }) => {
    const inventoryPage = new InventoryPage(loggedInPage);

    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.addProductToCart(products.bikeLight);
    await inventoryPage.addProductToCart(products.onesie);

    expect(await inventoryPage.getCartBadgeCount()).toBe(3);

    const cartPage = new CartPage(loggedInPage);
    await inventoryPage.goToCart();
    expect(await cartPage.getItemCount()).toBe(3);
    expect(await cartPage.getItemNames()).toEqual(
      expect.arrayContaining([products.backpack, products.bikeLight, products.onesie])
    );
  });

  test('removing a product from the inventory page updates the badge and button state @smoke', async ({
    loggedInPage,
  }) => {
    const inventoryPage = new InventoryPage(loggedInPage);

    await inventoryPage.addProductToCart(products.backpack);
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);

    await inventoryPage.removeProductFromCart(products.backpack);

    expect(await inventoryPage.isProductInCart(products.backpack)).toBe(false);
    expect(await inventoryPage.getCartBadgeCount()).toBe(0);
  });

  test('removing a product from the cart page removes it from the cart and updates the badge', async ({
    loggedInPage,
  }) => {
    const inventoryPage = new InventoryPage(loggedInPage);
    const cartPage = new CartPage(loggedInPage);

    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.addProductToCart(products.bikeLight);
    await inventoryPage.goToCart();

    await cartPage.removeProduct(products.backpack);

    expect(await cartPage.getItemCount()).toBe(1);
    expect(await cartPage.getItemNames()).toEqual([products.bikeLight]);

    // Cart badge lives on the inventory page's header; navigate back to confirm
    // the removal persisted across pages rather than only updating local state.
    await cartPage.continueShopping();
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);
  });

  test('cart is empty by default for a fresh session', async ({ loggedInPage }) => {
    const cartPage = new CartPage(loggedInPage);
    await cartPage.open();
    expect(await cartPage.getItemCount()).toBe(0);
  });
});
