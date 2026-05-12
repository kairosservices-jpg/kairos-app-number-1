from playwright.sync_api import sync_playwright

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        # Simulate mobile device
        context = browser.new_context(
            viewport={'width': 375, 'height': 812},
            is_mobile=True,
            has_touch=True
        )
        page = context.new_page()
        
        # We will track what element was actually clicked
        page.on("console", lambda msg: print(f"Browser console: {msg.text}"))
        
        page.goto("http://localhost:5173/")
        
        # Click mobile menu button
        print("Clicking mobile menu button...")
        page.click(".mobile-menu-btn")
        
        # Wait for menu to open
        page.wait_for_timeout(1000)
        
        # Try to click Contact
        print("Clicking Contact link...")
        # Get coordinates of the "Contact" link
        contact_link = page.locator("a", has_text="Contact").first
        box = contact_link.bounding_box()
        if box:
            print(f"Contact link box: {box}")
            # Click exactly at the center of the Contact link
            x = box['x'] + box['width'] / 2
            y = box['y'] + box['height'] / 2
            print(f"Clicking at {x}, {y}")
            page.mouse.click(x, y)
        else:
            print("Contact link not found!")
            
        page.wait_for_timeout(1000)
        
        browser.close()

if __name__ == "__main__":
    main()
