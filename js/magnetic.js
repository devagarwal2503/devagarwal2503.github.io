/**
 * magnetic.js
 * Magnetic button effect — elements physically follow cursor.
 * Applied to elements with [data-magnetic] attribute.
 * Max displacement is configurable via data-magnetic-strength.
 */

export function initMagnetic() {
  // Only on non-touch devices
  if (window.matchMedia('(hover: none)').matches) return;

  const magneticEls = document.querySelectorAll('[data-magnetic]');
  if (!magneticEls.length) return;

  magneticEls.forEach((el) => {
    const strength = parseFloat(el.dataset.magneticStrength || '0.35');
    let rafId = null;
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    function animate() {
      currentX = lerp(currentX, targetX, 0.1);
      currentY = lerp(currentY, targetY, 0.1);
      el.style.transform = `translate(${currentX}px, ${currentY}px)`;

      // Keep animating until settled
      if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
        rafId = requestAnimationFrame(animate);
      } else {
        el.style.transform = `translate(${targetX}px, ${targetY}px)`;
        rafId = null;
      }
    }

    el.addEventListener('mousemove', (e) => {
      const rect   = el.getBoundingClientRect();
      const centerX = rect.left + rect.width  / 2;
      const centerY = rect.top  + rect.height / 2;
      const deltaX  = e.clientX - centerX;
      const deltaY  = e.clientY - centerY;

      targetX = deltaX * strength;
      targetY = deltaY * strength;

      if (!rafId) {
        rafId = requestAnimationFrame(animate);
      }
    });

    el.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
      if (!rafId) {
        rafId = requestAnimationFrame(animate);
      }
    });
  });
}
