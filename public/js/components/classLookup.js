/* ═══════════════════════════════════════════════════════════════
   Campus Compass — Class Lookup Component (Faculty-only)
   Lets teachers look up CR and LR by year + branch
   ═══════════════════════════════════════════════════════════════ */

async function initClassLookup() {
  const yearSelect = document.getElementById('cc-year-select');
  const branchSelect = document.getElementById('cc-branch-select');
  const resultsContainer = document.getElementById('cc-class-results');

  if (!yearSelect || !branchSelect || !resultsContainer) return;

  // Load departments for branch options
  const departments = await fetchJSON('/api/departments');
  if (departments) {
    departments.forEach(dept => {
      const option = document.createElement('option');
      option.value = dept.code;
      option.textContent = `${dept.name} (${dept.code})`;
      branchSelect.appendChild(option);
    });
  }

  // Fetch class reps when both selectors have values
  async function fetchReps() {
    const year = yearSelect.value;
    const branch = branchSelect.value;

    if (!year || !branch) {
      resultsContainer.innerHTML = '';
      return;
    }

    resultsContainer.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:16px;color:var(--cc-text-secondary);">
        <span class="material-icons" style="animation:pulse 1s infinite;">hourglass_top</span>
        <p style="margin-top:4px;font-size:0.85rem;">Loading...</p>
      </div>
    `;

    const data = await fetchJSON(`/api/class-reps?year=${encodeURIComponent(year)}&branch=${encodeURIComponent(branch)}`);

    if (!data || data.length === 0) {
      resultsContainer.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:20px;color:var(--cc-text-secondary);">
          <span class="material-icons" style="font-size:32px;">group_off</span>
          <p style="margin-top:6px;font-size:0.85rem;">No class representatives found</p>
        </div>
      `;
      return;
    }

    const entry = data[0]; // Single entry per year+branch

    resultsContainer.innerHTML = `
      <!-- CR Card -->
      <div class="cc-rep-card">
        <div class="cc-rep-card__avatar cc-rep-card__avatar--cr">
          ${getInitials(entry.cr.name)}
        </div>
        <div class="cc-rep-card__info">
          <div class="cc-rep-card__role cc-rep-card__role--cr">Class Representative (CR)</div>
          <div class="cc-rep-card__name">${escapeHTML(entry.cr.name)}</div>
          <div class="cc-rep-card__phone">
            <span class="material-icons">phone</span>
            <a href="tel:${entry.cr.phone}">${escapeHTML(entry.cr.phone)}</a>
          </div>
        </div>
      </div>

      <!-- LR Card -->
      <div class="cc-rep-card">
        <div class="cc-rep-card__avatar cc-rep-card__avatar--lr">
          ${getInitials(entry.lr.name)}
        </div>
        <div class="cc-rep-card__info">
          <div class="cc-rep-card__role cc-rep-card__role--lr">Lady Representative (LR)</div>
          <div class="cc-rep-card__name">${escapeHTML(entry.lr.name)}</div>
          <div class="cc-rep-card__phone">
            <span class="material-icons">phone</span>
            <a href="tel:${entry.lr.phone}">${escapeHTML(entry.lr.phone)}</a>
          </div>
        </div>
      </div>
    `;
  }

  yearSelect.addEventListener('change', fetchReps);
  branchSelect.addEventListener('change', fetchReps);
}
