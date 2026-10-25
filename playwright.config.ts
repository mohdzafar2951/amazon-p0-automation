
import { defineConfig, devices } from '@playwright/test';
import testData from './Config/test-data.json';

export default defineConfig({
  testDir: './tests',

  fullyParallel: true,
  workers: process.env.CI ? 2 : undefined,

  // Amazon is a live third-party site, so CI receives two diagnostic retries.
  retries: process.env.CI ? 2 : 0,

  timeout: 60_000,

  reporter: [
    ['line'],
    ['html', { open: 'never' }],
    ['./reporters/excel-reporter.ts'],
  ],

  use: {
    ...devices['Desktop Chrome'],
    browserName: 'chromium',
    baseURL: process.env.BASE_URL ?? testData.baseUrl,
    // Set HEADED=true for local visual review; CI remains headless.
    headless: process.env.HEADED !== 'true',
    launchOptions: {
      slowMo: 250,
    },
    // Retain diagnostics only when a retry is needed.
    trace: 'on-first-retry',
    screenshot: 'on',
  },
});
