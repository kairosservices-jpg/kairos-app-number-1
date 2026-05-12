const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 375, height: 812, isMobile: true });
  
  await page.goto('http://localhost:8000', { waitUntil: 'networkidle0' });
  
  // click it
  await page.click('.mobile-menu-btn');
  
  // Check if nav-menu has 'active' class
  const isActive = await page.evaluate(() => {
    return document.querySelector('.nav-menu').classList.contains('active');
  });
  console.log('Is nav-menu active?', isActive);
  
  await browser.close();
})();
