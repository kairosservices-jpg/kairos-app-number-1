const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 375, height: 812, isMobile: true });
  
  await page.goto('http://localhost:8000', { waitUntil: 'networkidle0' });
  
  const result = await page.evaluate(() => {
    const btn = document.querySelector('.mobile-menu-btn');
    const rect = btn.getBoundingClientRect();
    const x = rect.x + rect.width / 2;
    const y = rect.y + rect.height / 2;
    const el = document.elementFromPoint(x, y);
    
    return {
      x, y,
      btnId: btn.id, btnClass: btn.className,
      elId: el ? el.id : null, elClass: el ? el.className : null, elTag: el ? el.tagName : null
    };
  });
  console.log(result);
  
  await browser.close();
})();
