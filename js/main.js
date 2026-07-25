/**
 * main.js
 * Entry point — initializes modules, parses dashboard states,
 * manages Accessibility / Physics Toggle, and controls widget execution loops.
 */

import { initCursor       } from './cursor.js';
import { initNav          } from './nav.js';
import { initMagnetic     } from './magnetic.js';
import { SkillsPhysics    } from './physics-skills.js';
import { ProjectsDeck     } from './physics-projects.js';
import { ContactPhysics   } from './physics-contact.js';
import { ExperienceConsole } from './experience-console.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize standard cursor, nav, and magnetic buttons
  initCursor();
  initNav();
  initMagnetic();

  // Instantiate widgets
  const skillsEngine = new SkillsPhysics("skills-canvas");
  const projectsDeck = new ProjectsDeck("projects-deck");
  const contactEngine = new ContactPhysics("contact-canvas", ".contact-links-sandbox");
  new ExperienceConsole();

  // Elements for state switching
  const physicsToggle = document.getElementById("physics-toggle");
  const skillsSandbox = document.getElementById("skills-sandbox-container");
  const skillsStaticList = document.getElementById("skills-static-list");
  const projectsDeckEl = document.getElementById("projects-deck");
  const projectsStaticList = document.getElementById("projects-static-list");
  const deckInstruction = document.getElementById("deck-instruction");

  // Populate projects list for static fallback directly from markup (SEO-friendly)
  function initStaticProjectsFallback() {
    if (!projectsDeckEl || !projectsStaticList) return;
    projectsStaticList.innerHTML = "";
    
    const cards = projectsDeckEl.querySelectorAll(".project-card");
    cards.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.style.transform = "";
      clone.style.position = "";
      clone.style.zIndex = "";
      clone.style.opacity = "";
      clone.style.pointerEvents = "auto";
      projectsStaticList.appendChild(clone);
    });
  }
  initStaticProjectsFallback();

  // Default state: Active physics mode
  let physicsActive = localStorage.getItem("portfolio-physics") !== "disabled";

  function setPhysicsState(active) {
    if (active) {
      physicsActive = true;
      localStorage.setItem("portfolio-physics", "enabled");
      
      physicsToggle.classList.add("active");
      physicsToggle.setAttribute("aria-pressed", "true");
      physicsToggle.querySelector(".physics-toggle__label").textContent = "Active Mode";

      // Show canvas elements, hide static fallback text listing
      if (skillsSandbox) skillsSandbox.classList.remove("hidden");
      if (skillsStaticList) skillsStaticList.classList.add("hidden");
      if (projectsDeckEl) projectsDeckEl.classList.remove("hidden");
      if (projectsStaticList) projectsStaticList.classList.add("hidden");
      if (deckInstruction) deckInstruction.classList.remove("hidden");

      // Start loop routines
      if (skillsEngine) skillsEngine.start();
      if (projectsDeck) projectsDeck.start();
      if (contactEngine) contactEngine.start();
    } else {
      physicsActive = false;
      localStorage.setItem("portfolio-physics", "disabled");
      
      physicsToggle.classList.remove("active");
      physicsToggle.setAttribute("aria-pressed", "false");
      physicsToggle.querySelector(".physics-toggle__label").textContent = "Static Mode";

      // Hide canvas elements, show static clean grids
      if (skillsSandbox) skillsSandbox.classList.add("hidden");
      if (skillsStaticList) skillsStaticList.classList.remove("hidden");
      if (projectsDeckEl) projectsDeckEl.classList.add("hidden");
      if (projectsStaticList) projectsStaticList.classList.remove("hidden");
      if (deckInstruction) deckInstruction.classList.add("hidden");

      // Stop loop routines and clear loops
      if (skillsEngine) skillsEngine.stop();
      if (projectsDeck) projectsDeck.stop();
      if (contactEngine) contactEngine.stop();
    }
  }

  // Handle click to toggle
  if (physicsToggle) {
    physicsToggle.addEventListener("click", () => {
      setPhysicsState(!physicsActive);
    });
  }

  // Initialize active loops
  setPhysicsState(physicsActive);

  // Smooth mouse coordinates tracking overlay across bento tiles
  const tiles = document.querySelectorAll(".bento-tile");
  tiles.forEach((tile) => {
    tile.addEventListener("mousemove", (e) => {
      const rect = tile.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      tile.style.setProperty("--mouse-x", `${x}px`);
      tile.style.setProperty("--mouse-y", `${y}px`);
    });
  });
});
