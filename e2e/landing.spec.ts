import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('renders the hero section with headline', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: /one quiet place for your whole day/i,
      })
    ).toBeVisible();
  });

  test('renders the brand name in navbar', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('DAYSPACE')).toBeVisible();
  });

  test('CTA button links to login page', async ({ page }) => {
    await page.goto('/');
    const cta = page.getByRole('link', { name: /enter workspace/i });
    await expect(cta).toBeVisible();
    await cta.click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('renders navigation links', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Features')).toBeVisible();
    await expect(page.getByText('How it works')).toBeVisible();
    await expect(page.getByText('Integrations')).toBeVisible();
    await expect(page.getByText('Pricing')).toBeVisible();
  });

  test('shows widget cards on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await expect(page.getByText('Live Clock')).toBeVisible();
    await expect(page.getByText("Today's Tasks")).toBeVisible();
    await expect(page.getByText('Calendar')).toBeVisible();
    await expect(page.getByText('Scratchpad')).toBeVisible();
  });

  test('shows feature badges at bottom', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Private by default')).toBeVisible();
    await expect(page.getByText('Syncs everywhere')).toBeVisible();
    await expect(page.getByText('Free to start')).toBeVisible();
  });
});
