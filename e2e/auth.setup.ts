import { expect, test as setup } from '@playwright/test';

import { APP_SESSION_KEY } from './helpers';

const authFile = 'e2e/.auth/user.json';
const bootTimeout = 60_000;

setup('authenticate as guest', async ({ page }) => {
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.error(`[browser] ${msg.text()}`);
    }
  });

  await page.goto('/login', { waitUntil: 'domcontentloaded' });

  await expect(page.getByRole('heading', { name: 'Welcome to TradeDesk' })).toBeVisible({
    timeout: bootTimeout,
  });
  await expect(page.getByRole('button', { name: 'Continue as guest' })).toBeEnabled({
    timeout: bootTimeout,
  });

  await page.getByRole('button', { name: 'Continue as guest' }).click();

  await expect(page.getByRole('heading', { name: 'Market Watch' })).toBeVisible({
    timeout: bootTimeout,
  });
  await page.waitForFunction(
    (sessionKey) => sessionStorage.getItem(sessionKey) === '1',
    APP_SESSION_KEY,
    { timeout: 30_000 },
  );
  await page.context().storageState({ path: authFile });
});
