import { Page } from '@playwright/test';

export async function refreshDashboard(page: Page): Promise<void> {
    await page.goto('/');
    await page.waitForURL(/.*\/(company_portal\?tab=dashboard|sage_portal\?tab=companies)/);
}
