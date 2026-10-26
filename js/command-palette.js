/**
 * command-palette.js
 * Developer Command Palette (Cmd+K / Ctrl+K) for instant navigation and actions.
 */

import { playClickSound, toggleAudioMute } from './audio.js';
import { showToast } from './toast.js';

export function initCommandPalette() {
  const modal = document.getElementById('cmd-palette-modal');
  const input = document.getElementById('cmd-palette-input');
  const resultsContainer = document.getElementById('cmd-palette-results');
  if (!modal || !input || !resultsContainer) return;

  const actions = [
    {
      id: 'work',
      title: 'View Projects & Live Systems',
      category: 'Navigation',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
      run: () => { window.location.hash = '#work'; }
    },
    {
      id: 'demo-ai',
      title: 'Run AI Code Review Simulator',
      category: 'Interactive Demo',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a2 2 0 0 1 2 2v2h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4V4a2 2 0 0 1 2-2z"/></svg>`,
      run: () => {
        window.location.hash = '#work';
        const btn = document.getElementById('ai-run-review-btn');
        if (btn) btn.click();
      }
    },
    {
      id: 'demo-pg',
      title: 'Simulate PulseGrid Load Balancer',
      category: 'Interactive Demo',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/></svg>`,
      run: () => {
        window.location.hash = '#work';
        const btn = document.getElementById('pg-burst-btn');
        if (btn) btn.click();
      }
    },
    {
      id: 'experience',
      title: 'View Work Experience & Timeline',
      category: 'Navigation',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
      run: () => { window.location.hash = '#experience'; }
    },
    {
      id: 'stack',
      title: 'Explore Tech Stack (Bento Grid)',
      category: 'Navigation',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
      run: () => { window.location.hash = '#stack'; }
    },
    {
      id: 'copy-email',
      title: 'Copy Email to Clipboard',
      category: 'Contact',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
      run: () => {
        navigator.clipboard.writeText('agarwaldev626@gmail.com').then(() => {
          showToast('Copied agarwaldev626@gmail.com to clipboard!', 'success');
        });
      }
    },
    {
      id: 'resume',
      title: 'Download Resume (PDF)',
      category: 'Document',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
      run: () => { window.open('Dev_Agarwal_Resume.pdf', '_blank'); }
    },
    {
      id: 'terminal',
      title: 'Open Interactive CLI Terminal',
      category: 'Tools',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`,
      run: () => {
        const termModal = document.getElementById('terminal-modal');
        if (termModal) {
          termModal.classList.add('is-open');
          const termInput = termModal.querySelector('.terminal-cli-input');
          if (termInput) termInput.focus();
        }
      }
    },
    {
      id: 'toggle-sound',
      title: 'Toggle Sound Effects (Web Audio API)',
      category: 'Preferences',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`,
      run: () => {
        const muted = toggleAudioMute();
        showToast(muted ? 'Sound muted' : 'Sound enabled', 'info');
      }
    },
    {
      id: 'github',
      title: 'Visit GitHub (@devagarwal2503)',
      category: 'External',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1C5.37 1 0 6.37 0 13c0 5.3 3.44 9.8 8.21 11.38.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.74-1.33-1.74-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.23 1.84 1.23 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.14 3 .4 2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58C20.57 22.8 24 18.3 24 13c0-6.63-5.37-12-12-12z"/></svg>`,
      run: () => { window.open('https://github.com/devagarwal2503', '_blank'); }
    },
    {
      id: 'linkedin',
      title: 'Visit LinkedIn Profile',
      category: 'External',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>`,
      run: () => { window.open('https://linkedin.com/in/devagarwal2503', '_blank'); }
    }
  ];

  let selectedIndex = 0;
  let filteredActions = [...actions];

  function openPalette() {
    modal.classList.add('is-open');
    input.value = '';
    renderActions(actions);
    setTimeout(() => input.focus(), 50);
  }

  function closePalette() {
    modal.classList.remove('is-open');
  }

  function renderActions(items) {
    filteredActions = items;
    selectedIndex = 0;
    if (items.length === 0) {
      resultsContainer.innerHTML = `<div class="cmd-palette-empty">No matching commands found.</div>`;
      return;
    }

    resultsContainer.innerHTML = items.map((action, idx) => `
      <div class="cmd-item ${idx === selectedIndex ? 'is-selected' : ''}" data-index="${idx}">
        <span class="cmd-item__icon">${action.icon}</span>
        <div class="cmd-item__text">
          <span class="cmd-item__title">${action.title}</span>
          <span class="cmd-item__category">${action.category}</span>
        </div>
        <kbd class="cmd-item__key">&hookleftarrow;</kbd>
      </div>
    `).join('');

    // Attach click handlers
    resultsContainer.querySelectorAll('.cmd-item').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.dataset.index, 10);
        executeAction(idx);
      });
    });
  }

  function executeAction(index) {
    const action = filteredActions[index];
    if (action) {
      playClickSound();
      closePalette();
      action.run();
    }
  }

  // Keyboard shortcut listener: Cmd+K / Ctrl+K
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (modal.classList.contains('is-open')) {
        closePalette();
      } else {
        openPalette();
      }
    } else if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closePalette();
    }
  });

  // Open triggers
  document.querySelectorAll('[data-action="open-cmd-palette"]').forEach(btn => {
    btn.addEventListener('click', openPalette);
  });

  // Backdrop click to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('cmd-palette-backdrop')) {
      closePalette();
    }
  });

  // Search filtering
  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    if (!query) {
      renderActions(actions);
      return;
    }
    const filtered = actions.filter(a =>
      a.title.toLowerCase().includes(query) ||
      a.category.toLowerCase().includes(query)
    );
    renderActions(filtered);
  });

  // Arrow key navigation
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % filteredActions.length;
      updateSelection();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + filteredActions.length) % filteredActions.length;
      updateSelection();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredActions.length > 0) {
        executeAction(selectedIndex);
      }
    }
  });

  function updateSelection() {
    const items = resultsContainer.querySelectorAll('.cmd-item');
    items.forEach((item, idx) => {
      item.classList.toggle('is-selected', idx === selectedIndex);
      if (idx === selectedIndex) {
        item.scrollIntoView({ block: 'nearest' });
      }
    });
  }
}
