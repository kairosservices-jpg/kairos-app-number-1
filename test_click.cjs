const puppeteer = require('puppeteer');

(async () => {
    // Determine the correct port
    const { execSync } = require('child_process');
    let port = 8000;
    try {
        const cmdline = execSync('cat /proc/$(pgrep -f "vite" | head -n 1)/cmdline').toString();
        if (cmdline.includes('vite')) port = 5173;
    } catch(e) {}
    
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    // Set mobile viewport
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    
    console.log(`Navigating to http://localhost:${port}...`);
    await page.goto(`http://localhost:${port}`, { waitUntil: 'networkidle2' });
    
    // Wait a bit for animations
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check "Yes I want my free plan" button
    const btnBox = await page.evaluate(() => {
        const btn = document.querySelector('#btn-hero-build');
        if (!btn) return null;
        const rect = btn.getBoundingClientRect();
        return {
            x: rect.x, y: rect.y, width: rect.width, height: rect.height,
            cx: rect.x + rect.width / 2,
            cy: rect.y + rect.height / 2
        };
    });
    
    if (btnBox) {
        console.log(`Button found at x=${btnBox.x}, y=${btnBox.y}`);
        
        // Check what element is at the center of the button
        const elementAtPoint = await page.evaluate((x, y) => {
            const el = document.elementFromPoint(x, y);
            if (!el) return 'none';
            return {
                tagName: el.tagName,
                id: el.id,
                className: el.className
            };
        }, btnBox.cx, btnBox.cy);
        
        console.log('Element at button center:', elementAtPoint);
    } else {
        console.log('Button not found!');
    }
    
    // Also try to open the menu and see if links are blocked
    await page.click('.mobile-menu-btn');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const linkBoxes = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.nav-menu a')).map(a => {
            const rect = a.getBoundingClientRect();
            return {
                text: a.textContent,
                cx: rect.x + rect.width / 2,
                cy: rect.y + rect.height / 2
            };
        });
    });
    
    for (let box of linkBoxes) {
        const el = await page.evaluate((x, y) => {
            const e = document.elementFromPoint(x, y);
            return e ? e.tagName + (e.id ? '#'+e.id : '') + (e.className ? '.'+e.className.replace(/ /g, '.') : '') : 'none';
        }, box.cx, box.cy);
        console.log(`Link "${box.text}" covered by:`, el);
    }
    
    await browser.close();
})();
