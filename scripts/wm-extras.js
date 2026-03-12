/* eslint-disable max-len */

/* ===== wm-extras.js — Enhanced demo features (loads when ?extras is present) ===== */

/* ────────── Extras Gating ────────── */
function parseExtrasParam() {
  const val = new URLSearchParams(window.location.search).get('extras');
  if (val === null || val === '') return new Set(['base']);
  const tokens = val.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  tokens.push('base');
  return new Set(tokens);
}

const EXTRAS = parseExtrasParam();

function hasExtra(name) { return EXTRAS.has(name); }

/* ────────── SVG Icons ────────── */
const ICN = {
  hub: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="14" height="14" rx="2"/><path d="M8 3V1M12 3V1M8 19v-2M12 19v-2M3 8H1M3 12H1M19 8h-2M19 12h-2"/></svg>',
  crop: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 2v13h13M2 5h13v13"/></svg>',
  wand: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 1l2 4.5L17 7l-3.5 3.5 1 5L10 13l-4.5 2.5 1-5L3 7l5-.5L10 1z"/></svg>',
  similar: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="5"/><path d="M13 13l4 4"/><rect x="5.5" y="5.5" width="5" height="5" rx="1" opacity=".3" fill="currentColor"/></svg>',
  cr: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 1l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V4l7-3zm-1 12l5-5-1.4-1.4L9 10.2 7.4 8.6 6 10l4 3z"/></svg>',
  download: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 3v10M6 9l4 4 4-4"/><path d="M3 14v2a1 1 0 001 1h12a1 1 0 001-1v-2"/></svg>',
  zoom: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="5"/><path d="M13 13l4 4M6 8h4M8 6v4"/></svg>',
  lock: '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="7" width="10" height="7" rx="1.5"/><path d="M5.5 7V5a2.5 2.5 0 015 0v2" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
  close: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 5l10 10M15 5L5 15"/></svg>',
  left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 4l-8 8 8 8"/></svg>',
  right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 4l8 8-8 8"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
  ai: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 0l2 5h5l-4 3.5 1.5 5L8 10.5 3.5 13.5 5 8.5 1 5h5z"/></svg>',
  chart: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 17h14M5 13v4M9 9v8M13 5v12M17 1v16"/></svg>',
  users: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="7" cy="7" r="3"/><path d="M1 17c0-3 2.7-5 6-5s6 2 6 5"/><circle cx="14" cy="6" r="2.5"/><path d="M13 12c1-.3 2-.5 3-.5 2.3 0 4 1.3 4 3.5"/></svg>',
  check: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 10l4 4 8-8"/></svg>',
  page: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 2h8l4 4v12a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z"/><path d="M12 2v4h4"/></svg>',
  place: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="16" height="16" rx="2"/><path d="M2 8h16M8 2v16"/><path d="M5 11l2 2 3-4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  trending: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12l4-4 3 3 7-8M11 3h4v4"/></svg>',
};

/* ────────── Configuration ────────── */
/* Image card indices: 0=Back-to-School, 1=Kevin, 2=St Bernard, 3=Associates, 4=Chris, 5=Sam's Club */
/* Gallery indices: 0=Barbie/Mahomes, 1=HIV Community, 2=Connect Lab, 3=Disaster Relief, 4=International */
const IMG_BADGES = {
  0: 'expired', 1: 'new', 3: 'expiring', 4: 'new',
};

const IMG_LOCKS = {
  2: { groups: ['PR & Communications', 'Disaster Response'], policy: 'Embargo — Q3 2026 press release', abac: ['dept=communications', 'clearance=L3'] },
  5: { groups: ["Sam's Club Marketing"], policy: 'Internal use only — not for external press', abac: ['brand=sams-club', 'role=marketing'] },
};

const IMG_CREDS = {
  0: { producer: 'Walmart Studios', ai: false, date: '2025-07-15' },
  1: {
    producer: 'Walmart Creative Studio', ai: true, tool: 'Adobe Firefly', date: '2025-11-15',
  },
  3: {
    producer: 'Walmart Corporate Comms', ai: true, tool: 'Adobe Firefly + Photoshop', date: '2026-01-22',
  },
  4: { producer: 'Walmart Executive Photography', ai: false, date: '2024-09-10' },
};

const IMG_SIMILAR = {
  0: [3, 5], 1: [4], 2: [3], 3: [0, 2], 4: [1], 5: [0, 3],
};

const GAL_BADGES = { 0: 'new', 3: 'expiring' };
const GAL_LOCKS = { 1: { groups: ['Health & Wellness'], policy: 'Sensitive health content — review required', abac: ['dept=health', 'clearance=L3'] } };

/* Color mappings — accurate to actual image content */
const COLORS = [
  {
    hex: '#2563eb', label: 'Blue', imgCards: [0, 2, 3, 5], galCards: [2, 4],
  },
  {
    hex: '#f59e0b', label: 'Yellow', imgCards: [0], galCards: [3],
  },
  {
    hex: '#10b981', label: 'Green', imgCards: [2], galCards: [3],
  },
  {
    hex: '#ef4444', label: 'Red', imgCards: [0, 3], galCards: [1, 3],
  },
  {
    hex: '#ec4899', label: 'Pink', imgCards: [], galCards: [0],
  },
  {
    hex: '#1a1a1a', label: 'Black', imgCards: [4], galCards: [],
  },
  {
    hex: '#a855f7', label: 'Purple', imgCards: [], galCards: [0, 4],
  },
];

/* Smart tags — accurate to content themes */
const SMART_TAGS = [
  { label: 'Corporate', imgCards: [0, 3, 4, 5], galCards: [2, 4] },
  { label: 'Leadership', imgCards: [4], galCards: [] },
  { label: 'Community', imgCards: [2], galCards: [1, 3] },
  { label: 'Retail', imgCards: [0, 3, 5], galCards: [0] },
  { label: 'Sustainability', imgCards: [2], galCards: [3] },
  { label: 'Holiday', imgCards: [1], galCards: [0] },
];

const BADGE_LABELS = { expired: 'Expired', expiring: 'Expiring Soon', new: 'New' };

/* Mock analytics data per card */
const ANALYTICS = {
  img: [
    {
      views: '12.4K', downloads: 342, trend: 'up', score: 87,
    },
    {
      views: '28.1K', downloads: 1204, trend: 'up', score: 95,
    },
    {
      views: '3.2K', downloads: 89, trend: 'down', score: 42,
    },
    {
      views: '8.7K', downloads: 256, trend: 'up', score: 71,
    },
    {
      views: '5.1K', downloads: 178, trend: 'down', score: 58,
    },
    {
      views: '1.8K', downloads: 45, trend: 'down', score: 31,
    },
  ],
  gal: [
    {
      views: '45.2K', downloads: 2890, trend: 'up', score: 98,
    },
    {
      views: '6.3K', downloads: 198, trend: 'down', score: 44,
    },
    {
      views: '9.8K', downloads: 423, trend: 'up', score: 68,
    },
    {
      views: '15.7K', downloads: 867, trend: 'up', score: 82,
    },
    {
      views: '11.2K', downloads: 534, trend: 'up', score: 75,
    },
  ],
};

/* Mock Workfront review data */
const WF_STATUSES = ['approved', 'in-review', 'draft', 'approved', 'rejected', 'in-review'];
const WF_REVIEWERS = [
  { name: 'Sarah M.', initials: 'SM', color: '#6366f1' },
  { name: 'David K.', initials: 'DK', color: '#ec4899' },
  { name: 'Lisa T.', initials: 'LT', color: '#10b981' },
  { name: 'James R.', initials: 'JR', color: '#f59e0b' },
];

const WF_ACTIVITY = [
  {
    reviewer: 0, action: 'approved', time: '2 hours ago', comment: 'Looks great — on brand and ready for publication.',
  },
  {
    reviewer: 1, action: 'commented', time: '5 hours ago', comment: 'Can we get a tighter crop for social?',
  },
  {
    reviewer: 2, action: 'approved', time: '1 day ago', comment: 'Color grading is perfect.',
  },
  {
    reviewer: 3, action: 'requested changes', time: '2 days ago', comment: 'Need alt text updated for accessibility.',
  },
];

/* Smart Crop presets */
const CROP_PRESETS = [
  {
    label: '16:9 Banner', ratio: '16:9', w: 1920, h: 1080,
  },
  {
    label: '1:1 Social', ratio: '1:1', w: 1080, h: 1080,
  },
  {
    label: '9:16 Story', ratio: '9:16', w: 1080, h: 1920,
  },
  {
    label: '4:3 Product', ratio: '4:3', w: 1200, h: 900,
  },
];

/* ────────── Utilities ────────── */
function makeEl(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
}

function showToast(msg, duration = 3000) {
  let container = document.querySelector('.wm-toast-container');
  if (!container) {
    container = makeEl('div', 'wm-toast-container');
    document.body.appendChild(container);
  }
  const toast = makeEl('div', 'wm-toast', msg);
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('wm-toast-show'));
  setTimeout(() => {
    toast.classList.remove('wm-toast-show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ────────── Image Lightbox ────────── */
let lightbox = null;
let lbImages = [];
let lbCurrent = 0;
let lbZoomed = false;

function showLbImage() {
  const data = lbImages[lbCurrent];
  const img = lightbox.querySelector('.wm-lb-img');
  img.src = data.src;
  img.alt = data.alt;
  img.classList.remove('wm-lb-zoomed');
  lightbox.querySelector('.wm-lb-title').textContent = data.alt;
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.hidden = true;
  document.body.style.overflow = '';
  lbZoomed = false;
}

function lbNav(dir) {
  lbCurrent = (lbCurrent + dir + lbImages.length) % lbImages.length;
  lbZoomed = false;
  showLbImage();
}

function toggleZoom() {
  lbZoomed = !lbZoomed;
  lightbox.querySelector('.wm-lb-img').classList.toggle('wm-lb-zoomed', lbZoomed);
}

function buildLightbox() {
  if (lightbox) return;
  lightbox = makeEl('div', 'wm-lightbox');
  lightbox.hidden = true;
  lightbox.innerHTML = `
    <div class="wm-lb-backdrop"></div>
    <button class="wm-lb-close">${ICN.close}</button>
    <button class="wm-lb-arrow wm-lb-prev">${ICN.left}</button>
    <button class="wm-lb-arrow wm-lb-next">${ICN.right}</button>
    <div class="wm-lb-stage"><img class="wm-lb-img" alt="" /></div>
    <div class="wm-lb-bar">
      <span class="wm-lb-title"></span>
      <div class="wm-lb-actions">
        <button class="wm-lb-zoom" title="Toggle zoom">${ICN.zoom}</button>
        <button class="wm-lb-download" title="Download">${ICN.download}</button>
      </div>
    </div>
  `;
  document.body.appendChild(lightbox);

  lightbox.querySelector('.wm-lb-backdrop').addEventListener('click', closeLightbox);
  lightbox.querySelector('.wm-lb-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.wm-lb-prev').addEventListener('click', () => lbNav(-1));
  lightbox.querySelector('.wm-lb-next').addEventListener('click', () => lbNav(1));
  lightbox.querySelector('.wm-lb-zoom').addEventListener('click', toggleZoom);
  lightbox.querySelector('.wm-lb-download').addEventListener('click', () => {
    window.open(lbImages[lbCurrent].src, '_blank');
    showToast('Opening full resolution for download...');
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') lbNav(-1);
    else if (e.key === 'ArrowRight') lbNav(1);
  });

  let tx = 0;
  const stage = lightbox.querySelector('.wm-lb-stage');
  stage.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) lbNav(dx > 0 ? -1 : 1);
  });
}

function openLightbox(img) {
  buildLightbox();
  lbImages = [...document.querySelectorAll('.cards-media > ul > li')]
    .filter((li) => !li.classList.contains('wm-no-match')
      && !li.classList.contains('wm-color-hidden')
      && !li.classList.contains('wm-tag-hidden'))
    .map((li) => {
      const i = li.querySelector('img');
      return { src: i?.src || '', alt: i?.alt || '' };
    });
  lbCurrent = lbImages.findIndex((im) => im.src === img.src);
  if (lbCurrent < 0) lbCurrent = 0;
  lbZoomed = false;
  showLbImage();
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
}

/* ────────── Find Similar ────────── */
function triggerFindSimilar(idx, type) {
  if (type !== 'media') {
    showToast('Find Similar is available for image assets');
    return;
  }
  const similar = IMG_SIMILAR[idx];
  if (!similar || similar.length === 0) {
    showToast('No similar assets found');
    return;
  }
  const allCards = [...document.querySelectorAll('.cards-media > ul > li')];
  document.body.classList.add('wm-similar-active');
  allCards.forEach((li, i) => {
    if (i === idx) li.classList.add('wm-similar-source');
    else if (similar.includes(i)) li.classList.add('wm-similar-match');
    else li.classList.add('wm-similar-dim');
  });
  showToast(`${similar.length} similar asset${similar.length > 1 ? 's' : ''} found`);
  const dismiss = (e) => {
    if (e.key === 'Escape' || e.type === 'click') {
      document.body.classList.remove('wm-similar-active');
      allCards.forEach((li) => li.classList.remove('wm-similar-source', 'wm-similar-match', 'wm-similar-dim'));
      document.removeEventListener('keydown', dismiss);
      setTimeout(() => document.removeEventListener('click', dismiss), 0);
    }
  };
  setTimeout(() => {
    document.addEventListener('keydown', dismiss);
    document.addEventListener('click', dismiss);
  }, 100);
}

/* ────────── Dynamic Media Smart Crop Preview ────────── */
function openSmartCropPreview(li) {
  if (!hasExtra('dm') && !hasExtra('base')) {
    showToast('Launching Dynamic Media Smart Crop editor...');
    return;
  }
  const img = li.querySelector('img');
  if (!img) return;

  /* Close any existing previews */
  document.querySelectorAll('.wm-dm-overlay').forEach((o) => o.remove());

  const imgDiv = li.querySelector('[class$="-image"]') || li.querySelector('div:first-child');
  if (!imgDiv) return;

  const overlay = makeEl('div', 'wm-dm-overlay');
  overlay.innerHTML = `
    <div class="wm-dm-header">
      <span>${ICN.crop} Smart Crop Preview</span>
      <button class="wm-dm-close">${ICN.close}</button>
    </div>
    <div class="wm-dm-stage">
      <img src="${img.src}" alt="${img.alt}" class="wm-dm-img" />
      <div class="wm-dm-crop-box"></div>
    </div>
    <div class="wm-dm-presets"></div>
    <div class="wm-dm-quality">
      <span>Rendition Quality:</span>
      <div class="wm-dm-quality-btns"></div>
      <span class="wm-dm-filesize">~2.4 MB</span>
    </div>
  `;

  const presetsRow = overlay.querySelector('.wm-dm-presets');
  const cropBox = overlay.querySelector('.wm-dm-crop-box');
  const filesizeEl = overlay.querySelector('.wm-dm-filesize');
  const qualities = ['Low', 'Medium', 'High', 'Lossless'];
  const fileSizes = ['~180 KB', '~540 KB', '~2.4 MB', '~8.1 MB'];
  let activeQuality = 2;

  function applyCrop(preset) {
    presetsRow.querySelectorAll('.wm-dm-preset').forEach((b) => b.classList.remove('active'));
    const btn = presetsRow.querySelector(`[data-ratio="${preset.ratio}"]`);
    if (btn) btn.classList.add('active');

    /* Calculate crop box based on ratio */
    const [rw, rh] = preset.ratio.split(':').map(Number);
    const containerW = 100;
    const containerH = 100;
    let boxW;
    let boxH;
    if (rw / rh > containerW / containerH) {
      boxW = 90;
      boxH = (90 * rh) / rw;
    } else {
      boxH = 85;
      boxW = (85 * rw) / rh;
    }
    cropBox.style.width = `${boxW}%`;
    cropBox.style.height = `${boxH}%`;
    cropBox.style.left = `${(100 - boxW) / 2}%`;
    cropBox.style.top = `${(100 - boxH) / 2}%`;
    cropBox.style.opacity = '1';
  }

  CROP_PRESETS.forEach((p, i) => {
    const btn = makeEl('button', `wm-dm-preset${i === 0 ? ' active' : ''}`, p.label);
    btn.dataset.ratio = p.ratio;
    btn.addEventListener('click', () => applyCrop(p));
    presetsRow.appendChild(btn);
  });

  const qualityRow = overlay.querySelector('.wm-dm-quality-btns');
  qualities.forEach((q, i) => {
    const btn = makeEl('button', `wm-dm-q-btn${i === activeQuality ? ' active' : ''}`, q);
    btn.addEventListener('click', () => {
      activeQuality = i;
      qualityRow.querySelectorAll('.wm-dm-q-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      filesizeEl.textContent = fileSizes[i];
    });
    qualityRow.appendChild(btn);
  });

  overlay.querySelector('.wm-dm-close').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });

  document.body.appendChild(overlay);
  applyCrop(CROP_PRESETS[0]);
}

/* ────────── Workfront Review Panel ────────── */
let wfPanel = null;

function buildWorkfrontPanel() {
  if (wfPanel) return;
  wfPanel = makeEl('div', 'wm-wf-panel');
  wfPanel.hidden = true;
  wfPanel.innerHTML = `
    <div class="wm-wf-header">
      <span>${ICN.users} Review & Approval</span>
      <button class="wm-wf-close">${ICN.close}</button>
    </div>
    <div class="wm-wf-asset-info">
      <img class="wm-wf-asset-thumb" src="" alt="" />
      <div>
        <div class="wm-wf-asset-name"></div>
        <span class="wm-wf-status-chip"></span>
      </div>
    </div>
    <div class="wm-wf-reviewers"></div>
    <div class="wm-wf-activity-label">Activity</div>
    <div class="wm-wf-activity"></div>
    <div class="wm-wf-actions">
      <div class="wm-wf-comment-box">
        <input type="text" placeholder="Add a comment... @mention to notify" />
        <button class="wm-wf-send">Send</button>
      </div>
      <button class="wm-wf-approve-btn">${ICN.check} Request Approval</button>
    </div>
  `;
  document.body.appendChild(wfPanel);

  wfPanel.querySelector('.wm-wf-close').addEventListener('click', () => {
    wfPanel.hidden = true;
  });
  wfPanel.querySelector('.wm-wf-approve-btn').addEventListener('click', () => {
    const reviewer = WF_REVIEWERS[Math.floor(Math.random() * WF_REVIEWERS.length)];
    showToast(`Approval request sent to ${reviewer.name}`);
    const chip = wfPanel.querySelector('.wm-wf-status-chip');
    chip.textContent = 'In Review';
    chip.className = 'wm-wf-status-chip wm-wf-status-in-review';
  });
  wfPanel.querySelector('.wm-wf-send').addEventListener('click', () => {
    const input = wfPanel.querySelector('.wm-wf-comment-box input');
    if (!input.value.trim()) return;
    const feed = wfPanel.querySelector('.wm-wf-activity');
    const entry = makeEl('div', 'wm-wf-entry');
    entry.innerHTML = `
      <span class="wm-wf-avatar" style="background:${WF_REVIEWERS[0].color}">${WF_REVIEWERS[0].initials}</span>
      <div class="wm-wf-entry-body">
        <div class="wm-wf-entry-meta">You · just now</div>
        <div class="wm-wf-entry-text">${input.value}</div>
      </div>
    `;
    feed.prepend(entry);
    input.value = '';
    showToast('Comment posted');
  });

  /* @mention autocomplete */
  const input = wfPanel.querySelector('.wm-wf-comment-box input');
  input.addEventListener('input', () => {
    const val = input.value;
    const atIdx = val.lastIndexOf('@');
    if (atIdx >= 0 && atIdx === val.length - 1) {
      showToast('Type a name: Sarah, David, Lisa, or James', 2000);
    }
  });
}

function openWorkfrontPanel(li, idx) {
  buildWorkfrontPanel();
  const img = li.querySelector('img');
  const title = li.querySelector('p:last-child')?.textContent || img?.alt || 'Asset';
  const status = WF_STATUSES[idx % WF_STATUSES.length];

  wfPanel.querySelector('.wm-wf-asset-thumb').src = img?.src || '';
  wfPanel.querySelector('.wm-wf-asset-name').textContent = title;

  const chip = wfPanel.querySelector('.wm-wf-status-chip');
  const statusLabels = {
    approved: 'Approved', 'in-review': 'In Review', draft: 'Draft', rejected: 'Rejected',
  };
  chip.textContent = statusLabels[status] || status;
  chip.className = `wm-wf-status-chip wm-wf-status-${status}`;

  /* Build reviewer avatars */
  const reviewersEl = wfPanel.querySelector('.wm-wf-reviewers');
  reviewersEl.innerHTML = '<span class="wm-wf-reviewers-label">Reviewers:</span>';
  WF_REVIEWERS.forEach((r) => {
    reviewersEl.innerHTML += `<span class="wm-wf-avatar" style="background:${r.color}" title="${r.name}">${r.initials}</span>`;
  });

  /* Build activity feed */
  const feed = wfPanel.querySelector('.wm-wf-activity');
  feed.innerHTML = '';
  WF_ACTIVITY.forEach((a) => {
    const r = WF_REVIEWERS[a.reviewer];
    const entry = makeEl('div', 'wm-wf-entry');
    entry.innerHTML = `
      <span class="wm-wf-avatar" style="background:${r.color}">${r.initials}</span>
      <div class="wm-wf-entry-body">
        <div class="wm-wf-entry-meta">${r.name} · ${a.action} · ${a.time}</div>
        <div class="wm-wf-entry-text">${a.comment}</div>
      </div>
    `;
    feed.appendChild(entry);
  });

  wfPanel.hidden = false;
}

/* ────────── Analytics Overlay ────────── */
let analyticsActive = false;

function applyAnalyticsOverlays() {
  /* Image cards */
  document.querySelectorAll('.cards-media > ul > li').forEach((li, i) => {
    if (li.querySelector('.wm-analytics-ribbon')) return;
    const data = ANALYTICS.img[i];
    if (!data) return;
    const ribbon = makeEl('div', 'wm-analytics-ribbon');
    ribbon.innerHTML = `
      <span class="wm-ar-views">${data.views} views</span>
      <span class="wm-ar-dl">${data.downloads} DL</span>
      <span class="wm-ar-trend wm-ar-${data.trend}">${ICN.trending}</span>
      <span class="wm-ar-score" title="Engagement Score">${data.score}</span>
    `;
    const imgDiv = li.querySelector('[class$="-image"]') || li.querySelector('div:first-child');
    if (imgDiv) {
      imgDiv.style.position = 'relative';
      imgDiv.appendChild(ribbon);
    }
  });

  /* Gallery cards */
  document.querySelectorAll('.cards-gallery > ul > li').forEach((li, i) => {
    if (li.querySelector('.wm-analytics-ribbon')) return;
    const data = ANALYTICS.gal[i];
    if (!data) return;
    const ribbon = makeEl('div', 'wm-analytics-ribbon');
    ribbon.innerHTML = `
      <span class="wm-ar-views">${data.views} views</span>
      <span class="wm-ar-dl">${data.downloads} DL</span>
      <span class="wm-ar-trend wm-ar-${data.trend}">${ICN.trending}</span>
      <span class="wm-ar-score" title="Engagement Score">${data.score}</span>
    `;
    const imgDiv = li.querySelector('[class$="-image"]') || li.querySelector('div:first-child');
    if (imgDiv) {
      imgDiv.style.position = 'relative';
      imgDiv.appendChild(ribbon);
    }
  });

  /* Summary bar */
  if (!document.querySelector('.wm-analytics-summary')) {
    const summary = makeEl('div', 'wm-analytics-summary');
    summary.innerHTML = `
      <div class="wm-as-item"><strong>Library Impressions:</strong> 142.3K this month</div>
      <div class="wm-as-item"><strong>Most Downloaded:</strong> Merry Like This Kevin (1,204)</div>
      <div class="wm-as-item"><strong>Trending:</strong> Barbie Gallery +312% WoW</div>
      <div class="wm-as-sparkline">
        <svg viewBox="0 0 80 24" fill="none" stroke="#6366f1" stroke-width="1.5"><path d="M0 20 L10 18 L20 15 L30 16 L40 12 L50 8 L60 6 L70 4 L80 2"/></svg>
      </div>
    `;
    const tabs = document.querySelector('.wm-filter-tabs');
    if (tabs) tabs.after(summary);
  }
}

function toggleAnalytics() {
  analyticsActive = !analyticsActive;
  document.body.classList.toggle('wm-analytics-active', analyticsActive);

  const toggle = document.querySelector('.wm-analytics-toggle');
  if (toggle) toggle.classList.toggle('active', analyticsActive);

  if (analyticsActive) {
    applyAnalyticsOverlays();
    showToast('Analytics overlay enabled');
  } else {
    document.querySelectorAll('.wm-analytics-ribbon').forEach((r) => r.remove());
    const summaryBar = document.querySelector('.wm-analytics-summary');
    if (summaryBar) summaryBar.remove();
    showToast('Analytics overlay disabled');
  }
}

function buildAnalyticsToggle() {
  const toggle = makeEl('button', 'wm-analytics-toggle', `${ICN.chart}`);
  toggle.title = 'Toggle Analytics Overlay';
  toggle.addEventListener('click', toggleAnalytics);
  document.body.appendChild(toggle);
}

/* ────────── Use On Page ────────── */
function openUseOnPage(li) {
  const img = li.querySelector('img');
  if (!img) return;

  document.querySelectorAll('.wm-uop-modal').forEach((m) => m.remove());

  const modal = makeEl('div', 'wm-uop-modal');
  modal.innerHTML = `
    <div class="wm-uop-content">
      <div class="wm-uop-header">
        <span>${ICN.place} Use On Page</span>
        <button class="wm-uop-close">${ICN.close}</button>
      </div>
      <div class="wm-uop-preview">
        <img src="${img.src}" alt="${img.alt}" />
      </div>
      <div class="wm-uop-options">
        <h4>Place this asset on:</h4>
        <div class="wm-uop-choice wm-uop-existing">
          <div class="wm-uop-choice-icon">${ICN.page}</div>
          <div>
            <strong>Existing Page</strong>
            <p>Choose a page and block to place this image</p>
          </div>
        </div>
        <div class="wm-uop-choice wm-uop-new">
          <div class="wm-uop-choice-icon">${ICN.place}</div>
          <div>
            <strong>Create New Page</strong>
            <p>Generate a new page with this hero image</p>
          </div>
        </div>
      </div>
      <div class="wm-uop-page-picker" hidden>
        <h4>Select destination page:</h4>
        <div class="wm-uop-pages">
          <label class="wm-uop-page-option"><input type="radio" name="uop-page" value="/about" checked /> About</label>
          <label class="wm-uop-page-option"><input type="radio" name="uop-page" value="/news" /> Newsroom</label>
          <label class="wm-uop-page-option"><input type="radio" name="uop-page" value="/purpose" /> Purpose</label>
          <label class="wm-uop-page-option"><input type="radio" name="uop-page" value="/careers" /> Careers</label>
        </div>
        <div class="wm-uop-block-select">
          <label>Block type: <select>
            <option>Hero</option>
            <option>Cards</option>
            <option>Columns</option>
            <option>Teaser</option>
          </select></label>
        </div>
        <button class="wm-uop-place-btn">Place Image</button>
      </div>
      <div class="wm-uop-new-form" hidden>
        <h4>New page details:</h4>
        <label class="wm-uop-field">Page title: <input type="text" value="${img.alt}" /></label>
        <label class="wm-uop-field">Path: <input type="text" value="/news/${img.alt.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30)}" /></label>
        <label class="wm-uop-field">Template:
          <select>
            <option>Article</option>
            <option>Landing Page</option>
            <option>Media Release</option>
          </select>
        </label>
        <button class="wm-uop-create-btn">Create Page with Image</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector('.wm-uop-close').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });

  modal.querySelector('.wm-uop-existing').addEventListener('click', () => {
    modal.querySelector('.wm-uop-page-picker').hidden = false;
    modal.querySelector('.wm-uop-new-form').hidden = true;
    modal.querySelector('.wm-uop-existing').classList.add('active');
    modal.querySelector('.wm-uop-new').classList.remove('active');
  });
  modal.querySelector('.wm-uop-new').addEventListener('click', () => {
    modal.querySelector('.wm-uop-page-picker').hidden = true;
    modal.querySelector('.wm-uop-new-form').hidden = false;
    modal.querySelector('.wm-uop-new').classList.add('active');
    modal.querySelector('.wm-uop-existing').classList.remove('active');
  });

  modal.querySelector('.wm-uop-place-btn')?.addEventListener('click', () => {
    const page = modal.querySelector('input[name="uop-page"]:checked')?.value || '/about';
    const block = modal.querySelector('.wm-uop-block-select select')?.value || 'Hero';
    modal.remove();
    showToast(`Image placed in ${block} block on ${page} — publishing...`, 4000);
  });
  modal.querySelector('.wm-uop-create-btn')?.addEventListener('click', () => {
    const title = modal.querySelector('.wm-uop-new-form input')?.value || 'New Page';
    modal.remove();
    showToast(`Creating "${title}" with hero image — publishing...`, 4000);
  });
}

/* ────────── Asset Action Toolbar ────────── */
function addAssetToolbar(li, type) {
  const imgDiv = li.querySelector(`.cards-${type}-image`) || li.querySelector('div:first-child');
  if (!imgDiv) return;
  imgDiv.style.position = 'relative';

  const toolbar = makeEl('div', 'wm-asset-toolbar');
  const actions = [
    { icon: ICN.hub, title: 'Open in Content Hub', cls: 'wm-at-hub' },
    { icon: ICN.crop, title: 'Edit in Dynamic Media', cls: 'wm-at-dm' },
    { icon: ICN.wand, title: 'Edit in Adobe Express', cls: 'wm-at-express' },
    { icon: ICN.similar, title: 'Find Similar', cls: 'wm-at-similar' },
  ];

  if (type === 'media') {
    actions.push({ icon: ICN.zoom, title: 'Quick View', cls: 'wm-at-zoom' });
    actions.push({ icon: ICN.download, title: 'Download', cls: 'wm-at-download' });
    actions.push({ icon: ICN.place, title: 'Use On Page', cls: 'wm-at-uop' });
  }

  actions.forEach((a) => {
    const btn = makeEl('button', `wm-at-btn ${a.cls}`, a.icon);
    btn.title = a.title;
    toolbar.appendChild(btn);
  });

  imgDiv.appendChild(toolbar);
}

function wireToolbarActions(li, idx, type) {
  li.querySelector('.wm-at-hub')?.addEventListener('click', (e) => {
    e.stopPropagation();
    showToast('Opening in AEM Assets Content Hub...');
  });
  li.querySelector('.wm-at-dm')?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (hasExtra('dm')) {
      openSmartCropPreview(li);
    } else {
      showToast('Launching Dynamic Media Smart Crop editor...');
    }
  });
  li.querySelector('.wm-at-express')?.addEventListener('click', (e) => {
    e.stopPropagation();
    showToast('Opening in Adobe Express...');
  });
  li.querySelector('.wm-at-similar')?.addEventListener('click', (e) => {
    e.stopPropagation();
    triggerFindSimilar(idx, type);
  });
  li.querySelector('.wm-at-zoom')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const img = li.querySelector('img');
    if (img) openLightbox(img);
  });
  li.querySelector('.wm-at-download')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const img = li.querySelector('img');
    if (img) {
      window.open(img.src, '_blank');
      showToast('Opening full-resolution asset for download...');
    }
  });
  li.querySelector('.wm-at-uop')?.addEventListener('click', (e) => {
    e.stopPropagation();
    openUseOnPage(li);
  });

  /* Workfront — on image card body click (if wf extras enabled) */
  if (hasExtra('wf') && type === 'media') {
    const body = li.querySelector('.cards-media-body') || li.querySelector('div:last-child');
    if (body) {
      const wfBtn = makeEl('button', 'wm-wf-open-btn', `${ICN.users} Review Status`);
      body.appendChild(wfBtn);
      wfBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openWorkfrontPanel(li, idx);
      });
    }
  }
}

/* ────────── Badges ────────── */
function addBadge(li, badgeType) {
  const imgDiv = li.querySelector('[class$="-image"]') || li.querySelector('div:first-child');
  if (!imgDiv) return;
  imgDiv.style.position = 'relative';
  const badge = makeEl('span', `wm-badge wm-badge-${badgeType}`);
  badge.textContent = BADGE_LABELS[badgeType] || badgeType;
  imgDiv.appendChild(badge);
}

/* ────────── Lock / Access Control ────────── */
function addLock(li, config, cardType) {
  const imgDiv = li.querySelector(`.cards-${cardType}-image`) || li.querySelector('div:first-child');
  if (!imgDiv) return;
  imgDiv.style.position = 'relative';
  const lockWrap = makeEl('div', 'wm-lock-wrap');
  lockWrap.innerHTML = `
    <span class="wm-lock-icon">${ICN.lock}</span>
    <div class="wm-lock-tooltip">
      <strong>Restricted Access</strong>
      <p><b>Groups:</b> ${config.groups.join(', ')}</p>
      <p><b>Policy:</b> ${config.policy}</p>
      <p class="wm-lock-abac"><b>ABAC:</b> ${config.abac.map((a) => `<code>${a}</code>`).join(' ')}</p>
    </div>
  `;
  lockWrap.addEventListener('click', (e) => e.stopPropagation());
  imgDiv.appendChild(lockWrap);
}

/* ────────── Content Credentials ────────── */
function addCredentials(li, config, cardType) {
  const imgDiv = li.querySelector(`.cards-${cardType}-image`) || li.querySelector('div:first-child');
  if (!imgDiv) return;
  imgDiv.style.position = 'relative';

  const crBtn = makeEl('button', 'wm-cr-btn', `${ICN.cr}<span>CR</span>`);
  crBtn.title = 'Content Credentials';
  imgDiv.appendChild(crBtn);

  const aiHtml = config.ai
    ? `<div class="wm-cr-ai">${ICN.ai} <span>Contains AI-Generated Content</span><small>Created with ${config.tool}</small></div>`
    : '<div class="wm-cr-verified">&#10003; Verified — No AI-generated content detected</div>';

  const panel = makeEl('div', 'wm-cr-panel');
  panel.innerHTML = `
    <div class="wm-cr-header">${ICN.cr} Content Credentials <button class="wm-cr-close">${ICN.close}</button></div>
    <div class="wm-cr-body">
      <p><b>Producer:</b> ${config.producer}</p>
      <p><b>Signed by:</b> Adobe Content Authenticity Initiative</p>
      <p><b>Date:</b> ${config.date}</p>
      ${aiHtml}
    </div>
  `;
  panel.hidden = true;
  imgDiv.appendChild(panel);

  crBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    document.querySelectorAll('.wm-cr-panel:not([hidden])').forEach((p) => { p.hidden = true; });
    panel.hidden = !panel.hidden;
  });
  panel.querySelector('.wm-cr-close')?.addEventListener('click', (e) => {
    e.stopPropagation();
    panel.hidden = true;
  });
}

/* ────────── Semantic Search Enhancement ────────── */
function enhanceSearch() {
  const bar = document.querySelector('.wm-search-bar');
  if (!bar) return;

  function getImageCards() {
    return [...document.querySelectorAll('.cards-media > ul > li')];
  }

  function getGalleryCards() {
    return [...document.querySelectorAll('.cards-gallery > ul > li')];
  }

  function updateResultCount() {
    const rc = document.querySelector('.wm-result-count');
    if (!rc) return;
    let count = 0;
    document.querySelectorAll('.cards-media > ul > li, .cards-gallery > ul > li, .cards-video > ul > li').forEach((li) => {
      const hidden = li.classList.contains('wm-no-match')
        || li.classList.contains('wm-color-hidden')
        || li.classList.contains('wm-tag-hidden');
      const sectionHidden = li.closest('.section')?.classList.contains('wm-hidden');
      if (!hidden && !sectionHidden) count += 1;
    });
    rc.textContent = count > 0 ? `Showing ${count} result${count !== 1 ? 's' : ''}` : '';
  }

  function clearColorFilter() {
    [...getImageCards(), ...getGalleryCards()].forEach((li) => li.classList.remove('wm-color-hidden'));
    updateResultCount();
  }

  function applyColorFilter(c) {
    getImageCards().forEach((li, i) => li.classList.toggle('wm-color-hidden', !c.imgCards.includes(i)));
    getGalleryCards().forEach((li, i) => li.classList.toggle('wm-color-hidden', !c.galCards.includes(i)));
    updateResultCount();
    showToast(`Filtering by ${c.label} — ${c.imgCards.length + c.galCards.length} matches`);
  }

  function applyTagFilter(activeTags) {
    if (activeTags.size === 0) {
      [...getImageCards(), ...getGalleryCards()].forEach((li) => li.classList.remove('wm-tag-hidden'));
      updateResultCount();
      return;
    }
    const matchedImg = new Set();
    const matchedGal = new Set();
    SMART_TAGS.filter((t) => activeTags.has(t.label)).forEach((t) => {
      t.imgCards.forEach((i) => matchedImg.add(i));
      t.galCards.forEach((i) => matchedGal.add(i));
    });
    getImageCards().forEach((li, i) => li.classList.toggle('wm-tag-hidden', !matchedImg.has(i)));
    getGalleryCards().forEach((li, i) => li.classList.toggle('wm-tag-hidden', !matchedGal.has(i)));
    updateResultCount();
  }

  /* Enhance the search input */
  const input = bar.querySelector('input');
  if (input) input.placeholder = 'Search with AI \u2014 try "blue corporate images" or "holiday"...';

  /* AI badge */
  bar.appendChild(makeEl('span', 'wm-search-ai-badge', `${ICN.ai} AI`));

  /* Wrapper for color picker + smart tags */
  const wrapper = makeEl('div', 'wm-search-enhanced');
  bar.parentNode.insertBefore(wrapper, bar.nextSibling);

  /* Color picker */
  const colorRow = makeEl('div', 'wm-color-picker');
  colorRow.appendChild(makeEl('span', 'wm-cp-label', 'Colors:'));
  let activeColor = null;
  COLORS.forEach((c) => {
    const btn = makeEl('button', 'wm-cp-swatch');
    btn.style.background = c.hex;
    btn.title = c.label;
    btn.addEventListener('click', () => {
      if (activeColor === c.hex) {
        activeColor = null;
        btn.classList.remove('active');
        clearColorFilter();
      } else {
        colorRow.querySelectorAll('.wm-cp-swatch').forEach((s) => s.classList.remove('active'));
        activeColor = c.hex;
        btn.classList.add('active');
        applyColorFilter(c);
      }
    });
    colorRow.appendChild(btn);
  });
  wrapper.appendChild(colorRow);

  /* Smart tags */
  const tagRow = makeEl('div', 'wm-smart-tags');
  tagRow.appendChild(makeEl('span', 'wm-st-label', 'Smart Tags:'));
  const activeTags = new Set();
  SMART_TAGS.forEach((t) => {
    const btn = makeEl('button', 'wm-st-tag', t.label);
    btn.addEventListener('click', () => {
      if (activeTags.has(t.label)) {
        activeTags.delete(t.label);
        btn.classList.remove('active');
      } else {
        activeTags.add(t.label);
        btn.classList.add('active');
      }
      applyTagFilter(activeTags);
    });
    tagRow.appendChild(btn);
  });
  wrapper.appendChild(tagRow);
}

/* ────────── Video Carousel ────────── */
function buildVideoCarousel() {
  const block = document.querySelector('.cards-video');
  if (!block) return;

  const items = [...block.querySelectorAll('ul > li')];
  const videos = items.map((li) => {
    const img = li.querySelector('img');
    const link = li.querySelector('a');
    const dur = li.querySelector('.cards-video-duration');
    const titleEl = link || li.querySelector('.cards-video-body p:first-child');
    let vimeoId = null;
    if (link) {
      const m = link.href.match(/vimeo\.com\/(\d+)/);
      if (m) [, vimeoId] = m;
    }
    return {
      thumb: img?.src || '',
      alt: img?.alt || '',
      title: titleEl?.textContent || '',
      duration: dur?.textContent || '',
      vimeoId,
    };
  });

  if (videos.length === 0) return;

  const carousel = makeEl('div', 'wm-vc');
  let current = 0;

  const player = makeEl('div', 'wm-vc-player');
  const playerInner = makeEl('div', 'wm-vc-player-inner');
  const playerImg = makeEl('img', 'wm-vc-player-img');
  playerImg.alt = videos[0].alt;
  const playerOverlay = makeEl('div', 'wm-vc-play-overlay', `<span class="wm-vc-play-btn">${ICN.play}</span>`);
  const playerIframe = makeEl('div', 'wm-vc-iframe-wrap');
  playerIframe.hidden = true;
  playerInner.append(playerImg, playerOverlay, playerIframe);
  player.appendChild(playerInner);

  const info = makeEl('div', 'wm-vc-info');
  const infoTitle = makeEl('span', 'wm-vc-info-title');
  const infoDownload = makeEl('button', 'wm-vc-info-btn', `${ICN.download} Download`);
  info.append(infoTitle, infoDownload);
  player.appendChild(info);

  const prevBtn = makeEl('button', 'wm-vc-arrow wm-vc-prev', ICN.left);
  const nextBtn = makeEl('button', 'wm-vc-arrow wm-vc-next', ICN.right);
  playerInner.append(prevBtn, nextBtn);

  const strip = makeEl('div', 'wm-vc-strip');

  function goTo(i) {
    current = i;
    const v = videos[i];
    playerImg.src = v.thumb;
    playerImg.alt = v.alt;
    playerImg.hidden = false;
    playerOverlay.hidden = false;
    playerIframe.hidden = true;
    playerIframe.innerHTML = '';
    infoTitle.textContent = v.title;
    strip.querySelectorAll('.wm-vc-thumb').forEach((t, j) => t.classList.toggle('active', j === i));
  }

  function playVideo() {
    const v = videos[current];
    if (!v.vimeoId) {
      showToast('Video preview \u2014 open in Content Hub for full playback');
      return;
    }
    playerImg.hidden = true;
    playerOverlay.hidden = true;
    playerIframe.hidden = false;
    playerIframe.innerHTML = `<iframe src="https://player.vimeo.com/video/${v.vimeoId}?autoplay=1&title=0&byline=0&portrait=0" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen playsinline></iframe>`;
  }

  videos.forEach((v, i) => {
    const t = makeEl('div', `wm-vc-thumb${i === 0 ? ' active' : ''}`);
    t.innerHTML = `<img src="${v.thumb}" alt="${v.alt}">`;
    t.addEventListener('click', () => goTo(i));
    strip.appendChild(t);
  });
  carousel.append(player, strip);

  playerOverlay.addEventListener('click', playVideo);
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    goTo((current - 1 + videos.length) % videos.length);
  });
  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    goTo((current + 1) % videos.length);
  });
  infoDownload.addEventListener('click', () => showToast('Preparing cloud download...'));

  let touchX = 0;
  playerInner.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  playerInner.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) {
      if (dx > 0) goTo((current - 1 + videos.length) % videos.length);
      else goTo((current + 1) % videos.length);
    }
  });

  carousel.setAttribute('tabindex', '0');
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goTo((current - 1 + videos.length) % videos.length);
    else if (e.key === 'ArrowRight') goTo((current + 1) % videos.length);
    else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      playVideo();
    }
  });

  goTo(0);
  block.replaceChildren(carousel);
  block.classList.add('wm-vc-block');
}

/* ────────── Decorate all cards ────────── */
function decorateImageCards() {
  const cards = [...document.querySelectorAll('.cards-media > ul > li')];
  cards.forEach((li, i) => {
    addAssetToolbar(li, 'media');
    wireToolbarActions(li, i, 'media');
    if (IMG_BADGES[i] !== undefined) addBadge(li, IMG_BADGES[i]);
    if (IMG_LOCKS[i]) addLock(li, IMG_LOCKS[i], 'media');
    if (IMG_CREDS[i]) addCredentials(li, IMG_CREDS[i], 'media');
  });
}

function decorateGalleryCards() {
  const cards = [...document.querySelectorAll('.cards-gallery > ul > li')];
  cards.forEach((li, i) => {
    addAssetToolbar(li, 'gallery');
    wireToolbarActions(li, i, 'gallery');
    if (GAL_BADGES[i] !== undefined) addBadge(li, GAL_BADGES[i]);
    if (GAL_LOCKS[i]) addLock(li, GAL_LOCKS[i], 'gallery');
  });
}

/* ────────── Init ────────── */
export default function initExtras() {
  function ready() {
    return document.querySelector('.cards-media > ul > li')
      && document.querySelector('.cards-gallery > ul > li')
      && document.querySelector('.cards-video > ul > li')
      && document.querySelector('.wm-search-bar');
  }

  function setup() {
    enhanceSearch();
    decorateImageCards();
    decorateGalleryCards();
    buildVideoCarousel();
    buildLightbox();

    /* Gated features */
    if (hasExtra('wf')) {
      buildWorkfrontPanel();
      document.body.classList.add('wm-extras-wf');
    }
    if (hasExtra('analytics')) {
      buildAnalyticsToggle();
      document.body.classList.add('wm-extras-analytics');
    }
    if (hasExtra('dm')) {
      document.body.classList.add('wm-extras-dm');
    }
  }

  if (ready()) {
    setup();
  } else {
    const poll = setInterval(() => {
      if (ready()) {
        clearInterval(poll);
        setup();
      }
    }, 100);
  }
}
