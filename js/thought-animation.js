/* ============================================
   THOUGHT ANIMATION
   Animated thought bubble for guide character
   ============================================ */

/**
 * Thought Animation Controller
 * Displays thoughts from the guide character with typing animation
 * Supports scene-specific configurations
 */

// Scene-specific configurations
const sceneConfigs = {
    // Scene 1: Meet Your Little Guide
    1: {
        gestureImage: "my toon/full_gesture_-removebg-preview.png",
        thoughtMessages: [
            "Hii Mahika how are you?",
            "Meet the miniature version of me!",
            "This journey gave you that experince which you never had before",
            "I'm here to guide you through this...",
            "the toon guide of me ",
            "So let's start the journey..."
        ],
        guidePlaceholderId: null, // Not needed for scene 1
        guideImageId: null, // Uses default selector: #guide-intro .guide-character-image
        thoughtBubbleId: "thoughtBubble",
        thoughtTextId: "thoughtText"
    },
    // Scene 2: How This Moment Came to Be
    2: {
        gestureImage: "my toon/think-removebg-preview.png",
        thoughtMessages: [
            "Welecome back miss we meeet again today haha !!!!",
            "Some moments arrive quietly this is one of them",
            "maybe its sounds poetic  !!!! but it has a deep meaning ",
            "Nothing planned.Nothing forced.Just something that felt worth sharing",
            "Take your time.We'll move ahead only when you're ready"
        ],
        guidePlaceholderId: "guidePlaceholderScene2",
        guideImageId: "guideCharacterImageScene2",
        thoughtBubbleId: "thoughtBubbleScene2",
        thoughtTextId: "thoughtTextScene2"
    },
    // Scene 3: The Things Worth Saying
    3: {
        gestureImage: "my toon/smile-removebg-preview.png",
        thoughtMessages: [
            "Some words are meant to be simple and honest.",
            "Nothing here asks for anything back",
            "Just take them as they are.",
            "You are truly appreciated..."
        ],
        guidePlaceholderId: "guidePlaceholderScene3",
        guideImageId: "guideCharacterImageScene3",
        thoughtBubbleId: "thoughtBubbleScene3", 
        thoughtTextId: "thoughtTextScene3"
    },
    // Scene 4: A Wish for What's Ahead
    4: {
        gestureImage: "my toon/me-removebg-preview.png",
        thoughtMessages: [
            "Sometimes it doesn't take long for a connection to feel real",
            "Comfort grows quietly in shared thoughts, small moments, and ease",
            "And now, it gently turns into a wish for what's ahead.",
            "Take your time reading them...",
           
        ],
        guidePlaceholderId: "guidePlaceholderScene4",
        guideImageId: "guideCharacterImageScene4",
        thoughtBubbleId: "thoughtBubbleScene4",
        thoughtTextId: "thoughtTextScene4"
    },
    // Scene 5: A Thought, in Bloom
    5: {
        gestureImage: "my toon/right-removebg-preview.png",
        thoughtMessages: [
            "Right now am unable to give you a flower but i can craft the flowers for you ",
            "Look at these beautiful flowers blooming...",
            "Each petal opens with such grace.",
            "Nature has its own way of showing beauty.",
            "Just like thoughts that need time to unfold."
        ],
        guidePlaceholderId: "guidePlaceholderScene5",
        guideImageId: "guideCharacterImageScene5",
        thoughtBubbleId: "thoughtBubbleScene5",
        thoughtTextId: "thoughtTextScene5"
    },
    // Scene 6: Before We Continue
    6: {
        gestureImage: "my toon/hello-removebg-preview.png",
        thoughtMessages: [
            "Hello! We're almost at the end of this journey.",
            "Something special is waiting for you ahead...",
            "Take your time, there's no rush.",
            "When you're ready, we'll continue .", 
             "You are such a wonderful person. This little guide loved giving you the tour. Thank you for being you",
            "And i take leave from you for now. see you next year."
           
        ],
        guidePlaceholderId: "guidePlaceholderScene6",
        guideImageId: "guideCharacterImageScene6",
        thoughtBubbleId: "thoughtBubbleScene6",
        thoughtTextId: "thoughtTextScene6"
    }
};

// Current scene configuration
let currentSceneConfig = null;
let thoughtMessages = [];
let currentThoughtIndex = 0;
let isTyping = false;
let thoughtCycleActive = false;
let typeInterval = null;
let currentTimeout = null;

/**
 * Type out text character by character
 * @param {HTMLElement} element - Element to type into
 * @param {string} text - Text to type
 * @param {number} speed - Typing speed in milliseconds per character
 * @param {Function} onComplete - Callback when typing completes
 */
function typeText(element, text, speed = 60, onComplete = null) {
    if (!element) return;
    
    // Clear any existing typing interval
    if (typeInterval) {
        clearInterval(typeInterval);
        typeInterval = null;
    }
    
    isTyping = true;
    element.textContent = '';
    element.classList.add('typing');
    element.style.opacity = '1';
    
    let index = 0;
    
    typeInterval = setInterval(() => {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
        } else {
            clearInterval(typeInterval);
            typeInterval = null;
            element.classList.remove('typing');
            isTyping = false;
            
            // Call completion callback
            if (onComplete) {
                onComplete();
            }
        }
    }, speed);
}

/**
 * Show thought bubble with animation
 * @param {string} message - Message to display
 * @param {Function} onComplete - Callback when thought is fully displayed
 */
function showThought(message, onComplete = null) {
    if (!currentSceneConfig) return;
    
    const thoughtBubble = document.getElementById(currentSceneConfig.thoughtBubbleId);
    const thoughtText = document.getElementById(currentSceneConfig.thoughtTextId);
    
    if (!thoughtBubble || !thoughtText) return;
    
    // Clear any existing timeouts
    if (currentTimeout) {
        clearTimeout(currentTimeout);
        currentTimeout = null;
    }
    
    // Clear any existing typing
    if (typeInterval) {
        clearInterval(typeInterval);
        typeInterval = null;
    }
    
    // Reset text
    thoughtText.textContent = '';
    thoughtText.style.opacity = '0';
    
    // Reset and show bubble with smooth animation
    thoughtBubble.style.transition = 'opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    thoughtBubble.style.opacity = '0';
    thoughtBubble.style.transform = 'scale(0.9) translateY(5px)';
    thoughtBubble.style.visibility = 'visible';
    
    // Show bubble
    currentTimeout = setTimeout(() => {
        thoughtBubble.style.opacity = '1';
        thoughtBubble.style.transform = 'scale(1) translateY(0)';
        
        // Start typing animation after bubble appears
        currentTimeout = setTimeout(() => {
            thoughtText.style.opacity = '1';
            thoughtText.style.transition = 'opacity 0.3s ease-in';
            typeText(thoughtText, message, 60, () => {
                // Wait after typing completes before showing next thought
                currentTimeout = setTimeout(() => {
                    if (onComplete) {
                        onComplete();
                    }
                }, 1500);
            });
        }, 400);
    }, 50);
}

/**
 * Show next thought in sequence based on array order
 */
function showNextThought() {
    if (!currentSceneConfig) return;
    
    // Check if we've shown all thoughts
    if (currentThoughtIndex >= thoughtMessages.length) {
        // All thoughts shown, stop cycling
        thoughtCycleActive = false;
        currentThoughtIndex = 0; // Reset for next time
        return;
    }
    
    // Get message from array in sequence order
    const message = thoughtMessages[currentThoughtIndex];
    const thoughtBubble = document.getElementById(currentSceneConfig.thoughtBubbleId);
    const thoughtText = document.getElementById(currentSceneConfig.thoughtTextId);
    
    if (!thoughtBubble || !thoughtText) return;
    
    // Fade out current thought if it's not the first one
    if (currentThoughtIndex > 0) {
        // Smooth fade out
        thoughtBubble.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
        thoughtBubble.style.opacity = '0';
        thoughtBubble.style.transform = 'scale(0.95) translateY(-5px)';
        
        currentTimeout = setTimeout(() => {
            // Show next thought in sequence
            showThought(message, () => {
                // Increment index to move to next message in array
                currentThoughtIndex++;
                // Show next thought after pause
                showNextThought();
            });
        }, 450);
    } else {
        // First thought - show directly
        showThought(message, () => {
            // Increment index to move to next message in array
            currentThoughtIndex++;
            // Show next thought after pause
            showNextThought();
        });
    }
}

/**
 * Start the thought cycle - show all thoughts one by one in sequence
 * @param {number} sceneIndex - Scene index to use configuration for
 */
function startThoughtCycle(sceneIndex = null) {
    // Clear any existing intervals/timeouts
    if (typeInterval) {
        clearInterval(typeInterval);
        typeInterval = null;
    }
    if (currentTimeout) {
        clearTimeout(currentTimeout);
        currentTimeout = null;
    }
    
    // If scene index provided, load that scene's configuration
    if (sceneIndex !== null && sceneConfigs[sceneIndex]) {
        currentSceneConfig = sceneConfigs[sceneIndex];
        thoughtMessages = [...currentSceneConfig.thoughtMessages];
        
        // Update guide image if needed
        updateGuideImage(sceneIndex);
    }
    
    if (!currentSceneConfig) return;
    
    // Reset everything to start fresh
    thoughtCycleActive = false;
    currentThoughtIndex = 0;
    isTyping = false;
    
    // Clear any existing thought text and reset bubble
    const thoughtBubble = document.getElementById(currentSceneConfig.thoughtBubbleId);
    const thoughtText = document.getElementById(currentSceneConfig.thoughtTextId);
    
    if (thoughtText) {
        thoughtText.textContent = '';
        thoughtText.style.opacity = '0';
    }
    
    if (thoughtBubble) {
        thoughtBubble.style.opacity = '0';
        thoughtBubble.style.transform = 'scale(0.9) translateY(5px)';
        thoughtBubble.style.visibility = 'hidden';
    }
    
    // Start the cycle after a brief delay
    setTimeout(() => {
        thoughtCycleActive = true;
        showNextThought();
    }, 100);
}

/**
 * Update guide image for the current scene
 * @param {number} sceneIndex - Scene index
 */
function updateGuideImage(sceneIndex) {
    if (!sceneConfigs[sceneIndex]) return;
    
    const config = sceneConfigs[sceneIndex];
    let guideImage = null;
    
    // Get guide image element based on scene
    if (config.guideImageId) {
        guideImage = document.getElementById(config.guideImageId);
    } else {
        // Default selector for scene 1
        guideImage = document.querySelector('#guide-intro .guide-character-image');
    }
    
    if (guideImage && config.gestureImage) {
        guideImage.src = config.gestureImage;
    }
}

/**
 * Initialize thought animation for a specific scene
 * @param {number} sceneIndex - Scene index to initialize
 */
function initThoughtAnimation(sceneIndex) {
    if (!sceneConfigs[sceneIndex]) return;
    
    currentSceneConfig = sceneConfigs[sceneIndex];
    thoughtMessages = [...currentSceneConfig.thoughtMessages];
    
    // Update guide image
    updateGuideImage(sceneIndex);
    
    // Ensure thought bubble is ready to be visible
    const thoughtBubble = document.getElementById(currentSceneConfig.thoughtBubbleId);
    if (thoughtBubble) {
        thoughtBubble.style.visibility = 'visible';
    }
    
    // Wait for guide image to appear, then start thought cycle automatically
    // Scene 1: Wait 1 second (1 second delay total)
    // Scene 2: Wait 1.5 seconds (immediate appearance)
    // Scene 3: Wait 1.5 seconds (immediate appearance)
    const delay = sceneIndex === 1 ? 1000 : 1500;
    setTimeout(() => {
        startThoughtCycle(sceneIndex);
    }, delay);
}

// Export for use in other modules
window.thoughtController = {
    showThought: showThought,
    typeText: typeText,
    startThoughtCycle: startThoughtCycle,
    showNextThought: showNextThought,
    initThoughtAnimation: initThoughtAnimation,
    updateGuideImage: updateGuideImage
};

