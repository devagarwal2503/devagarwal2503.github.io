/**
 * spotlight.js
 * Tracks mouse position over cards to produce radial border glows and dynamic illumination.
 */

export function initSpotlight() {
  if (window.matchMedia('(hover: none)').matches) return;

  const cards = document.querySelectorAll('.card, .bento-tile, .timeline-item');

  cards.forEach((card) => {
    card.classList.add('has-spotlight');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}
