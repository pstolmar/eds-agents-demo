/* eslint-disable max-len */

/* ===== wm-personalized.js — Guest + logged-in personalization ===== */

function makeEl(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
}

/* ─── Personalization Data ─── */
const GUEST_RECS = [
  {
    name: 'Great Value Paper Towels 12pk', price: '$11.97', img: '📦', tag: 'Bestseller',
  },
  {
    name: 'Equate Hand Soap 4pk', price: '$5.44', img: '🧴', tag: 'Popular',
  },
  {
    name: 'Mainstays Throw Blanket', price: '$9.97', img: '🛏️', tag: 'Trending',
  },
  {
    name: 'Great Value K-Cup Coffee 48ct', price: '$14.96', img: '☕', tag: 'Bestseller',
  },
];

const LOGGED_IN_RECS = [
  {
    name: 'Tide Pods 81ct (You bought 2x)', price: '$19.97', img: '🧺', tag: 'Buy Again', score: 94,
  },
  {
    name: 'Cheerios Family Size (Monthly)', price: '$5.48', img: '🥣', tag: 'Subscribe', score: 88,
  },
  {
    name: 'Pampers Swaddlers Size 4', price: '$44.94', img: '👶', tag: 'Predicted', score: 82,
  },
  {
    name: 'Organifi Green Juice', price: '$69.95', img: '🥬', tag: 'RTCDP Match', score: 76,
  },
];

const TRENDING = [
  { name: 'Ninja Creami Ice Cream Maker', sales: '2,400 sold today', trend: '+340%' },
  { name: 'Stanley Tumbler 40oz', sales: '1,890 sold today', trend: '+180%' },
  { name: 'Blackstone Griddle 36in', sales: '987 sold today', trend: '+95%' },
];

const USER = {
  name: 'Sarah Mitchell',
  store: '4208',
  city: 'Bentonville, AR',
  segments: ['Young Family', 'Health-Conscious', 'Budget Saver'],
  walmartPlus: true,
  rtcdpTraits: ['household_with_children', 'organic_preference', 'high_frequency_shopper'],
};

/* ─── Helpers ─── */
function findSection(main, keyword) {
  return [...main.querySelectorAll('.section')].find((s) => {
    const h = s.querySelector('h2');
    return h && h.textContent.toLowerCase().includes(keyword);
  });
}

/* ─── Trending Section (shared) ─── */
function buildTrending(main) {
  const trendSection = findSection(main, 'trending');
  if (!trendSection) return;
  const wrapper = trendSection.querySelector('.default-content-wrapper') || trendSection;
  wrapper.querySelectorAll('p').forEach((p) => p.remove());

  const list = makeEl('div', 'wm-pz-trending-list');
  TRENDING.forEach((item, i) => {
    const row = makeEl('div', 'wm-pz-trend-row');
    row.innerHTML = `
      <span class="wm-pz-trend-rank">#${i + 1}</span>
      <div class="wm-pz-trend-info">
        <strong>${item.name}</strong>
        <span>${item.sales}</span>
      </div>
      <span class="wm-pz-trend-pct">${item.trend}</span>
    `;
    list.appendChild(row);
  });
  wrapper.appendChild(list);
}

/* ─── Logged-In Personalization (RTCDP + Target) ─── */
function transitionToLoggedIn(main) {
  document.body.classList.add('wm-personalized-loggedin');

  /* Personalized top bar */
  const topBar = makeEl('div', 'wm-pz-topbar');
  topBar.innerHTML = `
    <div class="wm-pz-topbar-left">
      <span class="wm-pz-avatar">${USER.name.split(' ').map((n) => n[0]).join('')}</span>
      <div>
        <strong>Hi, ${USER.name.split(' ')[0]}!</strong>
        <span class="wm-pz-store-tag">Store #${USER.store} · ${USER.city}</span>
      </div>
    </div>
    <div class="wm-pz-topbar-right">
      ${USER.walmartPlus ? '<span class="wm-pz-wplus">W+ Member</span>' : ''}
      <span class="wm-pz-segments">${USER.segments.map((s) => `<span class="wm-pz-seg">${s}</span>`).join('')}</span>
    </div>
  `;
  main.prepend(topBar);

  /* Update heading */
  const h1 = main.querySelector('h1');
  if (h1) h1.textContent = `Welcome back, ${USER.name.split(' ')[0]}`;

  /* Upgrade recs to RTCDP-powered */
  const recsSection = findSection(main, 'recommended');
  if (recsSection) {
    const wrapper = recsSection.querySelector('.default-content-wrapper') || recsSection;
    const oldGrid = wrapper.querySelector('.wm-pz-recs-grid');
    if (oldGrid) oldGrid.remove();
    const oldBadge = wrapper.querySelector('.wm-pz-source-badge');
    if (oldBadge) oldBadge.remove();

    const grid = makeEl('div', 'wm-pz-recs-grid wm-pz-recs-loggedin');
    LOGGED_IN_RECS.forEach((item) => {
      const card = makeEl('div', 'wm-pz-rec-card');
      card.innerHTML = `
        <div class="wm-pz-rec-img">${item.img}</div>
        <div class="wm-pz-rec-body">
          <span class="wm-pz-rec-tag wm-pz-rec-tag-${item.tag.toLowerCase().replace(/\s+/g, '-')}">${item.tag}</span>
          <strong>${item.name}</strong>
          <span class="wm-pz-rec-price">${item.price}</span>
          <div class="wm-pz-rec-score">Match: ${item.score}%</div>
        </div>
      `;
      grid.appendChild(card);
    });
    wrapper.appendChild(grid);

    const badge = makeEl('div', 'wm-pz-source-badge wm-pz-source-rtcdp');
    badge.innerHTML = `
      🧠 <strong>Adobe RTCDP</strong> — Profile: ${USER.name} | Segments: ${USER.segments.join(', ')}
      <br><small>Traits: ${USER.rtcdpTraits.join(', ')}</small>
    `;
    wrapper.appendChild(badge);
  }

  /* Update store section with personalized info */
  const storeSection = findSection(main, 'your store');
  if (storeSection) {
    const geo = storeSection.querySelector('.wm-pz-geo-badge');
    if (geo) {
      geo.innerHTML = `📍 Your preferred store (Store #${USER.store})`;
      geo.classList.add('wm-pz-preferred');
    }
  }
}

/* ─── Guest Personalization (Adobe Target simulation) ─── */
function buildGuestExperience(main) {
  document.body.classList.add('wm-personalized-guest');

  /* Guest banner */
  const banner = makeEl('div', 'wm-pz-guest-banner');
  banner.innerHTML = `
    <span>👋 Welcome! Sign in for personalized recommendations.</span>
    <button class="wm-pz-signin-btn">Sign In</button>
  `;
  main.prepend(banner);

  /* Recommendations section */
  const recsSection = findSection(main, 'recommended');
  if (recsSection) {
    const grid = makeEl('div', 'wm-pz-recs-grid');
    GUEST_RECS.forEach((item) => {
      const card = makeEl('div', 'wm-pz-rec-card');
      card.innerHTML = `
        <div class="wm-pz-rec-img">${item.img}</div>
        <div class="wm-pz-rec-body">
          <span class="wm-pz-rec-tag">${item.tag}</span>
          <strong>${item.name}</strong>
          <span class="wm-pz-rec-price">${item.price}</span>
        </div>
      `;
      grid.appendChild(card);
    });
    const wrapper = recsSection.querySelector('.default-content-wrapper') || recsSection;
    wrapper.querySelectorAll('p').forEach((p) => p.remove());
    wrapper.appendChild(grid);
    const badge = makeEl('div', 'wm-pz-source-badge', '🎯 Adobe Target — Guest segment: New Visitor | A/B Test: v3-grid-layout');
    wrapper.appendChild(badge);
  }

  /* Store section — geo-based */
  const storeSection = findSection(main, 'your store');
  if (storeSection) {
    const wrapper = storeSection.querySelector('.default-content-wrapper') || storeSection;
    wrapper.querySelectorAll('p').forEach((p) => p.remove());
    const storeCard = makeEl('div', 'wm-pz-store-card');
    storeCard.innerHTML = `
      <div class="wm-pz-store-info">
        <h3>Walmart Supercenter</h3>
        <p>406 S Walton Blvd, Bentonville, AR 72712</p>
        <p>Store #4208 · Open until 11:00 PM</p>
        <div class="wm-pz-store-services">
          <span>🚗 Pickup</span><span>🚚 Delivery</span><span>💊 Pharmacy</span><span>👁️ Vision</span>
        </div>
      </div>
      <div class="wm-pz-geo-badge">📍 Based on IP geolocation</div>
    `;
    wrapper.appendChild(storeCard);
  }

  /* Trending section */
  buildTrending(main);

  /* Sign in handler */
  banner.querySelector('.wm-pz-signin-btn').addEventListener('click', () => {
    document.body.classList.remove('wm-personalized-guest');
    banner.remove();
    transitionToLoggedIn(main);
  });
}

export default function init() {
  document.body.classList.add('wm-personalized-page');
  const main = document.querySelector('main');
  if (!main) return;

  /* Wait for sections to load */
  function tryInit() {
    if (!main.querySelector('.section')) return false;
    buildGuestExperience(main);
    return true;
  }
  if (tryInit()) return;
  const obs = new MutationObserver(() => {
    if (tryInit()) obs.disconnect();
  });
  obs.observe(main, { childList: true, subtree: true });
}
