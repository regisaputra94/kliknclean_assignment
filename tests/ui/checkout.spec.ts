import { test, expect } from '../../fixtures/auth.fixture';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { products, checkoutInfo } from '../../fixtures/test-data';

test.describe('Checkout', () => {
  test('completes the full checkout flow for a single item @smoke', async ({ loggedInPage }) => {
    const inventoryPage = new InventoryPage(loggedInPage);
    const cartPage = new CartPage(loggedInPage);
    const checkoutPage = new CheckoutPage(loggedInPage);

    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.goToCart();
    await cartPage.goToCheckout();

    await checkoutPage.fillCustomerInfo(
      checkoutInfo.valid.firstName,
      checkoutInfo.valid.lastName,
      checkoutInfo.valid.postalCode
    );
    await checkoutPage.continueToOverview();

    // Sanity-check the price math before completing the order: subtotal +
    // tax should equal the displayed total, catching silent pricing bugs.
    const totals = await checkoutPage.getTotals();
    expect(totals.subtotal).toBeGreaterThan(0);
    expect(Math.round((totals.subtotal + totals.tax) * 100) / 100).toBeCloseTo(totals.total, 2);

    await checkoutPage.finishOrder();

    expect(await checkoutPage.getCompletionMessage()).toBe('Thank you for your order!');
    await expect(loggedInPage).toHaveURL(/checkout-complete\.html/);
  });

  test('completes checkout for multiple items and preserves them through the flow', async ({ loggedInPage }) => {
    const inventoryPage = new InventoryPage(loggedInPage);
    const cartPage = new CartPage(loggedInPage);
    const checkoutPage = new CheckoutPage(loggedInPage);

    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.addProductToCart(products.fleeceJacket);
    await inventoryPage.goToCart();
    expect(await cartPage.getItemCount()).toBe(2);

    await cartPage.goToCheckout();
    await checkoutPage.fillCustomerInfo(
      checkoutInfo.valid.firstName,
      checkoutInfo.valid.lastName,
      checkoutInfo.valid.postalCode
    );
    await checkoutPage.continueToOverview();

    await expect(checkoutPage.overviewItems).toHaveCount(2);

    await checkoutPage.finishOrder();
    expect(await checkoutPage.getCompletionMessage()).toBe('Thank you for your order!');
  });

  test('blocks checkout when required customer information is missing', async ({ loggedInPage }) => {
    const inventoryPage = new InventoryPage(loggedInPage);
    const cartPage = new CartPage(loggedInPage);
    const checkoutPage = new CheckoutPage(loggedInPage);

    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.goToCart();
    await cartPage.goToCheckout();

    // Leave all fields empty.
    await checkoutPage.continueToOverview();

    expect(await checkoutPage.getStepOneError()).toContain('First Name is required');
    await expect(loggedInPage).toHaveURL(/checkout-step-one\.html/);
  });

  test('cancelling from the customer info step returns to the cart', async ({ loggedInPage }) => {
    const inventoryPage = new InventoryPage(loggedInPage);
    const cartPage = new CartPage(loggedInPage);
    const checkoutPage = new CheckoutPage(loggedInPage);

    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.goToCart();
    await cartPage.goToCheckout();

    await checkoutPage.cancel();

    await expect(loggedInPage).toHaveURL(/cart\.html/);
    expect(await cartPage.getItemCount()).toBe(1); // cancelling must not clear the cart
  });
});
