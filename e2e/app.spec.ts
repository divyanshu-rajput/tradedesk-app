import { test, expect } from '@playwright/test';

import { gotoApp } from './helpers';

test.describe('unauthenticated', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('redirects to login when app session is missing', async ({ page }) => {
    await page.goto('/market-watch');
    await expect(page.getByRole('heading', { name: 'Welcome to TradeDesk' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in with Google' })).toBeVisible();
  });
});

test.describe('authenticated', () => {
  test('shows TradeDesk shell and Market Watch watchlist', async ({ page }) => {
    await gotoApp(page, '/market-watch');
    await expect(page.getByRole('columnheader', { name: 'Symbol' })).toBeVisible();
    await expect(page.getByText('BTC/USDT')).toBeVisible();
  });

  test('places a market order from Order Placement', async ({ page }) => {
    await gotoApp(page, '/order-placement');
    await expect(page.getByRole('heading', { name: 'Order Placement' })).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.getByRole('button', { name: 'Place order' })).toBeEnabled();
    await page.getByRole('button', { name: 'Place order' }).click();
    await expect(page.getByRole('heading', { name: 'Recent orders' })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText(/BUY BTC\/USDT/)).toBeVisible();
  });

  test('shows virtualized order history', async ({ page }) => {
    await gotoApp(page, '/order-history');
    await expect(page.getByRole('heading', { name: 'Order History' })).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.locator('.order-history-list__viewport')).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Time' })).toBeVisible();
    await expect(page.locator('.order-history-list__item').first()).toBeVisible({
      timeout: 15_000,
    });
  });

  test('shows order book depth for selected symbol', async ({ page }) => {
    await gotoApp(page, '/order-book');
    await expect(page.getByRole('heading', { name: 'Order Book' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Bids' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Asks' })).toBeVisible();
  });

  test('shows portfolio summary and holdings table', async ({ page }) => {
    await gotoApp(page, '/portfolio');
    await expect(page.getByRole('heading', { name: 'Portfolio' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'P&L' })).toBeVisible();
  });
});
