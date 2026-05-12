import re

with open('main.js', 'r') as f:
    js = f.read()

# Let's add a generic click listener to all nav-menu links
menu_close_code = """
  // Close menu on link click for immediate visual feedback
  const allNavLinks = document.querySelectorAll('.nav-menu a');
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        if (mainNav) mainNav.classList.remove('menu-open');
      }
    });
  });
"""

if "Close menu on link click" not in js:
    # Insert it right after the mobileMenuBtn listener
    target = """  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      if (mainNav) mainNav.classList.toggle('menu-open');
    });
  }"""
    
    js = js.replace(target, target + "\n" + menu_close_code)
    with open('main.js', 'w') as f:
        f.write(js)
    print("Added menu close logic to main.js!")
else:
    print("Menu close logic already present.")
