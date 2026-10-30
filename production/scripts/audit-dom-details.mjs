import { chromium } from '@playwright/test';

async function auditDomDetails() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Users\\dhira\\AppData\\Local\\ms-playwright\\chromium-1243\\chrome-win64\\chrome.exe'
  });

  const widths = [320, 360, 375, 390, 430, 768, 1024, 1440];
  const auditReport = {};

  for (const w of widths) {
    const context = await browser.newContext({
      viewport: { width: w, height: 800 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    await page.goto('http://localhost:3000/en', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const issues = await page.evaluate((width) => {
      const found = [];

      // 1. Horizontal scroll check
      if (document.documentElement.scrollWidth > window.innerWidth) {
        found.push({
          type: 'OVERFLOW',
          message: `Horizontal overflow: scrollWidth ${document.documentElement.scrollWidth} > innerWidth ${window.innerWidth}`,
        });
      }

      // 2. Elements bleeding beyond viewport
      const elements = document.querySelectorAll('*');
      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        // Ignore marquee or elements inside overflow-hidden parent
        let p = el.parentElement;
        let isInsideOverflowHidden = false;
        while (p) {
          const style = window.getComputedStyle(p);
          if (style.overflow === 'hidden' || style.overflowX === 'hidden') {
            isInsideOverflowHidden = true;
            break;
          }
          p = p.parentElement;
        }

        if (!isInsideOverflowHidden && rect.right > window.innerWidth + 2) {
          found.push({
            type: 'BLEED',
            tag: el.tagName,
            id: el.id,
            className: el.className?.toString().slice(0, 40),
            right: Math.round(rect.right),
            width: Math.round(rect.width),
          });
        }
      }

      // 3. Touch target sizes for links and buttons (< 40px)
      const interactives = document.querySelectorAll('button, a, input, select');
      let smallTargets = 0;
      for (const btn of interactives) {
        const rect = btn.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0 && (rect.width < 38 || rect.height < 38)) {
          // If parent is not hidden
          if (rect.top >= 0 && rect.bottom <= document.documentElement.scrollHeight) {
            smallTargets++;
          }
        }
      }

      // 4. Hero section inspection
      const hero = document.querySelector('section[aria-labelledby="hero-title"]');
      let heroInfo = null;
      if (hero) {
        const h1 = hero.querySelector('h1');
        const cta = hero.querySelector('a[href="#enquiry"]');
        const secondary = hero.querySelector('a[href="#fleet"]');
        const video = hero.querySelector('video');
        const floatingDock = document.querySelector('[data-testid="contact-dock"]') || document.querySelector('.fixed.bottom-5');

        const heroRect = hero.getBoundingClientRect();
        const h1Rect = h1 ? h1.getBoundingClientRect() : null;
        const ctaRect = cta ? cta.getBoundingClientRect() : null;
        const videoRect = video ? video.getBoundingClientRect() : null;
        const dockRect = floatingDock ? floatingDock.getBoundingClientRect() : null;

        heroInfo = {
          heroHeight: Math.round(heroRect.height),
          h1Top: h1Rect ? Math.round(h1Rect.top) : null,
          h1Height: h1Rect ? Math.round(h1Rect.height) : null,
          ctaTop: ctaRect ? Math.round(ctaRect.top) : null,
          videoHeight: videoRect ? Math.round(videoRect.height) : null,
          dockOverlapsHero: dockRect && ctaRect ? dockRect.top < ctaRect.bottom + 20 : false,
        };
      }

      // 5. Check Enquiry Form inputs
      const form = document.querySelector('form');
      const formInfo = {
        hasForm: !!form,
        inputsCount: form ? form.querySelectorAll('input, select, button').length : 0,
      };

      return {
        overflowIssues: found.filter(f => f.type === 'OVERFLOW'),
        bleedIssues: found.filter(f => f.type === 'BLEED').slice(0, 5),
        smallTargets,
        heroInfo,
        formInfo,
      };
    }, w);

    auditReport[`${w}px`] = issues;
    await context.close();
  }

  await browser.close();
  console.log(JSON.stringify(auditReport, null, 2));
}

auditDomDetails().catch(console.error);

