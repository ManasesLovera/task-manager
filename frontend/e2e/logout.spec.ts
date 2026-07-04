import { test, expect } from '@playwright/test';

const MEMBER_EMAIL = 'member@taskmanager.com';
const MEMBER_PASSWORD = 'Member123!';

test.describe('Member logout', () => {
  test('member can log out and is redirected to the login page', async ({ page }) => {
    await page.goto('/auth/login');

    await page.getByLabel('Email or Username').fill(MEMBER_EMAIL);
    await page.getByLabel('Password').fill(MEMBER_PASSWORD);
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: /Good morning/ })).toBeVisible();

    await page.getByAltText('User profile').click();
    await page.getByRole('button', { name: 'Logout' }).click();

    await expect(page).toHaveURL(/\/auth\/login$/);
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();

    await page.goto('/');
    await expect(page).toHaveURL(/\/auth\/login$/);
  });
});
