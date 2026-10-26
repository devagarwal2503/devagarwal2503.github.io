/**
 * demos.js
 * Interactive live simulator playgrounds for the flagship projects:
 * 1. AI-Powered Code Reviewer Simulator
 * 2. PulseGrid Load Balancer Live Traffic Simulator
 */

import { playClickSound, playSuccessSound } from './audio.js';
import { showToast } from './toast.js';

export function initInteractiveDemos() {
  initAICodeReviewDemo();
  initPulseGridDemo();
  initHRMSDemo();
}

/* ──────────────────────────────────────────────────────────
   1. AI-POWERED CODE REVIEW DEMO
   ────────────────────────────────────────────────────────── */
function initAICodeReviewDemo() {
  const container = document.getElementById('ai-review-demo');
  if (!container) return;

  const runBtn = container.querySelector('#ai-run-review-btn');
  const fileSelect = container.querySelector('#ai-file-select');
  const codeViewer = container.querySelector('#ai-code-viewer');
  const reviewResult = container.querySelector('#ai-review-result');
  const statusBadge = container.querySelector('#ai-status-badge');

  const files = {
    'auth_middleware.ts': {
      code: `12 |  async function handleSession(req: Request) {
13 | -  const user = await db.findUser(req.token);
14 | +  // Check cache before DB query to eliminate race condition
15 | +  let user = await redis.get(req.token);
16 |    if (!user) {
17 | -    return sendError('Unauthorized');
18 | +    user = await db.findUser(req.token);
19 |    }`,
      issues: [
        {
          file: 'auth_middleware.ts',
          line: 15,
          severity: 'CRITICAL',
          type: 'Race Condition / Performance',
          comment: 'Potential cache stampede detected under high concurrency. Recommend adding a distributed mutex or singleflight lock around line 18 fallback.'
        }
      ]
    },
    'load_balancer.cpp': {
      code: `45 |  void MinHeap::decreaseKey(int i, int new_load) {
46 |      heap[i].load = new_load;
47 | -    while (i != 0 && heap[parent(i)].load > heap[i].load) {
48 | +    while (i > 0 && heap[parent(i)].load > heap[i].load) {
49 |          swap(&heap[i], &heap[parent(i)]);
50 |          i = parent(i);
51 |      }`,
      issues: [
        {
          file: 'load_balancer.cpp',
          line: 48,
          severity: 'OPTIMIZATION',
          type: 'Index Bounds & O(log N) Guarantee',
          comment: 'Verified O(log N) percolation path. Suggest asserting posMap[heap[i].id] synchronization to prevent stale inverse lookup index.'
        }
      ]
    }
  };

  function renderFile(filename) {
    const file = files[filename];
    if (!file) return;
    codeViewer.textContent = file.code;
    reviewResult.innerHTML = `
      <div class="ai-empty-state">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        <span>Click "Simulate AI Review" to run gpt-4o-mini AST analysis</span>
      </div>
    `;
    statusBadge.textContent = 'Ready';
    statusBadge.className = 'badge badge--default';
  }

  if (fileSelect) {
    fileSelect.addEventListener('change', (e) => {
      renderFile(e.target.value);
      playClickSound();
    });
    renderFile(fileSelect.value);
  }

  if (runBtn) {
    runBtn.addEventListener('click', () => {
      playClickSound();
      const filename = fileSelect ? fileSelect.value : 'auth_middleware.ts';
      const file = files[filename];
      if (!file) return;

      runBtn.disabled = true;
      runBtn.innerHTML = `
        <span class="spinner-dot"></span>
        Analyzing PR diff...
      `;
      statusBadge.textContent = 'Scanning AST...';
      statusBadge.className = 'badge badge--amber';

      reviewResult.innerHTML = `
        <div class="ai-scanning-box">
          <div class="ai-laser-scanner"></div>
          <p>Fetching &plusmn;25 lines of context... checking race conditions...</p>
        </div>
      `;

      setTimeout(() => {
        statusBadge.textContent = '1 Issue Found';
        statusBadge.className = 'badge badge--violet';
        runBtn.disabled = false;
        runBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
          Re-run Review
        `;

        const issue = file.issues[0];
        const severityClass = issue.severity === 'CRITICAL' ? 'badge--accent' : 'badge--green';

        reviewResult.innerHTML = `
          <div class="ai-comment-card">
            <div class="ai-comment-header">
              <span class="badge ${severityClass}">${issue.severity}</span>
              <span class="ai-comment-file">${issue.file}:${issue.line}</span>
              <span class="badge badge--default">${issue.type}</span>
            </div>
            <p class="ai-comment-text">${issue.comment}</p>
            <div class="ai-comment-footer">
              <span class="ai-comment-bot">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a2 2 0 0 1 2 2v2h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4V4a2 2 0 0 1 2-2z"/></svg>
                DevReview-Bot (gpt-4o-mini)
              </span>
              <span class="ai-verified">HMAC Verified</span>
            </div>
          </div>
        `;
        playSuccessSound();
        showToast('AI Review complete — structured comment generated!', 'success');
      }, 1100);
    });
  }
}

/* ──────────────────────────────────────────────────────────
   2. PULSEGRID LOAD BALANCER SIMULATOR DEMO
   ────────────────────────────────────────────────────────── */
function initPulseGridDemo() {
  const container = document.getElementById('pulsegrid-demo');
  if (!container) return;

  const burstBtn = container.querySelector('#pg-burst-btn');
  const algoButtons = container.querySelectorAll('[data-algo]');
  const serverBars = container.querySelectorAll('.pg-server-bar');
  const serverLoads = container.querySelectorAll('.pg-server-pct');
  const varianceMeter = container.querySelector('#pg-variance-meter');
  const statusMsg = container.querySelector('#pg-status-msg');

  let currentAlgo = 'predictive'; // 'predictive' or 'wrr'

  algoButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      playClickSound();
      algoButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentAlgo = btn.dataset.algo;
      simulateDistribution();
    });
  });

  function simulateDistribution() {
    let loads = [];
    if (currentAlgo === 'predictive') {
      // Balanced distribution around 62-66% (std dev ~3.15)
      loads = [64, 63, 67, 62];
      if (varianceMeter) varianceMeter.innerHTML = `Standard Deviation: <strong>&sigma; = 3.15</strong> <span class="badge badge--green" style="margin-left:6px">~80% Better Balance</span>`;
      if (statusMsg) statusMsg.textContent = 'Predictive Headroom scheduler balanced load smoothly using Indexed Min-Heap.';
    } else {
      // Imbalanced WRR distribution (std dev ~15.72)
      loads = [91, 78, 48, 36];
      if (varianceMeter) varianceMeter.innerHTML = `Standard Deviation: <strong>&sigma; = 15.72</strong> <span class="badge badge--accent" style="margin-left:6px">High Imbalance</span>`;
      if (statusMsg) statusMsg.textContent = 'Weighted Round Robin suffered hot spotting on Server A.';
    }

    serverBars.forEach((bar, i) => {
      const pct = loads[i];
      bar.style.width = `${pct}%`;
      if (pct > 80) {
        bar.style.backgroundColor = 'var(--color-amber)';
      } else {
        bar.style.backgroundColor = 'var(--color-accent)';
      }
    });

    serverLoads.forEach((el, i) => {
      el.textContent = `${loads[i]}%`;
    });
  }

  if (burstBtn) {
    burstBtn.addEventListener('click', () => {
      playClickSound();
      burstBtn.disabled = true;
      burstBtn.textContent = 'Routing 500 requests...';

      // Animate fluctuation
      let step = 0;
      const interval = setInterval(() => {
        serverBars.forEach((bar) => {
          const rand = Math.floor(Math.random() * 40 + 30);
          bar.style.width = `${rand}%`;
        });
        step++;
        if (step > 4) {
          clearInterval(interval);
          simulateDistribution();
          burstBtn.disabled = false;
          burstBtn.textContent = '⚡ Dispatch 500 Requests';
          playSuccessSound();
          showToast(`500 requests routed using ${currentAlgo.toUpperCase()} algorithm!`, 'success');
        }
      }, 120);
    });
  }

  // Initial draw
  simulateDistribution();
}

/* ──────────────────────────────────────────────────────────
   3. HRMS ENTERPRISE WORKFLOW & TELEMETRY DEMO
   ────────────────────────────────────────────────────────── */
function initHRMSDemo() {
  const container = document.getElementById('hrms-demo');
  if (!container) return;

  const tabButtons = container.querySelectorAll('[data-hrms-tab]');
  const panelLeave = container.querySelector('#hrms-panel-leave');
  const panelAssessment = container.querySelector('#hrms-panel-assessment');
  const simulateBtn = container.querySelector('#hrms-simulate-btn');
  const pingBtn = container.querySelector('#hrms-ping-btn');
  const statusMsg = container.querySelector('#hrms-status-msg');
  const userCount = container.querySelector('#hrms-user-count');

  // Tab switching
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      playClickSound();
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTab = btn.dataset.hrmsTab;
      if (targetTab === 'leave') {
        if (panelLeave) panelLeave.style.display = 'flex';
        if (panelAssessment) panelAssessment.style.display = 'none';
      } else {
        if (panelLeave) panelLeave.style.display = 'none';
        if (panelAssessment) panelAssessment.style.display = 'flex';
      }
    });
  });

  // Step simulation for Leave Workflow
  if (simulateBtn) {
    simulateBtn.addEventListener('click', () => {
      playClickSound();
      simulateBtn.disabled = true;
      simulateBtn.textContent = 'Routing Approval...';

      const step1 = container.querySelector('#hrms-step-1');
      const step2 = container.querySelector('#hrms-step-2');
      const step3 = container.querySelector('#hrms-step-3');

      // Reset
      [step1, step2, step3].forEach(s => s && s.classList.remove('is-active', 'is-complete'));

      if (step1) step1.classList.add('is-active');
      if (statusMsg) statusMsg.textContent = '1/3 Validating leave entitlement against company handbook...';

      setTimeout(() => {
        if (step1) {
          step1.classList.remove('is-active');
          step1.classList.add('is-complete');
        }
        if (step2) step2.classList.add('is-active');
        if (statusMsg) statusMsg.textContent = '2/3 L1 Lead notified via automated webhook — auto-approved.';
      }, 700);

      setTimeout(() => {
        if (step2) {
          step2.classList.remove('is-active');
          step2.classList.add('is-complete');
        }
        if (step3) {
          step3.classList.add('is-active');
          step3.classList.add('is-complete');
        }
        if (statusMsg) statusMsg.textContent = '3/3 Approved! Synced to HR Payroll database (-40% manual time).';
        simulateBtn.disabled = false;
        simulateBtn.textContent = '✦ Simulate Flow';
        playSuccessSound();
        showToast('HR Leave Workflow completed with zero manual intervention (-40% time)!', 'success');
      }, 1400);
    });
  }

  // Audit ping for Proctoring Assessment
  if (pingBtn) {
    pingBtn.addEventListener('click', () => {
      playClickSound();
      pingBtn.disabled = true;
      pingBtn.textContent = 'Auditing 15 APIs...';

      setTimeout(() => {
        if (userCount) {
          const current = 520 + Math.floor(Math.random() * 25);
          userCount.textContent = current.toString();
        }
        pingBtn.disabled = false;
        pingBtn.textContent = '⚡ Audit Session';
        playSuccessSound();
        showToast('Assessment Proctor Audit: 500+ active sessions secured, 15/15 APIs healthy!', 'success');
      }, 600);
    });
  }
}
