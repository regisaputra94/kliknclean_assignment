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
});
