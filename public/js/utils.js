/* ═══════════════════════════════════════════════════════════════
   Campus Compass — Utility Functions
   ═══════════════════════════════════════════════════════════════ */

/**
 * Debounce a function call by the given delay.
 */
function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Fetch JSON from an API endpoint.
 */
async function fetchJSON(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('fetchJSON error:', err);
    return null;
  }
}

/**
 * Get a color class for a faculty status.
 */
function getStatusClass(status) {
  const map = {
    'in-cabin': 'in-cabin',
    'in-class': 'in-class',
    'on-leave': 'on-leave',
    'unavailable': 'unavailable'
  };
  return map[status] || 'unavailable';
}

/**
 * Get a human-readable label for a faculty status.
 */
function getStatusLabel(status) {
  const map = {
    'in-cabin': 'In Cabin',
    'in-class': 'In Class',
    'on-leave': 'On Leave',
    'unavailable': 'Unavailable'
  };
  return map[status] || 'Unknown';
}

/**
 * Get initials from a name string.
 */
function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Get a deterministic gradient for an avatar based on name.
 */
function getAvatarGradient(name) {
  const gradients = [
    'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    'linear-gradient(135deg, #10b981, #06b6d4)',
    'linear-gradient(135deg, #f59e0b, #ef4444)',
    'linear-gradient(135deg, #ec4899, #8b5cf6)',
    'linear-gradient(135deg, #06b6d4, #3b82f6)',
    'linear-gradient(135deg, #8b5cf6, #ec4899)',
    'linear-gradient(135deg, #14b8a6, #10b981)',
    'linear-gradient(135deg, #f97316, #f59e0b)'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
}

/**
 * Show a toast notification.
 */
function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icons = {
    info: 'info',
    warning: 'warning',
    error: 'error_outline'
  };

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `
    <span class="material-icons">${icons[type] || 'info'}</span>
    ${message}
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'opacity 0.3s, transform 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/**
 * Simple string escaping for HTML injection prevention.
 */
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
