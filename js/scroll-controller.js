/**
 * MotionSites "3D Jack Portfolio" Scroll & Interaction Controller
 * Features:
 * - Character-by-character scroll-driven text reveal
 * - Sticky card stacking scale animation
 * - Top scroll progress bar
 * - Three.js scroll synchronization
 */

class JackScrollController {
  constructor() {
    this.progressBar = document.getElementById('scroll-progress');
    this.revealParagraph = document.getElementById('scroll-reveal-text');
    this.cards = document.querySelectorAll('.sticky-project-card');

    this.charSpans = [];
    this.initCharacterReveal();
    this.bindScrollEvents();
  }

  initCharacterReveal() {
    if (!this.revealParagraph) return;
    const text = this.revealParagraph.innerText.trim();
    this.revealParagraph.innerHTML = '';

    // Wrap each character in a span
    for (let i = 0; i < text.length; i++) {
      const span = document.createElement('span');
      span.className = 'char-span';
      span.innerText = text[i];
      this.revealParagraph.appendChild(span);
      this.charSpans.push(span);
    }
  }

  bindScrollEvents() {
    window.addEventListener('scroll', () => {
      this.onScroll();
    }, { passive: true });

    // Initial check
    this.onScroll();
  }

  onScroll() {
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? scrollY / maxScroll : 0;

    // 1. Top progress bar
    if (this.progressBar) {
      this.progressBar.style.width = `${Math.min(progress * 100, 100)}%`;
    }

    // 2. Three.js scroll progress link
    if (window.cyberLab && typeof window.cyberLab.setScrollProgress === 'function') {
      window.cyberLab.setScrollProgress(progress);
    }

    // 3. Character-by-character scroll reveal
    if (this.revealParagraph && this.charSpans.length > 0) {
      const rect = this.revealParagraph.getBoundingClientRect();
      const windowH = window.innerHeight;
      
      // Calculate how far the paragraph is through the viewport
      const start = windowH * 0.85;
      const end = windowH * 0.25;
      const current = rect.top;
      
      let textProgress = (start - current) / (start - end);
      textProgress = Math.max(0, Math.min(1, textProgress));

      const countToReveal = Math.floor(textProgress * this.charSpans.length);
      for (let i = 0; i < this.charSpans.length; i++) {
        if (i < countToReveal) {
          this.charSpans[i].classList.add('revealed');
        } else {
          this.charSpans[i].classList.remove('revealed');
        }
      }
    }

    // 4. Sticky Project Cards scale & stack calculations
    const totalCards = this.cards.length;
    this.cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      // If card is sticking near the top
      const topOffset = 100 + index * 25;
      if (rect.top <= topOffset + 5) {
        // As user scrolls further past, scale down slightly
        const diff = Math.max(0, topOffset - rect.top);
        const scale = Math.max(0.88, 1 - (totalCards - 1 - index) * 0.025 - diff * 0.0002);
        card.style.transform = `scale(${scale})`;
      } else {
        card.style.transform = 'scale(1)';
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.jackScroll = new JackScrollController();
});
