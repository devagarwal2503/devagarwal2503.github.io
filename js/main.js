/**
 * main.js
 * Entry point — initializes all modules after DOM is ready.
 */

import { initCursor    } from './cursor.js';
import { initAnimations } from './animations.js';
import { initNav        } from './nav.js';
import { initMagnetic   } from './magnetic.js';

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initAnimations();
  initNav();
  initMagnetic();
});
