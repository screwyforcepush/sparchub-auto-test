import { Page } from '@playwright/test';

export async function smoothScroll(page: Page) {
  // Scroll down
  await page.evaluate(async () => {
    const height = document.body.scrollHeight;
    const duration = 1000;
    const steps = 20;
    const stepSize = height / steps;
    const stepDuration = duration / steps;
    
    for (let i = 0; i <= steps; i++) {
      window.scrollTo(0, i * stepSize);
      await new Promise(resolve => setTimeout(resolve, stepDuration));
    }
  });
  
  // Reset to top
  await page.waitForTimeout(1000); 
  await page.evaluate(() => window.scrollTo(0, 0));
  
  // Scroll down again
  await page.evaluate(async () => {
    const height = document.body.scrollHeight;
    const duration = 1000;
    const steps = 20;
    const stepSize = height / steps;
    const stepDuration = duration / steps;
    
    for (let i = 0; i <= steps; i++) {
      window.scrollTo(0, i * stepSize);
      await new Promise(resolve => setTimeout(resolve, stepDuration));
    }
  });
  await page.waitForTimeout(1000); 
  await page.mouse.wheel(0, 1000); // Scroll down 100 pixels more
}
