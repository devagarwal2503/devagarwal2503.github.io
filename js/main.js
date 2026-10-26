/**
 * main.js
 * Entry point — initializes all modules after DOM is ready.
 */

import { initCursor           } from './cursor.js';
import { initAnimations       } from './animations.js';
import { initNav              } from './nav.js';
import { initMagnetic         } from './magnetic.js';
import { initAudio            } from './audio.js';
import { initHeroCanvas       } from './canvas-bg.js';
import { initSpotlight        } from './spotlight.js';
import { initCardTilt         } from './tilt.js';
import { initInteractiveDemos } from './demos.js';
import { initCommandPalette   } from './command-palette.js';
import { initTerminal         } from './terminal.js';
import { initScrollProgress   } from './scroll-progress.js';
import { initHeroCockpit      } from './cockpit.js';

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initAnimations();
  initNav();
  initMagnetic();
  initAudio();
  initHeroCanvas();
  initHeroCockpit();
  initSpotlight();
  initCardTilt();
  initInteractiveDemos();
  initCommandPalette();
  initTerminal();
  initScrollProgress();
});
