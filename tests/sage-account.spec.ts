//do stuff in a sage account
//requires login from sage account
import { test, expect } from '@playwright/test';
import { refreshDashboard } from './helpers/navigationHelper';
import { performLogin, performLogout } from './helpers/authHelper';
import { credentials } from './config/auth.config';

test('Company and user management', async ({ page }) => {
    await refreshDashboard(page);

    test.setTimeout(180000);

    //setting up persistant ID as we cant delete companies
    const randomID = Math.random().toString(36).substring(2, 15);
    const companyName = 'company-' + randomID;
    console.log("companyname", companyName);

    await test.step('create new company', async () => {
        await page.getByRole('button', { name: 'Add company' }).click();
        await page.getByRole('textbox').fill(companyName);
        await page.getByRole('button', { name: 'Submit' }).click();
    });

    await test.step('add user to company from users page', async () => {
        //Add user to company
        await page.getByText('Users', { exact: true }).click();
        await page.getByRole('button', { name: 'Add user' }).click();
        await page.getByRole('button', { name: 'Add user' }).nth(1).click();
        await page.locator('input[type="email"]').fill(credentials.member.email);
        await page.locator('input[type="email"]').press('Enter');
        await page.locator('div').filter({ hasText: 'Edit userEmail address' }).getByRole('combobox').first().click();
        await page.locator('div').filter({ hasText: 'Edit userEmail address' }).getByRole('combobox').first().selectOption(companyName);
        page.once('dialog', dialog => {
          console.log(`Dialog message: ${dialog.message()}`);
          dialog.dismiss().catch(() => {});
        });
        console.log(companyName);
        await page.getByText('Hide deactivated companies').nth(1).click();
        await page.locator('div:nth-child(3) > div > div:nth-child(3)').first().click();
        await page.locator('div').filter({ hasText: 'Edit userEmail address' }).locator('div.bubble-element.RepeatingGroup').locator('div.GroupItem').filter({ hasText: companyName }).getByRole('combobox').nth(1).click();
        await page.locator('div').filter({ hasText: 'Edit userEmail address' }).locator('div.bubble-element.RepeatingGroup').locator('div.GroupItem').filter({ hasText: companyName }).getByRole('combobox').nth(1).selectOption('Company Member');
        await page.getByRole('button', { name: 'Save changes' }).click();
    });
    await test.step('bug in app. need to cancel for work around', async () => {
        page.once('dialog', dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            dialog.dismiss().catch(() => {});
          });
        await page.getByRole('button', { name: 'Cancel' }).click();
    });

    await test.step('add user to company from companies page', async () => {
        await page.locator('#ad-full-height-menu').getByText('Companies').click();
        await page.waitForTimeout(1000);
        await page.getByText(companyName).first().hover()
        await page.locator('div.rows').locator('div.bubble-element.GroupItem.group-item').filter({ hasText: companyName }).locator('div.bubble-element.CustomElement:has(svg.feather-more-vertical)').first().click()
        await page.getByRole('button', { name: 'Edit' }).click();
        await page.getByRole('button', { name: 'Users' }).click();
        await page.getByRole('button', { name: 'Add user' }).click();
        //complains about subscription broken backend
        page.once('dialog', dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.dismiss().catch(() => {});
        });
        await page.getByRole('button', { name: 'Add user' }).nth(1).click();

        await page.getByRole('textbox').fill(credentials.member.email);
        await page.getByRole('textbox').press('Enter');
        // In some situations the flow is different and the combobox is not present. Its a bug in the app.
        // await page.locator('div').filter({ hasText: 'Add userEmail addressWe found' }).getByRole('combobox').first().click();
        // await page.locator('div').filter({ hasText: 'Add userEmail addressWe found' }).getByRole('combobox').first().selectOption('Company Member');
        // await page.getByRole('button', { name: 'Add user' }).nth(1).click();
        await page.getByRole('button', { name: 'Company setup' }).click();
        await page.getByRole('button', { name: 'Save changes' }).click();

    });

    //login with other account and verify company access
    await test.step('login as member to access company', async () => {
        await performLogout(page);
        await performLogin(page, credentials.member);
        await expect.soft(page.getByRole('combobox')).toContainText(companyName);

    });

    await test.step('deactivate company', async () => {
        await performLogout(page);
        await performLogin(page, credentials.sage);
        await refreshDashboard(page);
        await page.getByText(companyName).first().hover()
        await page.locator('div.rows').locator('div.bubble-element.GroupItem.group-item').filter({ hasText: companyName }).locator('div.bubble-element.CustomElement:has(svg.feather-more-vertical)').first().click()
        await page.getByRole('button', { name: 'Deactivate' }).click();
        await page.getByRole('button', { name: 'Deactivate' }).click();
        await expect(page.getByRole('paragraph')).toContainText('The company and the associated users have been deactivated');
    });
    await test.step('assertion error log', async () => {
        expect(test.info().errors).toHaveLength(0);
      });
});