import { chromium } from '@playwright/test';
import path from 'node:path';

async function auditSections() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Users\\dhira\\AppData\\Local\\ms-playwright\\chromium-1243\\chrome-win64\\chrome.exe'
  });

  const mobileWidths = [320, 375, 430, 768];

  for (const width of mobileWidths) {
    const context = await browser.newContext({
      viewport: { width, height: 800 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    await page.goto('http://localhost:3000/en', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Capture full page screenshot
    await page.screenshot({
      path: path.resolve(`audit-screenshots/mobile-fullpage-${width}px.png`),
      fullPage: true,
    });

    await context.close();
  }

  await browser.close();
  console.log('Fullpage screenshots generated!');
}

auditSections().catch(console.error);

