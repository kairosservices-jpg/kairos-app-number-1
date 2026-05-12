const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Mobile viewport
  await page.setViewport({ width: 375, height: 812, isMobile: true });
  
  await page.goto('http://localhost:8000', { waitUntil: 'networkidle0' });
  
  const btn = await page.$('.mobile-menu-btn');
  if (btn) {
    const box = await btn.boundingBox();
    console.log(`Hamburger button found at x=${box.x}, y=${box.y}, width=${box.width}, height=${box.height}`);
    
    // Evaluate what element is at the center of the button
    const element = await page.evaluate(({x, y}) => {
      const el = document.elementFromPoint(x, y);
      return el ? { tagName: el.tagName, id: el.id, className: el.className } : null;
    }, { x: box.x + box.width / 2, y: box.y + box.height / 2 });
    
    console.log('Element at hamburger center:', element);
  } else {
    console.log('Hamburger button not found');
  }
  
  await browser.close();
})();
