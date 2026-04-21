const DEFAULTS = {
  blockMs: 1800,
  initialBurnMs: 1400,
  secondBurnMs: 900,
  offerCount: 240,
  imageCount: 28,
  reshuffleDelayMs: 1200,
};

function readNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getConfig() {
  const { body } = document;
  const { dataset } = body;

  return {
    blockMs: readNumber(dataset.blockMs, DEFAULTS.blockMs),
    initialBurnMs: readNumber(dataset.initialBurnMs, DEFAULTS.initialBurnMs),
    secondBurnMs: readNumber(dataset.secondBurnMs, DEFAULTS.secondBurnMs),
    offerCount: readNumber(dataset.offerCount, DEFAULTS.offerCount),
    imageCount: readNumber(dataset.imageCount, DEFAULTS.imageCount),
    reshuffleDelayMs: readNumber(dataset.reshuffleDelayMs, DEFAULTS.reshuffleDelayMs),
  };
}

function burnCpu(ms) {
  const start = performance.now();
  let accumulator = 0;
  let index = 0;

  while (performance.now() - start < ms) {
    accumulator += Math.sqrt((index % 997) + 1);
    index += 1;
  }

  return accumulator;
}

function makeDataUri(label, width, height, hue) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <defs>
        <linearGradient id="g" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="hsl(${hue}, 80%, 78%)" />
          <stop offset="100%" stop-color="hsl(${(hue + 70) % 360}, 78%, 62%)" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)" />
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
        font-family="Arial, Helvetica, sans-serif" font-size="28" fill="rgba(0,0,0,0.65)">
        ${label}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function buildCard(index) {
  const hueA = ((index * 17) + 40) % 360;
  const hueB = ((index * 29) + 110) % 360;
  const hueC = ((index * 13) + 190) % 360;
  const hueD = ((index * 7) + 260) % 360;

  const card = document.createElement('article');
  card.className = 'slow-offer-card';
  card.innerHTML = `
    <div class="slow-offer-media">
      <img
        src="${makeDataUri(`Offer ${index + 1}`, 800, 420, hueA)}"
        alt="Decorative campaign visual for offer ${index + 1}"
        width="800"
        height="420"
        loading="eager"
        decoding="sync"
      />
    </div>
    <div class="slow-offer-body">
      <p class="slow-kicker">Campaign ${index + 1}</p>
      <h3>Modernization offer ${index + 1}</h3>
      <p>
        This intentionally bloated card repeats realistic-looking marketing content so the
        page feels credible while remaining performance-heavy for demo purposes.
      </p>
      <ul class="slow-meta">
        <li style="color:hsl(${hueB}, 70%, 42%)">Region: Global</li>
        <li style="color:hsl(${hueC}, 70%, 42%)">Audience: Enterprise</li>
        <li style="color:hsl(${hueD}, 70%, 42%)">Priority: High</li>
      </ul>
    </div>
  `;

  return card;
}

function ensureGrid() {
  let grid = document.querySelector('.slow-offers-grid');

  if (!grid) {
    grid = document.createElement('section');
    grid.className = 'slow-offers-grid';
    document.body.append(grid);
  }

  return grid;
}

function inflateDom(count) {
  const grid = ensureGrid();
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < count; index += 1) {
    fragment.append(buildCard(index));
  }

  grid.append(fragment);
}

function addImageStrip(imageCount) {
  const strip = document.createElement('section');
  strip.className = 'slow-image-strip';

  for (let index = 0; index < imageCount; index += 1) {
    const img = document.createElement('img');
    const hue = ((index * 31) + 20) % 360;

    img.src = makeDataUri(`Asset ${index + 1}`, 1200, 800, hue);
    img.alt = `Additional decorative asset ${index + 1}`;
    img.width = 1200;
    img.height = 800;
    img.loading = 'eager';
    img.decoding = 'sync';
    strip.append(img);
  }

  document.body.append(strip);
}

function reorderCards() {
  const grid = document.querySelector('.slow-offers-grid');

  if (!grid) {
    return;
  }

  const cards = Array.from(grid.children);
  cards.sort((left, right) => {
    const leftScore = left.textContent.length % 11;
    const rightScore = right.textContent.length % 11;
    return rightScore - leftScore;
  });

  const fragment = document.createDocumentFragment();
  cards.forEach((card) => fragment.append(card));
  grid.append(fragment);
}

function bindJankyInteractions() {
  let ticking = false;

  window.addEventListener(
    'scroll',
    () => {
      if (ticking) {
        return;
      }

      ticking = true;

      requestAnimationFrame(() => {
        burnCpu(120);
        ticking = false;
      });
    },
    { passive: true },
  );

  window.addEventListener('resize', () => {
    burnCpu(90);
  });
}

function addMetricsBanner(config) {
  const banner = document.createElement('aside');
  banner.className = 'slow-debug-banner';
  banner.innerHTML = `
    <strong>Intentional demo baseline</strong>
    <span>blockMs=${config.blockMs}</span>
    <span>initialBurnMs=${config.initialBurnMs}</span>
    <span>secondBurnMs=${config.secondBurnMs}</span>
    <span>offerCount=${config.offerCount}</span>
  `;
  document.body.prepend(banner);
}

function initSlowPage() {
  const config = getConfig();

  addMetricsBanner(config);

  burnCpu(config.blockMs);
  inflateDom(config.offerCount);
  addImageStrip(config.imageCount);
  bindJankyInteractions();

  window.setTimeout(() => {
    burnCpu(config.initialBurnMs);
    reorderCards();
  }, 50);

  window.setTimeout(() => {
    burnCpu(config.secondBurnMs);
    reorderCards();
  }, config.reshuffleDelayMs);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSlowPage);
} else {
  initSlowPage();
}
