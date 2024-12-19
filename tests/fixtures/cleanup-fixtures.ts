import { test as base } from '@playwright/test';
import { smoothScroll } from '../helpers/opportunityHelper';
import { performLogout } from '../helpers/authHelper';
import { refreshDashboard } from '../helpers/navigationHelper';

type CleanupFixtures = {
  deleteAllIdeas: () => Promise<void>;
  deleteAllOpportunities: () => Promise<void>;
  logout: () => Promise<void>;
};

export const test = base.extend<CleanupFixtures>({
  deleteAllIdeas: async ({ page }, use) => {
    const deleteAllIdeasFn = async () => {
      await page.locator('#company-ideas-icon > div > div > div').click();

      while (true) {
        await page.waitForTimeout(2000);
        const resultsText = await page.locator('body').textContent();
        if (resultsText?.includes('0 results')) {
          break;
        }

        await page.locator('#company-idea-menu > div > div > div > div > div > div').first().click();
        await page.getByRole('button', { name: 'Delete' }).click();
        await page.getByRole('button', { name: 'Remove' }).click();
      }
    };

    await use(deleteAllIdeasFn);
  },

  deleteAllOpportunities: async ({ page }, use) => {
    const deleteAllOpportunitiesFn = async () => {
      await page.locator('#company-portfolio-icon > div > div > div').click();
      await page.getByRole('combobox').nth(1).click();
      await page.getByRole('combobox').nth(1).selectOption('All');

      while (true) {
        await smoothScroll(page);
        
        const resultsText = await page.locator('body').textContent();
        if (resultsText?.includes('0 opportunities')) {
          break;
        }
        
        await page.locator('div.GroupItem.group-item').filter({ hasText: 'Spend / Allocated / Budget' }).locator('div.Text.clickable-element').first().click();
        await page.getByText('Details', { exact: true }).click();
        await page.getByText('Delete Opportunity').click();
        await page.getByRole('button', { name: 'Delete' }).click();
        
        const closeButton = page.getByRole('button', { name: 'Close' });
        if (await closeButton.isVisible({ timeout: 1000 })) {
          await closeButton.click();
        }
      }
    };

    await use(deleteAllOpportunitiesFn);
  },

  logout: async ({ page }, use) => {
    const logoutFn = async () => {
      await refreshDashboard(page);
      await performLogout(page);
    };

    await use(logoutFn);
  }
});

export { expect } from '@playwright/test'; 