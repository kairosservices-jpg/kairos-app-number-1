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

  // Chatbox Send (mock)
  const chatInput = document.querySelector('.chat-input');
  const chatSend = document.querySelector('.chat-send');
  const chatMessages = document.querySelector('.chat-messages');

  if (chatSend && chatInput && chatMessages) {
    const sendMessage = () => {
      const text = chatInput.value.trim();
      if (text) {
        const msg = document.createElement('div');
        msg.className = 'chat-message message-user';
        msg.textContent = text;
        chatMessages.appendChild(msg);
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
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
        const emailInput = quizForm.querySelector('input[type="email"]');
        const email = emailInput.value;
        
        userAnswers['email'] = email;
        
        // TODO: Send exact data to Klaviyo/n8n/Supabase right here.
        console.log('Quiz completed. Data captured:', userAnswers);
        
        const currentStep = quizForm.closest('.quiz-step');
        const nextStep = document.getElementById('quiz-step-success');
        
        if (currentStep && nextStep) {
            currentStep.style.display = 'none';
            nextStep.style.display = 'block';
        }
      });
    }
  }
});
