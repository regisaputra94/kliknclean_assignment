import { test, expect } from '@playwright/test';
import { CartListSchema, ProductListSchema } from '../../schemas/fakeStoreApi.schemas';
import { ApiClient } from '../../utils/ApiClient';

test.describe('API: Carts', () => {
  test('GET /carts returns a list of valid cart objects @smoke', async ({ request }, testInfo) => {
    const api = new ApiClient(request, testInfo);
    const { body, response } = await api.get('/carts');

    expect(response.status()).toBe(200);
    const result = CartListSchema.safeParse(body);
    expect(result.success, result.success ? '' : JSON.stringify(result.error.issues)).toBe(true);
    expect((body as unknown[]).length).toBeGreaterThan(0);
  });

  test('every productId referenced in a cart corresponds to a real product (referential integrity)', async ({
    request,
  }, testInfo) => {
    const api = new ApiClient(request, testInfo);

    const { body: carts } = await api.get('/carts');
    const { body: products } = await api.get('/products');

    ProductListSchema.parse(products);
    const validProductIds = new Set((products as { id: number }[]).map((p) => p.id));

    const orphaned: { cartId: number; productId: number }[] = [];
    for (const cart of carts as { id: number; products: { productId: number }[] }[]) {
      for (const line of cart.products) {
        if (!validProductIds.has(line.productId)) {
          orphaned.push({ cartId: cart.id, productId: line.productId });
        }
      }
    }

    expect(orphaned, JSON.stringify(orphaned)).toEqual([]);
  });

  test('GET /carts/:id returns a single cart matching the schema', async ({ request }, testInfo) => {
    const api = new ApiClient(request, testInfo);
    const { body, response } = await api.get('/carts/1');

    expect(response.status()).toBe(200);
    expect((body as { id: number }).id).toBe(1);
    expect(Array.isArray((body as { products: unknown[] }).products)).toBe(true);
  });

  test('GET /carts/user/:userId returns only carts belonging to that user', async ({ request }, testInfo) => {
    const api = new ApiClient(request, testInfo);
    const { body, response } = await api.get('/carts/user/2');

    expect(response.status()).toBe(200);
    for (const cart of body as { userId: number }[]) {
      expect(cart.userId).toBe(2);
    }
  });

  test('GET /carts supports the limit query parameter', async ({ request }, testInfo) => {
    const api = new ApiClient(request, testInfo);
    const { body, response } = await api.get('/carts?limit=2');

    expect(response.status()).toBe(200);
    expect((body as unknown[]).length).toBeLessThanOrEqual(2);
  });
});
