import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = 'admin@taskmanager.com';
const ADMIN_PASSWORD = 'Admin123!';

test.describe('Admin login and role access', () => {
  test('admin can log in and access admin-only areas', async ({ page }) => {
    await page.goto('/auth/login');

    await page.getByLabel('Email or Username').fill(ADMIN_EMAIL);
    await page.getByLabel('Password').fill(ADMIN_PASSWORD);
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page).toHaveURL('/');

    await expect(page.getByText('System Administrator')).toBeVisible();
    await expect(page.getByText('Admin', { exact: true })).toBeVisible();

    await expect(page.getByRole('link', { name: 'Departments' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Analytics' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Team' })).toBeVisible();

    await page.getByRole('link', { name: 'Team' }).click();
    await expect(page).toHaveURL(/\/team$/);

    await expect(page.getByRole('heading', { name: 'Team Members' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Role' })).toBeVisible();

    const adminRow = page.getByRole('row', { name: /System Administrator/ });
    await expect(adminRow).toBeVisible();
    await expect(adminRow.getByText('Admin', { exact: true })).toBeVisible();
  });
});
