/**
 * main.js
 * Entry point — initializes all modules after DOM is ready.
 */

import { initCursor          } from './cursor.js';
import { initAnimations      } from './animations.js';
import { initNav             } from './nav.js';
import { initMagnetic        } from './magnetic.js';
import { initTelemetryCanvas } from './canvas.js';

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initAnimations();
  initNav();
  initMagnetic();
  initTelemetryCanvas();

  // Console Telemetry Welcome Log
  console.log(
    `%c[SYSTEM ONLINE] // DEPT-00 ACTIVE // LATENCY: 12ms // SEC-LVL: OMEGA\n%cWelcome to Dev Agarwal's software engineering interface. Raw ideas optimized into precision systems.`,
    'color: #00f0ff; font-weight: bold; font-family: monospace; font-size: 11px;',
    'color: #a0aec0; font-family: monospace; font-size: 10px;'
  );
});
