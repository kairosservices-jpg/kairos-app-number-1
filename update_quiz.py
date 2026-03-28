import re

with open('/Users/danielwee/Kairos - App/apply.html', 'r') as f:
    content = f.read()

new_quiz_html = """                <!-- Step 1 -->
                <div class="quiz-step active" id="quiz-step-1">
                    <span class="font-heading" style="font-size: 0.8rem; letter-spacing: 0.2em; color: var(--color-red); display: block; margin-bottom: 0.5rem;">Free Audit</span>
                    <h2 class="font-heading" style="font-size: 2.5rem; margin-bottom: 1rem;">Find Out Exactly Why You Aren't Losing Weight</h2>
                    <p style="color: rgba(255,255,255,0.7); margin-bottom: 2rem; max-width: 500px; margin-inline: auto;">Take this 60-second audit to uncover the #1 reason Spokane professionals fail to drop pounds.</p>
                    
                    <h3 class="font-heading" style="font-size: 1.5rem; margin-bottom: 1.5rem;">1. How often do you already know what you should eat—but don’t follow through?</h3>
                    <div class="quiz-options">
                        <button class="btn btn-secondary quiz-btn" data-next="quiz-step-2" data-score="0">Almost never</button>
                        <button class="btn btn-secondary quiz-btn" data-next="quiz-step-2" data-score="1">A few times a month</button>
                        <button class="btn btn-secondary quiz-btn" data-next="quiz-step-2" data-score="2">A few times a week</button>
                        <button class="btn btn-secondary quiz-btn" data-next="quiz-step-2" data-score="3">Most days</button>
                    </div>
                </div>

                <!-- Step 2 -->
                <div class="quiz-step" id="quiz-step-2" style="display: none;">
                    <span class="font-heading" style="font-size: 0.8rem; letter-spacing: 0.2em; color: var(--color-red); display: block; margin-bottom: 0.5rem;">Step 2 of 10</span>
                    <h3 class="font-heading" style="font-size: 1.5rem; margin-bottom: 1.5rem;">2. What usually causes you to go off plan?</h3>
                    <div class="quiz-options">
                        <button class="btn btn-secondary quiz-btn" data-next="quiz-step-3" data-score="0">I rarely go off plan</button>
                        <button class="btn btn-secondary quiz-btn" data-next="quiz-step-3" data-score="1">Social meals or weekends</button>
                        <button class="btn btn-secondary quiz-btn" data-next="quiz-step-3" data-score="2">Busy schedule and poor planning</button>
                        <button class="btn btn-secondary quiz-btn" data-next="quiz-step-3" data-score="3">I’m constantly making food decisions on the fly</button>
                    </div>
                    <button class="btn btn-secondary quiz-back-btn" data-prev="quiz-step-1" style="margin-top: 1.5rem; width: 100%; opacity: 0.7;">Back</button>
                </div>

                <!-- Step 3 -->
                <div class="quiz-step" id="quiz-step-3" style="display: none;">
                    <span class="font-heading" style="font-size: 0.8rem; letter-spacing: 0.2em; color: var(--color-red); display: block; margin-bottom: 0.5rem;">Step 3 of 10</span>
                    <h3 class="font-heading" style="font-size: 1.5rem; margin-bottom: 1.5rem;">3. How structured is your weekly eating routine right now?</h3>
                    <div class="quiz-options">
                        <button class="btn btn-secondary quiz-btn" data-next="quiz-step-4" data-score="0">Very structured—I eat on a consistent schedule</button>
                        <button class="btn btn-secondary quiz-btn" data-next="quiz-step-4" data-score="1">Somewhat structured, but not locked in</button>
                        <button class="btn btn-secondary quiz-btn" data-next="quiz-step-4" data-score="2">Inconsistent—some days are good, some are chaos</button>
                        <button class="btn btn-secondary quiz-btn" data-next="quiz-step-4" data-score="3">Almost no structure—I improvise most meals</button>
                    </div>
                    <button class="btn btn-secondary quiz-back-btn" data-prev="quiz-step-2" style="margin-top: 1.5rem; width: 100%; opacity: 0.7;">Back</button>
                </div>

                <!-- Step 4 -->
                <div class="quiz-step" id="quiz-step-4" style="display: none;">
                    <span class="font-heading" style="font-size: 0.8rem; letter-spacing: 0.2em; color: var(--color-red); display: block; margin-bottom: 0.5rem;">Step 4 of 10</span>
                    <h3 class="font-heading" style="font-size: 1.5rem; margin-bottom: 1.5rem;">4. By the end of the day, how much decision fatigue do you feel around food?</h3>
                    <div class="quiz-options">
                        <button class="btn btn-secondary quiz-btn" data-next="quiz-step-5" data-score="0">Very little</button>
                        <button class="btn btn-secondary quiz-btn" data-next="quiz-step-5" data-score="1">Some</button>
                        <button class="btn btn-secondary quiz-btn" data-next="quiz-step-5" data-score="2">A lot</button>
                        <button class="btn btn-secondary quiz-btn" data-next="quiz-step-5" data-score="3">It’s one of the main reasons I eat poorly</button>
                    </div>
                    <button class="btn btn-secondary quiz-back-btn" data-prev="quiz-step-3" style="margin-top: 1.5rem; width: 100%; opacity: 0.7;">Back</button>
                </div>

                <!-- Step 5 -->
                <div class="quiz-step" id="quiz-step-5" style="display: none;">
                    <span class="font-heading" style="font-size: 0.8rem; letter-spacing: 0.2em; color: var(--color-red); display: block; margin-bottom: 0.5rem;">Step 5 of 10</span>
                    <h3 class="font-heading" style="font-size: 1.5rem; margin-bottom: 1.5rem;">5. How often do work, family, or schedule disruptions knock your nutrition off track?</h3>
                    <div class="quiz-options">
                        <button class="btn btn-secondary quiz-btn" data-next="quiz-step-6" data-score="0">Rarely</button>
                        <button class="btn btn-secondary quiz-btn" data-next="quiz-step-6" data-score="1">Occasionally</button>
                        <button class="btn btn-secondary quiz-btn" data-next="quiz-step-6" data-score="2">Frequently</button>
                        <button class="btn btn-secondary quiz-btn" data-next="quiz-step-6" data-score="3">Constantly</button>
                    </div>
                    <button class="btn btn-secondary quiz-back-btn" data-prev="quiz-step-4" style="margin-top: 1.5rem; width: 100%; opacity: 0.7;">Back</button>
                </div>

                <!-- Step 6 -->
                <div class="quiz-step" id="quiz-step-6" style="display: none;">
                    <span class="font-heading" style="font-size: 0.8rem; letter-spacing: 0.2em; color: var(--color-red); display: block; margin-bottom: 0.5rem;">Step 6 of 10</span>
                    <h3 class="font-heading" style="font-size: 1.5rem; margin-bottom: 1.5rem;">6. Which best describes your dieting history?</h3>
                    <div class="quiz-options">
                        <button class="btn btn-secondary quiz-btn" data-next="quiz-step-7" data-score="0">I’ve been consistent and usually do well on plans</button>
                        <button class="btn btn-secondary quiz-btn" data-next="quiz-step-7" data-score="1">I’ve had some success, but I struggle to maintain it</button>
                        <button class="btn btn-secondary quiz-btn" data-next="quiz-step-7" data-score="2">I start strong, then fall off repeatedly</button>
                        <button class="btn btn-secondary quiz-btn" data-next="quiz-step-7" data-score="3">I’ve tried many things and keep ending up back where I started</button>
                    </div>
                    <button class="btn btn-secondary quiz-back-btn" data-prev="quiz-step-5" style="margin-top: 1.5rem; width: 100%; opacity: 0.7;">Back</button>
                </div>

                <!-- Step 7 -->
                <div class="quiz-step" id="quiz-step-7" style="display: none;">
                    <span class="font-heading" style="font-size: 0.8rem; letter-spacing: 0.2em; color: var(--color-red); display: block; margin-bottom: 0.5rem;">Step 7 of 10</span>
                    <h3 class="font-heading" style="font-size: 1.5rem; margin-bottom: 1.5rem;">7. When healthy food is not already handled for you, what happens?</h3>
                    <div class="quiz-options">
                        <button class="btn btn-secondary quiz-btn" data-next="quiz-step-8" data-score="0">I still make solid choices most of the time</button>
                        <button class="btn btn-secondary quiz-btn" data-next="quiz-step-8" data-score="1">I do okay, but not consistently</button>
                        <button class="btn btn-secondary quiz-btn" data-next="quiz-step-8" data-score="2">I often end up grabbing whatever is convenient</button>
                        <button class="btn btn-secondary quiz-btn" data-next="quiz-step-8" data-score="3">I usually default to poor choices or skip meals entirely</button>
                    </div>
                    <button class="btn btn-secondary quiz-back-btn" data-prev="quiz-step-6" style="margin-top: 1.5rem; width: 100%; opacity: 0.7;">Back</button>
                </div>

                <!-- Step 8 -->
                <div class="quiz-step" id="quiz-step-8" style="display: none;">
                    <span class="font-heading" style="font-size: 0.8rem; letter-spacing: 0.2em; color: var(--color-red); display: block; margin-bottom: 0.5rem;">Step 8 of 10</span>
                    <h3 class="font-heading" style="font-size: 1.5rem; margin-bottom: 1.5rem;">8. How much external accountability do you need to actually stay compliant?</h3>
                    <div class="quiz-options">
                        <button class="btn btn-secondary quiz-btn" data-next="quiz-step-9" data-score="0">Very little—I’m highly self-directed</button>
                        <button class="btn btn-secondary quiz-btn" data-next="quiz-step-9" data-score="1">Some check-ins help</button>
                        <button class="btn btn-secondary quiz-btn" data-next="quiz-step-9" data-score="2">I do much better with regular oversight</button>
                        <button class="btn btn-secondary quiz-btn" data-next="quiz-step-9" data-score="3">Without strong accountability, I do not stay consistent</button>
                    </div>
                    <button class="btn btn-secondary quiz-back-btn" data-prev="quiz-step-7" style="margin-top: 1.5rem; width: 100%; opacity: 0.7;">Back</button>
                </div>

                <!-- Step 9 -->
                <div class="quiz-step" id="quiz-step-9" style="display: none;">
                    <span class="font-heading" style="font-size: 0.8rem; letter-spacing: 0.2em; color: var(--color-red); display: block; margin-bottom: 0.5rem;">Step 9 of 10</span>
                    <h3 class="font-heading" style="font-size: 1.5rem; margin-bottom: 1.5rem;">9. How important is it for you to get predictable results in the next 12 weeks?</h3>
                    <div class="quiz-options">
                        <button class="btn btn-secondary quiz-btn" data-next="quiz-step-10" data-score="0">Nice to have, but not urgent</button>
                        <button class="btn btn-secondary quiz-btn" data-next="quiz-step-10" data-score="1">Important</button>
                        <button class="btn btn-secondary quiz-btn" data-next="quiz-step-10" data-score="2">Very important</button>
                        <button class="btn btn-secondary quiz-btn" data-next="quiz-step-10" data-score="3">Non-negotiable—I need this to work</button>
                    </div>
                    <button class="btn btn-secondary quiz-back-btn" data-prev="quiz-step-8" style="margin-top: 1.5rem; width: 100%; opacity: 0.7;">Back</button>
                </div>

                <!-- Step 10 -->
                <div class="quiz-step" id="quiz-step-10" style="display: none;">
                    <span class="font-heading" style="font-size: 0.8rem; letter-spacing: 0.2em; color: var(--color-red); display: block; margin-bottom: 0.5rem;">Step 10 of 10</span>
                    <h3 class="font-heading" style="font-size: 1.5rem; margin-bottom: 1.5rem;">10. Which statement sounds most like you right now?</h3>
                    <div class="quiz-options">
                        <button class="btn btn-secondary quiz-btn" data-next="quiz-step-email" data-score="0">I mostly need minor tightening up</button>
                        <button class="btn btn-secondary quiz-btn" data-next="quiz-step-email" data-score="1">I need better consistency in a few key areas</button>
                        <button class="btn btn-secondary quiz-btn" data-next="quiz-step-email" data-score="2">I need a more controlled system than I’ve been using</button>
                        <button class="btn btn-secondary quiz-btn" data-next="quiz-step-email" data-score="3">What I’m doing clearly isn’t working—I need a much higher level of control</button>
                    </div>
                    <button class="btn btn-secondary quiz-back-btn" data-prev="quiz-step-9" style="margin-top: 1.5rem; width: 100%; opacity: 0.7;">Back</button>
                </div>

                <!-- Step 11 (Email) -->
                <div class="quiz-step" id="quiz-step-email" style="display: none;">
                    <span class="font-heading" style="font-size: 0.8rem; letter-spacing: 0.2em; color: var(--color-red); display: block; margin-bottom: 0.5rem;">Results Ready</span>
                    <h2 class="font-heading" style="font-size: 2.2rem; margin-bottom: 1rem;">Your Customized Plan Requires Our 30-Min Fast-Track Method.</h2>
                    <p style="color: rgba(255,255,255,0.7); margin-bottom: 2rem; max-width: 500px; margin-inline: auto;">Enter your email to instantly receive <strong>The Spokane Executive's Guide to Losing 10lbs</strong> based on your answers.</p>
                    
                    <form class="lead-magnet-form" id="quiz-form">
                        <input type="email" class="lead-input" placeholder="Enter your best email address" required />
                        <button type="submit" class="btn btn-primary lead-btn">Reveal My Results & Get Guide</button>
                    </form>
                    <button class="btn btn-secondary quiz-back-btn" data-prev="quiz-step-10" style="margin-top: 1.5rem; width: 100%; opacity: 0.7;">Back</button>
                </div>
"""

# Extract the region between <!-- Step 1 --> and <!-- Step 14 (Success) -->
pattern = r'(<!-- Step 1 -->).*?(<!-- Step 14 \(Success\) -->)'
new_content = re.sub(pattern, new_quiz_html.strip() + '\n                \n                \\2', content, flags=re.DOTALL)

with open('/Users/danielwee/Kairos - App/apply.html', 'w') as f:
    f.write(new_content)

with open('/Users/danielwee/Kairos - App/main.js', 'r') as f:
    main_content = f.read()

# Replace single select option logic to capture scores
main_old_logic = """        // Single Select Option Handling
        if (questionText) {
            userAnswers[questionText] = answerText;
        }"""
main_new_logic = """        // Single Select Option Handling
        if (questionText) {
            userAnswers[questionText] = answerText;
            const scoreAttr = btn.getAttribute('data-score');
            if (scoreAttr !== null) {
                userAnswers['score_' + questionText] = parseInt(scoreAttr, 10);
            }
        }"""
main_content = main_content.replace(main_old_logic, main_new_logic)

# Calculate totalScore on submit before Klaviyo object creation
submit_old_logic = """        userAnswers['email'] = email;
        
        console.log('Quiz completed. Data captured:', userAnswers);"""
submit_new_logic = """        userAnswers['email'] = email;
        
        let totalScore = 0;
        let hasScore = false;
        for (const key in userAnswers) {
            if (key.startsWith('score_')) {
                totalScore += userAnswers[key];
                hasScore = true;
            }
        }
        if (hasScore) {
            userAnswers['totalScore'] = totalScore;
        }
        
        console.log('Quiz completed. Data captured:', userAnswers);"""
main_content = main_content.replace(submit_old_logic, submit_new_logic)

with open('/Users/danielwee/Kairos - App/main.js', 'w') as f:
    f.write(main_content)

print("Files modified successfully.")
