/**
 * nav.js
 * Navigation: scroll state, active section highlight, mobile menu.
 */

export function initNav() {
  initScrollState();
  initActiveSection();
  initMobileMenu();
}

/* ── Scroll State (transparent → frosted glass) ──────────── */
function initScrollState() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const threshold = 10;

  function update() {
    if (window.scrollY > threshold) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  update(); // Run once on load
}

/* ── Active Section Highlight ────────────────────────────── */
function initActiveSection() {
  const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
  if (!navLinks.length) return;

  // Build a map of id → link and id → section element
  const sections = [];
  navLinks.forEach((link) => {
    const id = link.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) sections.push({ id, el, link });
  });

  if (!sections.length) return;

  function getActiveId() {
    // Use viewport top-40% threshold: the last section whose top
    // has crossed the 40% mark is the "active" one.
    // This naturally handles scroll-to-bottom without getting stuck.
    const threshold = window.innerHeight * 0.4;
    let activeId = null;

    for (const { id, el } of sections) {
      const rect = el.getBoundingClientRect();
      if (rect.top <= threshold) {
        activeId = id;
      }
    }
    return activeId;
  }

  function updateLinks() {
    const activeId = getActiveId();
    navLinks.forEach((link) => {
      const isActive = activeId !== null && link.getAttribute('href') === `#${activeId}`;
      link.classList.toggle('is-active', isActive);
    });
  }

  window.addEventListener('scroll', updateLinks, { passive: true });
  updateLinks(); // Run once on load
}

/* ── Mobile Menu ─────────────────────────────────────────── */
function initMobileMenu() {
  const hamburger  = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile');
  const mobileLinks = document.querySelectorAll('.nav__mobile-link');

  if (!hamburger || !mobileMenu) return;

  function openMenu() {
    hamburger.classList.add('is-open');
    mobileMenu.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('is-open');
    mobileMenu.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  });

  // Close on link click
  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}
