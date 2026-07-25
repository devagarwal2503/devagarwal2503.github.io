/**
 * physics-skills.js
 * Custom 2D canvas physics engine for skill bubbles.
 * Supports elastic bubble-to-bubble collision, bounds bouncing,
 * gravity, mouse repulsion, and click-and-drag mechanics.
 */

const SKILLS = [
  { name: "Flutter", category: "mobile" },
  { name: "Dart", category: "mobile" },
  { name: "Android", category: "mobile" },
  { name: "iOS", category: "mobile" },
  { name: "Node.js", category: "backend" },
  { name: "Express.js", category: "backend" },
  { name: "React", category: "web" },
  { name: "MongoDB", category: "backend" },
  { name: "Firebase", category: "backend" },
  { name: "Supabase", category: "backend" },
  { name: "REST APIs", category: "backend" },
  { name: "BLoC", category: "architecture" },
  { name: "Riverpod", category: "architecture" },
  { name: "Git", category: "tools" },
  { name: "Docker", category: "tools" },
  { name: "n8n", category: "ai" },
  { name: "LLMs", category: "ai" }
];

class Bubble {
  constructor(x, y, text, category) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 4;
    this.vy = (Math.random() - 0.5) * 4;
    this.text = text;
    this.category = category;
    
    // Size bubble based on text length
    this.paddingX = 14;
    this.paddingY = 8;
    this.fontSize = 11;
    this.width = text.length * 7 + this.paddingX * 2;
    this.height = this.fontSize + this.paddingY * 2;
    
    // Treat as a circle for simplified physics calculations
    this.radius = Math.max(this.width, this.height) / 2;
    this.mass = this.radius * 0.1;
    this.isDragged = false;
    
    // Setup colors based on category
    this.setColors();
  }

  setColors() {
    switch (this.category) {
      case "mobile":
        this.bgColor = "rgba(139, 92, 246, 0.12)"; // violet
        this.borderColor = "#a78bfa";
        this.textColor = "#d8b4fe";
        break;
      case "backend":
        this.bgColor = "rgba(16, 185, 129, 0.1)"; // green/emerald
        this.borderColor = "#10b981";
        this.textColor = "#34d399";
        break;
      case "ai":
        this.bgColor = "rgba(245, 158, 11, 0.1)"; // amber
        this.borderColor = "#f59e0b";
        this.textColor = "#fbbf24";
        break;
      default:
        this.bgColor = "rgba(255, 255, 255, 0.04)"; // default/grey
        this.borderColor = "#3b3f4c";
        this.textColor = "#9ca3af";
    }
  }

  update(width, height, gravity, friction, restitution) {
    if (this.isDragged) return;

    // Apply gravity
    this.vy += gravity;

    // Apply velocity
    this.x += this.vx;
    this.y += this.vy;

    // Boundary Collisions (Sides)
    if (this.x - this.radius < 0) {
      this.x = this.radius;
      this.vx = -this.vx * restitution;
    } else if (this.x + this.radius > width) {
      this.x = width - this.radius;
      this.vx = -this.vx * restitution;
    }

    // Boundary Collisions (Bottom/Top)
    if (this.y + this.radius > height) {
      this.y = height - this.radius;
      this.vy = -this.vy * restitution;
      this.vx *= friction; // apply friction only on floor
    } else if (this.y - this.radius < 0) {
      this.y = this.radius;
      this.vy = -this.vy * restitution;
    }
  }

  draw(ctx) {
    ctx.save();
    
    // Draw bubble node card
    ctx.shadowBlur = 4;
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    
    ctx.fillStyle = this.bgColor;
    ctx.strokeStyle = this.borderColor;
    ctx.lineWidth = 1.2;
    
    // Draw rounded rect/pill
    const rx = this.x - this.width / 2;
    const ry = this.y - this.height / 2;
    const r = this.height / 2;
    
    ctx.beginPath();
    ctx.moveTo(rx + r, ry);
    ctx.lineTo(rx + this.width - r, ry);
    ctx.quadraticCurveTo(rx + this.width, ry, rx + this.width, ry + r);
    ctx.quadraticCurveTo(rx + this.width, ry + this.height, rx + this.width - r, ry + this.height);
    ctx.lineTo(rx + r, ry + this.height);
    ctx.quadraticCurveTo(rx, ry + this.height, rx, ry + r);
    ctx.quadraticCurveTo(rx, ry, rx + r, ry);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw Text
    ctx.fillStyle = this.textColor;
    ctx.font = `500 ${this.fontSize}px 'JetBrains Mono', monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.text, this.x, this.y + 0.5);

    ctx.restore();
  }
}

export class SkillsPhysics {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    
    this.bubbles = [];
    this.animationId = null;
    this.isActive = false;

    // Physics parameters
    this.gravity = 0.15;
    this.friction = 0.98;
    this.restitution = 0.65;
    this.repulsionRadius = 65;
    this.repulsionStrength = 0.5;

    // Mouse coordinates
    this.mouse = { x: -1000, y: -1000, isDown: false };
    this.draggedBubble = null;
    this.dragOffset = { x: 0, y: 0 };
    this.lastMouse = { x: 0, y: 0 };
    this.mouseVelocity = { x: 0, y: 0 };

    this.bindEvents();
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  initBubbles() {
    this.bubbles = [];
    const cols = 4;
    const spacingX = this.canvas.width / (cols + 1);
    
    SKILLS.forEach((skill, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      
      const x = spacingX * (col + 1) + (Math.random() - 0.5) * 15;
      const y = 30 + row * 40 + (Math.random() - 0.5) * 10;
      
      this.bubbles.push(new Bubble(x, y, skill.name, skill.category));
    });
  }

  bindEvents() {
    const getCoords = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const handleStart = (e) => {
      if (!this.isActive) return;
      const coords = getCoords(e);
      this.mouse.x = coords.x;
      this.mouse.y = coords.y;
      this.mouse.isDown = true;
      this.lastMouse.x = coords.x;
      this.lastMouse.y = coords.y;

      // Check click hits bubble
      for (let bubble of this.bubbles) {
        // Pill box distance check
        const dx = coords.x - bubble.x;
        const dy = coords.y - bubble.y;
        if (Math.abs(dx) < bubble.width / 2 && Math.abs(dy) < bubble.height / 2) {
          this.draggedBubble = bubble;
          bubble.isDragged = true;
          bubble.vx = 0;
          bubble.vy = 0;
          this.dragOffset.x = coords.x - bubble.x;
          this.dragOffset.y = coords.y - bubble.y;
          break;
        }
      }
    };

    const handleMove = (e) => {
      if (!this.isActive) return;
      const coords = getCoords(e);
      
      // Calculate mouse velocity for throwing physics
      this.mouseVelocity.x = coords.x - this.lastMouse.x;
      this.mouseVelocity.y = coords.y - this.lastMouse.y;

      this.mouse.x = coords.x;
      this.mouse.y = coords.y;
      
      this.lastMouse.x = coords.x;
      this.lastMouse.y = coords.y;

      if (this.draggedBubble) {
        this.draggedBubble.x = coords.x - this.dragOffset.x;
        this.draggedBubble.y = coords.y - this.dragOffset.y;
      }
    };

    const handleEnd = () => {
      this.mouse.isDown = false;
      if (this.draggedBubble) {
        this.draggedBubble.isDragged = false;
        // Inject velocity based on pointer drag flick
        this.draggedBubble.vx = this.mouseVelocity.x * 0.8;
        this.draggedBubble.vy = this.mouseVelocity.y * 0.8;
        this.draggedBubble = null;
      }
    };

    // Desktop mouse events
    this.canvas.addEventListener("mousedown", handleStart);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);

    // Mobile touch events
    this.canvas.addEventListener("touchstart", handleStart, { passive: true });
    window.addEventListener("touchmove", handleMove, { passive: true });
    window.addEventListener("touchend", handleEnd);

    // Resize observer
    window.addEventListener("resize", () => {
      if (this.isActive) {
        this.resize();
      }
    });
  }

  resolveBubbleCollisions() {
    for (let i = 0; i < this.bubbles.length; i++) {
      for (let j = i + 1; j < this.bubbles.length; j++) {
        const b1 = this.bubbles[i];
        const b2 = this.bubbles[j];

        const dx = b2.x - b1.x;
        const dy = b2.y - b1.y;
        const dist = Math.hypot(dx, dy);
        
        // Dynamic minimum distance to prevent text overlap
        // We use average width/height bounds as visual padding
        const minDist = (b1.radius + b2.radius) * 0.85;

        if (dist < minDist) {
          // Push away to resolve overlap
          const overlap = minDist - dist;
          const nx = dx / dist;
          const ny = dy / dist;

          const separationX = nx * overlap * 0.5;
          const separationY = ny * overlap * 0.5;

          if (!b1.isDragged) {
            b1.x -= separationX;
            b1.y -= separationY;
          }
          if (!b2.isDragged) {
            b2.x += separationX;
            b2.y += separationY;
          }

          // Elastic collision physics response
          const kx = b1.vx - b2.vx;
          const ky = b1.vy - b2.vy;
          const relativeSpeed = kx * nx + ky * ny;

          if (relativeSpeed > 0) {
            const impulse = (2 * relativeSpeed) / (b1.mass + b2.mass);
            
            if (!b1.isDragged) {
              b1.vx -= impulse * b2.mass * nx * 0.9;
              b1.vy -= impulse * b2.mass * ny * 0.9;
            }
            if (!b2.isDragged) {
              b2.vx += impulse * b1.mass * nx * 0.9;
              b2.vy += impulse * b1.mass * ny * 0.9;
            }
          }
        }
      }
    }
  }

  applyMouseForce(bubble) {
    if (bubble.isDragged) return;
    
    const dx = this.mouse.x - bubble.x;
    const dy = this.mouse.y - bubble.y;
    const dist = Math.hypot(dx, dy);

    if (dist < this.repulsionRadius) {
      // Direct repulsive force scaling inversely with distance
      const force = (this.repulsionRadius - dist) / this.repulsionRadius;
      const angle = Math.atan2(dy, dx);
      
      // Repel away from mouse coordinates
      bubble.vx -= Math.cos(angle) * force * this.repulsionStrength;
      bubble.vy -= Math.sin(angle) * force * this.repulsionStrength;
    }
  }

  loop() {
    if (!this.isActive) return;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw bubbles
    this.bubbles.forEach((bubble) => {
      this.applyMouseForce(bubble);
      bubble.update(this.canvas.width, this.canvas.height, this.gravity, this.friction, this.restitution);
    });

    // Resolve bubble collisions
    this.resolveBubbleCollisions();

    // Render bubbles
    this.bubbles.forEach((bubble) => bubble.draw(this.ctx));

    this.animationId = requestAnimationFrame(() => this.loop());
  }

  start() {
    this.isActive = true;
    this.resize();
    this.initBubbles();
    this.loop();
  }

  stop() {
    this.isActive = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
