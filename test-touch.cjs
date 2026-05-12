const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  
  await page.goto('http://localhost:8000', { waitUntil: 'networkidle0' });
  
  // click via tap
  const btn = await page.$('.mobile-menu-btn');
  await btn.tap();
  
  const isActive = await page.evaluate(() => {
    return document.querySelector('.nav-menu').classList.contains('active');
  });
  console.log('Is nav-menu active after tap?', isActive);
  
  await browser.close();
})();
