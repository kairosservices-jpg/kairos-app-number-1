import re

with open('style.css', 'r') as f:
    css = f.read()

chat_widget_old = """/* Chatbox */
.chat-widget {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  pointer-events: none; /* Prevent invisible box from eating clicks */
}"""

chat_widget_new = """/* Chatbox */
.chat-widget {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 900;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  pointer-events: none; /* Prevent invisible box from eating clicks */
}"""

if chat_widget_old in css:
    css = css.replace(chat_widget_old, chat_widget_new)
    with open('style.css', 'w') as f:
        f.write(css)
    print("Updated chat-widget z-index successfully!")
else:
    print("Could not find the exact old block for chat-widget.")
