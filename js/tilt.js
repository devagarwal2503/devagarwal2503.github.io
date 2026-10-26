/**
 * tilt.js
 * Smooth 3D perspective tilt & surface glare on cards.
 */

export function initCardTilt() {
  if (window.matchMedia('(hover: none)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const tiltElements = document.querySelectorAll('.card, .card--featured');

  tiltElements.forEach((el) => {
    // Add glare element if not present
    let glare = el.querySelector('.card__glare');
    if (!glare) {
      glare = document.createElement('div');
      glare.className = 'card__glare';
      el.appendChild(glare);
    }

    let isHovering = false;

    el.addEventListener('mouseenter', () => {
      isHovering = true;
      el.style.transition = 'transform 0.1s ease-out, box-shadow 0.2s ease-out';
      glare.style.opacity = '1';
    });

    el.addEventListener('mousemove', (e) => {
      if (!isHovering) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Gentle tilt max ~5-7 degrees
      const maxTilt = el.classList.contains('card--featured') ? 3.5 : 5.5;
      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;

      // Move glare
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.08) 0%, transparent 60%)`;
    });

    el.addEventListener('mouseleave', () => {
      isHovering = false;
      el.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s ease-out';
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      glare.style.opacity = '0';
    });
  });
}
