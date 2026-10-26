/**
 * canvas-bg.js
 * Interactive, high-performance particle & constellation mesh on hero canvas.
 * Drifts organically with gentle physics; connects neighbors with gradient lines;
 * dynamically illuminates and reacts to mouse velocity and proximity.
 */

export function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none';
    return;
  }

  let width = 0;
  let height = 0;
  let particles = [];
  let mouse = { x: -1000, y: -1000, radius: 140 };
  let animationId = null;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = rect.height;
    createParticles();
  }

  function createParticles() {
    particles = [];
    // Adjust density based on screen width
    const count = Math.floor((width * height) / 14000);
    const particleCount = Math.min(Math.max(count, 35), 85);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.5 + 1.2,
        baseColor: Math.random() > 0.4 ? 'rgba(99, 102, 241,' : 'rgba(167, 139, 250,',
        alpha: Math.random() * 0.4 + 0.2
      });
    }
  }

  function update() {
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;

      // Bounce at borders
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Mouse interaction
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        const angle = Math.atan2(dy, dx);
        p.x -= Math.cos(angle) * force * 1.8;
        p.y -= Math.sin(angle) * force * 1.8;
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 120;

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.22;
          ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${p.baseColor}${p.alpha})`;
      ctx.fill();

      // Subtle particle glow
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(99, 102, 241, 0.4)';
    }
    ctx.shadowBlur = 0;
  }

  function loop() {
    update();
    draw();
    animationId = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => {
    resize();
  });

  const heroSection = canvas.closest('.hero');
  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    heroSection.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });
  }

  // Use IntersectionObserver to pause loop when scrolled out of view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!animationId) loop();
      } else {
        if (animationId) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      }
    });
  }, { threshold: 0.05 });

  observer.observe(canvas);

  resize();
  loop();
}
