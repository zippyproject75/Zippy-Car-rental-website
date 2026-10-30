import { chromium } from '@playwright/test';

async function main() {
  const b = await chromium.launch({
    executablePath: 'C:\\Users\\dhira\\AppData\\Local\\ms-playwright\\chromium-1243\\chrome-win64\\chrome.exe'
  });
  const p = await b.newPage({ viewport: { width: 375, height: 667 } });
  await p.goto('http://localhost:3000/');
  await p.waitForTimeout(1000);

  const res = await p.evaluate(() => {
    const hero = document.querySelector('section[aria-labelledby="hero-title"]');
    if (!hero) return 'NO HERO';
    const links = Array.from(hero.querySelectorAll('a, button, video')).map(el => ({
      tag: el.tagName,
      href: el.getAttribute('href'),
      text: el.innerText ? el.innerText.trim() : null,
      rect: el.getBoundingClientRect(),
    }));
    return {
      heroRect: hero.getBoundingClientRect(),
      links,
      htmlSnippet: hero.innerHTML.slice(0, 500)
    };
  });

  console.log(JSON.stringify(res, null, 2));
  await b.close();
}

main().catch(console.error);
