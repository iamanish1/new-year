/* Flower Animation Initialization */

// Initialize flower animation when Scene 5 loads
function initFlowerAnimation() {
    const flowerContainer = document.querySelector('.flower-animation-container');
    if (!flowerContainer) return;
    
    // Remove not-loaded class to start animations
    const c = setTimeout(() => {
        flowerContainer.classList.remove("not-loaded");
        clearTimeout(c);
    }, 1000);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFlowerAnimation);
} else {
    initFlowerAnimation();
}

// Re-initialize when Scene 5 becomes active
if (window.showScene) {
    const originalShowScene = window.showScene;
    window.showScene = function(index) {
        originalShowScene(index);
        if (index === 5) {
            const flowerContainer = document.querySelector('.flower-animation-container');
            if (flowerContainer) {
                flowerContainer.classList.add("not-loaded");
                setTimeout(() => {
                    flowerContainer.classList.remove("not-loaded");
                }, 100);
            }
        }
    };
}

