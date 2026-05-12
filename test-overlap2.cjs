const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 400, height: 641, isMobile: true });
  
  await page.goto('http://localhost:8000', { waitUntil: 'networkidle0' });
  
  const rects = await page.evaluate(() => {
    const toJSON = (r) => ({x: r.x, y: r.y, w: r.width, h: r.height, top: r.top, bottom: r.bottom});
    const heroContent = document.querySelector('.hero-content').getBoundingClientRect();
    const mainNav = document.querySelector('.main-nav').getBoundingClientRect();
    const btn = document.querySelector('.mobile-menu-btn').getBoundingClientRect();
    return {
      hero: toJSON(heroContent),
      nav: toJSON(mainNav),
      btn: toJSON(btn)
    };
  });
  console.log(rects);
  
  await browser.close();
})();
