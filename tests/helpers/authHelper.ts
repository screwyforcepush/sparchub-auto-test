import { Page } from '@playwright/test';
import { Credentials } from '../config/auth.config';

export async function performLogin(page: Page, config: Credentials) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Log in' }).click();
  const loginFont = page.locator('font').filter({ hasText: 'Log in' });
  if (await loginFont.isVisible()) {
    await loginFont.click();
  }
  await page.locator('input[type="email"]').fill(config.email);
  await page.locator('input[type="password"]').fill(config.password);
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.waitForURL(/.*\/(company_portal\?tab=dashboard|sage_portal\?tab=companies)/);
}

export async function performLogout(page: Page): Promise<void> {
  await page.locator('div.bubble-element:has(svg.feather-bell)').locator('button.bubble-element.Button.clickable-element:has(~ div.bubble-element.Image.bubble-legacy-image):has(~ button.ion-arrow-down-b)[style*="cursor: pointer"]').click();
  await page.getByText('Log out').click();
  await page.waitForTimeout(2000); // wait a couple seconds because the website is slow.
} 
