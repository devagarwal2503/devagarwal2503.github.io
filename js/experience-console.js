/**
 * experience-console.js
 * Controls the interactive terminal interface for career experience.
 * Implements tab selection, custom syntax highlighting, and typewriter logging animations.
 */

const JOB_DATA = {
  "vishwaguru-trainee": `<span class="comment"># Fetching Vishwaguru Infotech Trainee achievements...</span>
<span class="keyword">export</span> <span class="variable">ROLE</span>=<span class="string">"Flutter Developer Trainee"</span>
<span class="keyword">export</span> <span class="variable">DURATION</span>=<span class="string">"Apr 2026 – Jun 2026"</span>
<span class="keyword">export</span> <span class="variable">HIGHLIGHT</span>=<span class="string">"Promoted from intern to trainee in 30 days"</span>

<span class="function">log_achievements</span>() {
  <span class="variable">bullet_1</span>=<span class="string">"Consistently shipped production-ready feature modules."</span>
  <span class="variable">bullet_2</span>=<span class="string">"Engineered responsive UI matching Flutter design specifications."</span>
  <span class="variable">bullet_3</span>=<span class="string">"Integrated complex REST APIs to enable real-time dashboard updates."</span>
  <span class="variable">bullet_4</span>=<span class="string">"Partnered with senior engineers in sprint review and Agile planning."</span>
}`,
  "vishwaguru-intern": `<span class="comment"># Fetching Vishwaguru Infotech Intern achievements...</span>
<span class="keyword">export</span> <span class="variable">ROLE</span>=<span class="string">"Flutter Developer Intern"</span>
<span class="keyword">export</span> <span class="variable">DURATION</span>=<span class="string">"Feb 2026 – Mar 2026"</span>

<span class="function">log_achievements</span>() {
  <span class="variable">bullet_1</span>=<span class="string">"Built full-featured e-commerce app (auth, payment, listings) in Flutter."</span>
  <span class="variable">bullet_2</span>=<span class="string">"Integrated Firebase Auth and Razorpay SDK secure payment simulation."</span>
  <span class="variable">bullet_3</span>=<span class="string">"Designed Slivers UI layouts and implemented adaptive light/dark mode."</span>
  <span class="variable">bullet_4</span>=<span class="string">"Architected API mapping with JSON parsers; migrated to Supabase db."</span>
}`,
  "centralogic": `<span class="comment"># Fetching Centralogic Pvt Ltd achievements...</span>
<span class="keyword">export</span> <span class="variable">ROLE</span>=<span class="string">"Flutter Developer"</span>
<span class="keyword">export</span> <span class="variable">DURATION</span>=<span class="string">"Mar 2023 – Apr 2024"</span>

<span class="function">log_achievements</span>() {
  <span class="variable">bullet_1</span>=<span class="string">"Delivered HRMS Leave Module reducing manual processing work by 40%."</span>
  <span class="variable">bullet_2</span>=<span class="string">"Engineered anticheat candidate assessment platform for 500+ concurrent."</span>
  <span class="variable">bullet_3</span>=<span class="string">"Integrated 15+ REST APIs to hospitality bookings for active sync."</span>
  <span class="variable">bullet_4</span>=<span class="string">"Maintained standard code linting under Agile git review sprints."</span>
}`
};

export class ExperienceConsole {
  constructor() {
    this.buttons = document.querySelectorAll(".console-btn");
    this.outputPre = document.getElementById("experience-output-pre");
    this.filenameEl = document.querySelector(".console-window__filename");
    this.isTyping = false;
    this.typingTimeout = null;

    this.bindEvents();
  }

  bindEvents() {
    this.buttons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const target = e.currentTarget;
        if (target.classList.contains("active") || this.isTyping) return;

        // Reset active tab button
        this.buttons.forEach((b) => {
          b.classList.remove("active");
          b.setAttribute("aria-selected", "false");
        });

        target.classList.add("active");
        target.setAttribute("aria-selected", "true");

        const jobId = target.dataset.job;
        const filename = target.textContent.trim();
        this.filenameEl.textContent = filename;

        // Render logs output
        this.writeConsoleLogs(jobId);
      });
    });
  }

  writeConsoleLogs(jobId) {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    const htmlContent = JOB_DATA[jobId] || "";
    this.outputPre.innerHTML = "";
    this.isTyping = true;

    // Typewriter effect that processes HTML elements by appending tags sequentially
    // We achieve this securely by matching HTML tokens using a simple parser
    let index = 0;
    const tokens = this.tokenizeHtml(htmlContent);
    
    const typeNextToken = () => {
      if (index >= tokens.length) {
        this.isTyping = false;
        return;
      }

      this.outputPre.innerHTML += tokens[index];
      index++;
      
      // Delay speed (faster for short logs to feel responsive)
      this.typingTimeout = setTimeout(typeNextToken, 12);
    };

    typeNextToken();
  }

  /**
   * Separates normal characters from HTML span tags to prevent printing broken markup
   */
  tokenizeHtml(htmlStr) {
    const tokens = [];
    let i = 0;
    while (i < htmlStr.length) {
      if (htmlStr[i] === '<') {
        const closeIdx = htmlStr.indexOf('>', i);
        if (closeIdx !== -1) {
          // Push tag token
          tokens.push(htmlStr.substring(i, closeIdx + 1));
          i = closeIdx + 1;
        } else {
          tokens.push(htmlStr[i]);
          i++;
        }
      } else {
        // Push character token
        tokens.push(htmlStr[i]);
        i++;
      }
    }
    return tokens;
  }
}
