const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 400, height: 641, isMobile: true });
  
  await page.goto('http://localhost:8000', { waitUntil: 'networkidle0' });
  
  // scroll down by 100px
  await page.evaluate(() => window.scrollBy(0, 100));
  
  const rects = await page.evaluate(() => {
    const toJSON = (r) => ({x: r.x, y: r.y, w: r.width, h: r.height, top: r.top, bottom: r.bottom});
    const heroContent = document.querySelector('.hero-content').getBoundingClientRect();
    const mainNav = document.querySelector('.main-nav').getBoundingClientRect();
    const btn = document.querySelector('.mobile-menu-btn').getBoundingClientRect();
    
    const x = btn.x + btn.width / 2;
    const y = btn.y + btn.height / 2;
    const el = document.elementFromPoint(x, y);
    
    return {
      hero: toJSON(heroContent),
      nav: toJSON(mainNav),
      btn: toJSON(btn),
      topEl: el ? el.tagName + (el.className ? '.' + el.className : '') : 'none'
    };
  });
  console.log(rects);
  
  await browser.close();
})();
