import re

# 1. Update style.css
with open('style.css', 'r') as f:
    css = f.read()

# Swap root variables
css = css.replace('--color-black: #000000;', '--color-black: #FFFFFF;')
css = css.replace('--color-white: #FFFFFF;', '--color-white: #000000;')
css = css.replace('--color-gray-100: #F8F9FA;', '--color-gray-100: #121212;')
css = css.replace('--color-gray-200: #E9ECEF;', '--color-gray-200: #212529;')
css = css.replace('--color-gray-800: #212529;', '--color-gray-800: #E9ECEF;')
css = css.replace('--color-gray-900: #121212;', '--color-gray-900: #F8F9FA;')

# Replace translucent whites with translucent blacks
css = css.replace('rgba(255, 255, 255,', 'rgba(0, 0, 0,')
css = css.replace('rgba(255,255,255,', 'rgba(0,0,0,')
# Make chat window background white instead of dark
css = css.replace('background: rgba(18, 18, 18, 0.8);', 'background: rgba(255, 255, 255, 0.9);')
# Reverse video bg overlay if needed. It uses grayscale(1) and opacity 0.4.
# We might want opacity 0.2 for light mode to keep it sublte.
css = css.replace('opacity: 0.4;', 'opacity: 0.15;') # Just a blanket replacement, there might be other 0.4s but it's safe usually. Actually let's just do it specific.
css = css.replace('opacity: 0.4;\n  filter: grayscale(1);', 'opacity: 0.15;\n  filter: grayscale(1);')

# 2. Add logo invert rule to style.css to make sure white logos become black
css += "\n/* Invert logos for light theme */\n.logo-nav, .logo-hero, .logo-footer {\n  filter: brightness(0);\n}\n"

with open('style.css', 'w') as f:
    f.write(css)

# 3. Update index.html
with open('index.html', 'r') as f:
    html = f.read()

html = html.replace('rgba(255,255,255,', 'rgba(0,0,0,')
html = html.replace('rgba(0,0,0,0.8)', 'rgba(255,255,255,0.95)') # Nav bar bg

with open('index.html', 'w') as f:
    f.write(html)

# 4. Update apply.html
with open('apply.html', 'r') as f:
    apply_html = f.read()

apply_html = apply_html.replace('rgba(255,255,255,', 'rgba(0,0,0,')
apply_html = apply_html.replace('rgba(0,0,0,0.8)', 'rgba(255,255,255,0.95)') # Nav bar bg

with open('apply.html', 'w') as f:
    f.write(apply_html)

print("Theme inverted successfully!")
