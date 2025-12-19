/* ============================================
   GUIDE CHARACTER
   Tour guide character show/hide and animations
   ============================================ */

/**
 * Guide Character Controller
 * Manages the appearance and animations of the tour guide character
 */

// Get guide element
const guideElement = document.getElementById('guide');

// Scenes where guide should appear
const guideScenes = [1, 2, 3, 5]; // Scene indices where guide is visible

/**
 * Initialize guide controller
 */
function initGuide() {
    if (!guideElement) {
        // Guide element removed - using scene-specific guide elements instead
        // Silently return without warning
        return;
    }

    // Guide starts hidden
    hideGuide();
}

/**
 * Show guide character with animation
 */
function showGuide() {
    if (!guideElement) return;

    // Remove hidden class
    guideElement.classList.remove('hidden');
    
    // Add visible and entering classes for animation
    guideElement.classList.add('visible', 'entering');

    // Remove entering class after animation completes
    setTimeout(() => {
        guideElement.classList.remove('entering');
    }, 600); // Match animation duration
}

/**
 * Hide guide character with animation
 */
function hideGuide() {
    if (!guideElement) return;

    // Add exiting class for exit animation
    guideElement.classList.add('exiting');

    // Remove visible class and add hidden after animation
    setTimeout(() => {
        guideElement.classList.remove('visible', 'exiting');
        guideElement.classList.add('hidden');
    }, 400); // Match animation duration
}

/**
 * Update guide visibility based on current scene
 * @param {number} sceneIndex - Current scene index
 */
function updateGuideVisibility(sceneIndex) {
    if (!guideElement) return;

    // Check if guide should be visible in this scene
    if (guideScenes.includes(sceneIndex)) {
        // Small delay for smooth transition
        setTimeout(() => {
            showGuide();
        }, 300);
    } else {
        hideGuide();
    }
}

/**
 * Show guide in specific scene context
 * Useful for custom guide appearances
 */
function showGuideInScene(sceneIndex) {
    updateGuideVisibility(sceneIndex);
}

/**
 * Force hide guide (for special cases)
 */
function forceHideGuide() {
    if (!guideElement) return;
    guideElement.classList.remove('visible', 'entering', 'exiting');
    guideElement.classList.add('hidden');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGuide);
} else {
    initGuide();
}

// Export functions for use in other modules
window.guideController = {
    show: showGuide,
    hide: hideGuide,
    updateVisibility: updateGuideVisibility,
    showInScene: showGuideInScene,
    forceHide: forceHideGuide
};

