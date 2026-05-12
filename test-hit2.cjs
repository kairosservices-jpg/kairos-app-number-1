const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: "new"});
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:5173/');
  
  await page.click('.mobile-menu-btn');
  await new Promise(r => setTimeout(r, 1000));
  
  const contactLink = await page.$('a[href="/contact.html"]');
  const box = await contactLink.boundingBox();
  console.log('Contact link box:', box);
  
  if (box) {
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    console.log(`Checking what is at coordinates: x=${x}, y=${y}`);
    
    const topmost = await page.evaluate((x, y) => {
      const el = document.elementFromPoint(x, y);
      return el ? { tagName: el.tagName, className: el.className, id: el.id } : null;
    }, x, y);
    console.log('Element at point:', topmost);
  }

  await browser.close();
  process.exit(0);
})();
