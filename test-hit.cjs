const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport to mobile size
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  
  await page.goto('http://localhost:5173/');
  
  // Click mobile menu button to open it
  await page.click('.mobile-menu-btn');
  await new Promise(r => setTimeout(r, 1000));
  
  // Find the Contact link
  const contactLink = await page.$('a[href="/contact.html"]');
  const box = await contactLink.boundingBox();
  
  console.log('Contact link bounding box:', box);
  
  if (box) {
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    console.log(`Checking what is at coordinates: x=${x}, y=${y}`);
    
    // Evaluate document.elementFromPoint
    const topmost = await page.evaluate((x, y) => {
      const el = document.elementFromPoint(x, y);
      if (!el) return null;
      return {
        tagName: el.tagName,
        className: el.className,
        id: el.id
      };
    }, x, y);
    
    console.log('Element at point:', topmost);
  } else {
    console.log('Could not find Contact link');
  }

  await browser.close();
})();
