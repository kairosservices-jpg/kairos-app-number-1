import re

with open('apply.html', 'r') as f:
    text = f.read()

# Total steps is now 13
text = text.replace('of 12', 'of 13')

# We must go from 11 down to 2 to avoid double-replacing (e.g., changing 2 to 3, then 3 to 4)
for i in range(11, 1, -1):
    new_i = i + 1
    # Replace the ID
    text = text.replace(f'id="quiz-step-{i}"', f'id="quiz-step-{new_i}"')
    
    # Replace the Step span
    text = text.replace(f'Step {i} of', f'Step {new_i} of')
    
    # Replace the heading number
    text = text.replace(f'>{i}. ', f'>{new_i}. ')
    
    # Replace the data-next
    text = text.replace(f'data-next="quiz-step-{i}"', f'data-next="quiz-step-{new_i}"')
    
    # Replace the data-prev
    text = text.replace(f'data-prev="quiz-step-{i}"', f'data-prev="quiz-step-{new_i}"')
    
    # Replace the comment <!-- Step X -->
    text = text.replace(f'<!-- Step {i} -->', f'<!-- Step {new_i} -->')

# Now insert the new Step 2 after Step 1
old_step_1_end = '''                   </div>
                </div>

                <!-- Step 3 -->'''

new_step_2 = '''                   </div>
                </div>

                <!-- Step 2 -->
                <div class="quiz-step" id="quiz-step-2" style="display: none;">
                    <span class="font-heading" style="font-size: 0.8rem; letter-spacing: 0.2em; color: var(--color-red); display: block; margin-bottom: 0.5rem;">Step 2 of 13</span>
                    <h3 class="font-heading" style="font-size: 1.5rem; margin-bottom: 1.5rem;">2. How old are you?</h3>
                    <div class="quiz-options">
                        <input type="number" class="lead-input" placeholder="e.g. 35" data-question="How old are you?" required style="margin-bottom: 0;" />
                        <button class="btn btn-secondary text-next-btn" data-next="quiz-step-3" style="margin-top: 1rem; width: 100%;">Next</button>
                    </div>
                    <button class="btn btn-secondary quiz-back-btn" data-prev="quiz-step-1" style="margin-top: 1.5rem; width: 100%; opacity: 0.7;">Back</button>
                </div>

                <!-- Step 3 -->'''

text = text.replace(old_step_1_end, new_step_2)

# One more thing: The old Step 12 was Step 12 of 12, now it should be Step 13 of 13
text = text.replace('Step 12 of 13', 'Step 13 of 13')
text = text.replace('<!-- Step 12 (Email + Phone) -->', '<!-- Step 13 (Email + Phone) -->')
# Step 1 was: data-next="quiz-step-2", this correctly points to the new step 2!
# Step 12's prev needs to point to the new step 12 (old step 11 was updated to 12).
# Wait, did old step 11's prev change correctly?
# Old step 11 back button: data-prev="quiz-step-10" -> data-prev="quiz-step-11".
# The final email step back button was: data-prev="quiz-step-11", it should become data-prev="quiz-step-12".
text = text.replace('data-prev="quiz-step-11"', 'data-prev="quiz-step-12"')

with open('apply.html', 'w') as f:
    f.write(text)
    
print("Updated!")
