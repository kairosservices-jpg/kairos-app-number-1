document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer for scroll reveal animations
  const revealElements = document.querySelectorAll('[data-reveal]');

  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // Button interaction tracking (mock)
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      console.log(`Action captured: ${btn.id || btn.textContent}`);
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // Chatbox Toggle
  const chatButton = document.getElementById('chat-button');
  const chatWindow = document.getElementById('chat-window');
  const closeChat = document.getElementById('close-chat');

  if (chatButton && chatWindow) {
    chatButton.addEventListener('click', () => {
      chatWindow.classList.toggle('active');
    });
  }

  if (closeChat) {
    closeChat.addEventListener('click', () => {
      chatWindow.classList.remove('active');
    });
  }

  // Chatbox Send with OpenAI Integration
  const chatInput = document.querySelector('.chat-input');
  const chatSend = document.querySelector('.chat-send');
  const chatMessages = document.querySelector('.chat-messages');

  if (chatSend && chatInput && chatMessages) {
    let conversationHistory = [
      { role: "system", content: "You are the Kairos Nutrition Advisor. You help high-performing Spokane professionals (working 50+ hours a week) achieve their fitness and nutrition goals with minimal time commitment. Be concise, motivating, and professional." }
    ];

    const sendMessage = async () => {
      const text = chatInput.value.trim();
      if (!text) return;

      // Add user message to DOM
      const userMsg = document.createElement('div');
      userMsg.className = 'chat-message message-user';
      userMsg.textContent = text;
      chatMessages.appendChild(userMsg);
      chatInput.value = '';
      chatMessages.scrollTop = chatMessages.scrollHeight;

      // Add to conversation history
      conversationHistory.push({ role: "user", content: text });

      // Add a loading message to DOM
      const loadingMsg = document.createElement('div');
      loadingMsg.className = 'chat-message message-bot';
      loadingMsg.textContent = 'Thinking...';
      chatMessages.appendChild(loadingMsg);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) {
        loadingMsg.textContent = 'Error: Missing VITE_OPENAI_API_KEY environment variable.';
        return;
      }

      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini", // Very fast, cheap model
            messages: conversationHistory
          })
        });

        const data = await response.json();

        if (data.error) {
          loadingMsg.textContent = `Error: ${data.error.message}`;
          // Remove from history so retries work cleanly
          conversationHistory.pop(); 
          return;
        }

        const botReply = data.choices[0].message.content;
        
        // Update DOM with actual reply
        loadingMsg.textContent = botReply;
        
        // Store in conversation history
        conversationHistory.push({ role: "assistant", content: botReply });
        chatMessages.scrollTop = chatMessages.scrollHeight;

      } catch (err) {
        console.error("Chat API Error:", err);
        loadingMsg.textContent = "Sorry, I'm having trouble connecting right now.";
        conversationHistory.pop();
      }
    };

    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }

  // Quiz Logic
  const quizContainer = document.getElementById('lead-quiz');
  if (quizContainer) {
    const quizBtns = quizContainer.querySelectorAll('.quiz-btn');
    const nextBtns = quizContainer.querySelectorAll('.next-step-btn');
    
    // Store user answers if we want to send them to Klaviyo later
    const userAnswers = {};
    
    quizBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const currentStep = btn.closest('.quiz-step');
        const questionText = currentStep.querySelector('h3')?.textContent;
        const answerText = btn.textContent.replace('→', '').replace('✓', '').trim();
        
        // Handle Multi-Select Options
        if (btn.classList.contains('multi-select')) {
            const nextStepBtn = currentStep.querySelector('.next-step-btn');
            
            // "None" or "None of the above" selection logic
            if (btn.classList.contains('exclusive')) {
                // Deselect everything else
                const siblings = currentStep.querySelectorAll('.quiz-btn.multi-select:not(.exclusive)');
                siblings.forEach(sib => sib.classList.remove('selected'));
                btn.classList.toggle('selected');
            } else {
                // Select a normal option, deselect "None of the above"
                const exclusiveBtn = currentStep.querySelector('.quiz-btn.multi-select.exclusive');
                if (exclusiveBtn) exclusiveBtn.classList.remove('selected');
                btn.classList.toggle('selected');
            }
            
            // Show Next button if at least one is selected
            const selectedOptions = currentStep.querySelectorAll('.quiz-btn.multi-select.selected');
            if (nextStepBtn) {
                if (selectedOptions.length > 0) {
                    nextStepBtn.style.display = 'block';
                } else {
                    nextStepBtn.style.display = 'none';
                }
            }
            return; // Don't proceed to next step automatically
        }
        
        // Single Select Option Handling
        if (questionText) {
            userAnswers[questionText] = answerText;
            const scoreAttr = btn.getAttribute('data-score');
            if (scoreAttr !== null) {
                userAnswers['score_' + questionText] = parseInt(scoreAttr, 10);
            }
        }
        
        const nextStepId = btn.getAttribute('data-next');
        const nextStep = document.getElementById(nextStepId);
        
        if (currentStep && nextStep) {
          currentStep.style.display = 'none';
          nextStep.style.display = 'block';
        }
      });
    });

    nextBtns.forEach(nextBtn => {
        nextBtn.addEventListener('click', (e) => {
            const currentStep = nextBtn.closest('.quiz-step');
            const questionText = currentStep.querySelector('h3')?.textContent;
            
            const selectedOptions = currentStep.querySelectorAll('.quiz-btn.multi-select.selected');
            const answers = Array.from(selectedOptions).map(btn => btn.textContent.replace('→', '').replace('✓', '').trim());
            
            if (questionText) {
                userAnswers[questionText] = answers;
            }
            
            const nextStepId = nextBtn.getAttribute('data-next');
            const nextStep = document.getElementById(nextStepId);
            
            if (currentStep && nextStep) {
                currentStep.style.display = 'none';
                nextStep.style.display = 'block';
            }
        });
    });

    const textNextBtns = quizContainer.querySelectorAll('.text-next-btn');
    textNextBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const currentStep = btn.closest('.quiz-step');
            const inputs = currentStep.querySelectorAll('.lead-input');
            
            let allValid = true;
            inputs.forEach(input => {
                if (input.value.trim() === '') {
                    allValid = false;
                    input.style.border = '1px solid var(--color-red)';
                    setTimeout(() => {
                        input.style.border = '';
                    }, 2000);
                }
            });
            
            if (allValid && inputs.length > 0) {
                inputs.forEach(input => {
                    const questionText = input.getAttribute('data-question');
                    if (questionText) {
                        userAnswers[questionText] = input.value.trim();
                        if (questionText === "What's your first name?") {
                            userAnswers['first_name'] = input.value.trim();
                        }
                        if (questionText === "What's your last name?") {
                            userAnswers['last_name'] = input.value.trim();
                        }
                    }
                });
                
                const nextStepId = btn.getAttribute('data-next');
                const nextStep = document.getElementById(nextStepId);
                
                if (currentStep && nextStep) {
                    currentStep.style.display = 'none';
                    nextStep.style.display = 'block';
                }
            }
        });
    });

    const backBtns = quizContainer.querySelectorAll('.quiz-back-btn');
    backBtns.forEach(backBtn => {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const currentStep = backBtn.closest('.quiz-step');
            const prevStepId = backBtn.getAttribute('data-prev');
            const prevStep = document.getElementById(prevStepId);
            
            if (currentStep && prevStep) {
                currentStep.style.display = 'none';
                prevStep.style.display = 'block';
            }
        });
    });
    const quizForm = document.getElementById('quiz-form');
    if (quizForm) {
      quizForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('quiz-email');
        const phoneInput = document.getElementById('quiz-phone');
        
        const email = emailInput ? emailInput.value.trim() : '';
        const phone = phoneInput ? phoneInput.value.trim() : '';
        
        userAnswers['email'] = email;
        userAnswers['phone_number'] = phone;
        
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
        
        console.log('Quiz completed. Data captured:', userAnswers);
        
        // Send data to Klaviyo
        const klaviyoPublicKey = 'QWmkMT'; // Hardcoded for production
        if (klaviyoPublicKey && klaviyoPublicKey !== 'YOUR_KLAVIYO_PUBLIC_KEY_HERE') {
            const klaviyoData = {
                data: {
                    type: 'event',
                    attributes: {
                        properties: userAnswers,
                        metric: {
                            data: {
                                type: 'metric',
                                attributes: { name: 'Completed Quiz' }
                            }
                        },
                        profile: {
                            data: {
                                type: 'profile',
                                attributes: {
                                    email: email,
                                    phone_number: phone,
                                    first_name: userAnswers['first_name'] || '',
                                    properties: userAnswers
                                }
                            }
                        }
                    }
                }
            };

            fetch(`https://a.klaviyo.com/client/events/?company_id=${klaviyoPublicKey}`, {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    revision: '2024-02-15',
                    'content-type': 'application/json'
                },
                body: JSON.stringify(klaviyoData)
            })
            .then(async res => {
                if (!res.ok) {
                    const errorText = await res.text();
                    console.error('Klaviyo API Error:', errorText);
                } else {
                    console.log('Successfully sent to Klaviyo');
                }
            })
            .catch(err => console.error('Error sending to Klaviyo:', err));
        } else {
            console.warn('VITE_KLAVIYO_PUBLIC_KEY is not set or is still the placeholder. Skipping Klaviyo integration.');
        }

        const makeWebhookUrl = 'https://hook.us2.make.com/2p5li29o1by9kjksn4h0lnpgghjma3qa'; // Hardcoded for production
        
        // Show loading state
        const submitBtn = quizForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn ? submitBtn.textContent : 'Get My Plan';
        if (submitBtn) {
            submitBtn.textContent = 'Processing...';
            submitBtn.disabled = true;
        }

        if (makeWebhookUrl) {
            fetch(makeWebhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userAnswers)
            })
            .then(async response => {
                if (!response.ok) {
                    throw new Error('Make webhook returned an error status: ' + response.status);
                }
                // Check if the response is plain text "Accepted" which make.com returns when scenario is off or fails
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('text/plain')) {
                    const text = await response.text();
                    if (text === "Accepted") {
                        throw new Error("MAKE_SCENARIO_OFF");
                    }
                }
                return response.json();
            })
            .then(data => {
                console.log('Successfully sent to Make webhook. Response:', data);
                
                // Redirect based on the route string returned by Make
                if (data && data.route) {
                    window.location.href = `/${data.route}.html`;
                } else {
                    console.warn('No route provided by Make, falling back to success screen.');
                    showSuccessStep();
                }
            })
            .catch(error => {
                console.error('Error sending to Make webhook:', error);
                if (error.message === "MAKE_SCENARIO_OFF") {
                    alert("It looks like your Make.com scenario is turned OFF or failed to start! Make.com caught the data, but didn't send a URL back. Please click 'Run once' in Make.com and try again.");
                }
                showSuccessStep(); // Fallback if Webhook fails
            })
            .finally(() => {
                 if (submitBtn) {
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                 }
            });
        } else {
             console.warn('VITE_MAKE_WEBHOOK_URL is not set. Falling back to success screen.');
             showSuccessStep();
             if (submitBtn) {
                 submitBtn.textContent = originalBtnText;
                 submitBtn.disabled = false;
             }
        }
        
        function showSuccessStep() {
            console.log("Redirecting to fallback success page...");
            window.location.href = "/non-local.html";
        }
      });
    }
  }
});
