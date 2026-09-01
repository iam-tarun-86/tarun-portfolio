/**
 * MotionSites Dynamic Cursor Spotlight & Raytraced Glass Tracker
 * Illuminates card borders and surfaces relative to mouse position
 */

document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.glass-panel, .calc-card, .quest-dock, .top-rover-hud, .hero-telemetry-card');

  window.addEventListener('mousemove', (e) => {
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
});
