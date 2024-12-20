import { test as base } from '@playwright/test';
import { smoothScroll } from '../helpers/opportunityHelper';
import { refreshDashboard } from '../helpers/navigationHelper';

type IdeaData = {
  title: string;
  description: string;
  problem: string;
  marketSize: string;
  marketSizeDescription: string;
  contributorName: string;
  status: string;
  strategicAllignment1: string;
  strategicAllignment2: string;
};

type OpportunityData = {
  opportunitySize: string;
  budget: string;
  executionType: 'internal' | 'external';
};

type NewOpportunityData = {
  title: string;
  description: string;
  opportunitySize: string;
  budget: string;
  executionType: 'internal' | 'external';
  strategicAllignment1: string;
  strategicAllignment2: string;
};

type IdeaFixtures = {
  createIdea: (ideaData?: Partial<IdeaData>) => Promise<void>;
  convertToOpportunity: (opportunityData?: Partial<OpportunityData>) => Promise<void>;
  deleteOpportunity: (title?: string) => Promise<void>;
  createNewOpportunity: (opportunityData?: Partial<NewOpportunityData>) => Promise<void>;
  updateUncertainty: () => Promise<void>;
  selectOpportunity: (title: string) => Promise<void>;
};

export const test = base.extend<IdeaFixtures>({
  createIdea: async ({ page }, use) => {
    const createIdeaFn = async (ideaData: Partial<IdeaData> = {}) => {
      const defaultData: IdeaData = {
        title: 'autotestideaop',
        description: 'automate testing of sparchub',
        problem: 'regression issues',
        marketSize: 'Hundreds',
        marketSizeDescription: 'userbase guess',
        contributorName: 'composer',
        status: 'active',
        strategicAllignment1: '1',
        strategicAllignment2: '5'
      };

      const finalData = { ...defaultData, ...ideaData };

      await refreshDashboard(page);
      await page.locator('#company-ideas-icon > div > div > div').click();
      await page.getByRole('button', { name: 'New' }).click();
      
      // Fill form fields
      await page.locator('#company-idea-form input[type="input"]').first().fill(finalData.title);
      await page.locator('textarea').first().fill(finalData.description);
      await page.locator('textarea').nth(1).fill(finalData.problem);
      await page.getByRole('combobox').nth(1).selectOption(`"${finalData.marketSize}"`);
      await page.locator('textarea').nth(2).fill(finalData.marketSizeDescription);
      await page.locator('#company-idea-form input[type="input"]').nth(2).fill(finalData.contributorName);
      await page.getByRole('combobox').nth(2).selectOption(`"${finalData.status}"`);
      await page.locator('#company-idea-form input[type="input"]').nth(3).fill(finalData.strategicAllignment1);
      await page.locator('#company-idea-form input[type="input"]').nth(4).fill(finalData.strategicAllignment2);
      
      await page.getByRole('button', { name: 'Save', exact: true }).click();
    };

    await use(createIdeaFn);
  },

  convertToOpportunity: async ({ page }, use) => {
    const convertToOpportunityFn = async (opportunityData: Partial<OpportunityData> = {}) => {
      const defaultData: OpportunityData = {
        opportunitySize: '$10,000,000',
        budget: '$20,000',
        executionType: 'internal'
      };

      const finalData = { ...defaultData, ...opportunityData };

      await refreshDashboard(page);
      await page.locator('#company-ideas-icon > div > div > div').click();
      await page.locator('#company-idea-menu > div > div > div > div > div > div').first().click();
      await page.getByRole('button', { name: 'Move to opportunity' }).click();
      
      await page.locator('#oppsize_input').fill(finalData.opportunitySize);
      await page.locator('#budget_input').fill(finalData.budget);
      await page.locator('#intext_input').selectOption(`"${finalData.executionType}"`);
      
      await page.getByRole('button', { name: 'Save changes' }).click();
    };

    await use(convertToOpportunityFn);
  },


  createNewOpportunity: async ({ page }, use) => {
    const createNewOpportunityFn = async (opportunityData: Partial<NewOpportunityData> = {}) => {
      const defaultData: NewOpportunityData = {
        title: 'testdirectopportunity',
        description: 'create opportunity directly',
        opportunitySize: '$10,000,000',
        budget: '$20,000',
        executionType: 'internal',
        strategicAllignment1: '1',
        strategicAllignment2: '5'
      };

      const finalData = { ...defaultData, ...opportunityData };

      await refreshDashboard(page);
      await page.locator('#company-portfolio-icon > div > div > div').click();
      await page.getByRole('button', { name: 'New' }).click();
      
      await page.locator('#oppytitle_input').click();
      await page.locator('#oppytitle_input').fill(finalData.title);
      await page.locator('textarea').click();
      await page.locator('textarea').fill(finalData.description);
      await page.locator('#oppsize_input').click();
      await page.locator('#oppsize_input').fill(finalData.opportunitySize);
      await page.locator('#budget_input').click();
      await page.locator('#budget_input').fill(finalData.budget);
      await page.locator('#intext_input').selectOption(`"${finalData.executionType}"`);
      await page.getByPlaceholder('0').first().click();
      await page.getByPlaceholder('0').first().fill(finalData.strategicAllignment1);
      await page.getByPlaceholder('0').nth(1).click();
      await page.getByPlaceholder('0').nth(1).fill(finalData.strategicAllignment2);
      
      await page.getByRole('button', { name: 'Save changes' }).click();
    };

    await use(createNewOpportunityFn);
  },

  updateUncertainty: async ({ page }, use) => {
    const updateUncertaintyFn = async () => {
      //check the radio button to mark as high certainty
      await page.locator('div:nth-child(4) > div > div > div > div > div > div > .ion-android-radio-button-off').first().click();
      await page.getByText('Add a comment about this score change').isVisible();
      await page.waitForTimeout(200);
      await page.getByRole('textbox').fill('consult with domain experts to unbox an uncertainty black box');
      await page.waitForTimeout(200);
      await page.getByRole('button', { name: 'Submit' }).click();
      await page.waitForTimeout(200);
    };

    await use(updateUncertaintyFn);
  },

  selectOpportunity: async ({ page }, use) => {
    const selectOpportunityFn = async (title: string) => {
      await refreshDashboard(page);
      await page.locator("#company-portfolio-icon > div > div > div").click();
      await page.getByRole('combobox').nth(1).click()
      await page.getByRole('combobox').nth(1).selectOption('All');
      await smoothScroll(page);
      await page.locator('div.GroupItem.group-item').filter({ hasText: 'Spend / Allocated / Budget' }).getByText(title, { exact: true }).first().click();
    };

    await use(selectOpportunityFn);
  },

  deleteOpportunity: async ({ page, selectOpportunity }, use) => {
    const deleteOpportunityFn = async (title: string = 'autotestideaop') => {
      await selectOpportunity(title);
      
      await page.getByText('Details', { exact: true }).click();
      await page.getByText('Delete Opportunity').click();
      await page.getByRole('button', { name: 'Delete' }).click();
      
      // Handle optional modal close button
      const closeButton = page.getByRole('button', { name: 'Close' });
      if (await closeButton.isVisible({ timeout: 1000 })) {
        await closeButton.click();
      }
      
      await page.waitForTimeout(1000);
    };

    await use(deleteOpportunityFn);
  },


});

export { expect } from '@playwright/test'; 