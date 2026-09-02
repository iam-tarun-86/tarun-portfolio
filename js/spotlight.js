/**
 * MotionSites Dynamic 3D Gyro Card Tilt, Spotlight & Audio Feedback
 */

document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.sticky-project-card, .calc-jack-wrapper, .capability-item, .contact-final-box');

  cards.forEach(card => {
    // Sound on hover
    card.addEventListener('mouseenter', () => {
      if (window.soundEngine && window.soundEngine.enabled) {
        window.soundEngine.playClick();
      }
    });

    // 3D Tilt calculation
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Max tilt angle: 6 degrees
      const rotateX = ((y - centerY) / centerY) * -5.0;
      const rotateY = ((x - centerX) / centerX) * 5.0;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
      card.style.setProperty('--rx', `${rotateX.toFixed(2)}deg`);
      card.style.setProperty('--ry', `${rotateY.toFixed(2)}deg`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--rx', `0deg`);
      card.style.setProperty('--ry', `0deg`);
    });
  });

  // Global button click sounds
  document.querySelectorAll('button, a.btn-contact-motionsites, a.btn-secondary-ghost').forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.soundEngine && window.soundEngine.enabled) {
        window.soundEngine.playClick();
      }
    });
  });
});
