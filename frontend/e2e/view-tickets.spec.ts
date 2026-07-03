import { test, expect } from '@playwright/test';

const MEMBER_EMAIL = 'member@taskmanager.com';
const MEMBER_PASSWORD = 'Member123!';

test.describe('Member ticket visibility', () => {
  test('member can log in and view all tickets', async ({ page }) => {
    await page.goto('/auth/login');

    await page.getByLabel('Email or Username').fill(MEMBER_EMAIL);
    await page.getByLabel('Password').fill(MEMBER_PASSWORD);
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: /Good morning/ })).toBeVisible();

    await page.getByRole('link', { name: 'Tickets' }).click();

    await expect(page).toHaveURL(/\/tickets$/);
    await expect(page.getByRole('heading', { name: 'Active Ticket Pipeline' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Ticket ID' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Title' })).toBeVisible();

    const ticketRows = page.locator('tbody tr');
    await expect(ticketRows.first()).toBeVisible();
  });
});
