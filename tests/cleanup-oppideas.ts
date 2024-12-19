import { test as cleanup } from './fixtures/cleanup-fixtures';
import fs from 'fs';
import { CORPORATE_STORAGE_STATE } from '../playwright.config';
import { refreshDashboard } from "./helpers/navigationHelper";


cleanup('cleanup all test data', async ({ page, deleteAllOpportunities, deleteAllIdeas, logout }) => {
  await refreshDashboard(page);
  
  try { 
  // Clean up opportunities first (since they're converted from ideas)
    await deleteAllOpportunities();
  } catch (error) {
    console.error('delete opportunities failed:', error);
  } 
  // Then clean up remaining ideas
  try {
    await deleteAllIdeas();
  } catch (error) {
    console.error('delete ideas failed:', error);
  }
  
  // Finally logout
  try { 
    await logout();
  } catch (error) {
    console.error('logout failed:', error);
  }
  try {
    if (fs.existsSync(CORPORATE_STORAGE_STATE)) {
      fs.unlinkSync(CORPORATE_STORAGE_STATE);
    }
    await page.context().close();
  } catch (error) {
    console.error('Cleanup failed:', error);
  }
});