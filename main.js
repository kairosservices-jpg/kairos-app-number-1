document.addEventListener('DOMContentLoaded', () => {

  // Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');
  const mainNav = document.getElementById('main-nav');
  
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      if (mainNav) mainNav.classList.toggle('menu-open');
    });

    // Auto-close menu when a link is clicked
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        if (mainNav) mainNav.classList.remove('menu-open');
      });
    });
  }



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
        // Ported Portions Database and Logic from finally-fit.js
        const INGREDIENTS = {
            'tri_tip': { name: "Tri-Tip", category: "protein", price_per_oz: 0.606, protein_per_oz: 7.5, carbs_per_oz: 0, fat_per_oz: 4.0, calories_per_oz: 66 },
            'ground_turkey': { name: "Ground Turkey", category: "protein", price_per_oz: 0.271, protein_per_oz: 7.0, carbs_per_oz: 0, fat_per_oz: 2.5, calories_per_oz: 51 },
            'chicken_breast': { name: "Chicken Breast", category: "protein", price_per_oz: 0.165, protein_per_oz: 8.5, carbs_per_oz: 0, fat_per_oz: 1.0, calories_per_oz: 43 },
            'pork_shoulder': { name: "Pork Shoulder", category: "protein", price_per_oz: 0.118, protein_per_oz: 7.5, carbs_per_oz: 0, fat_per_oz: 4.5, calories_per_oz: 71 },
            'chicken_thigh': { name: "Chicken Thigh", category: "protein", price_per_oz: 0.107, protein_per_oz: 7.0, carbs_per_oz: 0, fat_per_oz: 3.0, calories_per_oz: 55 },
            'eggs': { name: "Whole Eggs", category: "protein", price_per_oz: 0.180, protein_per_oz: 3.6, carbs_per_oz: 0.3, fat_per_oz: 2.8, calories_per_oz: 41 },
            'greek_yogurt': { name: "Greek Yogurt", category: "protein", price_per_oz: 0.150, protein_per_oz: 3.0, carbs_per_oz: 1.0, fat_per_oz: 0, calories_per_oz: 16 },
            'cottage_cheese': { name: "Cottage Cheese", category: "protein", price_per_oz: 0.120, protein_per_oz: 3.5, carbs_per_oz: 1.0, fat_per_oz: 0.5, calories_per_oz: 23 },
            'chopped_potato': { name: "Chopped Potato", category: "carb", price_per_oz: 0.150, protein_per_oz: 0.7, carbs_per_oz: 6.0, fat_per_oz: 0.5, calories_per_oz: 31 },
            'mashed_potato': { name: "Mashed Potato", category: "carb", price_per_oz: 0.103, protein_per_oz: 0.6, carbs_per_oz: 5.0, fat_per_oz: 1.0, calories_per_oz: 31 },
            'sweet_potato': { name: "Sweet Potato", category: "carb", price_per_oz: 0.083, protein_per_oz: 0.6, carbs_per_oz: 6.0, fat_per_oz: 0, calories_per_oz: 26 },
            'jasmine_rice': { name: "Cooked Jasmine Rice", category: "carb", price_per_oz: 0.021, protein_per_oz: 0.8, carbs_per_oz: 8.0, fat_per_oz: 0.1, calories_per_oz: 37 },
            'pasta': { name: "Spaghetti Pasta", category: "carb", price_per_oz: 0.036, protein_per_oz: 1.5, carbs_per_oz: 8.0, fat_per_oz: 0.2, calories_per_oz: 40 },
            'granola': { name: "Granola/Fruit", category: "carb", price_per_oz: 0.100, protein_per_oz: 0.5, carbs_per_oz: 6.0, fat_per_oz: 1.0, calories_per_oz: 35 },
            'broccoli': { name: "Broccoli", category: "veg", price_per_oz: 0.133, protein_per_oz: 0.8, carbs_per_oz: 2.0, fat_per_oz: 0, calories_per_oz: 11 },
            'green_beans': { name: "Green Beans", category: "veg", price_per_oz: 0.099, protein_per_oz: 0.5, carbs_per_oz: 2.0, fat_per_oz: 0, calories_per_oz: 10 }
        };

        const MEAL_TEMPLATES = {
            'Steak and Eggs': { protein_id: 'tri_tip', carb_id: 'chopped_potato', veg_id: 'broccoli' },
            'Yogurt Parfait': { protein_id: 'greek_yogurt', carb_id: 'granola', veg_id: 'broccoli' },
            'Honey Sweet Cottage Cheese': { protein_id: 'cottage_cheese', carb_id: 'granola', veg_id: 'green_beans' },
            'Morning Grand Slam': { protein_id: 'eggs', carb_id: 'sweet_potato', veg_id: 'broccoli' },
            'Meat & Cheese-To-Go': { protein_id: 'pork_shoulder', carb_id: 'mashed_potato', veg_id: 'green_beans' },
            'Steak n Mash': { protein_id: 'tri_tip', carb_id: 'mashed_potato', veg_id: 'broccoli' },
            'Teriyaki Chicken': { protein_id: 'chicken_breast', carb_id: 'jasmine_rice', veg_id: 'broccoli' },
            'Chicken Fried Rice': { protein_id: 'chicken_breast', carb_id: 'jasmine_rice', veg_id: 'green_beans' },
            'Chili Margarita': { protein_id: 'chicken_breast', carb_id: 'jasmine_rice', veg_id: 'green_beans' },
            'BBQ Chicken Thigh': { protein_id: 'chicken_thigh', carb_id: 'mashed_potato', veg_id: 'green_beans' },
            'Sweet Chili Chicken Thigh': { protein_id: 'chicken_thigh', carb_id: 'jasmine_rice', veg_id: 'green_beans' },
            'Asian Zing Chicken Thigh': { protein_id: 'chicken_thigh', carb_id: 'jasmine_rice', veg_id: 'green_beans' },
            'Spaghetti and Meatballs': { protein_id: 'ground_turkey', carb_id: 'pasta', veg_id: 'broccoli' },
            'Chicken Pesto Pasta': { protein_id: 'chicken_breast', carb_id: 'pasta', veg_id: 'broccoli' }
        };

        const BASE_PREP_FEE = 5.00;
        const INGREDIENT_MARKUP = 1.0;

        function calculateMealPortionsAndPricing(mealName, targetMealProtein, targetMealCarbs, targetMealFat) {
            if (mealName === 'Homemade Meal') {
                return {
                    name: "Homemade Meal",
                    price: 0.00,
                    protein: Math.round(targetMealProtein),
                    carbs: Math.round(targetMealCarbs),
                    fat: Math.round(targetMealFat),
                    calories: Math.round((targetMealProtein * 4) + (targetMealCarbs * 4) + (targetMealFat * 9)),
                    portions: {
                        protein: { name: "Prepare at home", oz: 0 },
                        carb: { name: "", oz: 0 },
                        veg: { name: "", oz: 0 }
                    },
                    detailsHtml: "Prepare at home"
                };
            }

            const template = MEAL_TEMPLATES[mealName];
            if (!template) {
                return { name: mealName, price: 9.95, protein: 30, carbs: 30, fat: 10, calories: 330, detailsHtml: "" };
            }

            const pIng = INGREDIENTS[template.protein_id];
            const cIng = INGREDIENTS[template.carb_id];
            const vIng = INGREDIENTS[template.veg_id];

            let pOz = Math.round(targetMealProtein / pIng.protein_per_oz);
            const fitnessGoalText = userAnswers['2. What is your primary fitness goal?'] || 'Fat Loss / Toning';
            let fitnessGoal = 'Maintain';
            if (fitnessGoalText.includes('Fat Loss')) {
                fitnessGoal = 'Fat Loss';
            } else if (fitnessGoalText.includes('Build Muscle')) {
                fitnessGoal = 'Muscle Gain';
            }
            
            const cOzRaw = targetMealCarbs / cIng.carbs_per_oz;
            let cOz = Math.round(cOzRaw);
            if (fitnessGoal === 'Fat Loss') {
                cOz = Math.floor(cOzRaw);
            } else if (fitnessGoal === 'Muscle Gain') {
                cOz = Math.ceil(cOzRaw);
            }

            let vOz = 2;
            pOz = Math.max(4, Math.min(8, pOz));
            cOz = Math.max(3, Math.min(5, cOz));

            const mealP = Math.round((pOz * pIng.protein_per_oz) + (cOz * cIng.protein_per_oz) + (vOz * vIng.protein_per_oz));
            const mealC = Math.round((pOz * pIng.carbs_per_oz) + (cOz * cIng.carbs_per_oz) + (vOz * vIng.carbs_per_oz));
            const mealF = Math.round((pOz * pIng.fat_per_oz) + (cOz * cIng.fat_per_oz) + (vOz * vIng.fat_per_oz));
            const mealCal = Math.round((mealP * 4) + (mealC * 4) + (mealF * 9));

            const pCost = pOz * pIng.price_per_oz * INGREDIENT_MARKUP;
            const cCost = cOz * cIng.price_per_oz * INGREDIENT_MARKUP;
            const vCost = vOz * vIng.price_per_oz * INGREDIENT_MARKUP;
            const totalPrice = Math.round((BASE_PREP_FEE + pCost + cCost + vCost) * 100) / 100;

            return {
                name: mealName,
                price: totalPrice,
                protein: mealP,
                carbs: mealC,
                fat: mealF,
                calories: mealCal,
                portions: {
                    protein: { name: pIng.name, oz: pOz },
                    carb: { name: cIng.name, oz: cOz },
                    veg: { name: vIng.name, oz: vOz }
                },
                detailsHtml: `${pOz}oz ${pIng.name}, ${cOz}oz ${cIng.name}, ${vOz}oz ${vIng.name}`
            };
        }

        // Mifflin-St Jeor Calculations for Onboarding Quiz
        const userAge = parseInt(userAnswers['How old are you?']) || 35;
        const userWeight = parseFloat(userAnswers['What is your current weight?']) || 170;
        const heightFeet = parseInt(userAnswers['Height (Feet)']) || 5;
        const heightInches = parseInt(userAnswers['Height (Inches)']) || 9;
        const gender = userAnswers['3. Are you:'] || 'Female';
        const activityText = userAnswers['6. Which best describes your activity level?'] || 'Lightly active';

        const weightKg = userWeight * 0.45359237;
        const totalHeightInches = (heightFeet * 12) + heightInches;
        const heightCm = totalHeightInches * 2.54;

        let BMR = 0;
        if (gender === 'Male') {
            BMR = (10 * weightKg) + (6.25 * heightCm) - (5 * userAge) + 5;
        } else {
            BMR = (10 * weightKg) + (6.25 * heightCm) - (5 * userAge) - 161;
        }

        let activityMultiplier = 1.375;
        if (activityText.includes('sitting') || activityText.includes('desk')) {
            activityMultiplier = 1.2;
        } else if (activityText.includes('Lightly')) {
            activityMultiplier = 1.375;
        } else if (activityText.includes('Moderately')) {
            activityMultiplier = 1.55;
        } else if (activityText.includes('Very')) {
            activityMultiplier = 1.725;
        }

        const TDEE = Math.round(BMR * activityMultiplier);

        const fitnessGoalText = userAnswers['2. What is your primary fitness goal?'] || 'Fat Loss / Toning';
        let fitnessGoal = 'Maintain';
        if (fitnessGoalText.includes('Fat Loss')) {
            fitnessGoal = 'Fat Loss';
        } else if (fitnessGoalText.includes('Build Muscle')) {
            fitnessGoal = 'Muscle Gain';
        }

        let targetCalories = TDEE;
        if (fitnessGoal === 'Fat Loss') {
            targetCalories = Math.round(TDEE - 500);
            if (gender === 'Female' && targetCalories < 1200) targetCalories = 1200;
            if (gender === 'Male' && targetCalories < 1500) targetCalories = 1500;
        } else if (fitnessGoal === 'Muscle Gain') {
            targetCalories = Math.round(TDEE + 300);
        }

        let proteinGrams = Math.round(userWeight);
        if (gender === 'Male') {
            if (proteinGrams > 220) proteinGrams = 220;
        } else {
            if (proteinGrams > 160) proteinGrams = 160;
        }
        if (proteinGrams * 4 > targetCalories * 0.4) {
            proteinGrams = Math.round((targetCalories * 0.4) / 4);
        }
        const fatGrams = Math.round((targetCalories * 0.275) / 9);
        const proteinCal = proteinGrams * 4;
        const fatCal = fatGrams * 9;
        const carbCal = targetCalories - proteinCal - fatCal;
        const carbGrams = Math.max(20, Math.round(carbCal / 4));

        let calculatedTier = 'L';
        if (targetCalories < 1700) {
            calculatedTier = 'S';
        } else if (targetCalories > 2300) {
            calculatedTier = 'XL';
        }

        const calculatedPlan = {
            calories: targetCalories,
            protein: proteinGrams,
            carbs: carbGrams,
            fat: fatGrams,
            bmr: Math.round(BMR),
            tdee: TDEE,
            tier: calculatedTier
        };

        const mealTargetP = (proteinGrams - 25) / 4;
        const mealTargetC = (carbGrams - 20) / 4;
        const mealTargetF = (fatGrams - 10) / 4;

        const eggsDetails = calculateMealPortionsAndPricing('Morning Grand Slam', mealTargetP, mealTargetC, mealTargetF);
        const steakDetails = calculateMealPortionsAndPricing('Steak n Mash', mealTargetP, mealTargetC, mealTargetF);
        const chickenDetails = calculateMealPortionsAndPricing('Teriyaki Chicken', mealTargetP, mealTargetC, mealTargetF);

        // Build integrated calculations payload
        const payload = {
            ...userAnswers,
            ...calculatedPlan,
            lead_status: "quiz-completed",
            pipeline_stage: "Quiz Completed",
            source: "Kairos Nutrition Onboarding Quiz",
            studio: userAnswers['Gym'] || userAnswers['Studio'] || 'At Home',
            gym: userAnswers['Gym'] || userAnswers['Studio'] || 'At Home',
            
            eggs_meal_name: eggsDetails.name,
            eggs_meal_portions: eggsDetails.detailsHtml,
            eggs_meal_protein: eggsDetails.protein,
            eggs_meal_carbs: eggsDetails.carbs,
            eggs_meal_fat: eggsDetails.fat,
            eggs_meal_calories: eggsDetails.calories,
            
            steak_meal_name: steakDetails.name,
            steak_meal_price: steakDetails.price,
            steak_meal_portions: steakDetails.detailsHtml,
            steak_meal_protein: steakDetails.protein,
            steak_meal_carbs: steakDetails.carbs,
            steak_meal_fat: steakDetails.fat,
            steak_meal_calories: steakDetails.calories,
            
            chicken_meal_name: chickenDetails.name,
            chicken_meal_price: chickenDetails.price,
            chicken_meal_portions: chickenDetails.detailsHtml,
            chicken_meal_protein: chickenDetails.protein,
            chicken_meal_carbs: chickenDetails.carbs,
            chicken_meal_fat: chickenDetails.fat,
            chicken_meal_calories: chickenDetails.calories
        };

        localStorage.setItem('ffp_user_answers', JSON.stringify({
            'First Name': userAnswers["What's your first name?"] || 'Athlete',
            'Last Name': userAnswers["What's your last name?"] || '',
            'Email': email,
            'Phone': phone
        }));
        localStorage.setItem('ffp_macro_plan', JSON.stringify(calculatedPlan));
        
        console.log('Quiz completed. Data captured:', payload);
        
        // Send data to Klaviyo
        const klaviyoPublicKey = 'QWmkMT'; // Hardcoded for production
        if (klaviyoPublicKey && klaviyoPublicKey !== 'YOUR_KLAVIYO_PUBLIC_KEY_HERE') {
            const klaviyoData = {
                data: {
                    type: 'event',
                    attributes: {
                        profile: {
                            $email: email,
                            $phone_number: phone,
                            $first_name: userAnswers['first_name'] || '',
                            $last_name: userAnswers['last_name'] || ''
                        },
                        metric: {
                            name: 'Completed Quiz'
                        },
                        properties: payload,
                        time: new Date().toISOString()
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
                body: JSON.stringify(payload)
            })
            .then(async response => {
                if (!response.ok) {
                    throw new Error('Make webhook returned an error status: ' + response.status);
                }
                
                const text = await response.text();
                if (text === "Accepted") {
                    throw new Error("MAKE_SCENARIO_OFF");
                }
                
                try {
                    return JSON.parse(text);
                } catch (e) {
                    console.warn("Failed to parse Make webhook response as JSON:", text);
                    return { __raw: text, __error: e.message };
                }
            })
            .then(data => {
                console.log('Successfully sent to Make webhook. Response:', data);
                
                // Redirect to Finally Fit program page
                window.location.href = "/finally-fit";
            })
            .catch(error => {
                console.error('Error sending to Make webhook:', error);
                if (error.message === "MAKE_SCENARIO_OFF") {
                    alert("It looks like your Make.com scenario is turned OFF or failed to start! Make.com caught the data, but didn't send a URL back. Please click 'Run once' in Make.com and try again.");
                } else {
                    alert("DEBUG INFO: The browser blocked the Make.com response! This is usually a CORS error, an adblocker, or network drop.\n\nError: " + error.message + "\n\nPlease screenshot this popup!");
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
            window.location.href = "/finally-fit";
        }
      });
    }
  }
});
