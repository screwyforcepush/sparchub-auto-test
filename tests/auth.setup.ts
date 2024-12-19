import { test as setup } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { credentials } from './config/auth.config';
import { performLogin } from './helpers/authHelper';

// Ensure auth directory exists
setup('authenticate', async ({ browser }, testInfo) => {
  // Determine which credentials to use based on project name
  const projectName = testInfo.project.name;
  let config;
  
  if (projectName.includes('sage')) {
    config = credentials.sage;
  } else if (projectName.includes('professor')) {
    config = credentials.professor;
  } else {
    config = credentials.corporate;
  }
  
  const authDir = path.dirname(config.storageState!);
  fs.mkdirSync(authDir, { recursive: true });

  // Create a new context with no storage state
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    await performLogin(page, config);
    
    // Save signed-in state
    await context.storageState({ path: config.storageState! });
    
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  } finally {
    // Clean up
    await context.close();
  }
});
