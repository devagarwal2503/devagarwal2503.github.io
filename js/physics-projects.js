/**
 * physics-projects.js
 * Stacked card controller for the Projects pipeline widget.
 * Implements swipe gesture tracking, inertia fling animation,
 * rubber-band spring back, and layout sorting.
 */

export class ProjectsDeck {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.cards = Array.from(this.container.querySelectorAll(".project-card"));
    this.isActive = false;

    // Gesture state variables
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.draggedCard = null;

    this.swipeThreshold = 130; // pixels to trigger dismiss
    this.boundPointerDown = this.onPointerDown.bind(this);
    this.boundPointerMove = this.onPointerMove.bind(this);
    this.boundPointerUp = this.onPointerUp.bind(this);
  }

  initDeckLayout() {
    this.cards.forEach((card, index) => {
      card.classList.remove("dismissed");
      card.style.transition = "transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.25), opacity 0.5s";
      
      // Compute stack offsets (stacked from top card to bottom card)
      const depth = index;
      const translateY = depth * 14;
      const scale = 1 - depth * 0.04;
      const zIndex = this.cards.length - depth;

      card.style.transform = `translate3d(0px, ${translateY}px, ${-depth * 50}px) scale(${scale})`;
      card.style.zIndex = zIndex;
      card.style.opacity = depth > 3 ? "0" : "1"; // Hide very deep cards
      card.style.pointerEvents = depth === 0 ? "auto" : "none"; // Only top card is draggable
    });
  }

  onPointerDown(e) {
    if (!this.isActive) return;
    
    // Only drag top card
    const topCard = this.cards[0];
    if (!topCard || !topCard.contains(e.target)) return;

    // Ignore clicks on anchor links
    if (e.target.tagName.toLowerCase() === 'a' || e.target.closest('a')) {
      return;
    }

    this.isDragging = true;
    this.draggedCard = topCard;
    this.draggedCard.style.transition = "none"; // Real-time translation during drag

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    this.startX = clientX;
    this.startY = clientY;
    this.currentX = this.startX;
    this.currentY = this.startY;

    if (e.cancelable) e.preventDefault();
  }

  onPointerMove(e) {
    if (!this.isActive || !this.isDragging || !this.draggedCard) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    this.currentX = clientX;
    this.currentY = clientY;

    const dx = this.currentX - this.startX;
    const dy = this.currentY - this.startY;

    // Rotate slightly during horizontal drag
    const rotate = dx * 0.08;

    this.draggedCard.style.transform = `translate3d(${dx}px, ${dy}px, 0px) rotate(${rotate}deg) scale(1.02)`;
  }

  onPointerUp(e) {
    if (!this.isActive || !this.isDragging || !this.draggedCard) return;
    this.isDragging = false;

    const dx = this.currentX - this.startX;
    const dy = this.currentY - this.startY;
    const velocityX = Math.abs(dx);

    this.draggedCard.style.transition = "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.15), opacity 0.4s";

    if (velocityX > this.swipeThreshold) {
      // Dismiss card (flick away)
      const direction = dx > 0 ? 1 : -1;
      const flyX = direction * (window.innerWidth / 2 + 300);
      const flyY = dy + (dy / (dx || 1)) * flyX; // maintain angle
      const rotate = direction * 35;

      this.draggedCard.style.transform = `translate3d(${flyX}px, ${flyY}px, 0px) rotate(${rotate}deg)`;
      this.draggedCard.style.opacity = "0";

      // Re-order card to bottom after transition completes
      const cardToCycle = this.draggedCard;
      setTimeout(() => {
        if (!this.isActive) return;
        
        // Remove from start of array and push to end
        this.cards.shift();
        this.cards.push(cardToCycle);

        // Update deck layout
        this.initDeckLayout();
      }, 350);

    } else {
      // Spring back to home stack position
      this.draggedCard.style.transform = `translate3d(0px, 0px, 0px) scale(1)`;
    }

    this.draggedCard = null;
  }

  bindEvents() {
    this.container.addEventListener("mousedown", this.boundPointerDown);
    window.addEventListener("mousemove", this.boundPointerMove);
    window.addEventListener("mouseup", this.boundPointerUp);

    this.container.addEventListener("touchstart", this.boundPointerDown, { passive: false });
    window.addEventListener("touchmove", this.boundPointerMove, { passive: false });
    window.addEventListener("touchend", this.boundPointerUp);
  }

  unbindEvents() {
    this.container.removeEventListener("mousedown", this.boundPointerDown);
    window.removeEventListener("mousemove", this.boundPointerMove);
    window.removeEventListener("mouseup", this.boundPointerUp);

    this.container.removeEventListener("touchstart", this.boundPointerDown);
    window.removeEventListener("touchmove", this.boundPointerMove);
    window.removeEventListener("touchend", this.boundPointerUp);
  }

  start() {
    this.isActive = true;
    this.initDeckLayout();
    this.bindEvents();
  }

  stop() {
    this.isActive = false;
    this.unbindEvents();

    // Reset card inline styles so css handles static grid overrides
    this.cards.forEach((card) => {
      card.style.transform = "";
      card.style.zIndex = "";
      card.style.opacity = "";
      card.style.transition = "";
      card.style.pointerEvents = "";
    });
  }
}
