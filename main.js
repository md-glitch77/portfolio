/**
 * Modern Vanilla JS Interactions for Systems Developer Portfolio
 * High-performance, zero dependencies, lightweight.
 */

document.addEventListener('DOMContentLoaded', () => {
  initCursorGlow();
  initCopyEmail();
  initTerminalSimulation();
  initNavScrollObserver();
});

/**
 * Ambient subtle glow that follows the cursor
 */
function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;

  // Only enable on fine pointers (mouse), not touch devices
  if (window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
    }, { passive: true });
  } else {
    glow.style.display = 'none';
  }
}

/**
 * Copy email button with toast feedback
 */
function initCopyEmail() {
  const copyBtn = document.getElementById('copyEmailBtn');
  const copyText = document.getElementById('copyEmailText');
  const toast = document.getElementById('toastMessage');
  const toastText = document.getElementById('toastText');

  if (!copyBtn) return;

  copyBtn.addEventListener('click', async () => {
    const email = copyBtn.getAttribute('data-email') || 'miggy.morales@gmail.com';
    
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
      } else {
        // Fallback for non-https / older browsers
        const tempInput = document.createElement('textarea');
        tempInput.value = email;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }

      showToast(`Email copied: ${email}`);
      if (copyText) {
        const originalText = copyText.textContent;
        copyText.textContent = 'Copied!';
        setTimeout(() => {
          copyText.textContent = originalText;
        }, 2000);
      }
    } catch (err) {
      showToast('Could not copy email, opening mail client...');
      window.location.href = `mailto:${email}`;
    }
  });

  function showToast(msg) {
    if (!toast || !toastText) return;
    toastText.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }
}

/**
 * Interactive Terminal Diagnostics Simulator
 */
function initTerminalSimulation() {
  const runBtn = document.getElementById('runSimulationBtn');
  const output = document.getElementById('terminalOutput');

  if (!runBtn || !output) return;

  const simulationSteps = [
    { delay: 100, text: '<p><span class="term-info">guest@edge-dr-node:~$</span> <span class="term-cmd">node restore-db.js --dry-run --verify-checksums</span></p>' },
    { delay: 400, text: '<p><span class="term-info">[00:00:01 UTC]</span> Initiating automated disaster recovery verification pipeline...</p>' },
    { delay: 800, text: '<p><span class="term-info">[00:00:02 UTC]</span> Doppler SecretOps: Fetching production libSQL credentials... <span class="term-success">OK</span></p>' },
    { delay: 1200, text: '<p><span class="term-info">[00:00:03 UTC]</span> Turso Edge Cluster: Querying primary partition health... <span class="term-success">LATENCY: 9ms</span></p>' },
    { delay: 1600, text: '<p><span class="term-info">[00:00:04 UTC]</span> Cloudflare R2: Validating asset vault read/write permissions... <span class="term-success">VERIFIED</span></p>' },
    { delay: 2000, text: '<p><span class="term-info">[00:00:05 UTC]</span> Snapshot: Generating point-in-time binary archive (SHA256: 7d2c4...f91b)... <span class="term-success">VALID</span></p>' },
    { delay: 2400, text: '<p><span class="term-info">[00:00:06 UTC]</span> Dry-run sandbox database initialized. Replaying 1,420 asset transactions...</p>' },
    { delay: 2800, text: '<p><span class="term-success">[00:00:07 UTC] ✓ DISASTER RECOVERY TEST SUCCESSFUL: 0 data corruption detected. Zero-cost automated pipeline active.</span></p>' },
    { delay: 3000, text: '<p><span class="term-info">guest@edge-dr-node:~$</span> <span class="term-cursor"></span></p>' }
  ];

  let isRunning = false;

  runBtn.addEventListener('click', () => {
    if (isRunning) return;
    isRunning = true;
    runBtn.textContent = 'Running...';
    runBtn.style.opacity = '0.6';
    runBtn.disabled = true;

    output.innerHTML = '<p><span class="term-info">Initializing diagnostic sandbox container...</span></p>';

    simulationSteps.forEach((step, index) => {
      setTimeout(() => {
        if (index === 0) {
          output.innerHTML = step.text;
        } else {
          output.innerHTML += step.text;
        }
        output.scrollTop = output.scrollHeight;

        if (index === simulationSteps.length - 1) {
          isRunning = false;
          runBtn.textContent = 'Re-run Diagnostics';
          runBtn.style.opacity = '1';
          runBtn.disabled = false;
        }
      }, step.delay);
    });
  });
}

/**
 * Update active link in navigation as sections scroll into view
 */
function initNavScrollObserver() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${currentId}`) {
            link.style.color = 'var(--accent-cyan)';
          } else {
            link.style.color = '';
          }
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -70% 0px'
  });

  sections.forEach(section => observer.observe(section));
}
