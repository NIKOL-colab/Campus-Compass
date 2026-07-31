/* ═══════════════════════════════════════════════════════════════
   Campus Compass — Faculty Profile Page
   ═══════════════════════════════════════════════════════════════ */

async function renderProfile(container, facultyId) {
  // Show loading state
  container.innerHTML = `
    <div class="cc-profile" style="text-align:center;padding-top:80px;">
      <span class="material-icons" style="font-size:48px;color:var(--cc-text-secondary);animation:pulse 1.5s infinite;">person</span>
      <p style="color:var(--cc-text-secondary);margin-top:12px;">Loading profile...</p>
    </div>
  `;

  const faculty = await fetchJSON(`/api/faculty/${facultyId}`);

  if (!faculty) {
    container.innerHTML = `
      <div class="cc-profile" style="text-align:center;padding-top:80px;">
        <span class="material-icons" style="font-size:48px;color:var(--cc-accent-rose);">error_outline</span>
        <p style="color:var(--cc-text-secondary);margin-top:12px;">Faculty not found</p>
      </div>
    `;
    return;
  }

  const initials = getInitials(faculty.name);
  const gradient = getAvatarGradient(faculty.name);
  const statusClass = getStatusClass(faculty.status);
  const statusLabel = getStatusLabel(faculty.status);

  // Status badge colors (light theme)
  const statusBg = {
    'in-cabin': '#E8F5E9',
    'in-class': '#FFF3E0',
    'on-leave': '#FFEBEE',
    'unavailable': '#ECEFF1'
  };
  const statusColor = {
    'in-cabin': '#2E7D32',
    'in-class': '#EF6C00',
    'on-leave': '#C62828',
    'unavailable': '#546E7A'
  };

  let timetableHTML = '';
  if (faculty.timetable) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    timetableHTML = days.map(day => {
      const slots = faculty.timetable[day];
      if (!slots || slots.length === 0) return '';
      return `
        <div class="cc-timetable__day">
          <div class="cc-timetable__day-name">${day}</div>
          <div class="cc-timetable__slots">
            ${slots.map(slot => `
              <div class="cc-timetable__slot">
                <span class="cc-timetable__slot-time">${escapeHTML(slot.time)}</span>
                <span class="cc-timetable__slot-subject">${escapeHTML(slot.subject)}</span>
                <span class="cc-timetable__slot-room">${escapeHTML(slot.room)}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  container.innerHTML = `
    <div class="cc-profile">
      <!-- Hero Card -->
      <div class="cc-profile__hero">
        <div class="cc-profile__avatar" style="background:${gradient}">
          ${faculty.photo ? `<img src="${faculty.photo}" alt="${escapeHTML(faculty.name)}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">` : initials}
        </div>
        <div class="cc-profile__info">
          <div class="cc-profile__name">${escapeHTML(faculty.name)}</div>
          <div class="cc-profile__dept">${escapeHTML(faculty.department)} Department</div>
          <div class="cc-profile__status-badge" style="background:${statusBg[faculty.status]};color:${statusColor[faculty.status]}">
            <span class="cc-suggestion-item__status-dot" style="width:8px;height:8px;border-radius:50%;background:${statusColor[faculty.status]}"></span>
            ${statusLabel}
          </div>
        </div>
      </div>

      <!-- Detail Cards -->
      <div class="cc-profile__detail-cards">
        <div class="cc-profile__detail-card">
          <div class="cc-profile__detail-card-label">Cabin / Office</div>
          <div class="cc-profile__detail-card-value">
            <span class="material-icons">meeting_room</span>
            ${escapeHTML(faculty.cabin)}
          </div>
        </div>
        <div class="cc-profile__detail-card">
          <div class="cc-profile__detail-card-label">Phone</div>
          <div class="cc-profile__detail-card-value">
            <span class="material-icons">phone</span>
            <a href="tel:${faculty.phone}" style="color:var(--cc-accent-emerald);text-decoration:none;">${escapeHTML(faculty.phone)}</a>
          </div>
        </div>
        <div class="cc-profile__detail-card">
          <div class="cc-profile__detail-card-label">Email</div>
          <div class="cc-profile__detail-card-value">
            <span class="material-icons">email</span>
            <a href="mailto:${faculty.email}" style="color:var(--cc-accent-blue);text-decoration:none;font-size:0.85rem;">${escapeHTML(faculty.email)}</a>
          </div>
        </div>
        <div class="cc-profile__detail-card">
          <div class="cc-profile__detail-card-label">Subjects</div>
          <div class="cc-profile__detail-card-value" style="flex-wrap:wrap;gap:4px;">
            ${faculty.subjects.map(s => `<span style="background:#E3F2FD;color:#1565C0;padding:4px 10px;border-radius:20px;font-size:0.8rem;border:1px solid #BBDEFB;">${escapeHTML(s)}</span>`).join('')}
          </div>
        </div>
      </div>

      <!-- Timetable -->
      <div class="cc-timetable">
        <div class="cc-timetable__title">
          <span class="material-icons">calendar_today</span>
          Weekly Schedule
        </div>
        ${timetableHTML || '<p style="color:var(--cc-text-secondary);font-size:0.9rem;">No timetable available</p>'}
      </div>
    </div>
  `;
}
