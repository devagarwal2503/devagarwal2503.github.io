/**
 * cursor.js
 * Custom cursor — dot + ring with spring physics.
 * Desktop only (hidden via CSS on touch devices).
 */

export function initCursor() {
  // Don't run on touch devices
  if (window.matchMedia('(hover: none)').matches) return;

  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');

  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let rafId  = null;

  // Dot follows instantly
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Ring follows with spring lag
  function animateRing() {
    const dx = mouseX - ringX;
    const dy = mouseY - ringY;
    // Spring coefficient — lower = more lag, more organic
    ringX += dx * 0.12;
    ringY += dy * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    rafId = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover state — enlarge ring over interactive elements
  const interactiveSelectors = 'a, button, .btn, .card, .contact-link, .nav__link, [data-cursor-hover]';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelectors)) {
      ring.classList.add('is-hovering');
      dot.style.opacity = '0';
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelectors)) {
      ring.classList.remove('is-hovering');
      dot.style.opacity = '1';
    }
  });

  // Hide when cursor leaves window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
}
