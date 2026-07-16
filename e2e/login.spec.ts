import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test('renders the login form with pre-filled credentials', async ({
    page,
  }) => {
    await page.goto('/login');
    await expect(page.getByLabel('Email')).toHaveValue('demo@dayspace.app');
    await expect(page.getByLabel('Password')).toHaveValue('dayspace123');
  });

  test('shows error for wrong credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('wrong@email.com');
    await page.getByLabel('Password').fill('wrongpass');
    await page.getByRole('button', { name: /log in/i }).click();
    await expect(
      page.getByText('Invalid email or password. Try the demo credentials.')
    ).toBeVisible();
  });

  test('successful login shows welcome message and redirects to dashboard', async ({
    page,
  }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /log in/i }).click();
    await expect(page.getByText(/this workspace belongs to you/i)).toBeVisible({
      timeout: 5000,
    });
    await page.waitForURL('/dashboard', { timeout: 10000 });
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('renders DAYSPACE branding', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('DAYSPACE')).toBeVisible();
  });

  test('shows demo credentials hint', async ({ page }) => {
    await page.goto('/login');
    await expect(
      page.getByText('Demo credentials are pre-filled — just hit Log In.')
    ).toBeVisible();
  });
});
