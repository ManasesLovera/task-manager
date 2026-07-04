import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = 'admin@taskmanager.com';
const ADMIN_PASSWORD = 'Admin123!';

test.describe('Admin department management', () => {
  test('admin can create and then delete a department', async ({ page }) => {
    const departmentName = `E2E Dept ${Date.now()}`;
    const departmentCode = `E2E${Date.now()}`.slice(-8);

    page.on('dialog', (dialog) => dialog.accept());

    await page.goto('/auth/login');

    await page.getByLabel('Email or Username').fill(ADMIN_EMAIL);
    await page.getByLabel('Password').fill(ADMIN_PASSWORD);
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page).toHaveURL('/');

    await page.getByRole('link', { name: 'Departments' }).click();
    await expect(page).toHaveURL(/\/departments$/);

    await page.getByRole('button', { name: 'Add New Department' }).click();

    const modal = page.getByRole('heading', { name: 'Add New Department' });
    await expect(modal).toBeVisible();

    await page.getByLabel('Department Name').fill(departmentName);
    await page.getByLabel('Department Code').fill(departmentCode);

    await page.getByRole('button', { name: 'Create Department' }).click();

    await expect(page.getByText('Department created successfully!')).toBeVisible();
    await expect(modal).not.toBeVisible();

    const departmentRow = page.getByRole('row', { name: new RegExp(departmentName) });
    await expect(departmentRow).toBeVisible();

    await departmentRow.getByRole('button').click();

    await expect(departmentRow).not.toBeVisible();
    await expect(page.getByRole('cell', { name: departmentName })).not.toBeVisible();
  });
});
