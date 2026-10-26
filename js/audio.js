/**
 * audio.js
 * Synthesized Web Audio API sound effects. Zero external asset files.
 * Generates futuristic, subtle micro-haptics on the fly.
 */

let audioCtx = null;
let isMuted = localStorage.getItem('portfolio-audio-muted') === 'true';

function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function isAudioMuted() {
  return isMuted;
}

export function toggleAudioMute() {
  isMuted = !isMuted;
  localStorage.setItem('portfolio-audio-muted', isMuted ? 'true' : 'false');
  updateAudioToggleUI();
  if (!isMuted) {
    playTone(520, 'sine', 0.08, 0.04);
  }
  return isMuted;
}

export function updateAudioToggleUI() {
  const btns = document.querySelectorAll('[data-action="toggle-sound"]');
  btns.forEach(btn => {
    btn.setAttribute('aria-pressed', (!isMuted).toString());
    const icon = btn.querySelector('.audio-icon');
    if (icon) {
      icon.innerHTML = isMuted
        ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`
        : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;
    }
    const label = btn.querySelector('.audio-label');
    if (label) {
      label.textContent = isMuted ? 'Muted' : 'Sound On';
    }
  });
}

function playTone(freq, type = 'sine', duration = 0.05, gainValue = 0.03) {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(gainValue, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // AudioContext blocked before interaction
  }
}

export function playClickSound() {
  playTone(800, 'triangle', 0.04, 0.025);
}

export function playHoverSound() {
  playTone(320, 'sine', 0.03, 0.015);
}

export function playSuccessSound() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [440, 660, 880].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.06);
      gain.gain.setValueAtTime(0.02, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.06 + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.12);
    });
  } catch {}
}

export function playTerminalBeep() {
  playTone(600, 'square', 0.03, 0.015);
}

export function initAudio() {
  updateAudioToggleUI();

  // Unlock audio on first user gesture
  const unlock = () => {
    getAudioContext();
    window.removeEventListener('pointerdown', unlock);
    window.removeEventListener('keydown', unlock);
  };
  window.addEventListener('pointerdown', unlock, { once: true });
  window.addEventListener('keydown', unlock, { once: true });

  // Attach hover sounds to key interactive buttons
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('button, .btn, .nav__link, .card__link')) {
      playHoverSound();
    }
  });

  document.addEventListener('click', (e) => {
    if (e.target.closest('button, .btn, .nav__link, .card__link')) {
      playClickSound();
    }
  });
}
