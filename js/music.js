/* ============================================
   MUSIC CONTROL
   Background music play/pause functionality
   Scene-wise music support
   ============================================ */

/**
 * Music Controller
 * Handles background music playback with user control
 * Supports different music tracks for different scenes
 */

// Get audio element and toggle button
const backgroundMusic = document.getElementById('backgroundMusic');
const musicToggle = document.getElementById('musicToggle');

// Initialize music settings
let isPlaying = false;
let currentMusicSceneIndex = 0;
let currentAudio = null;

// Scene music configuration
// Map scene index to music file path
const sceneMusicConfig = {
    0: 'assets/audio/background-music.mp3', // Landing scene
    1: 'assets/audio/scene1-music.mp3',      // Meet Your Little Guide
    2: 'assets/audio/scene2-music.mp3',      // How This Moment Came to Be
    3: 'assets/audio/scene3-music.mp3',      // The Things Worth Saying
    4: 'assets/audio/scene4-music.mp3',      // A Wish for What's Ahead
    5: 'assets/audio/scene5-music.mp3',      // A Thought, in Bloom
    6: 'assets/audio/scene6-music.mp3',      // Before We Continue
    7: 'assets/audio/scene7-music.mp3',      // From Me, Honestly
    8: 'assets/audio/scene8-music.mp3'       // Until the Year Ends
    // Add more scenes as needed
};

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
    currentAudio = backgroundMusic;

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
        // Don't hide button, just log error - other scenes might have music
    });
}

/**
 * Change music for a specific scene
 * @param {number} sceneIndex - The scene index to play music for
 */
function changeSceneMusic(sceneIndex) {
    currentMusicSceneIndex = sceneIndex;
    
    // Get music file for this scene
    const musicFile = sceneMusicConfig[sceneIndex];
    
    if (!musicFile) {
        // No music configured for this scene, pause current music
        if (currentAudio && isPlaying) {
            currentAudio.pause();
            isPlaying = false;
            updateMusicButton();
        }
        return;
    }

    // If same music file, don't change
    // Extract filename from both paths for comparison
    let currentSrc = '';
    if (currentAudio && currentAudio.src) {
        try {
            currentSrc = new URL(currentAudio.src, window.location.href).pathname;
        } catch (e) {
            // Fallback to simple string check if URL parsing fails
            currentSrc = currentAudio.src;
        }
    }
    const newMusicFile = musicFile.split('/').pop();
    if (currentSrc && currentSrc.includes(newMusicFile)) {
        return;
    }

    // Fade out current music
    if (currentAudio && isPlaying) {
        fadeOutMusic(currentAudio, () => {
            // Load and play new music
            loadAndPlayMusic(musicFile);
        });
    } else {
        // No music playing, just load new music
        loadAndPlayMusic(musicFile);
    }
}

/**
 * Load and play music file
 * @param {string} musicFile - Path to music file
 */
function loadAndPlayMusic(musicFile) {
    // Check if we need to create a new audio element or reuse existing
    if (!currentAudio || currentAudio.id !== 'backgroundMusic') {
        // Create new audio element for scene-specific music
        const newAudio = new Audio(musicFile);
        newAudio.loop = true;
        newAudio.volume = 0.2;
        
        // Set up event listeners
        newAudio.addEventListener('play', () => {
            isPlaying = true;
            updateMusicButton();
        });
        
        newAudio.addEventListener('pause', () => {
            isPlaying = false;
            updateMusicButton();
        });
        
        newAudio.addEventListener('error', (e) => {
            console.warn('Audio error for', musicFile, e);
            // Try to use default background music as fallback
            if (backgroundMusic && musicFile !== backgroundMusic.src) {
                loadAndPlayMusic('assets/audio/background-music.mp3');
            }
        });
        
        currentAudio = newAudio;
    } else {
        // Update existing audio source
        currentAudio.src = musicFile;
        currentAudio.load();
    }
    
    // Play if music was previously playing
    if (isPlaying) {
        const playPromise = currentAudio.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    isPlaying = true;
                    updateMusicButton();
                    // Fade in
                    fadeInMusic(currentAudio);
                })
                .catch(error => {
                    console.warn('Playback failed:', error);
                });
        }
    }
}

/**
 * Fade out music smoothly
 * @param {HTMLAudioElement} audio - Audio element to fade out
 * @param {Function} callback - Callback when fade is complete
 */
function fadeOutMusic(audio, callback) {
    if (!audio) {
        if (callback) callback();
        return;
    }
    
    const fadeInterval = 50; // ms
    const fadeStep = audio.volume / 10;
    
    const fadeTimer = setInterval(() => {
        if (audio.volume > fadeStep) {
            audio.volume -= fadeStep;
        } else {
            audio.volume = 0;
            audio.pause();
            clearInterval(fadeTimer);
            if (callback) callback();
        }
    }, fadeInterval);
}

/**
 * Fade in music smoothly
 * @param {HTMLAudioElement} audio - Audio element to fade in
 */
function fadeInMusic(audio) {
    if (!audio) return;
    
    audio.volume = 0;
    const targetVolume = 0.2;
    const fadeInterval = 50; // ms
    const fadeStep = targetVolume / 10;
    
    const fadeTimer = setInterval(() => {
        if (audio.volume < targetVolume - fadeStep) {
            audio.volume += fadeStep;
        } else {
            audio.volume = targetVolume;
            clearInterval(fadeTimer);
        }
    }, fadeInterval);
}

/**
 * Toggle music play/pause
 */
function toggleMusic() {
    if (!currentAudio) {
        // If no current audio, try to load scene music
        changeSceneMusic(currentMusicSceneIndex);
        return;
    }

    try {
        if (isPlaying) {
            currentAudio.pause();
        } else {
            // Play music (may require user interaction first)
            const playPromise = currentAudio.play();
            
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
    if (currentAudio && isPlaying) {
        currentAudio.pause();
    }
}

/**
 * Resume music
 */
function resumeMusic() {
    if (currentAudio && !isPlaying) {
        const playPromise = currentAudio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.warn('Resume failed:', error);
            });
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initMusic();
        // Load music for initial scene (scene 0)
        changeSceneMusic(0);
    });
} else {
    initMusic();
    // Load music for initial scene (scene 0)
    changeSceneMusic(0);
}

// Export functions for use in other modules
window.musicController = {
    pause: pauseMusic,
    resume: resumeMusic,
    toggle: toggleMusic,
    changeScene: changeSceneMusic,
    getCurrentScene: () => currentMusicSceneIndex
};

