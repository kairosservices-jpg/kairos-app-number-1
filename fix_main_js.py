with open("main.js", "r") as f:
    content = f.read()

script_to_add = """
  // Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');
  const mainNav = document.getElementById('main-nav');
  
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      if (mainNav) mainNav.classList.toggle('menu-open');
    });
  }
"""

if "Mobile Menu Toggle" not in content:
    content = content.replace("document.addEventListener('DOMContentLoaded', () => {", "document.addEventListener('DOMContentLoaded', () => {\n" + script_to_add)

with open("main.js", "w") as f:
    f.write(content)
