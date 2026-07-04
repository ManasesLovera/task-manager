import { test, expect } from '@playwright/test';

const MEMBER_EMAIL = 'member@taskmanager.com';
const MEMBER_PASSWORD = 'Member123!';

test.describe('Member ticket creation', () => {
  test('member can create a ticket and see it in their ticket list', async ({ page }) => {
    const ticketTitle = `E2E Test Ticket ${Date.now()}`;
    const ticketDescription = 'This ticket was created by an automated Playwright test.';

    await page.goto('/auth/login');

    await page.getByLabel('Email or Username').fill(MEMBER_EMAIL);
    await page.getByLabel('Password').fill(MEMBER_PASSWORD);
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page).toHaveURL('/');

    await page.getByRole('link', { name: 'Tickets' }).click();
    await expect(page).toHaveURL(/\/tickets$/);

    await page.getByRole('main').getByRole('button', { name: 'New Ticket' }).click();

    const modal = page.getByRole('heading', { name: 'Create New Ticket' });
    await expect(modal).toBeVisible();

    await page.getByLabel('Title').fill(ticketTitle);
    await page.getByLabel('Department').selectOption({ label: 'Information Technology' });
    await page.getByLabel('Priority').selectOption({ label: 'High' });
    await page.getByLabel('Description').fill(ticketDescription);

    await page.getByRole('button', { name: 'Create Ticket' }).click();

    await expect(page.getByText('Ticket created successfully!')).toBeVisible();
    await expect(modal).not.toBeVisible();

    await expect(page.getByRole('cell', { name: ticketTitle })).toBeVisible();
  });
});
