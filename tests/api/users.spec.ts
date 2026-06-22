import { test, expect } from '@playwright/test';
import { UserListSchema, UserSchema } from '../../schemas/fakeStoreApi.schemas';
import { ApiClient } from '../../utils/ApiClient';

test.describe('API: Users', () => {
  test('GET /users returns a list of valid user objects @smoke', async ({ request }, testInfo) => {
    const api = new ApiClient(request, testInfo);
    const { body, response } = await api.get('/users');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const result = UserListSchema.safeParse(body);
    expect(result.success, result.success ? '' : JSON.stringify(result.error.issues)).toBe(true);
    expect((body as unknown[]).length).toBeGreaterThan(0);
  });

  test('GET /users/1 returns a single user matching the schema and usable credentials', async ({ request }, testInfo) => {
    const api = new ApiClient(request, testInfo);
    const { body, response } = await api.get('/users/1');

    expect(response.status()).toBe(200);

    const result = UserSchema.safeParse(body);
    expect(result.success, result.success ? '' : JSON.stringify(result.error.issues)).toBe(true);

    const user = body as { username: string; password: string };
    expect(user.username).toBeTruthy();
    expect(user.password).toBeTruthy();
  });

  test('GET /users/:id with a non-existent id does not return a valid user payload', async ({ request }, testInfo) => {
    const api = new ApiClient(request, testInfo);
    const { body, response } = await api.get('/users/99999');

    expect(response.ok()).toBe(true);
    expect(UserSchema.safeParse(body).success).toBe(false);
  });

  test('GET /users supports the limit query parameter', async ({ request }, testInfo) => {
    const api = new ApiClient(request, testInfo);
    const { body, response } = await api.get('/users?limit=3');

    expect(response.status()).toBe(200);
    expect((body as unknown[]).length).toBeLessThanOrEqual(3);
  });
});
