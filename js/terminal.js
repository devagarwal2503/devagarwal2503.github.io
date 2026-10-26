/**
 * terminal.js
 * Interactive developer CLI modal with realistic commands, autocomplete, and history.
 */

import { playTerminalBeep, playSuccessSound } from './audio.js';
import { showToast } from './toast.js';

export function initTerminal() {
  const modal = document.getElementById('terminal-modal');
  const output = document.getElementById('terminal-output');
  const input = document.getElementById('terminal-input');
  const closeBtn = document.getElementById('terminal-close-btn');
  if (!modal || !output || !input) return;

  const history = [];
  let historyIdx = -1;

  const commands = {
    help: () => `Available commands:
  • <span class="term-cyan">bio</span>          - Learn about Dev Agarwal
  • <span class="term-cyan">skills</span>       - List core technical stack & CS fundamentals
  • <span class="term-cyan">projects</span>     - Browse flagship projects & live demos
  • <span class="term-cyan">stats</span>        - Review production metrics
  • <span class="term-cyan">contact</span>      - Get email and profile handles
  • <span class="term-cyan">clear</span>        - Clear terminal screen
  • <span class="term-cyan">sudo hire</span>    - Quick hiring action :)`,

    bio: () => `Dev Agarwal — Software Engineer
Pune, India (Open to India & Remote roles)
Nearly 2 years in production shipping enterprise HRMS, candidate assessment platforms (500+ concurrent users), and real-time systems.
Strong focus on Data Structures & Algorithms, System Design, and Backend Engineering.`,

    skills: () => `CORE CS: Data Structures & Algorithms, System Design Basics, OOP, C++
LANGUAGES: C++, TypeScript, JavaScript, Dart, Python, SQL
BACKEND: Node.js, Express, WebSockets, REST APIs, MongoDB, Supabase, Firebase
FRONTEND: React, Angular, Flutter, Vite, Recharts, BLoC, Riverpod
TOOLS: Git, GitHub Actions, Docker, CI/CD, Linux, Postman, Jira, OpenProject`,

    projects: () => `FLAGSHIP PROJECTS:
1. <span class="term-green">AI-Powered Code Review Assistant</span> [Featured]
   • GitHub App running gpt-4o-mini AST analysis
   • Diff chunking, ±25 line context fetch, HMAC security
2. <span class="term-green">PulseGrid — Load Balancer Visualizer</span>
   • Custom Indexed Min-Heap (O(1) peek, O(log N) updates)
   • Predictive Linear Regression scheduler (80% less variance vs WRR)
3. <span class="term-green">HRMS Platform</span> (Centralogic Pvt Ltd)
   • Multi-level approval module cut manual HR effort by 40%
   • Candidate assessment platform serving 500+ concurrent users`,

    stats: () => `METRICS:
  ✔ 2+ Years Professional Experience
  ✔ 500+ Concurrent Users Handled
  ✔ O(log N) Heap Operations in Custom Scheduler
  ✔ 40% HR Effort Reduction Shipped to Production`,

    contact: () => `CONTACT CHANNELS:
  • Email:    <a href="mailto:agarwaldev626@gmail.com" class="term-link">agarwaldev626@gmail.com</a>
  • LinkedIn: <a href="https://linkedin.com/in/devagarwal2503" target="_blank" class="term-link">linkedin.com/in/devagarwal2503</a>
  • GitHub:   <a href="https://github.com/devagarwal2503" target="_blank" class="term-link">github.com/devagarwal2503</a>`,

    'sudo hire': () => {
      playSuccessSound();
      showToast('Offer accepted! Opening email draft...', 'success', 4000);
      setTimeout(() => {
        window.location.href = 'mailto:agarwaldev626@gmail.com?subject=Software%20Engineer%20Opportunity&body=Hi%20Dev,%20I%20reviewed%20your%20portfolio%20and%20would%20love%20to%20connect!';
      }, 700);
      return `<span class="term-green">ACCESS GRANTED: Thank you for your interest! Launching mail client...</span>`;
    },

    clear: () => {
      output.innerHTML = '';
      return null;
    }
  };

  function printLine(html) {
    const p = document.createElement('div');
    p.className = 'term-line';
    p.innerHTML = html;
    output.appendChild(p);
    output.scrollTop = output.scrollHeight;
  }

  function handleCommand(cmdText) {
    const raw = cmdText.trim();
    if (!raw) return;

    history.push(raw);
    historyIdx = history.length;

    printLine(`<span class="term-prompt">dev@portfolio:~$</span> <span class="term-cmd">${escapeHtml(raw)}</span>`);
    playTerminalBeep();

    const lower = raw.toLowerCase();
    if (commands[lower]) {
      const response = commands[lower]();
      if (response !== null) {
        printLine(response);
      }
    } else {
      printLine(`<span class="term-error">Command not recognized: '${escapeHtml(raw)}'. Type <span class="term-cyan">'help'</span> for list of commands.</span>`);
    }
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = input.value;
      input.value = '';
      handleCommand(val);
    } else if (e.key === 'ArrowUp') {
      if (historyIdx > 0) {
        historyIdx--;
        input.value = history[historyIdx];
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIdx < history.length - 1) {
        historyIdx++;
        input.value = history[historyIdx];
      } else {
        historyIdx = history.length;
        input.value = '';
      }
    }
  });

  // Open triggers
  document.querySelectorAll('[data-action="open-terminal"]').forEach(btn => {
    btn.addEventListener('click', () => {
      modal.classList.add('is-open');
      setTimeout(() => input.focus(), 50);
      if (output.children.length === 0) {
        printLine(`Welcome to Dev Agarwal's Developer Terminal (v2.0)`);
        printLine(`Type <span class="term-cyan">'help'</span> to see available commands.`);
      }
    });
  });

  // Close triggers
  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.classList.remove('is-open'));
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('terminal-backdrop')) {
      modal.classList.remove('is-open');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      modal.classList.remove('is-open');
    }
  });
}
