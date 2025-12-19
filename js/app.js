/* ============================================
   MAIN APP LOGIC
   Scene navigation and interaction handling
   ============================================ */

/**
 * Main Application Controller
 * Manages scene transitions, navigation, and user interactions
 */

// Get all scene elements
const scenes = document.querySelectorAll('.scene');
let currentSceneIndex = 0;
const totalScenes = scenes.length;

/**
 * Initialize the application
 */
function initApp() {
    // Show first scene
    showScene(0);

    // Set up button event listeners
    setupButtonListeners();

    // Set up video event listeners
    setupVideoListeners();

    // Set up letter interaction
    setupLetterInteraction();

    // Initialize thought animation for guide scene
    initThoughtAnimationForScene();

    console.log('Storytelling app initialized');
}

/**
 * Show a specific scene with smooth transition
 * @param {number} index - Scene index to show (0-based)
 */
function showScene(index) {
    // Validate index
    if (index < 0 || index >= totalScenes) {
        console.warn(`Invalid scene index: ${index}`);
        return;
    }

    // Get current and target scenes
    const currentScene = scenes[currentSceneIndex];
    const targetScene = scenes[index];

    if (!targetScene) {
        console.warn(`Scene at index ${index} not found`);
        return;
    }

    // Fade out current scene
    if (currentScene && currentSceneIndex !== index) {
        currentScene.classList.add('fade-out');
        currentScene.classList.remove('active', 'fade-in');

        // Remove fade-out class after animation
        setTimeout(() => {
            currentScene.classList.remove('fade-out');
        }, 600);
    }

    // Update current scene index
    currentSceneIndex = index;

    // Fade in target scene
    setTimeout(() => {
        targetScene.classList.remove('fade-out');
        targetScene.classList.add('active', 'fade-in');
        
        // Scroll to top of scene
        targetScene.scrollTop = 0;
    }, currentScene && currentSceneIndex !== index ? 300 : 0);

    // Update guide visibility
    if (window.guideController) {
        window.guideController.updateVisibility(index);
    }

    // Initialize thought animation for scenes with guide character
    if (window.thoughtController && (index === 1 || index === 2 || index === 3 || index === 4 || index === 5 || index === 6)) {
        // Scene 1: Start immediately (will use 1s delay in initThoughtAnimation)
        // Scene 2: Start immediately (will use 1.5s delay in initThoughtAnimation)
        // Scene 3: Start immediately (will use 1.5s delay in initThoughtAnimation)
        // Scene 4: Start immediately (will use 1.5s delay in initThoughtAnimation)
        // Scene 5: Start immediately (will use 1.5s delay in initThoughtAnimation)
        // Scene 6: Start immediately (will use 1.5s delay in initThoughtAnimation)
        setTimeout(() => {
            window.thoughtController.initThoughtAnimation(index);
        }, 0);
    }

    // Handle video playback for video scenes
    handleVideoScenes(index);
    
    // Initialize flower animation for Scene 5
    if (index === 5) {
        const flowerContainer = document.querySelector('.flower-animation-container');
        if (flowerContainer) {
            flowerContainer.classList.add("not-loaded");
            setTimeout(() => {
                flowerContainer.classList.remove("not-loaded");
            }, 100);
        }
    }
    
    // Change music for this scene
    if (window.musicController && window.musicController.changeScene) {
        window.musicController.changeScene(index);
    }
}

/**
 * Navigate to next scene
 */
function nextScene() {
    if (currentSceneIndex < totalScenes - 1) {
        showScene(currentSceneIndex + 1);
    }
}

/**
 * Navigate to previous scene
 */
function previousScene() {
    if (currentSceneIndex > 0) {
        showScene(currentSceneIndex - 1);
    }
}

/**
 * Set up button event listeners
 */
function setupButtonListeners() {
    // Get all scene navigation buttons
    const buttons = document.querySelectorAll('.scene-btn');

    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get target scene from data attribute
            const nextSceneIndex = parseInt(button.getAttribute('data-next'), 10);
            
            if (!isNaN(nextSceneIndex)) {
                showScene(nextSceneIndex);
            } else {
                // Fallback to next scene
                nextScene();
            }
        });
    });
}

/**
 * Set up video event listeners
 * Pause background music when videos play
 */
function setupVideoListeners() {
    const videos = document.querySelectorAll('.story-video');

    videos.forEach(video => {
        // Pause music when video starts playing
        video.addEventListener('play', () => {
            if (window.musicController) {
                window.musicController.pause();
            }
        });

        // Resume music when video ends or is paused
        video.addEventListener('ended', () => {
            if (window.musicController) {
                window.musicController.resume();
            }
        });

        video.addEventListener('pause', () => {
            // Only resume if video is paused but not ended
            if (video.ended === false && window.musicController) {
                window.musicController.resume();
            }
        });

        // Handle video errors gracefully
        video.addEventListener('error', () => {
            console.warn('Video error:', video.src);
            // Show placeholder if video fails to load
            const container = video.closest('.video-container');
            if (container) {
                const placeholder = container.querySelector('.video-placeholder');
                if (placeholder) {
                    placeholder.style.display = 'flex';
                }
            }
        });

        // Hide placeholder when video loads successfully
        video.addEventListener('loadeddata', () => {
            const container = video.closest('.video-container');
            if (container) {
                const placeholder = container.querySelector('.video-placeholder');
                if (placeholder && video.readyState >= 2) {
                    placeholder.style.display = 'none';
                }
            }
        });
    });
}

/**
 * Handle video scenes
 * Show/hide video placeholders based on video availability
 * @param {number} sceneIndex - Current scene index
 */
function handleVideoScenes(index) {
    // Video scenes: 7 (indices) - Scene 8 (special moments) and Scene 8 (final message) removed
    const videoScenes = [7];
    
    if (videoScenes.includes(index)) {
        const scene = scenes[index];
        if (scene) {
            const videos = scene.querySelectorAll('.story-video');
            videos.forEach(video => {
                // Check if video source exists
                if (video.src && video.src !== window.location.href) {
                    // Video source exists, hide placeholder
                    const container = video.closest('.video-container');
                    if (container) {
                        const placeholder = container.querySelector('.video-placeholder');
                        if (placeholder) {
                            placeholder.style.display = 'none';
                        }
                    }
                } else {
                    // No video source, show placeholder
                    const container = video.closest('.video-container');
                    if (container) {
                        const placeholder = container.querySelector('.video-placeholder');
                        if (placeholder) {
                            placeholder.style.display = 'flex';
                        }
                    }
                }
            });
        }
    }
}

/**
 * Set up letter interaction (click to close and send)
 */
function setupLetterInteraction() {
    // Use setTimeout to ensure DOM is fully ready
    setTimeout(() => {
        const letterContainer = document.getElementById('letterContainer');
        const letterPaper = document.getElementById('letterPaper');
        const letterEnvelope = document.getElementById('letterEnvelope');
        const letterSending = document.getElementById('letterSending');
        
        if (!letterContainer || !letterPaper || !letterEnvelope || !letterSending) {
            console.warn('Letter elements not found');
            return; // Letter elements not found (not on landing page)
        }

        let letterClicked = false;
        
        const handleLetterClick = () => {
            console.log('Letter click handler triggered');
            if (letterClicked) {
                console.log('Letter already clicked, ignoring');
                return; // Prevent multiple clicks
            }
            
            letterClicked = true;
            console.log('Starting letter animation sequence');
            
            // Close the letter (smooth fade out)
            letterPaper.style.transition = 'opacity 0.3s ease-out';
            letterPaper.style.opacity = '0.9';
            
            setTimeout(() => {
                letterPaper.classList.add('closing');
            }, 100);
            
            // After letter closes, show envelope
            setTimeout(() => {
                letterPaper.style.display = 'none';
                letterEnvelope.classList.remove('hidden');
                letterEnvelope.classList.add('visible');
                
                // Close envelope flap after envelope appears
                setTimeout(() => {
                    const envelopeFlap = letterEnvelope.querySelector('.envelope-flap');
                    if (envelopeFlap) {
                        envelopeFlap.classList.add('closed');
                    }
                }, 600);
            }, 2000);
            
            // Show sending animation after envelope closes
            setTimeout(() => {
                letterEnvelope.style.transition = 'opacity 0.5s ease-out';
                letterEnvelope.style.opacity = '0';
                
                setTimeout(() => {
                    letterEnvelope.classList.add('hidden');
                    letterSending.classList.remove('hidden');
                    letterSending.classList.add('visible');
                }, 500);
            }, 3800);
            
            // Transition to next scene after sending animation
            setTimeout(() => {
                showScene(1);
            }, 5500);
        };
        
        // Add click handler to letter container
        letterContainer.addEventListener('click', handleLetterClick);
        console.log('Letter container click handler added');
        
        // Add click handler to button (stop propagation to prevent double trigger)
        const clickBtn = letterPaper.querySelector('.letter-click-btn');
        if (clickBtn) {
            console.log('Click button found, adding event listener');
            clickBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                console.log('Button clicked!');
                handleLetterClick();
            });
        } else {
            console.error('Click button not found!');
            // Try alternative selector
            const altBtn = document.querySelector('.letter-click-btn');
            if (altBtn) {
                console.log('Found button with alternative selector');
                altBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    console.log('Button clicked (alternative)!');
                    handleLetterClick();
                });
            }
        }
        
        // Add hover effect
        letterContainer.addEventListener('mouseenter', () => {
            if (!letterClicked) {
                letterPaper.style.transform = 'scale(1.02)';
                letterPaper.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(139, 115, 85, 0.1), inset 0 0 30px rgba(139, 115, 85, 0.05)';
            }
        });
        
        letterContainer.addEventListener('mouseleave', () => {
            if (!letterClicked) {
                letterPaper.style.transform = 'scale(1)';
                letterPaper.style.boxShadow = '';
            }
        });
    }, 100); // Small delay to ensure DOM is ready
}

/**
 * Initialize thought animation when guide scene is shown
 */
function initThoughtAnimationForScene() {
    // Check if thought animation controller exists
    if (window.thoughtController) {
        // Initialize thought animation
        setTimeout(() => {
            const guideIntro = document.getElementById('guide-intro');
            if (guideIntro) {
                window.thoughtController.showThought("Currently, I have any thought there...");
            }
        }, 2000);
    }
}

/**
 * Keyboard navigation support
 */
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Arrow keys for navigation
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            nextScene();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            previousScene();
        }
        // Escape to go to first scene
        else if (e.key === 'Escape') {
            e.preventDefault();
            showScene(0);
        }
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initApp();
        setupKeyboardNavigation();
    });
} else {
    initApp();
    setupKeyboardNavigation();
}

// Export functions for debugging/advanced use
window.appController = {
    showScene: showScene,
    nextScene: nextScene,
    previousScene: previousScene,
    getCurrentScene: () => currentSceneIndex,
    getTotalScenes: () => totalScenes
};

