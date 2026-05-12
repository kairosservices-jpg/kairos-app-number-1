import re

with open('style.css', 'r') as f:
    css = f.read()

main_nav_old = """/* Main Navigation */
.main-nav {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  padding: 0.5rem 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: background 0.3s ease, backdrop-filter 0.3s ease;
}

.main-nav.menu-open {
  background: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  border-bottom: none;
  height: 100vh; /* Force container to expand so iOS Safari does not clip touch events */
}"""

main_nav_new = """/* Main Navigation */
.main-nav {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.main-nav::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: -1;
  transition: opacity 0.3s ease;
}

.main-nav.menu-open {
  border-bottom: none;
}

.main-nav.menu-open::before {
  opacity: 0;
}"""

if main_nav_old in css:
    css = css.replace(main_nav_old, main_nav_new)
    with open('style.css', 'w') as f:
        f.write(css)
    print("Updated style.css successfully!")
else:
    print("Could not find the exact old block.")
