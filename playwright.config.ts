import { defineConfig, devices } from '@playwright/test';

const ciWebServerCommand =
  'firebase emulators:start --only auth,firestore,hosting --project tradedesk-e1956';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: 1,
  timeout: process.env['CI'] ? 180_000 : 30_000,
  expect: process.env['CI'] ? { timeout: 60_000 } : undefined,
  reporter: process.env['CI'] ? 'github' : 'html',
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
    actionTimeout: 30_000,
  },
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/, timeout: 240_000 },
    {
      name: 'chromium',
      testIgnore: /auth\.setup\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
  webServer: {
    command: process.env['CI'] ? ciWebServerCommand : 'npm run start -- --configuration=demo',
    url: 'http://localhost:4200/login',
    reuseExistingServer: !process.env['CI'],
    timeout: 300_000,
  },
});
