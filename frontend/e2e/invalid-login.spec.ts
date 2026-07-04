import { test, expect } from '@playwright/test';

test.describe('Invalid credentials', () => {
  test('shows an error and stays on the login page when credentials are wrong', async ({ page }) => {
    await page.goto('/auth/login');

    await page.getByLabel('Email or Username').fill('nonexistent@example.com');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page.getByText('HTTP error! status: 401')).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/login$/);
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });
});
