import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        # iPhone 13 Pro Max dimensions
        context = await browser.new_context(viewport={'width': 428, 'height': 926}, is_mobile=True, has_touch=True)
        page = await context.new_page()
        await page.goto("http://localhost:5173" if "vite" in open(f"/proc/27988/cmdline", "r").read() else "http://localhost:8000", wait_until="networkidle")

        # Wait for any animations to settle
        await page.wait_for_timeout(1000)

        # Get bounding box of the hero button
        btn = page.locator("#btn-hero-build")
        box = await btn.bounding_box()
        
        if box:
            x = box['x'] + box['width'] / 2
            y = box['y'] + box['height'] / 2
            print(f"Button center is at {x}, {y}")
            
            # Check what element is at this point
            handle = await page.evaluate_handle(f"document.elementFromPoint({x}, {y})")
            element_info = await page.evaluate(
                "el => el ? {tag: el.tagName, id: el.id, className: el.className} : null", 
                handle
            )
            print(f"Element at point: {element_info}")
        else:
            print("Button not found or invisible")
            
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
