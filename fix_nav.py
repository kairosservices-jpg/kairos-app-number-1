import glob

# 1. replace `<nav ... style="...">` with `<nav id="main-nav" class="main-nav">`
# 2. replace mobileMenuBtn script with the updated one

for file in glob.glob('*.html'):
    with open(file, 'r') as f:
        content = f.read()

    # Simple replace for nav inline style
    content = content.replace(
        '<nav\n        style="position: fixed; top: 0; width: 100%; z-index: 1000; padding: 0.5rem 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(255,255,255,0.05);">',
        '<nav id="main-nav" class="main-nav">'
    )
    content = content.replace(
        '<nav style="position: fixed; top: 0; width: 100%; z-index: 1000; padding: 0.5rem 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(255,255,255,0.05);">',
        '<nav id="main-nav" class="main-nav">'
    )

    # Simple replace for the toggle
    old_script = """            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            const navMenu = document.querySelector('.nav-menu');
            if (mobileMenuBtn && navMenu) {
                mobileMenuBtn.addEventListener('click', () => {
                    navMenu.classList.toggle('active');
                });
            }"""
    
    new_script = """            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            const navMenu = document.querySelector('.nav-menu');
            const mainNav = document.getElementById('main-nav');
            if (mobileMenuBtn && navMenu) {
                mobileMenuBtn.addEventListener('click', () => {
                    navMenu.classList.toggle('active');
                    if (mainNav) mainNav.classList.toggle('menu-open');
                });
            }"""
    
    content = content.replace(old_script, new_script)

    with open(file, 'w') as f:
        f.write(content)

