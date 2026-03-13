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
  fragment: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="1" width="14" height="18" rx="2"/><path d="M7 5h6M7 9h6M7 13h4"/></svg>',
  firefly: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 1l1.5 3.5L15 6l-3.5 1.5L10 11 8.5 7.5 5 6l3.5-1.5L10 1zM4 11l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2zM15 12l.8 1.7 1.7.8-1.7.8-.8 1.7-.8-1.7L12.5 14.5l1.7-.8z"/></svg>',
  form: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="16" height="16" rx="2"/><path d="M5 6h10M5 10h7M5 14h4"/><circle cx="14" cy="14" r="2" fill="currentColor"/></svg>',
  ab: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 2v16M2 2h7v16H2zM11 2h7v16h-7z"/><path d="M5 8l1.5 4M8 8L6.5 12M5.5 11h2" stroke-width="1.2"/><path d="M14 8v4M14 8h1.5a1.5 1.5 0 010 3H14M14 11h1.5a1.5 1.5 0 010 0" stroke-width="1.2"/></svg>',
  move: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 2v16M2 10h16M10 2l-3 3M10 2l3 3M10 18l-3-3M10 18l3-3M2 10l3-3M2 10l3 3M18 10l-3-3M18 10l-3 3"/></svg>',
  confirm: '<svg viewBox="0 0 20 20" fill="none" stroke="#22c55e" stroke-width="2.5"><path d="M4 10l4 4 8-8"/></svg>',
  pencil: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13.5 3.5l3 3L7 16H4v-3L13.5 3.5z"/><path d="M11 6l3 3"/></svg>',
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

/* Vimeo thumbnail fallback URLs (CDN URLs that EDS can't ingest) */
const VIMEO_THUMBS = [
  'https://i.vimeocdn.com/video/2063608988-7441c0c1e0678e9769bf67443bbf6a6cb6df44afb11934e63cd9c18456a441c8-d?mw=960',
  'https://i.vimeocdn.com/video/2059108368-36df3e4271e4191599ec53ecfea9a3db76130792b72a4dc84e24d4d3e167d7a8-d?mw=960',
  'https://i.vimeocdn.com/video/2059107265-aeb3fe7ee09a431600e1b2a8848f7bfccca1587cdf69c87d019ed6ddab6fd265-d?mw=960',
  'https://i.vimeocdn.com/video/2054935657-bce2284e6f450cf05069ddef419b78b92abbe50a91c0a8fa72a18a8ef193d57d-d?mw=960',
  'https://i.vimeocdn.com/video/2052195797-3b27021bdb70a2361d1c01d7263f2dd5e5311e33d9512f77d3d03c2bdacbbc58-d?mw=960',
  'https://i.vimeocdn.com/video/1920705689-105871e947f0fef94847f80259bcfe84b8c3cc258d7bf5a3140bcef870c15472-d?mw=960',
];

/* People search — image/gallery indices containing people */
/* Only: 0=School/Back-to-School, 1=Kevin, 3=Associates/Store, 4=Chris */
const PEOPLE_CARDS = {
  imgCards: [0, 1, 3, 4],
  galCards: [0, 2],
};

/* Content Fragment mock data (for extras=cf) */
const CF_FIELDS = [
  { label: 'Title', type: 'text' },
  { label: 'Alt Text', type: 'text' },
  { label: 'Caption', type: 'textarea' },
  { label: 'Rights', type: 'select', options: ['Royalty-Free', 'Rights-Managed', 'Editorial Only', 'Internal Use'] },
  { label: 'Expiry Date', type: 'date' },
  { label: 'Category', type: 'select', options: ['Corporate', 'Brand', 'Event', 'Product', 'Campaign'] },
];

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

  document.querySelectorAll('.wm-dm-overlay').forEach((o) => o.remove());

  const overlay = makeEl('div', 'wm-dm-overlay');
  overlay.innerHTML = `
    <div class="wm-dm-dialog">
      <div class="wm-dm-header">
        <span>${ICN.crop} Dynamic Media — Smart Crop</span>
        <button class="wm-dm-close">${ICN.close}</button>
      </div>
      <div class="wm-dm-body">
        <div class="wm-dm-stage">
          <img src="${img.src}" alt="${img.alt}" class="wm-dm-img" />
          <div class="wm-dm-crop-box">
            <div class="wm-dm-crop-handle wm-dm-h-tl"></div>
            <div class="wm-dm-crop-handle wm-dm-h-tr"></div>
            <div class="wm-dm-crop-handle wm-dm-h-bl"></div>
            <div class="wm-dm-crop-handle wm-dm-h-br"></div>
          </div>
        </div>
        <div class="wm-dm-sidebar">
          <h4>Crop Presets</h4>
          <div class="wm-dm-presets"></div>
          <h4>Quality</h4>
          <div class="wm-dm-quality">
            <div class="wm-dm-quality-btns"></div>
            <span class="wm-dm-filesize">~2.4 MB</span>
          </div>
          <h4>Preview</h4>
          <div class="wm-dm-preview-area">
            <img class="wm-dm-preview-img" src="${img.src}" alt="Crop preview" />
            <span class="wm-dm-preview-dims">1920 × 1080</span>
          </div>
          <div class="wm-dm-actions">
            <button class="wm-dm-confirm-btn">${ICN.confirm} ${hasExtra('wf') ? 'Submit for Review' : 'Upload Rendition'}</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const presetsRow = overlay.querySelector('.wm-dm-presets');
  const cropBox = overlay.querySelector('.wm-dm-crop-box');
  const filesizeEl = overlay.querySelector('.wm-dm-filesize');
  const previewImg = overlay.querySelector('.wm-dm-preview-img');
  const previewDims = overlay.querySelector('.wm-dm-preview-dims');
  const stage = overlay.querySelector('.wm-dm-stage');
  const qualities = ['Low', 'Medium', 'High', 'Lossless'];
  const fileSizes = ['~180 KB', '~540 KB', '~2.4 MB', '~8.1 MB'];
  let activeQuality = 2;
  let cropState = {
    x: 5, y: 5, w: 90, h: 85,
  };

  function updatePreview() {
    const cx = cropState.x + cropState.w / 2;
    const cy = cropState.y + cropState.h / 2;
    const scale = Math.min(100 / cropState.w, 100 / cropState.h);
    previewImg.style.objectPosition = `${cx}% ${cy}%`;
    previewImg.style.transform = `scale(${scale.toFixed(2)})`;
    previewImg.style.transformOrigin = `${cx}% ${cy}%`;
    const pw = Math.round((cropState.w / 100) * 4000);
    const ph = Math.round((cropState.h / 100) * 3000);
    previewDims.textContent = `${pw} × ${ph}`;
  }

  function applyCrop(preset) {
    presetsRow.querySelectorAll('.wm-dm-preset').forEach((b) => b.classList.remove('active'));
    const btn = presetsRow.querySelector(`[data-ratio="${preset.ratio}"]`);
    if (btn) btn.classList.add('active');
    const [rw, rh] = preset.ratio.split(':').map(Number);
    let boxW; let boxH;
    if (rw / rh > 1) { boxW = 60; boxH = (60 * rh) / rw; } else { boxH = 55; boxW = (55 * rw) / rh; }
    cropState = {
      x: (100 - boxW) / 2, y: (100 - boxH) / 2, w: boxW, h: boxH,
    };
    cropBox.style.width = `${boxW}%`;
    cropBox.style.height = `${boxH}%`;
    cropBox.style.left = `${cropState.x}%`;
    cropBox.style.top = `${cropState.y}%`;
    cropBox.style.opacity = '1';
    updatePreview();
  }

  /* Draggable crop box */
  let dragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragStartCrop = {};
  cropBox.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('wm-dm-crop-handle')) return;
    dragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    dragStartCrop = { ...cropState };
    cropBox.style.cursor = 'grabbing';
    e.preventDefault();
  });
  document.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const rect = stage.getBoundingClientRect();
    const dx = ((e.clientX - dragStartX) / rect.width) * 100;
    const dy = ((e.clientY - dragStartY) / rect.height) * 100;
    cropState.x = Math.max(0, Math.min(100 - cropState.w, dragStartCrop.x + dx));
    cropState.y = Math.max(0, Math.min(100 - cropState.h, dragStartCrop.y + dy));
    cropBox.style.left = `${cropState.x}%`;
    cropBox.style.top = `${cropState.y}%`;
    updatePreview();
  });
  document.addEventListener('mouseup', () => {
    if (dragging) { dragging = false; cropBox.style.cursor = 'grab'; }
  });

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

  overlay.querySelector('.wm-dm-confirm-btn').addEventListener('click', () => {
    if (hasExtra('wf')) {
      overlay.remove();
      showToast('Crop submitted to Workfront for review — reviewers notified', 4000);
    } else {
      overlay.remove();
      showToast('Rendition uploaded to AEM Assets — available in 30s', 4000);
    }
  });
  overlay.querySelector('.wm-dm-close').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  document.addEventListener('keydown', function dmEsc(e) {
    if (e.key === 'Escape' && document.querySelector('.wm-dm-overlay')) {
      overlay.remove();
      document.removeEventListener('keydown', dmEsc);
    }
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
    { icon: ICN.pencil, title: 'Edit in Dynamic Media', cls: 'wm-at-dm' },
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
  /* Clear colors X button */
  const clearColorBtn = makeEl('button', 'wm-cp-clear', `${ICN.close}`);
  COLORS.forEach((c) => {
    const btn = makeEl('button', 'wm-cp-swatch');
    btn.style.background = c.hex;
    btn.title = c.label;
    btn.addEventListener('click', () => {
      if (activeColor === c.hex) {
        activeColor = null;
        btn.classList.remove('active');
        clearColorFilter();
        clearColorBtn.style.display = 'none';
      } else {
        colorRow.querySelectorAll('.wm-cp-swatch').forEach((s) => s.classList.remove('active'));
        activeColor = c.hex;
        btn.classList.add('active');
        applyColorFilter(c);
        clearColorBtn.style.display = 'inline-flex';
      }
    });
    colorRow.appendChild(btn);
  });
  clearColorBtn.title = 'Clear color filter';
  clearColorBtn.style.display = 'none';
  clearColorBtn.addEventListener('click', () => {
    activeColor = null;
    colorRow.querySelectorAll('.wm-cp-swatch').forEach((s) => s.classList.remove('active'));
    clearColorFilter();
    clearColorBtn.style.display = 'none';
  });
  colorRow.appendChild(clearColorBtn);
  wrapper.appendChild(colorRow);

  /* Smart tags */
  const tagRow = makeEl('div', 'wm-smart-tags');
  tagRow.appendChild(makeEl('span', 'wm-st-label', 'Smart Tags:'));
  const activeTags = new Set();
  const clearTagBtn = makeEl('button', 'wm-st-clear', `${ICN.close}`);
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
      clearTagBtn.style.display = activeTags.size > 0 ? 'inline-flex' : 'none';
      applyTagFilter(activeTags);
    });
    tagRow.appendChild(btn);
  });
  clearTagBtn.title = 'Clear all filters';
  clearTagBtn.style.display = 'none';
  clearTagBtn.addEventListener('click', () => {
    activeTags.clear();
    tagRow.querySelectorAll('.wm-st-tag').forEach((b) => b.classList.remove('active'));
    clearTagBtn.style.display = 'none';
    applyTagFilter(activeTags);
    /* Also clear color */
    activeColor = null;
    colorRow.querySelectorAll('.wm-cp-swatch').forEach((s) => s.classList.remove('active'));
    clearColorFilter();
  });
  tagRow.appendChild(clearTagBtn);
  wrapper.appendChild(tagRow);

  /* Enhance text search to recognize "people" keyword */
  const origInput = bar.querySelector('input');
  if (origInput) {
    origInput.addEventListener('input', () => {
      const q = origInput.value.trim().toLowerCase();
      if (q.includes('people') || q.includes('person') || q.includes('faces')) {
        getImageCards().forEach((li, i) => li.classList.toggle('wm-no-match', !PEOPLE_CARDS.imgCards.includes(i)));
        getGalleryCards().forEach((li, i) => li.classList.toggle('wm-no-match', !PEOPLE_CARDS.galCards.includes(i)));
        updateResultCount();
      }
    });
  }
}

/* ────────── Video Carousel ────────── */
function buildVideoCarousel() {
  const block = document.querySelector('.cards-video');
  if (!block) return;

  const items = [...block.querySelectorAll('ul > li')];
  const videos = items.map((li, idx) => {
    const img = li.querySelector('img');
    const link = li.querySelector('a');
    const dur = li.querySelector('.cards-video-duration');
    const titleEl = link || li.querySelector('.cards-video-body p:first-child');
    let vimeoId = null;
    if (link) {
      const m = link.href.match(/vimeo\.com\/(\d+)/);
      if (m) [, vimeoId] = m;
    }
    /* Fix broken thumbnails — use Vimeo CDN fallback */
    let thumb = img?.src || '';
    if (!thumb || thumb === 'about:error' || thumb.includes('about:error')) {
      thumb = VIMEO_THUMBS[idx] || '';
    }
    return {
      thumb,
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
    /* Check for broken/missing images and add watermark */
    const img = li.querySelector('img');
    if (img && (!img.src || img.src === 'about:error' || img.src.includes('about:error'))) {
      const imgDiv = li.querySelector('.cards-media-image') || li.querySelector('div:first-child');
      if (imgDiv) {
        imgDiv.style.position = 'relative';
        const watermark = makeEl('div', 'wm-missing-watermark');
        watermark.innerHTML = '<span>MISSING</span><small>Asset unavailable — 404</small>';
        imgDiv.appendChild(watermark);
        imgDiv.style.background = '#f0f0f0';
      }
    }
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

/* ────────── Content Fragment Preview (extras=cf) ────────── */
function openContentFragmentPanel(li) {
  document.querySelectorAll('.wm-cf-panel').forEach((p) => p.remove());
  const img = li.querySelector('img');
  if (!img) return;
  const panel = makeEl('div', 'wm-cf-panel');
  panel.innerHTML = `
    <div class="wm-cf-header">
      <span>${ICN.fragment} Content Fragment</span>
      <button class="wm-cf-close">${ICN.close}</button>
    </div>
    <div class="wm-cf-model">
      <span class="wm-cf-model-label">Model: <strong>Media Asset</strong></span>
      <span class="wm-cf-path">/content/dam/walmart/media/${img.alt.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30)}</span>
    </div>
    <div class="wm-cf-fields"></div>
    <div class="wm-cf-actions">
      <button class="wm-cf-save">${ICN.check} Save Fragment</button>
      <button class="wm-cf-publish">Publish</button>
    </div>
  `;
  const fieldsEl = panel.querySelector('.wm-cf-fields');
  CF_FIELDS.forEach((f) => {
    const row = makeEl('div', 'wm-cf-field');
    let input = '';
    if (f.type === 'text') {
      let val = '';
      if (f.label === 'Title' || f.label === 'Alt Text') val = img.alt;
      input = `<input type="text" value="${val}" />`;
    } else if (f.type === 'textarea') {
      input = `<textarea rows="2">${img.alt} — Walmart Corporate Media Library</textarea>`;
    } else if (f.type === 'select') {
      input = `<select>${f.options.map((o, i) => `<option${i === 0 ? ' selected' : ''}>${o}</option>`).join('')}</select>`;
    } else if (f.type === 'date') {
      input = '<input type="date" value="2026-12-31" />';
    }
    row.innerHTML = `<label>${f.label}</label>${input}`;
    fieldsEl.appendChild(row);
  });
  panel.querySelector('.wm-cf-close').addEventListener('click', () => panel.remove());
  panel.querySelector('.wm-cf-save').addEventListener('click', () => {
    panel.remove();
    showToast('Content Fragment saved to AEM Assets', 3000);
  });
  panel.querySelector('.wm-cf-publish').addEventListener('click', () => {
    panel.remove();
    showToast('Fragment published — references updated on 3 pages', 4000);
  });
  document.body.appendChild(panel);
}

/* ────────── Firefly Generative Fill (extras=ff) ────────── */
function openFireflyPanel(li) {
  document.querySelectorAll('.wm-ff-overlay').forEach((o) => o.remove());
  const img = li.querySelector('img');
  if (!img) return;
  const overlay = makeEl('div', 'wm-ff-overlay');
  overlay.innerHTML = `
    <div class="wm-ff-dialog">
      <div class="wm-ff-header">
        <span>${ICN.firefly} Adobe Firefly — Generative Fill</span>
        <button class="wm-ff-close">${ICN.close}</button>
      </div>
      <div class="wm-ff-body">
        <div class="wm-ff-source">
          <img src="${img.src}" alt="${img.alt}" class="wm-ff-src-img" />
          <div class="wm-ff-selection" title="Drag to select region">
            <span>Select region to fill</span>
          </div>
        </div>
        <div class="wm-ff-controls">
          <label>Prompt: <input type="text" class="wm-ff-prompt" value="Extend background naturally" /></label>
          <div class="wm-ff-modes">
            <button class="wm-ff-mode active">Generative Fill</button>
            <button class="wm-ff-mode">Expand Image</button>
            <button class="wm-ff-mode">Remove Object</button>
          </div>
          <button class="wm-ff-generate">${ICN.firefly} Generate 3 Variations</button>
        </div>
      </div>
      <div class="wm-ff-results" hidden>
        <h4>Generated Variations</h4>
        <div class="wm-ff-grid">
          <div class="wm-ff-var"><img src="${img.src}" alt="Variation 1" style="filter:hue-rotate(10deg) brightness(1.05)"/><span>Variation 1</span><button>Use This</button></div>
          <div class="wm-ff-var"><img src="${img.src}" alt="Variation 2" style="filter:hue-rotate(-5deg) saturate(1.2)"/><span>Variation 2</span><button>Use This</button></div>
          <div class="wm-ff-var"><img src="${img.src}" alt="Variation 3" style="filter:brightness(1.1) contrast(1.05)"/><span>Variation 3</span><button>Use This</button></div>
        </div>
      </div>
    </div>
  `;
  overlay.querySelector('.wm-ff-close').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  overlay.querySelectorAll('.wm-ff-mode').forEach((btn) => {
    btn.addEventListener('click', () => {
      overlay.querySelectorAll('.wm-ff-mode').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
  overlay.querySelector('.wm-ff-generate').addEventListener('click', () => {
    const genBtn = overlay.querySelector('.wm-ff-generate');
    genBtn.textContent = 'Generating...';
    genBtn.disabled = true;
    setTimeout(() => {
      overlay.querySelector('.wm-ff-results').hidden = false;
      genBtn.textContent = 'Regenerate';
      genBtn.disabled = false;
    }, 2000);
  });
  overlay.querySelectorAll('.wm-ff-var button').forEach((btn) => {
    btn.addEventListener('click', () => {
      overlay.remove();
      showToast('Firefly variation saved to AEM Assets', 3000);
    });
  });
  document.body.appendChild(overlay);
}

/* ────────── AEM Forms Intake (extras=forms) ────────── */
function openFormsPanel(li) {
  document.querySelectorAll('.wm-forms-panel').forEach((p) => p.remove());
  const img = li.querySelector('img');
  if (!img) return;
  const panel = makeEl('div', 'wm-forms-panel');
  panel.innerHTML = `
    <div class="wm-forms-header">
      <span>${ICN.form} AEM Forms — Asset Request</span>
      <button class="wm-forms-close">${ICN.close}</button>
    </div>
    <div class="wm-forms-tabs">
      <button class="wm-forms-tab active" data-tab="rights">Request Rights</button>
      <button class="wm-forms-tab" data-tab="brief">Creative Brief</button>
      <button class="wm-forms-tab" data-tab="issue">Report Issue</button>
    </div>
    <div class="wm-forms-body">
      <div class="wm-forms-asset-info">
        <img src="${img.src}" alt="${img.alt}" />
        <div>
          <strong>${img.alt}</strong>
          <small>Auto-populated from asset metadata</small>
        </div>
      </div>
      <div class="wm-forms-fields" data-tab="rights">
        <label>Usage Type <select><option>Digital — Web</option><option>Digital — Social</option><option>Print — Brochure</option><option>Print — Billboard</option><option>Broadcast — TV</option></select></label>
        <label>Territory <select><option>North America</option><option>Global</option><option>EMEA</option><option>APAC</option><option>LATAM</option></select></label>
        <label>Duration <select><option>6 months</option><option>1 year</option><option>2 years</option><option>Perpetual</option></select></label>
        <label>Justification <textarea rows="3" placeholder="Explain why you need extended rights..."></textarea></label>
      </div>
      <div class="wm-forms-fields" data-tab="brief" hidden>
        <label>Campaign Name <input type="text" placeholder="e.g., Back-to-School 2026" /></label>
        <label>Deliverables <select multiple><option>Hero Banner</option><option>Social Posts</option><option>Email Template</option><option>In-Store Signage</option></select></label>
        <label>Deadline <input type="date" value="2026-04-15" /></label>
        <label>Notes <textarea rows="3" placeholder="Additional creative direction..."></textarea></label>
      </div>
      <div class="wm-forms-fields" data-tab="issue" hidden>
        <label>Issue Type <select><option>Incorrect metadata</option><option>Broken link</option><option>Rights expired</option><option>Quality issue</option><option>Duplicate asset</option></select></label>
        <label>Description <textarea rows="4" placeholder="Describe the issue..."></textarea></label>
        <label>Priority <select><option>Low</option><option>Medium</option><option selected>High</option><option>Critical</option></select></label>
      </div>
      <button class="wm-forms-submit">${ICN.check} Submit Request</button>
    </div>
  `;
  panel.querySelector('.wm-forms-close').addEventListener('click', () => panel.remove());
  panel.querySelectorAll('.wm-forms-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      panel.querySelectorAll('.wm-forms-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      panel.querySelectorAll('.wm-forms-fields').forEach((f) => { f.hidden = f.dataset.tab !== tab.dataset.tab; });
    });
  });
  panel.querySelector('.wm-forms-submit').addEventListener('click', () => {
    const activeTab = panel.querySelector('.wm-forms-tab.active')?.dataset.tab || 'rights';
    const msgs = { rights: 'Rights request submitted — Workfront task created', brief: 'Creative brief submitted — team notified', issue: 'Issue reported — ticket #WM-4892 created' };
    panel.remove();
    showToast(msgs[activeTab], 4000);
  });
  document.body.appendChild(panel);
}

/* ────────── A/B Test Configurator (extras=ab) ────────── */
function openABConfigurator() {
  document.querySelectorAll('.wm-ab-overlay').forEach((o) => o.remove());
  const allImgs = [...document.querySelectorAll('.cards-media > ul > li img')].filter((i) => i.src && i.src !== 'about:error');
  if (allImgs.length < 2) { showToast('Need at least 2 images for A/B test'); return; }
  const overlay = makeEl('div', 'wm-ab-overlay');
  overlay.innerHTML = `
    <div class="wm-ab-dialog">
      <div class="wm-ab-header">
        <span>${ICN.ab} EDS Experiment Configurator</span>
        <button class="wm-ab-close">${ICN.close}</button>
      </div>
      <div class="wm-ab-body">
        <div class="wm-ab-variants">
          <div class="wm-ab-variant">
            <h4>Control (A)</h4>
            <div class="wm-ab-img-picker" data-slot="a">
              <img src="${allImgs[0].src}" alt="${allImgs[0].alt}" />
              <button class="wm-ab-change">Change</button>
            </div>
          </div>
          <div class="wm-ab-vs">VS</div>
          <div class="wm-ab-variant">
            <h4>Variant (B)</h4>
            <div class="wm-ab-img-picker" data-slot="b">
              <img src="${allImgs[1].src}" alt="${allImgs[1].alt}" />
              <button class="wm-ab-change">Change</button>
            </div>
          </div>
        </div>
        <div class="wm-ab-config">
          <label>Experiment Name <input type="text" value="hero-image-test-${Date.now().toString(36).slice(-4)}" /></label>
          <label>Page Path <input type="text" value="/about" /></label>
          <label>Traffic Split
            <div class="wm-ab-split">
              <input type="range" min="10" max="90" value="50" class="wm-ab-slider" />
              <span class="wm-ab-split-label">50% / 50%</span>
            </div>
          </label>
          <label>Audience
            <select>
              <option>All Visitors</option>
              <option>New Visitors</option>
              <option>Returning Visitors</option>
              <option>Mobile Users</option>
              <option>Walmart+ Members</option>
            </select>
          </label>
          <label>Success Metric
            <select>
              <option>Click-Through Rate</option>
              <option>Engagement Time</option>
              <option>Conversion Rate</option>
              <option>Bounce Rate (lower is better)</option>
            </select>
          </label>
          <label>Duration <select><option>7 days</option><option selected>14 days</option><option>30 days</option></select></label>
        </div>
      </div>
      <div class="wm-ab-footer">
        <span class="wm-ab-note">Writes to <code>/.helix/config.xlsx</code> experiments sheet</span>
        <button class="wm-ab-launch">${ICN.trending} Launch Experiment</button>
      </div>
    </div>
  `;
  const slider = overlay.querySelector('.wm-ab-slider');
  const splitLabel = overlay.querySelector('.wm-ab-split-label');
  slider.addEventListener('input', () => {
    const v = parseInt(slider.value, 10);
    splitLabel.textContent = `${v}% / ${100 - v}%`;
  });
  overlay.querySelector('.wm-ab-close').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  overlay.querySelector('.wm-ab-launch').addEventListener('click', () => {
    overlay.remove();
    showToast('Experiment launched — config.xlsx updated, live in 60s', 4000);
  });
  overlay.querySelectorAll('.wm-ab-change').forEach((btn) => {
    btn.addEventListener('click', () => {
      const picker = btn.closest('.wm-ab-img-picker');
      const currentSrc = picker.querySelector('img').src;
      const next = allImgs.find((i) => i.src !== currentSrc) || allImgs[0];
      picker.querySelector('img').src = next.src;
      picker.querySelector('img').alt = next.alt;
    });
  });
  document.body.appendChild(overlay);
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
    if (hasExtra('search')) enhanceSearch();
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
    if (hasExtra('cf')) {
      document.body.classList.add('wm-extras-cf');
      /* Add CF button to media card toolbars */
      document.querySelectorAll('.cards-media > ul > li').forEach((li) => {
        const body = li.querySelector('.cards-media-body') || li.querySelector('div:last-child');
        if (body) {
          const cfBtn = makeEl('button', 'wm-cf-open-btn', `${ICN.fragment} Content Fragment`);
          body.appendChild(cfBtn);
          cfBtn.addEventListener('click', (e) => { e.stopPropagation(); openContentFragmentPanel(li); });
        }
      });
    }
    if (hasExtra('ff')) {
      document.body.classList.add('wm-extras-ff');
      document.querySelectorAll('.cards-media > ul > li').forEach((li) => {
        const body = li.querySelector('.cards-media-body') || li.querySelector('div:last-child');
        if (body) {
          const ffBtn = makeEl('button', 'wm-ff-open-btn', `${ICN.firefly} Firefly`);
          body.appendChild(ffBtn);
          ffBtn.addEventListener('click', (e) => { e.stopPropagation(); openFireflyPanel(li); });
        }
      });
    }
    if (hasExtra('forms')) {
      document.body.classList.add('wm-extras-forms');
      document.querySelectorAll('.cards-media > ul > li').forEach((li) => {
        const body = li.querySelector('.cards-media-body') || li.querySelector('div:last-child');
        if (body) {
          const formBtn = makeEl('button', 'wm-forms-open-btn', `${ICN.form} Request`);
          body.appendChild(formBtn);
          formBtn.addEventListener('click', (e) => { e.stopPropagation(); openFormsPanel(li); });
        }
      });
    }
    if (hasExtra('ab')) {
      document.body.classList.add('wm-extras-ab');
      /* Add A/B test button to filter bar */
      const filterBar = document.querySelector('.wm-filter-tabs');
      if (filterBar) {
        const abBtn = makeEl('button', 'wm-ab-toggle', `${ICN.ab} A/B Test`);
        abBtn.addEventListener('click', openABConfigurator);
        filterBar.appendChild(abBtn);
      }
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
