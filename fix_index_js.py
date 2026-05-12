with open("index.html", "r") as f:
    content = f.read()

import re
pattern = r"const mobileMenuBtn = document\.querySelector\('\.mobile-menu-btn'\);.*?if \(mobileMenuBtn && navMenu\) \{.*?\}.*?\}\n"
# Actually easier to just replace the whole thing if I know exactly what it looks like.
old_script = """            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            const navMenu = document.querySelector('.nav-menu');
            const mainNav = document.getElementById('main-nav');
            if (mobileMenuBtn && navMenu) {
                mobileMenuBtn.addEventListener('click', () => {
                    navMenu.classList.toggle('active');
                    if (mainNav) mainNav.classList.toggle('menu-open');
                });
            }"""

content = content.replace(old_script, "")

with open("index.html", "w") as f:
    f.write(content)
