import { test, expect } from './fixtures/idea-opportunity-fixtures';
import { refreshDashboard } from "./helpers/navigationHelper";

test.describe.configure({ mode: 'serial' });
test.describe('Idea + Opportunity Lifecycle', () => {

    test('create new idea', async ({ page, createIdea }) => {
        await createIdea();
        // Verify idea creation
        await expect(page.locator('body')).toContainText('autotestideaop');
    });

    test('convert idea to opportunity', async ({ page, convertToOpportunity }) => {
        await convertToOpportunity();
        // Verify the conversion
        await expect(page.locator('body')).toContainText('Opportunity portfolio');
    });

    test('delete opportunity', async ({ page, deleteOpportunity }) => {
        await deleteOpportunity();
        await expect(page.locator('body')).toContainText('0 opportunities');
    });

    test('delete idea', async ({ page }) => {  
        await refreshDashboard(page);
        await page.locator('#company-ideas-icon > div > div > div').click();
    
        //Just checking some of the details. skip this block for now
        // await page.getByText('autotestideaop', { exact: true }).nth(2).click();
        // await expect(page.locator('#company-idea-form')).toContainText('2.0'); // Currently showing old strategic alignment. not updated from opportunity change.
        // await page.getByText('< Back to Idea Inventory').click();
        // await page.locator('#company-idea-menu > div > div > div > div > div > div').click();
        // await page.getByRole('button', { name: 'Move to opportunity' }).click(); //All budget and allocated have been removed.
        // await page.locator('div:nth-child(94) > div > div > div').first().click();
        // await page.locator('div:nth-child(94) > div > div > div').first().click();
    
        //Delete idea
        await page.locator('#company-idea-menu > div > div > div > div > div > div').first().click();
        await page.getByRole('button', { name: 'Delete' }).click();
        await page.getByRole('button', { name: 'Remove' }).click();
    
    
        await expect(page.locator('body')).toContainText('0 results');
    });

});
