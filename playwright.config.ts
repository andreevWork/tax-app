import { defineConfig, devices } from '@playwright/test';

const WEB_SERVER_PORT = 5173;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],

  webServer: {
    command: `npm run preview -- --port=${WEB_SERVER_PORT}`,
    port: WEB_SERVER_PORT,
    timeout: 60_000,
    reuseExistingServer: !process.env.CI,
  },

  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
