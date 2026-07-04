import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = 'admin@taskmanager.com';
const ADMIN_PASSWORD = 'Admin123!';

test.describe('Admin department listing', () => {
  test('admin can log in and view the department directory', async ({ page }) => {
    await page.goto('/auth/login');

    await page.getByLabel('Email or Username').fill(ADMIN_EMAIL);
    await page.getByLabel('Password').fill(ADMIN_PASSWORD);
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page).toHaveURL('/');

    await page.getByRole('link', { name: 'Departments' }).click();

    await expect(page).toHaveURL(/\/departments$/);
    await expect(page.getByRole('heading', { name: 'Corporate Structure' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Department Directory' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Department Name' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Department Code' })).toBeVisible();

    const departmentRows = page.locator('tbody tr');
    await expect(departmentRows.first()).toBeVisible();
  });
});
