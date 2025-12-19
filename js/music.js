/* ============================================
   MUSIC CONTROL
   Background music play/pause functionality
   ============================================ */

/**
 * Music Controller
 * Handles background music playback with user control
 */

// Get audio element and toggle button
const backgroundMusic = document.getElementById('backgroundMusic');
const musicToggle = document.getElementById('musicToggle');

// Initialize music settings
let isPlaying = false;

/**
 * Initialize music controller
 * Sets up event listeners and default volume
 */
function initMusic() {
    if (!backgroundMusic || !musicToggle) {
        console.warn('Music elements not found');
        return;
    }

    // Set low volume (20% of max)
    backgroundMusic.volume = 0.2;
    
    // Loop is already set in HTML, but ensure it's enabled
    backgroundMusic.loop = true;

    // Add click event listener to toggle button
    musicToggle.addEventListener('click', toggleMusic);

    // Update button state based on audio state
    updateMusicButton();

    // Handle audio events
    backgroundMusic.addEventListener('play', () => {
        isPlaying = true;
        updateMusicButton();
    });

    backgroundMusic.addEventListener('pause', () => {
        isPlaying = false;
        updateMusicButton();
    });

    // Handle errors gracefully
    backgroundMusic.addEventListener('error', (e) => {
        console.warn('Audio error:', e);
        // Hide music button if audio file is missing
        musicToggle.style.display = 'none';
    });
}

/**
 * Toggle music play/pause
 */
function toggleMusic() {
    if (!backgroundMusic) return;

    try {
        if (isPlaying) {
            backgroundMusic.pause();
        } else {
            // Play music (may require user interaction first)
            const playPromise = backgroundMusic.play();
            
            // Handle promise rejection (browser autoplay policies)
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        isPlaying = true;
                        updateMusicButton();
                    })
                    .catch(error => {
                        console.warn('Playback failed:', error);
                        // User interaction may be required
                    });
            }
        }
    } catch (error) {
        console.warn('Music toggle error:', error);
    }
}

/**
 * Update music button visual state
 */
function updateMusicButton() {
    if (!musicToggle) return;

    if (isPlaying) {
        musicToggle.classList.add('playing');
        musicToggle.setAttribute('aria-label', 'Pause background music');
    } else {
        musicToggle.classList.remove('playing');
        musicToggle.setAttribute('aria-label', 'Play background music');
    }
}

/**
 * Pause music (useful for video playback)
 */
function pauseMusic() {
    if (backgroundMusic && isPlaying) {
        backgroundMusic.pause();
    }
}

/**
 * Resume music
 */
function resumeMusic() {
    if (backgroundMusic && !isPlaying) {
        const playPromise = backgroundMusic.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.warn('Resume failed:', error);
            });
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMusic);
} else {
    initMusic();
}

// Export functions for use in other modules
window.musicController = {
    pause: pauseMusic,
    resume: resumeMusic,
    toggle: toggleMusic
};

