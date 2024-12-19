import { test as cleanup } from './fixtures/cleanup-fixtures';
import fs from 'fs';
import { PROF_STORAGE_STATE } from '../playwright.config';

cleanup('cleanup all test data', async ({ page }) => {
  try {
    if (fs.existsSync(PROF_STORAGE_STATE)) {
      fs.unlinkSync(PROF_STORAGE_STATE);
    }
    await page.context().close();
  } catch (error) {
    console.error('Cleanup failed:', error);
  }
});