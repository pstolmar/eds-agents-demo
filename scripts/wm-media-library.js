/* ===== Walmart Media Library — page controller ===== */
/* Loaded ONLY on /content/wm-media-library-eds        */

const WM_NAV_LINKS = [
  {
    label: 'About',
    href: '#',
    children: [
      { label: 'Our Story', href: '#' },
      { label: 'Leadership', href: '#' },
      { label: 'Location Facts', href: '#' },
    ],
  },
  {
    label: 'News',
    href: '#',
    children: [
      { label: 'Media Library', href: '#' },
      { label: 'Newsroom', href: '#' },
      { label: 'Views & Perspectives', href: '#' },
    ],
  },
  { label: 'Purpose', href: '#' },
  { label: 'Investors', href: '#' },
  { label: 'Suppliers', href: '#' },
  { label: 'Careers', href: '#' },
  { label: 'Ask Walmart', href: '#' },
];

/* Walmart spark SVG — 6-pointed burst */
const SPARK_SVG = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <g fill="#FFC220">
    <polygon points="16,0 18.5,11.5 16,8 13.5,11.5"/>
    <polygon points="16,32 13.5,20.5 16,24 18.5,20.5"/>
    <polygon points="0,16 11.5,13.5 8,16 11.5,18.5"/>
    <polygon points="32,16 20.5,18.5 24,16 20.5,13.5"/>
    <polygon points="2.3,2.3 12.5,10.5 7.5,10 10.5,12.5"/>
    <polygon points="29.7,29.7 19.5,21.5 24.5,22 21.5,19.5"/>
    <polygon points="29.7,2.3 21.5,12.5 22,7.5 19.5,10.5"/>
    <polygon points="2.3,29.7 10.5,19.5 10,24.5 12.5,21.5"/>
  </g>
</svg>`;

/**
 * Override the existing header with Walmart branding
 */
function overrideNav() {
  const header = document.querySelector('header');
  if (!header) return;

  /* Poll until nav is loaded — more reliable than MutationObserver for timing */
  const poll = setInterval(() => {
    const navWrapper = header.querySelector('.nav-wrapper');
    if (!navWrapper) return;
    clearInterval(poll);

    /* Small delay to let header.js finish setting up */
    setTimeout(() => {
      const nav = navWrapper.querySelector('nav');
      if (!nav) return;

      /* --- Brand --- */
      const brand = nav.querySelector('.nav-brand');
      if (brand) {
        const brandLink = brand.querySelector('a') || brand.querySelector('p');
        if (brandLink) {
          brandLink.innerHTML = `<span class="wm-spark">${SPARK_SVG}</span> Walmart`;
        }
      }

      /* --- Sections (replace with Walmart links) --- */
      const sections = nav.querySelector('.nav-sections');
      if (sections) {
        const wrapper = sections.querySelector('.default-content-wrapper') || sections;
        const ul = document.createElement('ul');

        WM_NAV_LINKS.forEach((item) => {
          const li = document.createElement('li');
          li.setAttribute('aria-expanded', 'false');

          if (item.children) {
            li.classList.add('nav-drop');
            const p = document.createElement('p');
            p.textContent = item.label;
            li.appendChild(p);

            const subUl = document.createElement('ul');
            item.children.forEach((child) => {
              const subLi = document.createElement('li');
              subLi.innerHTML = `<a href="${child.href}">${child.label}</a>`;
              subUl.appendChild(subLi);
            });
            li.appendChild(subUl);

            /* Hover open/close (desktop) — uses class for CSS control */
            li.addEventListener('mouseenter', () => {
              if (window.innerWidth >= 900) {
                ul.querySelectorAll('.nav-drop').forEach((d) => {
                  d.classList.remove('wm-dropdown-open');
                  d.setAttribute('aria-expanded', 'false');
                });
                li.classList.add('wm-dropdown-open');
                li.setAttribute('aria-expanded', 'true');
              }
            });
            li.addEventListener('mouseleave', () => {
              if (window.innerWidth >= 900) {
                li.classList.remove('wm-dropdown-open');
                li.setAttribute('aria-expanded', 'false');
              }
            });
            /* prevent the original header.js click handler from toggling */
            li.addEventListener('click', (e) => {
              e.stopPropagation();
            }, true);
          } else {
            li.innerHTML = `<a href="${item.href}">${item.label}</a>`;
          }
          ul.appendChild(li);
        });

        /* Replace existing content */
        const oldUl = wrapper.querySelector('ul');
        if (oldUl) {
          oldUl.replaceWith(ul);
        } else {
          wrapper.appendChild(ul);
        }
      }
    }, 150);
  }, 50);
}

/* Image card indices: 0=Back-to-School, 1=Kevin, 2=St Bernard,
   3=Associates/Store, 4=Chris, 5=Sam's Club */
const PEOPLE_SEARCH_CARDS = [0, 1, 3, 4]; /* School, Kevin, Store, Chris */

/**
 * Build the search bar UI
 */
function buildSearchBar() {
  const firstSection = document.querySelector('main > .section:first-of-type');
  if (!firstSection) return null;

  const wrapper = firstSection.querySelector('.default-content-wrapper');
  if (!wrapper) return null;

  const searchBar = document.createElement('div');
  searchBar.className = 'wm-search-bar';

  const searchSvg = '<svg class="wm-search-icon" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
    + '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
  const clearSvg = '<svg class="wm-search-clear" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none;cursor:pointer;">'
    + '<path d="M18 6L6 18M6 6l12 12"/></svg>';

  searchBar.innerHTML = `${searchSvg}${clearSvg}<input type="text" placeholder="Search media library..." />`;

  wrapper.appendChild(searchBar);

  const input = searchBar.querySelector('input');
  const searchIcon = searchBar.querySelector('.wm-search-icon');
  const clearIcon = searchBar.querySelector('.wm-search-clear');

  /* Toggle search/clear icons */
  input.addEventListener('input', () => {
    const hasText = input.value.trim().length > 0;
    searchIcon.style.display = hasText ? 'none' : '';
    clearIcon.style.display = hasText ? '' : 'none';
  });

  /* Clear button resets search */
  clearIcon.addEventListener('click', () => {
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    searchIcon.style.display = '';
    clearIcon.style.display = 'none';
    input.focus();
  });

  return input;
}

/**
 * Count visible cards across all visible sections
 */
function countVisibleCards() {
  const main = document.querySelector('main');
  let count = 0;
  main.querySelectorAll(
    '.cards-media > ul > li, .cards-gallery > ul > li, .cards-video > ul > li',
  ).forEach((li) => {
    if (li.classList.contains('wm-no-match')) return;
    const section = li.closest('.section');
    if (section && section.classList.contains('wm-hidden')) return;
    count += 1;
  });
  return count;
}

/**
 * Build filter tabs: All | Images | Galleries | Videos
 */
function buildFilterTabs() {
  const main = document.querySelector('main');
  const firstSection = main.querySelector('.section:first-of-type');
  if (!firstSection) return null;

  /* Identify content sections */
  const allSections = [...main.querySelectorAll('.section')];
  const contentSections = {
    images: allSections.find((s) => s.querySelector('.cards-media')),
    galleries: allSections.find((s) => s.querySelector('.cards-gallery')),
    videos: allSections.find((s) => s.querySelector('.cards-video')),
  };

  /* Tag them with data attributes for filtering */
  if (contentSections.images) contentSections.images.dataset.wmType = 'images';
  if (contentSections.galleries) contentSections.galleries.dataset.wmType = 'galleries';
  if (contentSections.videos) contentSections.videos.dataset.wmType = 'videos';

  const tabs = [
    { label: 'All', filter: 'all' },
    { label: 'Images', filter: 'images' },
    { label: 'Galleries', filter: 'galleries' },
    { label: 'Videos', filter: 'videos' },
  ];

  const tabBar = document.createElement('div');
  tabBar.className = 'wm-filter-tabs';

  const resultCount = document.createElement('div');
  resultCount.className = 'wm-result-count';

  function updateResultCount() {
    const count = countVisibleCards();
    resultCount.textContent = count > 0
      ? `Showing ${count} result${count !== 1 ? 's' : ''}`
      : '';
  }

  let activeFilter = 'all';

  function applyFilter(filter) {
    activeFilter = filter;
    const sectionTypes = ['images', 'galleries', 'videos'];
    sectionTypes.forEach((type) => {
      const section = contentSections[type];
      if (!section) return;
      if (filter === 'all' || filter === type) {
        section.classList.remove('wm-hidden');
      } else {
        section.classList.add('wm-hidden');
      }
    });

    tabBar.querySelectorAll('.wm-filter-tab').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });

    updateResultCount();
  }

  tabs.forEach((t) => {
    const btn = document.createElement('button');
    btn.className = `wm-filter-tab${t.filter === 'all' ? ' active' : ''}`;
    btn.textContent = t.label;
    btn.dataset.filter = t.filter;
    btn.addEventListener('click', () => applyFilter(t.filter));
    tabBar.appendChild(btn);
  });

  /* Insert after first section */
  firstSection.after(tabBar);
  tabBar.after(resultCount);

  /* Delayed count — blocks may still be decorating */
  setTimeout(updateResultCount, 500);
  setTimeout(updateResultCount, 1500);

  return {
    applyFilter,
    updateResultCount,
    getActiveFilter: () => activeFilter,
  };
}

/**
 * Wire up search to filter cards by text
 */
function wireSearch(searchInput, tabCtrl) {
  if (!searchInput) return;

  let debounce;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      const query = searchInput.value.trim().toLowerCase();
      const main = document.querySelector('main');
      const isPeopleQuery = query.includes('people') || query.includes('person') || query.includes('faces');

      /* People search — show only School, Kevin, Store, Chris image cards */
      if (isPeopleQuery) {
        const imgCards = [...main.querySelectorAll('.cards-media > ul > li')];
        imgCards.forEach((li, i) => {
          li.classList.toggle('wm-no-match', !PEOPLE_SEARCH_CARDS.includes(i));
        });
        /* Hide gallery and video cards for people search */
        main.querySelectorAll('.cards-gallery > ul > li, .cards-video > ul > li').forEach((li) => {
          li.classList.add('wm-no-match');
        });
        if (tabCtrl) tabCtrl.updateResultCount();
        return;
      }

      main.querySelectorAll(
        '.cards-media > ul > li, .cards-gallery > ul > li, .cards-video > ul > li',
      ).forEach((li) => {
        if (!query) {
          li.classList.remove('wm-no-match');
          return;
        }
        const text = li.textContent.toLowerCase();
        const imgs = li.querySelectorAll('img');
        let altMatch = false;
        imgs.forEach((img) => {
          if (img.alt && img.alt.toLowerCase().includes(query)) altMatch = true;
        });
        if (text.includes(query) || altMatch) {
          li.classList.remove('wm-no-match');
        } else {
          li.classList.add('wm-no-match');
        }
      });

      if (tabCtrl) tabCtrl.updateResultCount();
    }, 200);
  });
}

/* ===== Extras Toggle Panel ===== */
const EXTRAS_FEATURES = [
  { key: 'search', label: 'AI Search', desc: 'Smart tags, colors & people search' },
  { key: 'dm', label: 'Dynamic Media', desc: 'Smart crop & renditions' },
  { key: 'wf', label: 'Workfront', desc: 'Review & approval panel' },
  { key: 'analytics', label: 'Analytics', desc: 'Engagement dashboard' },
  { key: 'cf', label: 'Content Fragment', desc: 'CF model editor' },
  { key: 'ff', label: 'Firefly', desc: 'Generative fill overlay' },
  { key: 'forms', label: 'AEM Forms', desc: 'Asset request forms' },
  { key: 'ab', label: 'A/B Test', desc: 'Experiment configurator' },
];

function buildExtrasToggle(params) {
  const active = new Set((params.get('extras') || '').split(',').map((s) => s.trim()).filter(Boolean));

  /* Floating toggle button */
  const toggle = document.createElement('button');
  toggle.className = 'wm-extras-toggle';
  toggle.title = 'Configure AEM Features';
  toggle.innerHTML = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5">'
    + '<circle cx="10" cy="10" r="3"/>'
    + '<path d="M10 1v3M10 16v3M1 10h3M16 10h3M3.5 3.5l2 2M14.5 14.5l2 2M3.5 16.5l2-2M14.5 5.5l2-2"/>'
    + '</svg>';

  /* Panel */
  const panel = document.createElement('div');
  panel.className = 'wm-extras-panel';
  panel.innerHTML = '<div class="wm-extras-panel-header">'
    + '<strong>AEM Feature Toggles</strong>'
    + '<small>Select features to preview</small>'
    + '</div>'
    + '<div class="wm-extras-panel-body"></div>'
    + '<div class="wm-extras-panel-footer">'
    + '<button class="wm-extras-apply">Apply</button>'
    + '<button class="wm-extras-clear">Clear All</button>'
    + '</div>';

  const body = panel.querySelector('.wm-extras-panel-body');
  EXTRAS_FEATURES.forEach((f) => {
    const row = document.createElement('label');
    row.className = 'wm-extras-feature';
    row.innerHTML = `<input type="checkbox" value="${f.key}" ${active.has(f.key) ? 'checked' : ''}>
      <span class="wm-extras-feature-info">
        <span class="wm-extras-feature-name">${f.label}</span>
        <span class="wm-extras-feature-desc">${f.desc}</span>
      </span>`;
    body.appendChild(row);
  });

  /* Toggle panel open/close */
  toggle.addEventListener('click', () => {
    panel.classList.toggle('open');
    toggle.classList.toggle('active');
  });

  /* Apply button — reload with selected extras */
  panel.querySelector('.wm-extras-apply').addEventListener('click', () => {
    const checked = [...body.querySelectorAll('input:checked')].map((cb) => cb.value);
    const url = new URL(window.location.href);
    if (checked.length > 0) {
      url.searchParams.set('extras', checked.join(','));
    } else {
      url.searchParams.delete('extras');
    }
    window.location.href = url.toString();
  });

  /* Clear all */
  panel.querySelector('.wm-extras-clear').addEventListener('click', () => {
    body.querySelectorAll('input').forEach((cb) => { cb.checked = false; });
  });

  document.body.appendChild(toggle);
  document.body.appendChild(panel);
}

/**
 * Initialize everything
 */
export default function init() {
  document.body.classList.add('wm-media-library');
  overrideNav();

  const main = document.querySelector('main');
  if (!main) return;

  /* Wait until block ULs exist (cards-media/gallery/video blocks create ul > li) */
  function tryInit() {
    const hasCardUls = main.querySelector('.cards-media > ul, .cards-gallery > ul, .cards-video > ul');
    if (!hasCardUls) return false;

    const searchInput = buildSearchBar();
    const tabCtrl = buildFilterTabs();
    wireSearch(searchInput, tabCtrl);

    /* Load extras mode when ?extras is present */
    const params = new URLSearchParams(window.location.search);
    if (params.has('extras')) {
      document.body.classList.add('wm-extras');
      import('./wm-extras.js').then((mod) => mod.default());
    }

    /* Extras toggle panel */
    buildExtrasToggle(params);

    return true;
  }

  /* Try immediately */
  if (tryInit()) return;

  /* Otherwise observe and retry */
  const obs = new MutationObserver(() => {
    if (tryInit()) obs.disconnect();
  });
  obs.observe(main, { childList: true, subtree: true });
}
