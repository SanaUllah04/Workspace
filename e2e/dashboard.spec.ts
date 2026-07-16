import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('renders all toggle buttons', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: /toggle calendar panel/i })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /toggle tasks panel/i })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /toggle notepad/i })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /toggle bookshelf/i })
    ).toBeVisible();
  });

  test('clock updates over time', async ({ page }) => {
    const timeEl = page.locator('.font-fraunces.text-lg').first();
    const initialText = await timeEl.textContent();
    await page.waitForTimeout(2000);
    const updatedText = await timeEl.textContent();
    expect(initialText).not.toBe(updatedText);
  });

  test('toggle calendar panel open and close', async ({ page }) => {
    const calendarBtn = page.getByRole('button', {
      name: /toggle calendar panel/i,
    });

    await calendarBtn.click();
    await expect(page.getByText(/connect google calendar/i)).toBeVisible();

    await calendarBtn.click();
    await expect(page.getByText(/connect google calendar/i)).not.toBeVisible();
  });

  test('toggle tasks panel and perform CRUD', async ({ page }) => {
    const tasksBtn = page.getByRole('button', {
      name: /toggle tasks panel/i,
    });

    await tasksBtn.click();
    await expect(page.getByText('Tasks & Reminders')).toBeVisible();

    // Add a task
    await page.getByPlaceholder('Add a task...').fill('E2E test task');
    await page.getByRole('button', { name: /add task/i }).click();
    await expect(page.getByText('E2E test task')).toBeVisible();

    // Toggle completion
    const newTaskToggle = page
      .getByText('E2E test task')
      .locator('..')
      .getByRole('button', { name: /mark as done/i });
    await newTaskToggle.click();

    // Delete the task
    const deleteBtn = page.getByRole('button', {
      name: /delete e2e test task/i,
    });
    await deleteBtn.click();
    await expect(page.getByText('E2E test task')).not.toBeVisible();
  });

  test('toggle notepad panel', async ({ page }) => {
    const notepadBtn = page.getByRole('button', {
      name: /toggle notepad/i,
    });

    await notepadBtn.click();
    await expect(page.getByText('Scratchpad')).toBeVisible();

    const textarea = page.getByPlaceholder('Jot something down…');
    await textarea.fill('Hello from E2E test');
    await expect(page.getByText('22 characters')).toBeVisible();
  });

  test('toggle bookshelf panel', async ({ page }) => {
    const bookshelfBtn = page.getByRole('button', {
      name: /toggle bookshelf/i,
    });

    await bookshelfBtn.click();
    await expect(
      page.getByRole('heading', { name: 'Bookshelf' })
    ).toBeVisible();
  });

  test('only one panel open at a time', async ({ page }) => {
    const calendarBtn = page.getByRole('button', {
      name: /toggle calendar panel/i,
    });
    const tasksBtn = page.getByRole('button', {
      name: /toggle tasks panel/i,
    });

    await calendarBtn.click();
    await expect(page.getByText(/connect google calendar/i)).toBeVisible();

    await tasksBtn.click();
    await expect(page.getByText('Tasks & Reminders')).toBeVisible();
    await expect(page.getByText(/connect google calendar/i)).not.toBeVisible();
  });
});
