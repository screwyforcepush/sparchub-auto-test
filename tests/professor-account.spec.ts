//do stuff in a sage account
//requires login from sage account
import { test, expect } from '@playwright/test';
import { refreshDashboard } from './helpers/navigationHelper';
import { performLogin, performLogout } from './helpers/authHelper';
import { credentials } from './config/auth.config';
import { navigateToManagedCourses, attemptCourseAccess } from './helpers/courseHelper';

test('Course management', async ({ page }) => {
    const randomID = Math.random().toString(36).substring(2, 15);
    const courseName = 'autotestclass-' + randomID;
    const courseAccessCode = 'accesscode' + randomID;
    test.setTimeout(180000);

    await test.step('Create new course', async () => {
        await refreshDashboard(page);
        await navigateToManagedCourses(page);
        await page.getByRole('button', { name: 'New' }).click();
        await page.getByRole('textbox').first().fill(courseName);
        await page.getByRole('textbox').nth(1).fill(courseAccessCode);
        await page.waitForTimeout(5000); // wait for bubble db to check course name is available
        await page.getByRole('button', { name: 'Save changes' }).click();
    });

    await test.step('Verify course access as student', async () => {
        await performLogout(page);
        await attemptCourseAccess(page, courseAccessCode);
        await expect.soft(page.getByRole('button', { name: 'Pay with Stripe' })).toBeVisible();
    });

    await test.step('Deactivate course as professor', async () => {
        await performLogin(page, credentials.professor);
        await navigateToManagedCourses(page);
        // Keep scrolling until element is found or max attempts reached
        const maxScrollAttempts = 50;
        let attempt = 0;
        let elementFound = false;

        while (attempt < maxScrollAttempts && !elementFound) {
            // Try to find the element
            const element = await page.getByText(courseName).first();
            if (await element.isVisible()) {
                elementFound = true;
                break;
            }

            // Scroll and wait for any dynamic content to load
            await page.mouse.wheel(0, 1000); // Simulates mouse wheel scroll down
            await page.waitForTimeout(200); // Wait for content to potentially load
            
            attempt++;
        }

        if (!elementFound) {
            throw new Error(`Could not find course "${courseName}" after ${maxScrollAttempts} scroll attempts`);
        }

        await page.getByText(courseName).first().hover()
        await page.locator('div.rows').locator('div.bubble-element.GroupItem.group-item')
            .filter({ hasText: courseName })
            .locator('div.bubble-element.CustomElement:has(svg.feather-more-vertical)')
            .first().click()
        await page.getByRole('button', { name: 'Deactivate' }).click();
        await page.getByRole('button', { name: 'Deactivate' }).click();
    });

    await test.step('Verify course access denied after deactivation', async () => {
        await performLogout(page);
        await attemptCourseAccess(page, courseAccessCode);
        await expect(page.getByText('Access code does not match!')).toBeVisible();
    });
    await test.step('assertion error log', async () => {
        expect(test.info().errors).toHaveLength(0);
      });
});