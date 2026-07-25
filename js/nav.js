/**
 * nav.js
 * Terminal Console navigation, boot sequence diagnostics, and uptime clocks.
 */

// Track if a boot loop is active to avoid multiple runs
let isBooting = false;

export function initNav() {
  initBootSequence();
  initTabRouting();
  initMobileMenu();
}

/* ── Diagnostics Boot Sequence ───────────────────────────── */
function initBootSequence() {
  if (isBooting) return;
  isBooting = true;

  const bootScreen = document.getElementById('boot-screen');
  const bootLogs = document.getElementById('boot-logs');
  const fill = document.getElementById('boot-progress-fill');
  const btn = document.getElementById('btn-boot-enter');
  const consoleShell = document.getElementById('console-shell');

  if (!bootScreen || !bootLogs || !fill || !btn || !consoleShell) {
    isBooting = false;
    return;
  }

  // Clear logs just in case
  bootLogs.innerHTML = '';
  fill.style.width = '0%';
  btn.style.display = 'none';

  const logMessages = [
    'SYS.INIT // MOUNTING SYSTEM FRAMEWORK...',
    'CORE HARDWARE INVENTORY DETECTED // 6 DIVISIONS',
    'RESOLVING FLUTTER RUNTIME DEPENDENCIES... [OK]',
    'LINKING STATE MANAGEMENT MODULES (BLoC, PROVIDER)... [OK]',
    'RESOLVING INTEGRATIONS & PAYMENTS (RAZORPAY, STRIPE)... [OK]',
    'MAPPING GEOLOCATION: 18.5204 N, 73.8567 E // PUNE, IN',
    'DIAGNOSTICS: MEMORY LOAD 14.8% // HEAT SENSORS NOMINAL',
    'ESTABLISHING SECURE CONNECTION CORE PROTOCOL...',
    'CONNECTION SECURED // INTEGRITY 100% // LATENCY 12ms',
    'INITIATING CONSOLE WORKSTATION GRAPHICAL USER INTERFACE...',
    'SYSTEM INITIALIZATION COMPLETED SUCCESSFULLY.'
  ];

  let currentLogIdx = 0;
  let progress = 0;

  // Diagnostics interval loop
  const interval = setInterval(() => {
    if (currentLogIdx < logMessages.length) {
      const p = document.createElement('p');
      p.style.margin = '0 0 4px 0';
      p.style.fontFamily = 'var(--font-mono)';
      p.innerText = `> ${logMessages[currentLogIdx]}`;
      bootLogs.appendChild(p);
      bootLogs.scrollTop = bootLogs.scrollHeight;
      currentLogIdx++;
    }

    // Fill loader progress bar
    progress += Math.floor(Math.random() * 8) + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      fill.style.width = '100%';
      // Fade in system access button
      btn.style.display = 'block';
      isBooting = false;
    } else {
      fill.style.width = `${progress}%`;
    }
  }, 140);

  // Enter command center
  // Ensure click listener is only attached once
  if (!btn.dataset.listenerAttached) {
    btn.dataset.listenerAttached = 'true';
    btn.addEventListener('click', () => {
      bootScreen.classList.add('is-booted');
      document.body.classList.add('console-active');
      consoleShell.style.display = 'flex';

      // Route initially matching hash state, default to '#about'
      const targetHash = window.location.hash || '#about';
      activateTab(targetHash.slice(1));

      // Run custom reveals inside active tabs
      triggerTabReveals(targetHash.slice(1));

      // Begin uptime telemetry clock
      startUptimeCounter();
    });
  }
}

/* ── SPA Tabbed Routing ─────────────────────────────────── */
function activateTab(tabId) {
  // Normalize invalid tab targets
  const validTabs = ['about', 'experience', 'work', 'stack', 'contact'];
  if (!validTabs.includes(tabId)) {
    tabId = 'about';
  }

  // Swap active screens visibility
  const screens = document.querySelectorAll('.console-screen');
  screens.forEach((s) => s.classList.remove('is-active'));

  const targetScreen = document.getElementById(`tab-${tabId}`);
  if (targetScreen) {
    targetScreen.classList.add('is-active');
    // Scroll container back to top instantly
    const scrollEl = targetScreen.querySelector('.screen-scroll-container');
    if (scrollEl) scrollEl.scrollTop = 0;
  }

  // Update navbar items indicator CSS classes (desktop & mobile)
  const links = document.querySelectorAll('.nav__link, .nav__mobile-link');
  links.forEach((link) => {
    const isTarget = link.getAttribute('data-tab') === tabId || link.getAttribute('href') === `#${tabId}`;
    link.classList.toggle('is-active', isTarget);
  });

  // Safe update URL hash coordinate
  if (window.location.hash !== `#${tabId}`) {
    history.pushState(null, null, `#${tabId}`);
  }

  // Trigger animations inside tab elements
  triggerTabReveals(tabId);
}

function initTabRouting() {
  const links = document.querySelectorAll('.nav__link, .nav__mobile-link');
  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = link.getAttribute('data-tab');
      if (tabId) {
        activateTab(tabId);
      }
    });
  });

  // Bind Logo click route direct to about tab!
  const logo = document.querySelector('.nav__logo');
  if (logo) {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      activateTab('about');
    });
  }

  // Intercept back-forward history clicks
  window.addEventListener('hashchange', () => {
    const tabId = window.location.hash.slice(1);
    if (tabId) activateTab(tabId);
  });
}

function triggerSystemReboot() {
  const bootScreen = document.getElementById('boot-screen');
  const consoleShell = document.getElementById('console-shell');

  if (!bootScreen || !consoleShell) return;

  // Hides workstation UI and resets body scroll lock
  consoleShell.style.display = 'none';
  document.body.classList.remove('console-active');
  bootScreen.classList.remove('is-booted');

  // Trigger diagnostic loader again
  initBootSequence();
}

/* Force run scroll reveals on tab change since page is viewport-locked */
function triggerTabReveals(tabId) {
  const screen = document.getElementById(`tab-${tabId}`);
  if (!screen) return;
  const revealEls = screen.querySelectorAll('.reveal');
  revealEls.forEach((el) => {
    el.classList.add('is-visible');
  });
}

/* ── Uptime Counter Telemetry ────────────────────────────── */
let uptimeIntervalId = null;
function startUptimeCounter() {
  // Prevent multiple ticking intervals
  if (uptimeIntervalId !== null) return;

  const counterEl = document.getElementById('uptime-counter');
  if (!counterEl) return;

  let seconds = 0;
  let minutes = 0;
  let hours = 0;

  uptimeIntervalId = setInterval(() => {
    seconds++;
    if (seconds >= 60) {
      seconds = 0;
      minutes++;
      if (minutes >= 60) {
        minutes = 0;
        hours++;
      }
    }

    const h = hours.toString().padStart(2, '0');
    const m = minutes.toString().padStart(2, '0');
    const s = seconds.toString().padStart(2, '0');

    counterEl.innerText = `${h}:${m}:${s}`;
  }, 1000);
}

/* ── Mobile Nav Overlay Toggle ───────────────────────────── */
function initMobileMenu() {
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile');
  const mobileLinks = document.querySelectorAll('.nav__mobile-link');

  if (!hamburger || !mobileMenu) return;

  function openMenu() {
    hamburger.classList.add('is-open');
    mobileMenu.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    hamburger.classList.remove('is-open');
    mobileMenu.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  });

  mobileLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      // Mobile click routes tab and then closes overlay
      const tabId = link.getAttribute('data-tab');
      if (tabId) activateTab(tabId);
      closeMenu();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}
