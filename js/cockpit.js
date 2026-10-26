/**
 * cockpit.js
 * Interactive Developer IDE card in the hero section.
 * Displays Dev's real TypeScript profile, architecture breakdown, and stack.
 */

import { playClickSound } from './audio.js';
import { showToast } from './toast.js';

export function initHeroCockpit() {
  const cockpit = document.getElementById('hero-cockpit');
  if (!cockpit) return;

  const tabs = cockpit.querySelectorAll('.cockpit-tab-btn');
  const panels = cockpit.querySelectorAll('.cockpit-panel');
  const copyBtn = cockpit.querySelector('#cockpit-copy-btn');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      playClickSound();
      const targetId = tab.dataset.target;
      tabs.forEach(t => t.classList.remove('is-active'));
      panels.forEach(p => p.classList.remove('is-active'));

      tab.classList.add('is-active');
      const targetPanel = cockpit.querySelector(`#${targetId}`);
      if (targetPanel) targetPanel.classList.add('is-active');
    });
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      playClickSound();
      const activePanel = cockpit.querySelector('.cockpit-panel.is-active code');
      if (activePanel) {
        navigator.clipboard.writeText(activePanel.innerText).then(() => {
          showToast('Copied code snippet to clipboard!', 'success');
        });
      }
    });
  }
}
