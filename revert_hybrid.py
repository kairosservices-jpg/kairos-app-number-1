import re

# 1. Update style.css
with open('style.css', 'r') as f:
    css = f.read()

# Testimonial squared in black
# .review-card { background: var(--color-surface); ... } Wait, where is color-surface? I didn't define it. It was var(--color-gray-900) or something? No, it was var(--color-surface).
# I'll just hardcode .review-card { background: #121212; color: #fff; border: 1px solid rgba(255,255,255,0.1); ... }
css = re.sub(
    r'\.review-card\s*\{[^}]*\}',
    '.review-card {\n  background: #121212;\n  color: #fff;\n  border: 1px solid rgba(255,255,255,0.1);\n  border-radius: 12px;\n  padding: var(--space-xl);\n  width: 380px;\n  flex-shrink: 0;\n  display: flex;\n  flex-direction: column;\n  gap: var(--space-md);\n  transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), border-color 0.4s ease;\n  box-shadow: 0 10px 30px rgba(0,0,0,0.5);\n}',
    css, flags=re.MULTILINE)

# Testimonial text color inside review card
css = css.replace('.review-text {\n  font-style: italic;\n  color: rgba(0, 0, 0, 0.85);',
                  '.review-text {\n  font-style: italic;\n  color: rgba(255, 255, 255, 0.85);')

# Testimonial reviewer border
css = css.replace('.reviewer {\n  display: flex;\n  align-items: center;\n  gap: var(--space-md);\n  margin-top: var(--space-sm);\n  border-top: 1px solid rgba(0,0,0,0.1);\n  padding-top: var(--space-md);\n}',
                  '.reviewer {\n  display: flex;\n  align-items: center;\n  gap: var(--space-md);\n  margin-top: var(--space-sm);\n  border-top: 1px solid rgba(255,255,255,0.1);\n  padding-top: var(--space-md);\n}')

# Pict    css, flags=re.MULTILINE)

# Testimonial text color inside review card
css = css.replace('.review-text {\n  font-style: ita'opacity: 0.15;\n  filter: grayscale(1);', 'opacity: 0.5;\n  filter: none;')

with open('style.css', 'w') as f:
    f.write(css)

# 2. Update index.html
with open('index.html', 'r') as f:
    html = f.read()

# Header black
# <nav style="... background: rgba(255,255,255,0.95); ... border-bottom: 1px solid rgba(0,0,0,0.05);">
html = html.replace('background: rgba(255,255,255,0.95);', 'background: rgba(0,0,0,0.8);')
html = html.replace('border-bottom: 1px solid rgba(0,0,0,0.05);', 'border-bottom: 1px solid rgba(255,255,255,0.1);')

# The nav links color:
# They use color: var(--color-white). Now that color-white is black, they are black. But the nav is black, so links must be #fff.
html = html.replace('color: var(--color-white); text-decoration: none;', 'color: #FFFFFF; text-decoration: none;')

# Footer black
# <footer class="section-padding" style="text-align: center; border-top: 1px solid rgba(0,0,0,0.05);">
html = html.replace('<footer class="section-padding" style="text-align: center; border-top: 1px solid rgba(0,0,0,0.05);">',
                    '<footer class="section-padding" style="text-align: center; background: #000; color: #fff; border-top: 1px solid rgba(255,255,255,0.05);">')

# Note: The logo in nav and footer has filter: brightness(0); globally in CSS.
# I should undo that for nav and footer.
css_logo = """
/* Fix logos in dark headers/footers */
.logo-nav, .logo-footer {
  filter: brightness(0) invert(1);
}
"""
with open('style.css', 'a') as f:
    f.write(css_logo)

with open('index.html', 'w') as f:
    f.write(html)

# 3. Update apply.html (Quiz black)
with open('apply.html', 'r') as f:
    apply_html = f.read()

# Override the body variables right on the body tag for apply.html
apply_html = apply_html.replace('<body>', '<body style="--color-black: #000000; --color-white: #FFFFFF; --color-gray-900: #121212; background: var(--color-black); color: var(--color-white);">')

with open('apply.html', 'w') as f:
    f.write(apply_html)

print("Hybrid theme applied!")
