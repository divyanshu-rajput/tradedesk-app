import { expect, type Page } from '@playwright/test';

export const APP_SESSION_KEY = 'tradedesk.app-session';

/** Ensures the guest session flag survives cold Angular bootstraps in Playwright. */
export async function ensureGuestSession(page: Page): Promise<void> {
  await page.addInitScript((sessionKey) => {
    sessionStorage.setItem(sessionKey, '1');
  }, APP_SESSION_KEY);
}

/**
 * Navigate to an authenticated route. Re-authenticates as guest if the auth
 * guard sends us back to login (Firebase emulator auth can lag on later CI runs).
 */
export async function gotoApp(page: Page, path: string): Promise<void> {
  await ensureGuestSession(page);
  await page.goto(path, { waitUntil: 'domcontentloaded' });

  if (page.url().includes('/login')) {
    const guestButton = page.getByRole('button', { name: 'Continue as guest' });
    await expect(guestButton).toBeEnabled({ timeout: 60_000 });
    await guestButton.click();
    await expect(page).not.toHaveURL(/\/login(\?|$)/, { timeout: 60_000 });
    await page.goto(path, { waitUntil: 'domcontentloaded' });
  }
}
