/* ═══════════════════════════════════════════════════════════════
   Campus Compass — SearchBox Component
   Reusable live-search with Instagram-style suggestion dropdown
   ═══════════════════════════════════════════════════════════════ */

class SearchBox {
  /**
   * @param {Object} opts
   * @param {HTMLElement} opts.container   — parent element to mount into
   * @param {string}      opts.label       — heading text
   * @param {string}      opts.placeholder — input placeholder
   * @param {string}      opts.iconEmoji   — emoji for the header icon
   * @param {string}      opts.iconClass   — CSS modifier class for icon bg
   * @param {Function}    opts.fetchResults — async (query) => Array<{id, name, meta, status?, photo?}>
   * @param {Function}    opts.onSelect    — (item) => void
   */
  constructor(opts) {
    this.opts = opts;
    this.results = [];
    this.activeIndex = -1;
    this.isOpen = false;

    this._build();
    this._bindEvents();
  }

  _build() {
    this.el = document.createElement('div');
    this.el.className = 'cc-search-section';

    this.el.innerHTML = `
      <div class="cc-search-card">
        <div class="cc-search-card__header">
          <div class="cc-search-card__icon ${this.opts.iconClass}">
            ${this.opts.iconEmoji}
          </div>
          <div class="cc-search-card__label">${this.opts.label}</div>
        </div>
        <div class="cc-search-card__input-wrap">
          <input
            type="text"
            class="cc-search-card__input"
            placeholder="${this.opts.placeholder}"
            autocomplete="off"
          />
          <span class="material-icons cc-search-card__search-icon">search</span>
        </div>
        <div class="cc-suggestions" style="display:none;"></div>
      </div>
    `;

    this.input = this.el.querySelector('.cc-search-card__input');
    this.dropdown = this.el.querySelector('.cc-suggestions');
    this.opts.container.appendChild(this.el);
  }

  _bindEvents() {
    // Debounced search
    this.input.addEventListener('input', debounce(async () => {
      const q = this.input.value.trim();
      if (q.length < 1) {
        this._close();
        return;
      }
      await this._search(q);
    }, 250));

    // Keyboard nav
    this.input.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.activeIndex = Math.min(this.activeIndex + 1, this.results.length - 1);
        this._highlightActive();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.activeIndex = Math.max(this.activeIndex - 1, 0);
        this._highlightActive();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (this.activeIndex >= 0 && this.results[this.activeIndex]) {
          this._select(this.results[this.activeIndex]);
        }
      } else if (e.key === 'Escape') {
        this._close();
        this.input.blur();
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!this.el.contains(e.target)) {
        this._close();
      }
    });

    // Reopen on focus if there's a value
    this.input.addEventListener('focus', async () => {
      const q = this.input.value.trim();
      if (q.length >= 1 && this.results.length > 0) {
        this._open();
      } else if (q.length >= 1) {
        await this._search(q);
      }
    });
  }

  async _search(query) {
    try {
      this.results = await this.opts.fetchResults(query);
      this.activeIndex = -1;
      this._render();
      this._open();
    } catch (err) {
      console.error('Search error:', err);
      this.results = [];
      this._render();
    }
  }

  _render() {
    if (this.results.length === 0) {
      this.dropdown.innerHTML = `
        <div class="cc-no-results">
          <span class="material-icons" style="font-size:24px;display:block;margin-bottom:4px;">search_off</span>
          No results found
        </div>
      `;
      return;
    }

    this.dropdown.innerHTML = this.results.map((item, i) => {
      const initials = getInitials(item.name);
      const gradient = getAvatarGradient(item.name);
      const statusClass = item.status ? getStatusClass(item.status) : '';
      const statusLabel = item.status ? getStatusLabel(item.status) : '';

      return `
        <div class="cc-suggestion-item ${i === this.activeIndex ? 'cc-suggestion-item--active' : ''}"
             data-index="${i}">
          <div class="cc-suggestion-item__avatar" style="background:${gradient}">
            ${item.photo ? `<img src="${item.photo}" alt="${escapeHTML(item.name)}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">` : initials}
          </div>
          <div class="cc-suggestion-item__info">
            <div class="cc-suggestion-item__name">${escapeHTML(item.name)}</div>
            <div class="cc-suggestion-item__meta">${escapeHTML(item.meta || '')}</div>
          </div>
          ${item.status ? `
            <div class="cc-suggestion-item__status cc-suggestion-item__status--${statusClass}">
              <span class="cc-suggestion-item__status-dot"></span>
              ${statusLabel}
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    // Click handlers
    this.dropdown.querySelectorAll('.cc-suggestion-item').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.dataset.index);
        this._select(this.results[idx]);
      });
    });
  }

  _highlightActive() {
    this.dropdown.querySelectorAll('.cc-suggestion-item').forEach((el, i) => {
      el.classList.toggle('cc-suggestion-item--active', i === this.activeIndex);
    });
    // Scroll into view
    const active = this.dropdown.querySelector('.cc-suggestion-item--active');
    if (active) active.scrollIntoView({ block: 'nearest' });
  }

  _select(item) {
    this._close();
    this.input.value = item.name;
    if (this.opts.onSelect) {
      this.opts.onSelect(item);
    }
  }

  _open() {
    this.dropdown.style.display = 'block';
    this.isOpen = true;
  }

  _close() {
    this.dropdown.style.display = 'none';
    this.isOpen = false;
    this.activeIndex = -1;
  }

  destroy() {
    this.el.remove();
  }
}
