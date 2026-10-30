import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const viewports = [
  { width: 320, height: 640, name: '320px-small-mobile' },
  { width: 360, height: 740, name: '360px-android-compact' },
  { width: 375, height: 667, name: '375px-iphone-se' },
  { width: 390, height: 844, name: '390px-iphone-12' },
  { width: 430, height: 932, name: '430px-iphone-pro-max' },
  { width: 768, height: 1024, name: '768px-tablet-portrait' },
  { width: 1024, height: 768, name: '1024px-tablet-landscape' },
  { width: 1440, height: 900, name: '1440px-desktop' },
];

const outDir = path.resolve('audit-screenshots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function runAudit() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Users\\dhira\\AppData\\Local\\ms-playwright\\chromium-1243\\chrome-win64\\chrome.exe'
  });
  const results = [];

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

    // Wait 1.5s for initial layout & video to mount
    await page.waitForTimeout(1500);

    // Audit metrics
    const auditData = await page.evaluate(() => {
      // Check horizontal overflow
      const docWidth = document.documentElement.scrollWidth;
      const windowWidth = window.innerWidth;
      const hasHorizontalOverflow = docWidth > windowWidth;

      // Find overflowing elements
      const overflowingElements = [];
      const allEls = document.querySelectorAll('*');
      for (const el of allEls) {
        const rect = el.getBoundingClientRect();
        if (rect.right > windowWidth + 1) {
          overflowingElements.push({
            tag: el.tagName,
            className: el.className?.toString().slice(0, 50),
            right: rect.right,
            width: rect.width,
          });
        }
      }

      // Check hero details
      const heroSection = document.querySelector('section[aria-labelledby="hero-title"]');
      const heroRect = heroSection ? heroSection.getBoundingClientRect() : null;
      const heroVideo = document.querySelector('section[aria-labelledby="hero-title"] video');
      const videoRect = heroVideo ? heroVideo.getBoundingClientRect() : null;
      const heroHeadline = document.getElementById('hero-title');
      const headlineRect = heroHeadline ? heroHeadline.getBoundingClientRect() : null;
      const ctaBtn = document.querySelector('section[aria-labelledby="hero-title"] a[href="#enquiry"]');
      const ctaRect = ctaBtn ? ctaBtn.getBoundingClientRect() : null;

      // Check floating dock buttons
      const floatingDock = document.querySelector('[aria-label="Contact options"]') || document.querySelector('.fixed');
      const floatingDockRect = floatingDock ? floatingDock.getBoundingClientRect() : null;

      return {
        hasHorizontalOverflow,
        docWidth,
        windowWidth,
        overflowingElementsCount: overflowingElements.length,
        overflowingElements: overflowingElements.slice(0, 5),
        heroRect: heroRect ? { height: heroRect.height, top: heroRect.top } : null,
        videoRect: videoRect ? { width: videoRect.width, height: videoRect.height, top: videoRect.top } : null,
        headlineRect: headlineRect ? { height: headlineRect.height, top: headlineRect.top } : null,
        ctaRect: ctaRect ? { top: ctaRect.top } : null,
      };
    });

    results.push({ ...vp, ...auditData });

    // Take full page screenshot and hero screenshot
    await page.screenshot({
      path: path.join(outDir, `${vp.name}-full.png`),
      fullPage: false,
    });

    await context.close();
  }

  await browser.close();
  console.log(JSON.stringify(results, null, 2));
}

runAudit().catch(err => {
  console.error(err);
  process.exit(1);
});
