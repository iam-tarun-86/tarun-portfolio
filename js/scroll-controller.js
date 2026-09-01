/**
 * Scroll Physics & 3D Parallax Orchestrator
 * Maps scroll position to 3D camera timeline, updates progress bar, and handles 3D card tilt
 */

document.addEventListener('DOMContentLoaded', () => {
  const progressBar = document.getElementById('scroll-progress-bar');
  const navLinks = document.querySelectorAll('.spatial-nav-link');
  const stages = document.querySelectorAll('.stage-section');

  // Initialize Three.js Spatial Universe
  if (window.initSpatialUniverse) {
    window.initSpatialUniverse();
  }

  // Handle Scroll Progress
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const currentScroll = window.scrollY;
    const progress = totalHeight > 0 ? Math.min(Math.max(currentScroll / totalHeight, 0), 1) : 0;

    // Update Top Progress Bar
    if (progressBar) {
      progressBar.style.width = `${progress * 100}%`;
    }

    // Drive 3D WebGL Camera Timeline
    if (window.spatialUniverse) {
      window.spatialUniverse.setScrollProgress(progress);
    }

    // Update Active Nav Link
    stages.forEach((stage, idx) => {
      const rect = stage.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.45) {
        navLinks.forEach(link => link.classList.remove('active'));
        if (navLinks[idx]) navLinks[idx].classList.add('active');
      }
    });
  });

  // 3D Gyroscopic Card Tilt on Hover
  const cards = document.querySelectorAll('.spatial-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotateX = -(y / (rect.height / 2)) * 6;
      const rotateY = (x / (rect.width / 2)) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
});
