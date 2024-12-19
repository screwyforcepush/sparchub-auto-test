import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// // Define storage state path
export const CORPORATE_STORAGE_STATE = path.join(__dirname, 'playwright', '.auth', 'corporate.json');
export const SAGE_STORAGE_STATE = path.join(__dirname, 'playwright', '.auth', 'sage.json');
export const PROF_STORAGE_STATE = path.join(__dirname, 'playwright', '.auth', 'professor.json');

export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Only collect trace on failure */
    trace: 'retain-on-failure',

    baseURL: 'https://sparchub.valize.com/',
    // Store auth state in a more standard location
    // storageState: STORAGE_STATE,
  },

  // Folder for test artifacts such as screenshots, videos, traces, etc.
  outputDir: 'test-results',

  // Each test is given 120 seconds.
  timeout: 120000,

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'corporate-auth',
      testMatch: /auth\.setup\.ts/,
      teardown: 'cleanup-opportunity-ideas',
    },
    {
      name: 'core-product',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: CORPORATE_STORAGE_STATE,
      },
      testMatch: /(idea-opportunity-lifecycle|portfolio|opportunity)\.spec\.ts/,
      dependencies: ['corporate-auth'],
    },
    {
      name: 'cleanup-opportunity-ideas',
      testMatch: /cleanup-oppideas\.ts/,
      use: {
        storageState: CORPORATE_STORAGE_STATE,
      },
    },
    {
      name: 'sage-auth',
      testMatch: /auth\.setup\.ts/,
      teardown: 'cleanup-sage',
    },
    {
      name: 'sage-account',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: SAGE_STORAGE_STATE,
      },
      testMatch: /sage-account\.spec\.ts/,
      dependencies: ['sage-auth'],
    },
    {
      name: 'cleanup-sage',
      testMatch: /cleanup-sage\.ts/,
      use: {
        storageState: SAGE_STORAGE_STATE,
      },
    },
    {
      name: 'professor-auth',
      testMatch: /auth\.setup\.ts/,
      teardown: 'cleanup-professor',
    },
    {
      name: 'professor-account',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: PROF_STORAGE_STATE,
      },
      testMatch: /professor-account\.spec\.ts/,
      dependencies: ['professor-auth'],
    },
    {
      name: 'cleanup-professor',
      testMatch: /cleanup-prof\.ts/,
      use: {
        storageState: PROF_STORAGE_STATE,
      },
    },
 
  ],
});
