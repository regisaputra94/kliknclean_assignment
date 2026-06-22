import { test, expect } from '../../fixtures/auth.fixture';
import { InventoryPage } from '../../pages/InventoryPage';


test.describe('Product sorting (regression) @retest', () => {
  test('sorting by price low to high reorders the catalog correctly', async ({ loggedInPage }) => {
    const inventoryPage = new InventoryPage(loggedInPage);

    await inventoryPage.sortBy('lohi');

    const prices = await inventoryPage.getDisplayedPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('sorting by price high to low reorders the catalog correctly', async ({ loggedInPage }) => {
    const inventoryPage = new InventoryPage(loggedInPage);

    await inventoryPage.sortBy('hilo');

    const prices = await inventoryPage.getDisplayedPrices();
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  });

  test('sorting by name A to Z and Z to A reorders the catalog correctly', async ({ loggedInPage }) => {
    const inventoryPage = new InventoryPage(loggedInPage);

    await inventoryPage.sortBy('az');
    const namesAsc = await inventoryPage.getDisplayedProductNames();
    expect(namesAsc).toEqual([...namesAsc].sort((a, b) => a.localeCompare(b)));

    await inventoryPage.sortBy('za');
    const namesDesc = await inventoryPage.getDisplayedProductNames();
    expect(namesDesc).toEqual([...namesDesc].sort((a, b) => b.localeCompare(a)));
  });

  test('switching sort order does not change the number of products displayed', async ({ loggedInPage }) => {
    const inventoryPage = new InventoryPage(loggedInPage);

    const before = await inventoryPage.inventoryItems.count();
    await inventoryPage.sortBy('za');
    await inventoryPage.sortBy('hilo');
    const after = await inventoryPage.inventoryItems.count();

    expect(after).toBe(before);
  });
});
