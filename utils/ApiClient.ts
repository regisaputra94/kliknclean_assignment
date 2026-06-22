import { APIRequestContext, TestInfo } from '@playwright/test';

/**
 * ApiClient membungkus `APIRequestContext` Playwright dan secara otomatis
 * mencatat setiap request + response ke dalam HTML report menggunakan
 * `testInfo.attach()`.
 *
 * Cara pakai di spec file:
 *
 *   import { ApiClient } from '../../utils/ApiClient';
 *
 *   test('GET /products', async ({ request }, testInfo) => {
 *     const api = new ApiClient(request, testInfo);
 *     const { body, response } = await api.get('/products');
 *     expect(response.status()).toBe(200);
 *   });
 *
 * Setiap test yang menggunakan ApiClient akan punya attachment di HTML report:
 *   - "REQUEST  GET /products"       → method, URL, headers, body (jika ada)
 *   - "RESPONSE GET /products"       → status, headers, body (JSON pretty-printed)
 */

interface RequestLog {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: unknown;
}

interface ResponseLog {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: unknown;
  durationMs: number;
}

export class ApiClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly testInfo: TestInfo,
  ) {}

  // ─── Public methods ─────────────────────────────────────────────────────────

  async get(path: string, options?: Parameters<APIRequestContext['get']>[1]) {
    return this._send('GET', path, undefined, options);
  }

  async post(path: string, data?: unknown, options?: Parameters<APIRequestContext['post']>[1]) {
    return this._send('POST', path, data, options);
  }

  async put(path: string, data?: unknown, options?: Parameters<APIRequestContext['put']>[1]) {
    return this._send('PUT', path, data, options);
  }

  async patch(path: string, data?: unknown, options?: Parameters<APIRequestContext['patch']>[1]) {
    return this._send('PATCH', path, data, options);
  }

  async delete(path: string, options?: Parameters<APIRequestContext['delete']>[1]) {
    return this._send('DELETE', path, undefined, options);
  }

  // Internal method untuk mengirim request dan mencatat log

  private async _send(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    path: string,
    data?: unknown,
    options?: Record<string, unknown>,
  ) {
    const mergedOptions = data ? { ...options, data } : options;

    // Catat request ke report
    const requestLog: RequestLog = {
      method,
      url: path,
      headers: (mergedOptions?.headers as Record<string, string>) ?? {},
      body: data,
    };
    await this._attach(`REQUEST  ${method} ${path}`, requestLog);

    // Kirim request & ukur durasi response
    const start = Date.now();
    const response = await this.request[method.toLowerCase() as 'get'](path, mergedOptions as never);
    const durationMs = Date.now() - start;

    // Parse response body sesuai content-type
    let body: unknown;
    const contentType = response.headers()['content-type'] ?? '';
    if (contentType.includes('application/json')) {
      body = await response.json().catch(() => '<tidak dapat di-parse sebagai JSON>');
    } else {
      body = await response.text().catch(() => '<tidak dapat dibaca sebagai teks>');
    }

    // Catat response ke report
    const responseLog: ResponseLog = {
      status: response.status(),
      statusText: response.statusText(),
      headers: response.headers() as Record<string, string>,
      body,
      durationMs,
    };
    await this._attach(`RESPONSE ${method} ${path} → ${response.status()} (${durationMs}ms)`, responseLog);

    return { response, body };
  }

  private async _attach(name: string, data: unknown) {
    await this.testInfo.attach(name, {
      contentType: 'application/json',
      body: JSON.stringify(data, null, 2),
    });
  }
}
