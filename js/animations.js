/**
 * animations.js
 * Scroll-triggered reveal system using IntersectionObserver.
 * Also handles count-up animations for stat numbers.
 */

export function initAnimations() {
  // Signal to CSS that JS is active — enables progressive-enhancement animations
  document.documentElement.classList.add('js-animations');
  initScrollReveal();
  initCountUp();
}

/* ── Scroll Reveal ────────────────────────────────────────── */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Unobserve after first reveal (one-shot animation)
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealEls.forEach((el) => observer.observe(el));
}

/* ── Count-Up ─────────────────────────────────────────────── */
function initCountUp() {
  const countEls = document.querySelectorAll('[data-count]');
  if (!countEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  countEls.forEach((el) => observer.observe(el));
}

function animateCount(el) {
  const target   = parseFloat(el.dataset.count);
  const duration = 1600; // ms
  const decimals = (el.dataset.count.includes('.')) ? 1 : 0;
  const start    = performance.now();

  function tick(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const value    = eased * target;

    el.textContent = decimals ? value.toFixed(1) : Math.floor(value).toString();

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = decimals ? target.toFixed(1) : target.toString();
    }
  }

  requestAnimationFrame(tick);
}
