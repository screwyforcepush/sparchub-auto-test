import { smoothScroll } from "./helpers/opportunityHelper";
import { mergeTests } from "@playwright/test";
import { test as ideaTest } from "./fixtures/idea-opportunity-fixtures";
import { test as cleanupTest } from "./fixtures/cleanup-fixtures";
import { expect } from "@playwright/test";
import { refreshDashboard } from "./helpers/navigationHelper";

// Merge the fixtures
export const test = mergeTests(ideaTest, cleanupTest);

test.beforeEach(async ({ page }) => {
  await refreshDashboard(page);
  await page.locator("#company-portfolio-icon > div > div > div").click();
  await page.waitForURL("**/company_portal?tab=portfolio**");
});

test.afterEach(async ({ page, deleteAllOpportunities }) => {
  await page.goto("/");
  await page.waitForURL("**/company_portal?tab=dashboard");
  await deleteAllOpportunities();
});

test("Multiple opportunity portfolio", async ({
  page,
  createNewOpportunity,
  updateUncertainty,
  selectOpportunity
}) => {
  await test.step("setup 2 opportunities with createNewOpportunity", async () => {
    await createNewOpportunity({ title: "sureThingOpportunity" });
    await createNewOpportunity({ title: "diceRollingOpportunity" });
  });

  await test.step("increase certainty of opportunity", async () => {
    await selectOpportunity("sureThingOpportunity");

    for (let i = 0; i < 3; i++) {
      await updateUncertainty();
    }
  });
  await test.step("Note the different opportunity positions in chart", async () => {
    await page.goto("/");
    await page.waitForURL("**/company_portal?tab=dashboard");
    await page.locator("#company-portfolio-icon > div > div > div").click();
    await page.waitForTimeout(2000);
  });
});

test("Positioning Opportunity", async ({
  page,
  createNewOpportunity,
  updateUncertainty,
  selectOpportunity
}) => {
  await test.step("setup 2 opportunities with createNewOpportunity", async () => {
    await createNewOpportunity({ title: "certainOpportunity" });
  });

  await test.step("Increase certainty to positioning options", async () => {
    await selectOpportunity("certainOpportunity");

    for (let i = 0; i < 5; i++) {
      await updateUncertainty();
    }

    await page.waitForTimeout(1000); //incase the modal pops up later
    await expect.soft(page.getByText('Positioning Options')).toBeVisible();
    await page.getByRole("button", { name: "Close", exact: true }).click();
  });

  await test.step("Increase certainty to Platform Positioning", async () => {
    for (let i = 0; i < 23; i++) {
      await updateUncertainty();
    }

    await page.waitForTimeout(1000); //incase the modal pops up later
    await expect.soft(page.getByText('Platform Positioning')).toBeVisible();
    await page.getByRole("button", { name: "Close", exact: true }).click();
  });
  await test.step("Increase certainty to Core", async () => {

    for (let i = 0; i < 8; i++) {
      await updateUncertainty();
    }

    await page.waitForTimeout(1000); //incase the modal pops up later
    await expect.soft(page.getByText('This opportunity classification has changed')).toBeVisible();
    await page.getByRole("button", { name: "Close", exact: true }).click();
  });

  await test.step("Note the opportunity position bottom left of the chart", async () => {
    await page.goto("/");
    await page.waitForURL("**/company_portal?tab=dashboard");
    await page.locator("#company-portfolio-icon > div > div > div").click();
    await page.waitForTimeout(2000);
  });
  await test.step('assertion error log', async () => {
    expect(test.info().errors).toHaveLength(0);
  });
});
