import { defineConfig, devices } from '@playwright/test';

declare const process: any;

/**
 * Two independent projects share one config:
 *  - "ui"  -> browser-driven tests against saucedemo.com (Page Object Model)
 *  - "api" -> headless HTTP tests against fakestoreapi.com (Playwright's
 *             `request` fixture, no browser context needed)
 *
 * Run everything:        npx playwright test
 * Run only UI:            npx playwright test --project=ui
 * Run only API:           npx playwright test --project=api
 */
export default defineConfig({
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],

  projects: [
    {
      name: 'ui',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://www.saucedemo.com',
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
      },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: 'https://fakestoreapi.com',
      },
    },
  ],
});
