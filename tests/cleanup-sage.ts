import { test as cleanup } from './fixtures/cleanup-fixtures';
import fs from 'fs';
import { SAGE_STORAGE_STATE } from '../playwright.config';
import { refreshDashboard } from "./helpers/navigationHelper";


cleanup('cleanup all test data', async ({ page, logout }) => {
  // await refreshDashboard(page);
  
  // try { 
  //   await logout();
  // } catch (error) {
  //   console.error('logout failed:', error);
  // }
  try {
    if (fs.existsSync(SAGE_STORAGE_STATE)) {
      fs.unlinkSync(SAGE_STORAGE_STATE);
    }
    await page.context().close();
  } catch (error) {
    console.error('Cleanup failed:', error);
  }
});