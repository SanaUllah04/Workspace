import { test, expect } from '@playwright/test';

test.describe('Bookshelf', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByRole('button', { name: /toggle bookshelf/i }).click();
    await expect(
      page.getByRole('heading', { name: 'Bookshelf' })
    ).toBeVisible();
  });

  test('renders sample books on the shelf', async ({ page }) => {
    await expect(page.getByText('The Art of Focus')).toBeVisible();
    await expect(page.getByText('Notes on Notes')).toBeVisible();
    await expect(page.getByText('Calendar Zen')).toBeVisible();
  });

  test('add a new book', async ({ page }) => {
    await page.getByRole('button', { name: /add new book/i }).click();
    const input = page.getByPlaceholder('Book name…');
    await input.fill('My E2E Book');
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByText('My E2E Book')).toBeVisible();
  });

  test('open a book and read its content', async ({ page }) => {
    await page.getByRole('button', { name: /open the art of focus/i }).click();
    await expect(page.getByText('Back to shelf')).toBeVisible();
    await expect(
      page.getByText(/in a world of endless distractions/i)
    ).toBeVisible();
  });

  test('navigate back from reading view', async ({ page }) => {
    await page.getByRole('button', { name: /open the art of focus/i }).click();
    await page.getByText('Back to shelf').click();
    await expect(
      page.getByRole('heading', { name: 'Bookshelf' })
    ).toBeVisible();
  });

  test('close bookshelf panel', async ({ page }) => {
    await page.getByRole('button', { name: /close bookshelf/i }).click();
    await expect(
      page.getByRole('heading', { name: 'Bookshelf' })
    ).not.toBeVisible();
  });
});
