/**
 * physics-contact.js
 * Draws glowing interactive connection lines (electric arc streams)
 * from contact link nodes to the user's cursor.
 */

export class ContactPhysics {
  constructor(canvasId, containerId) {
    this.canvas = document.getElementById(canvasId);
    this.container = document.querySelector(containerId);
    if (!this.canvas || !this.container) return;

    this.ctx = this.canvas.getContext("2d");
    this.nodes = Array.from(this.container.querySelectorAll(".contact-btn-node"));
    
    this.isActive = false;
    this.animationId = null;

    // Mouse positions (relative to canvas coordinates)
    this.mouse = { x: -1000, y: -1000, isInside: false };
    
    // Animation metrics
    this.time = 0;
    this.particles = []; // particles traveling along paths

    this.boundResize = this.resize.bind(this);
    this.boundMouseMove = this.onMouseMove.bind(this);
    this.boundMouseEnter = this.onMouseEnter.bind(this);
    this.boundMouseLeave = this.onMouseLeave.bind(this);
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  onMouseMove(e) {
    if (!this.isActive) return;
    const rect = this.canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    this.mouse.x = clientX - rect.left;
    this.mouse.y = clientY - rect.top;
  }

  onMouseEnter() {
    this.mouse.isInside = true;
  }

  onMouseLeave() {
    this.mouse.isInside = false;
    this.mouse.x = -1000;
    this.mouse.y = -1000;
  }

  bindEvents() {
    this.container.addEventListener("mousemove", this.boundMouseMove);
    this.container.addEventListener("mouseenter", this.boundMouseEnter);
    this.container.addEventListener("mouseleave", this.boundMouseLeave);

    this.container.addEventListener("touchmove", this.boundMouseMove, { passive: true });
    this.container.addEventListener("touchstart", this.boundMouseEnter, { passive: true });
    this.container.addEventListener("touchend", this.boundMouseLeave);

    window.addEventListener("resize", this.boundResize);
  }

  unbindEvents() {
    this.container.removeEventListener("mousemove", this.boundMouseMove);
    this.container.removeEventListener("mouseenter", this.boundMouseEnter);
    this.container.removeEventListener("mouseleave", this.boundMouseLeave);

    this.container.removeEventListener("touchmove", this.boundMouseMove);
    this.container.removeEventListener("touchstart", this.boundMouseEnter);
    this.container.removeEventListener("touchend", this.boundMouseLeave);

    window.removeEventListener("resize", this.boundResize);
  }

  drawConnectorLine(x1, y1, x2, y2) {
    this.ctx.save();
    
    // Create connection path gradient
    const grad = this.ctx.createLinearGradient(x1, y1, x2, y2);
    grad.addColorStop(0, "rgba(139, 92, 246, 0.45)"); // Glow start (purple)
    grad.addColorStop(1, "rgba(16, 185, 129, 0.15)");  // Fade end (emerald)
    
    this.ctx.strokeStyle = grad;
    this.ctx.lineWidth = 1.5;
    
    // Draw wavy vector Bezier connector
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    
    // Adding sine waves to make lines feel alive
    const offset = Math.sin(this.time * 0.05 + (x1 * 0.01)) * 12;
    const controlX = midX;
    const controlY = midY + offset;

    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.quadraticCurveTo(controlX, controlY, x2, y2);
    this.ctx.stroke();

    // Draw node glowing targets on hovered cursor
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = "#8b5cf6";
    this.ctx.fillStyle = "rgba(139, 92, 246, 0.7)";
    this.ctx.beginPath();
    this.ctx.arc(x2, y2, 2.5, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
  }

  spawnNodePulse(x1, y1, x2, y2) {
    // Spawn data packet particles along the bezier paths at random intervals
    if (Math.random() < 0.04) {
      this.particles.push({
        progress: 0,
        speed: 0.015 + Math.random() * 0.01,
        x1, y1, x2, y2,
        size: 2 + Math.random() * 2
      });
    }
  }

  updateParticles() {
    this.ctx.save();
    this.ctx.fillStyle = "#a78bfa";
    this.ctx.shadowBlur = 8;
    this.ctx.shadowColor = "#8b5cf6";

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.progress += p.speed;

      if (p.progress >= 1) {
        this.particles.splice(i, 1);
        continue;
      }

      // Bezier curve calculations mapping to standard line wave offset
      const midX = (p.x1 + p.x2) / 2;
      const midY = (p.y1 + p.y2) / 2;
      const offset = Math.sin(this.time * 0.05 + (p.x1 * 0.01)) * 12;
      
      const cx = midX;
      const cy = midY + offset;

      // Quadratic bezier formula
      const t = p.progress;
      const x = (1 - t) * (1 - t) * p.x1 + 2 * (1 - t) * t * cx + t * t * p.x2;
      const y = (1 - t) * (1 - t) * p.y1 + 2 * (1 - t) * t * cy + t * t * p.y2;

      this.ctx.beginPath();
      this.ctx.arc(x, y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.restore();
  }

  loop() {
    if (!this.isActive) return;

    this.time++;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.mouse.isInside && this.mouse.x !== -1000) {
      const canvasRect = this.canvas.getBoundingClientRect();

      this.nodes.forEach((node) => {
        // Find exact center coordinates of the node button
        const nodeRect = node.getBoundingClientRect();
        const nx = nodeRect.left - canvasRect.left + nodeRect.width / 2;
        const ny = nodeRect.top - canvasRect.top + nodeRect.height / 2;

        // Draw connections and trace pulse updates
        this.drawConnectorLine(nx, ny, this.mouse.x, this.mouse.y);
        this.spawnNodePulse(nx, ny, this.mouse.x, this.mouse.y);
      });
    }

    this.updateParticles();
    this.animationId = requestAnimationFrame(() => this.loop());
  }

  start() {
    this.isActive = true;
    this.resize();
    this.loop();
    this.bindEvents();
  }

  stop() {
    this.isActive = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles = [];
    this.unbindEvents();
  }
}
