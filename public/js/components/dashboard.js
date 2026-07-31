/* ═══════════════════════════════════════════════════════════════
   Campus Compass — Dashboard Component
   Renders the search dashboard with role-based search boxes
   ═══════════════════════════════════════════════════════════════ */

function renderDashboard(container, session) {
  const role = session.role;
  const name = session.name;

  container.innerHTML = `
    <div class="cc-dashboard">
      <div class="cc-dashboard__hero">
        <div class="cc-dashboard__hero-greeting">Welcome back,</div>
        <div class="cc-dashboard__hero-title">${escapeHTML(name)} 👋</div>
        <div class="cc-dashboard__hero-subtitle">Find faculty, departments, and classrooms instantly</div>
        <div class="cc-dashboard__hero-role">
          ${role === 'teacher' ? '👨‍🏫' : '🎓'}
          ${role === 'teacher' ? 'Faculty Mode' : 'Student Mode'}
        </div>
      </div>
      <div class="cc-search-sections" id="cc-search-sections"></div>
    </div>
  `;

  const searchContainer = document.getElementById('cc-search-sections');

  // 1. Search by Department
  new SearchBox({
    container: searchContainer,
    label: 'Search by Department',
    placeholder: 'e.g. Computer Science, Electronics...',
    iconEmoji: '🏛️',
    iconClass: 'cc-search-card__icon--dept',
    fetchResults: async (query) => {
      const data = await fetchJSON(`/api/faculty?dept=${encodeURIComponent(query)}`);
      if (!data) return [];
      return data.map(f => ({
        id: f.id,
        name: f.name,
        meta: `${f.department} • ${f.cabin}`,
        status: f.status,
        photo: f.photo
      }));
    },
    onSelect: (item) => {
      window.location.hash = `#/profile/${item.id}`;
    }
  });

  // 2. Search by Subject
  new SearchBox({
    container: searchContainer,
    label: 'Search by Subject',
    placeholder: 'e.g. Data Structures, Thermodynamics...',
    iconEmoji: '📚',
    iconClass: 'cc-search-card__icon--subject',
    fetchResults: async (query) => {
      const data = await fetchJSON(`/api/faculty?subject=${encodeURIComponent(query)}`);
      if (!data) return [];
      return data.map(f => ({
        id: f.id,
        name: f.name,
        meta: f.subjects.join(', '),
        status: f.status,
        photo: f.photo
      }));
    },
    onSelect: (item) => {
      window.location.hash = `#/profile/${item.id}`;
    }
  });

  // 3. Search by Faculty Name
  new SearchBox({
    container: searchContainer,
    label: 'Search by Faculty Name',
    placeholder: 'e.g. Dr. Rajesh Kumar...',
    iconEmoji: '👤',
    iconClass: 'cc-search-card__icon--faculty',
    fetchResults: async (query) => {
      const data = await fetchJSON(`/api/faculty?q=${encodeURIComponent(query)}`);
      if (!data) return [];
      return data.map(f => ({
        id: f.id,
        name: f.name,
        meta: `${f.department} • ${f.cabin}`,
        status: f.status,
        photo: f.photo
      }));
    },
    onSelect: (item) => {
      window.location.hash = `#/profile/${item.id}`;
    }
  });

  // 4. Search by Class (Faculty only)
  if (role === 'teacher') {
    const classSection = document.createElement('div');
    classSection.className = 'cc-search-section';
    classSection.innerHTML = `
      <div class="cc-search-card cc-class-lookup">
        <div class="cc-search-card__header">
          <div class="cc-search-card__icon cc-search-card__icon--class">🎓</div>
          <div class="cc-search-card__label">Search by Class</div>
        </div>
        <div class="cc-class-lookup__selectors">
          <select class="cc-select" id="cc-year-select">
            <option value="">Select Year</option>
            <option value="1st">1st Year</option>
            <option value="2nd">2nd Year</option>
            <option value="3rd">3rd Year</option>
            <option value="4th">4th Year</option>
          </select>
          <select class="cc-select" id="cc-branch-select">
            <option value="">Select Branch</option>
          </select>
        </div>
        <div class="cc-class-results" id="cc-class-results"></div>
      </div>
    `;
    searchContainer.appendChild(classSection);
    initClassLookup();
  }
}
