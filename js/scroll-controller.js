/**
 * Scroll Controller & Rover Input Coordinator (Concept 1)
 */

document.addEventListener('DOMContentLoaded', () => {
  const progressBar = document.getElementById('scroll-progress-bar');
  const modeBtn = document.getElementById('hud-mode-btn');

  // Initialize 3D Cyber Lab Universe
  if (window.initSpatialUniverse) {
    window.initSpatialUniverse();
  }

  // Scroll Progress Listener
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const currentScroll = window.scrollY;
    const progress = totalHeight > 0 ? Math.min(Math.max(currentScroll / totalHeight, 0), 1) : 0;

    if (progressBar) {
      progressBar.style.width = `${progress * 100}%`;
    }

    if (window.cyberLab) {
      window.cyberLab.setScrollProgress(progress);
    }
  });

  // Toggle Control Mode
  if (modeBtn) {
    modeBtn.addEventListener('click', () => {
      if (!window.cyberLab) return;
      const newMode = window.cyberLab.controlMode === 'scroll' ? 'manual' : 'scroll';
      window.cyberLab.setControlMode(newMode);
      if (window.soundEngine) window.soundEngine.playClick();
    });
  }

  // Mobile Touch D-pad bindings
  const bindTouchKey = (id, keyName) => {
    const btn = document.getElementById(id);
    if (!btn) return;

    btn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (window.cyberLab) {
        window.cyberLab.setControlMode('manual');
        window.cyberLab.keys[keyName] = true;
      }
    });

    btn.addEventListener('touchend', (e) => {
      e.preventDefault();
      if (window.cyberLab) {
        window.cyberLab.keys[keyName] = false;
      }
    });
  };

  bindTouchKey('touch-up', 'up');
  bindTouchKey('touch-down', 'down');
  bindTouchKey('touch-left', 'left');
  bindTouchKey('touch-right', 'right');
});
