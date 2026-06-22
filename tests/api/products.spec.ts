import { test, expect } from '@playwright/test';
import { ProductListSchema, ProductSchema, CategoryListSchema } from '../../schemas/fakeStoreApi.schemas';
import { ApiClient } from '../../utils/ApiClient';

test.describe('API: Products', () => {
  test('GET /products returns the full catalog matching the schema @smoke', async ({ request }, testInfo) => {
    const api = new ApiClient(request, testInfo);

    const { body, response } = await api.get('/products');

    expect(response.status()).toBe(200);
    const result = ProductListSchema.safeParse(body);
    expect(result.success, result.success ? '' : JSON.stringify(result.error.issues)).toBe(true);

    const { body: catBody } = await api.get('/products/categories');
    const categories = catBody as string[];
    for (const product of body as { category: string }[]) {
      expect(categories).toContain(product.category);
    }
  });

  test('GET /products/1 returns a single product matching the schema', async ({ request }, testInfo) => {
    const api = new ApiClient(request, testInfo);
    const { body, response } = await api.get('/products/1');

    expect(response.status()).toBe(200);
    const result = ProductSchema.safeParse(body);
    expect(result.success, result.success ? '' : JSON.stringify(result.error.issues)).toBe(true);
    expect((body as { id: number }).id).toBe(1);
  });

  test('GET /products/:id with a non-numeric id does not return a valid product', async ({ request }, testInfo) => {
    const api = new ApiClient(request, testInfo);
    const { body, response } = await api.get('/products/not-a-number', { failOnStatusCode: false });

    if (response.ok()) {
      expect(ProductSchema.safeParse(body).success).toBe(false);
    } else {
      expect(response.status()).toBeGreaterThanOrEqual(400);
    }
  });

  test('GET /products/categories returns the expected non-empty category list @smoke', async ({ request }, testInfo) => {
    const api = new ApiClient(request, testInfo);
    const { body, response } = await api.get('/products/categories');

    expect(response.status()).toBe(200);
    const result = CategoryListSchema.safeParse(body);
    expect(result.success, result.success ? '' : JSON.stringify(result.error.issues)).toBe(true);

    const list = body as string[];
    expect(list.length).toBeGreaterThan(0);
    expect(new Set(list).size).toBe(list.length);
  });

  test('GET /products supports limit and sort query parameters', async ({ request }, testInfo) => {
    const api = new ApiClient(request, testInfo);

    const { body: limited } = await api.get('/products?limit=5');
    expect((limited as unknown[]).length).toBeLessThanOrEqual(5);

    const { body: ascending } = await api.get('/products?sort=asc');
    const ids = (ascending as { id: number }[]).map((p) => p.id);
    expect(ids).toEqual([...ids].sort((a, b) => a - b));
  });
});
