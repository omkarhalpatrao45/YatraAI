import { test, expect } from '@playwright/test';

test('redirects unauthenticated user from /dashboard to /login', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/login/);
});

test('login page loads', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: /Welcome to YatraAI/i })).toBeVisible();
});

