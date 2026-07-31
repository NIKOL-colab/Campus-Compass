/* ═══════════════════════════════════════════════════════════════
   Campus Compass — Main App (SPA Router + Page Orchestrator)
   Handles: Login → ERP Dashboard → Campus Compass Module
   ═══════════════════════════════════════════════════════════════ */

(function () {
  const app = document.getElementById('app');
  let session = null;

  // ─── ERP Module definitions (matches the real ERP portal) ───
  const ERP_MODULES = [
    { name: 'Academics', icon: 'auto_stories', color: '#FF9800' },
    { name: 'Accounts', icon: 'account_balance', color: '#4CAF50' },
    { name: 'Assignment', icon: 'assignment', color: '#F44336' },
    { name: 'Certificate', icon: 'workspace_premium', color: '#9C27B0' },
    { name: 'Counselling Support for Mental Health', icon: 'psychology', color: '#00BCD4' },
    { name: 'Examination', icon: 'quiz', color: '#3F51B5' },
    { name: 'Feedback', icon: 'rate_review', color: '#4CAF50' },
    { name: 'Hostel', icon: 'apartment', color: '#795548' },
    { name: 'My Time Table', icon: 'calendar_month', color: '#2196F3' },
    { name: 'Proctor', icon: 'groups', color: '#607D8B' },
    { name: 'Project Monitoring', icon: 'monitoring', color: '#FF5722' },
    { name: 'Quiz', icon: 'fact_check', color: '#E91E63' },
    { name: 'Registration', icon: 'app_registration', color: '#009688' },
  ];

  // ─── Boot ─────────────────────────────────────────────────────
  async function boot() {
    // Check if user is "logged in" (has session in localStorage)
    const stored = localStorage.getItem('cc_session');
    if (stored) {
      session = JSON.parse(stored);
      // Also sync with server
      const serverSession = await fetchJSON('/api/session');
      if (serverSession) session = serverSession;
      routeByHash();
    } else {
      renderLoginPage();
    }

    // Hash change listener
    window.addEventListener('hashchange', routeByHash);
  }

  // ─── Router ───────────────────────────────────────────────────
  function routeByHash() {
    const hash = window.location.hash || '#/erp';

    if (hash === '#/erp' || hash === '#/' || hash === '') {
      renderERPDashboard();
    } else if (hash === '#/compass') {
      renderCompassDashboard();
    } else if (hash.startsWith('#/profile/')) {
      const id = hash.split('/')[2];
      renderCompassProfile(id);
    } else {
      renderERPDashboard();
    }
  }

  // ═════════════════════════════════════════════════════════════
  // LOGIN PAGE
  // ═════════════════════════════════════════════════════════════
  function renderLoginPage() {
    document.body.style.background = '#f0f4f8';
    app.innerHTML = `
      <div class="login-page">
        <!-- Left side — Banner -->
        <div class="login-page__left">
          <div class="login-banner">
            <div style="font-size:2.5rem;margin-bottom:12px;">🎓</div>
            <div class="login-banner__title">eduplus<span style="color:var(--accent)">campus</span></div>
            <div class="login-banner__subtitle">Revolutionising Education!</div>
            <div class="login-banner__stats">
              <div class="login-banner__stat">
                <div class="login-banner__stat-number">1L+</div>
                <div class="login-banner__stat-label">Learners</div>
              </div>
              <div class="login-banner__stat">
                <div class="login-banner__stat-number">50+</div>
                <div class="login-banner__stat-label">Modules</div>
              </div>
              <div class="login-banner__stat">
                <div class="login-banner__stat-number">100+</div>
                <div class="login-banner__stat-label">Clients</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right side — Login form -->
        <div class="login-page__right">
          <div class="login-card">
            <div class="login-card__college-logo">
              <div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#1565C0,#0D47A1);display:flex;align-items:center;justify-content:center;margin-bottom:12px;">
                <span style="font-size:2rem;">🏛️</span>
              </div>
            </div>

            <div class="login-card__title">
              <span>Student Sign</span><span class="accent">-In</span>
            </div>

            <form id="login-form" autocomplete="off">
              <div class="login-field" id="field-username">
                <span class="material-icons login-field__icon">person</span>
                <input
                  type="text"
                  class="login-field__input"
                  id="login-username"
                  placeholder="Username"
                  autocomplete="off"
                />
                <div class="login-field__error">Please enter your username</div>
              </div>

              <div class="login-field" id="field-password">
                <span class="material-icons login-field__icon">lock</span>
                <input
                  type="password"
                  class="login-field__input"
                  id="login-password"
                  placeholder="Password"
                  autocomplete="off"
                />
                <button type="button" class="login-field__toggle" id="toggle-password" tabindex="-1">
                  <span class="material-icons">visibility_off</span>
                </button>
                <div class="login-field__error">Please enter your password</div>
              </div>

              <button type="submit" class="login-btn" id="login-btn">SIGN IN</button>
            </form>

            <div class="login-actions">
              <div class="login-actions__link">
                <span class="material-icons">help_outline</span>
                Help
              </div>
              <div class="login-actions__link">
                <span class="material-icons">lock_reset</span>
                Forgot Password?
              </div>
            </div>

            <div class="login-stores">
              <div class="login-stores__badge">
                <span style="font-size:1.1rem;">▶️</span> Google Play
              </div>
              <div class="login-stores__badge">
                <span style="font-size:1.1rem;">🍎</span> App Store
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Support button -->
      <button class="support-btn">
        <span class="material-icons">help_outline</span>
        Support
      </button>
    `;

    // Bind login form
    const form = document.getElementById('login-form');
    const usernameField = document.getElementById('field-username');
    const passwordField = document.getElementById('field-password');
    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');
    const toggleBtn = document.getElementById('toggle-password');
    const loginBtn = document.getElementById('login-btn');

    // Password visibility toggle
    toggleBtn.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      toggleBtn.querySelector('.material-icons').textContent = isPassword ? 'visibility' : 'visibility_off';
    });

    // Form submit
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let valid = true;

      // Validate
      usernameField.classList.remove('login-field--error');
      passwordField.classList.remove('login-field--error');

      if (!usernameInput.value.trim()) {
        usernameField.classList.add('login-field--error');
        valid = false;
      }
      if (!passwordInput.value.trim()) {
        passwordField.classList.add('login-field--error');
        valid = false;
      }

      if (!valid) return;

      // "Login" — simulate auth
      loginBtn.classList.add('login-btn--loading');
      loginBtn.textContent = 'SIGNING IN...';

      await new Promise(r => setTimeout(r, 800));

      // Detect role from username
      const username = usernameInput.value.trim().toLowerCase();
      const isTeacher = username.includes('faculty') || username.includes('teacher') || username.includes('prof');

      session = {
        role: isTeacher ? 'teacher' : 'student',
        name: extractName(username),
        id: username,
        regNo: '125B1D062',
        branch: 'B.Tech. Computer Engineering - (Regional Language)'
      };

      localStorage.setItem('cc_session', JSON.stringify(session));

      // Also set server session
      if (isTeacher) {
        await fetchJSON('/api/session/toggle');
      }

      window.location.hash = '#/erp';
      renderERPDashboard();
    });
  }

  function extractName(email) {
    // Turn "nikol.ghodke25@pccoepune.org" into "NIKOL GHODKE"
    const local = email.split('@')[0] || email;
    return local
      .replace(/[0-9]/g, '')
      .replace(/[._]/g, ' ')
      .trim()
      .toUpperCase() || 'STUDENT USER';
  }

  // ═════════════════════════════════════════════════════════════
  // ERP DASHBOARD
  // ═════════════════════════════════════════════════════════════
  function renderERPDashboard() {
    if (!session) {
      renderLoginPage();
      return;
    }

    document.body.style.background = '#ECEFF1';

    const initials = getInitials(session.name);

    // Build module cards HTML
    const moduleCardsHTML = ERP_MODULES.map((mod, i) => `
      <div class="erp-card erp-card--disabled" style="animation-delay:${i * 0.04}s;" title="${mod.name}">
        <div class="erp-card__gradient">
          <div class="erp-card__title">${mod.name}</div>
        </div>
        <div class="erp-card__icon-wrap">
          <span class="material-icons" style="color:${mod.color}">${mod.icon}</span>
        </div>
      </div>
    `).join('');

    // Campus Compass card (active!)
    const compassCardHTML = `
      <div class="erp-card erp-card--compass erp-card--active" id="erp-compass-card" title="Campus Compass — Navigate campus">
        <div class="erp-card__gradient">
          <div class="erp-card__title">Campus Compass</div>
        </div>
        <div class="erp-card__icon-wrap">
          <span class="material-icons" style="color:#1565C0">explore</span>
        </div>
      </div>
    `;

    app.innerHTML = `
      <!-- Navbar -->
      <nav class="erp-navbar">
        <div class="erp-navbar__logo">
          <span style="font-size:1.2rem;">🏛️</span>
        </div>
        <div class="erp-navbar__college-name">PIMPRI CHINCHWAD COLLEGE OF ENGINEERING</div>
        <div class="erp-navbar__spacer"></div>
        <div class="erp-navbar__network">
          <span class="material-icons">bolt</span>
          Online
        </div>
        <div class="erp-navbar__icons">
          <button class="erp-navbar__icon-btn erp-navbar__icon-btn--home"><span class="material-icons">home</span></button>
          <button class="erp-navbar__icon-btn erp-navbar__icon-btn--analytics"><span class="material-icons">speed</span></button>
          <button class="erp-navbar__icon-btn"><span class="material-icons">help_outline</span></button>
          <button class="erp-navbar__icon-btn erp-navbar__icon-btn--people"><span class="material-icons">people</span></button>
          <button class="erp-navbar__icon-btn">
            <span class="material-icons">notifications</span>
            <span class="erp-navbar__badge">0</span>
          </button>
          <button class="erp-navbar__icon-btn"><span class="material-icons">fullscreen</span></button>
        </div>
        <div class="erp-navbar__avatar" id="erp-avatar" title="Profile: ${escapeHTML(session.name)}">${initials}</div>
      </nav>

      <!-- User info bar -->
      <div class="erp-user-bar">
        <div class="erp-user-bar__avatar">
          <span class="material-icons">person</span>
        </div>
        <div class="erp-user-bar__name">${escapeHTML(session.name)}</div>
        <div class="erp-user-bar__status">Active</div>
        <div class="erp-user-bar__info">
          <span>Registration No: ${escapeHTML(session.regNo || 'N/A')}</span>
          <span>${escapeHTML(session.branch || '')}</span>
        </div>
      </div>

      <!-- Search bar -->
      <div class="erp-search-bar">
        <div class="erp-search-bar__input-wrap">
          <input type="text" class="erp-search-bar__input" placeholder="Search Module" id="erp-module-search" />
          <span class="material-icons erp-search-bar__icon">search</span>
        </div>
      </div>

      <!-- Module grid -->
      <div class="erp-modules">
        <div class="erp-modules__grid" id="erp-module-grid">
          ${moduleCardsHTML}
          ${compassCardHTML}
        </div>
      </div>

      <!-- Footer -->
      <footer class="erp-footer">
        <span class="erp-footer__text">Powered By</span>
        <span class="erp-footer__brand">eduplus<span style="color:var(--amber)">campus</span></span>
        <div class="erp-footer__socials">
          <a class="erp-footer__social-link" title="YouTube">▶</a>
          <a class="erp-footer__social-link" title="Facebook">f</a>
          <a class="erp-footer__social-link" title="Instagram">📷</a>
          <a class="erp-footer__social-link" title="Twitter">𝕏</a>
          <a class="erp-footer__social-link" title="LinkedIn">in</a>
        </div>
      </footer>

      <!-- Support button -->
      <button class="support-btn">
        <span class="material-icons">help_outline</span>
        Support
      </button>
    `;

    // Campus Compass card click → open compass module
    document.getElementById('erp-compass-card').addEventListener('click', () => {
      window.location.hash = '#/compass';
    });

    // Module search filter
    const searchInput = document.getElementById('erp-module-search');
    const grid = document.getElementById('erp-module-grid');
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase();
      grid.querySelectorAll('.erp-card').forEach(card => {
        const title = card.querySelector('.erp-card__title').textContent.toLowerCase();
        card.style.display = title.includes(q) ? '' : 'none';
      });
    });

    // Avatar click → toggle role (demo)
    document.getElementById('erp-avatar').addEventListener('click', async () => {
      const data = await fetchJSON('/api/session/toggle');
      if (data) {
        session.role = data.role;
        session.name = session.name; // keep the actual name
        localStorage.setItem('cc_session', JSON.stringify(session));
        showToast(`Switched to ${data.role === 'teacher' ? 'Faculty' : 'Student'} mode`, 'info');
      }
    });
  }

  // ═════════════════════════════════════════════════════════════
  // CAMPUS COMPASS — DASHBOARD
  // ═════════════════════════════════════════════════════════════
  function renderCompassDashboard() {
    if (!session) {
      renderLoginPage();
      return;
    }

    document.body.style.background = 'var(--cc-bg-primary)';

    app.innerHTML = `
      <div class="cc-page">
        <!-- CC Navbar -->
        <nav class="cc-navbar">
          <button class="cc-navbar__back" id="cc-back-btn" title="Back to ERP">
            <span class="material-icons">arrow_back</span>
          </button>
          <div class="cc-navbar__brand">
            <span class="cc-navbar__brand-icon">🧭</span>
            <span class="cc-navbar__brand-text">Campus Compass</span>
          </div>
          <div class="cc-navbar__spacer"></div>
          <button class="cc-navbar__role-toggle" id="cc-role-toggle">
            <span id="cc-role-icon">${session.role === 'teacher' ? '👨‍🏫' : '🎓'}</span>
            <span id="cc-role-label">${session.role === 'teacher' ? 'Faculty' : 'Student'}</span>
            <span class="material-icons" style="font-size:14px;">expand_more</span>
          </button>
        </nav>

        <div id="cc-content"></div>
      </div>
    `;

    // Back to ERP
    document.getElementById('cc-back-btn').addEventListener('click', () => {
      window.location.hash = '#/erp';
    });

    // Role toggle handler
    const roleToggleBtn = document.getElementById('cc-role-toggle');
    if (roleToggleBtn) {
      roleToggleBtn.addEventListener('click', async () => {
        const nextRole = session.role === 'teacher' ? 'student' : 'teacher';
        session.role = nextRole;
        localStorage.setItem('cc_session', JSON.stringify(session));

        // Call backend API to sync
        fetchJSON('/api/session/toggle');

        showToast(`Switched to ${nextRole === 'teacher' ? 'Faculty' : 'Student'} Mode`, 'info');
        renderCompassDashboard(); // re-render view with 4 search boxes if teacher, 3 if student
      });
    }

    // Render dashboard search boxes
    const content = document.getElementById('cc-content');
    renderDashboard(content, session);
  }

  // ═════════════════════════════════════════════════════════════
  // CAMPUS COMPASS — PROFILE
  // ═════════════════════════════════════════════════════════════
  function renderCompassProfile(facultyId) {
    if (!session) {
      renderLoginPage();
      return;
    }

    document.body.style.background = 'var(--cc-bg-primary)';

    app.innerHTML = `
      <div class="cc-page">
        <nav class="cc-navbar">
          <button class="cc-navbar__back" id="cc-back-btn" title="Back to Dashboard">
            <span class="material-icons">arrow_back</span>
          </button>
          <div class="cc-navbar__brand">
            <span class="cc-navbar__brand-icon">🧭</span>
            <span class="cc-navbar__brand-text">Campus Compass</span>
          </div>
          <div class="cc-navbar__breadcrumb">
            <span class="cc-navbar__breadcrumb-sep">›</span>
            <span class="cc-navbar__breadcrumb-current">Faculty Profile</span>
          </div>
          <div class="cc-navbar__spacer"></div>
        </nav>

        <div id="cc-content"></div>
      </div>
    `;

    // Back to compass dashboard
    document.getElementById('cc-back-btn').addEventListener('click', () => {
      window.location.hash = '#/compass';
    });

    const content = document.getElementById('cc-content');
    renderProfile(content, facultyId);
  }

  // ─── Logout helper (for future use) ──────────────────────────
  window.ccLogout = function () {
    localStorage.removeItem('cc_session');
    session = null;
    window.location.hash = '';
    renderLoginPage();
  };

  // ─── Start the app ───────────────────────────────────────────
  boot();
})();
