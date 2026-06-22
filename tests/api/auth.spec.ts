import { test, expect } from '@playwright/test';
import { AuthTokenSchema } from '../../schemas/fakeStoreApi.schemas';
import { ApiClient } from '../../utils/ApiClient';

test.describe('API: Auth', () => {
  test('POST /auth/login succeeds with valid credentials sourced from GET /users @smoke', async ({ request }, testInfo) => {
    const api = new ApiClient(request, testInfo);

    // Ambil username & password asli dari endpoint /users
    const { body: user } = await api.get('/users/1');
    const { username, password } = user as { username: string; password: string };

    const { body, response } = await api.post('/auth/login', { username, password });

    expect(response.status()).toBe(201);
    const result = AuthTokenSchema.safeParse(body);
    expect(result.success, result.success ? '' : JSON.stringify(result.error.issues)).toBe(true);
  });

  test('POST /auth/login is rejected with an incorrect password', async ({ request }, testInfo) => {
    const api = new ApiClient(request, testInfo);

    const { body: user } = await api.get('/users/1');
    const { username } = user as { username: string };

    const { body, response } = await api.post(
      '/auth/login',
      { username, password: 'definitely_wrong_password' },
      { failOnStatusCode: false },
    );

    expect(response.ok()).toBe(false);
    expect((body as Record<string, unknown>).token).toBeUndefined();
  });

  test('POST /auth/login is rejected with a non-existent username', async ({ request }, testInfo) => {
    const api = new ApiClient(request, testInfo);

    const { body, response } = await api.post(
      '/auth/login',
      { username: 'definitely_not_a_real_user_12345', password: 'whatever' },
      { failOnStatusCode: false },
    );

    expect(response.ok()).toBe(false);
    expect((body as Record<string, unknown>).token).toBeUndefined();
  });

  test('POST /auth/login is rejected when the request body is missing required fields', async ({ request }, testInfo) => {
    const api = new ApiClient(request, testInfo);

    const { response } = await api.post(
      '/auth/login',
      { username: 'standard_user_only' },
      { failOnStatusCode: false },
    );

    expect(response.ok()).toBe(false);
  });
});
