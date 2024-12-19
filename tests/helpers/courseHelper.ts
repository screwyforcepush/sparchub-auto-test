import { Page, expect } from '@playwright/test';

export async function navigateToManagedCourses(page: Page) {
    await page.locator('div.bubble-element:has(svg.feather-bell)')
        .locator('button.bubble-element.Button.clickable-element:has(~ div.bubble-element.Image.bubble-legacy-image):has(~ button.ion-arrow-down-b)[style*="cursor: pointer"]')
        .click();
    await page.getByText('My account (Prof.)').click();
    await page.getByText('Courses').click();
}

export async function attemptCourseAccess(page: Page, courseAccessCode: string) {
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.getByText('Sign up').click();
    await page.getByText('Education').click();
    await page.getByRole('textbox').click();
    await page.getByRole('textbox').fill(courseAccessCode);
    await expect(page.getByRole('button', { name: 'Sign Up' })).toHaveCSS('cursor', 'pointer');
    await page.getByRole('button', { name: 'Sign Up' }).click();
} 