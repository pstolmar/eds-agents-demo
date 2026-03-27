import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeSearch(nav) {
  const overlay = nav.querySelector('.nav-search-overlay');
  if (overlay) overlay.classList.remove('active');
}

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
    closeSearch(nav);
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * Builds the search overlay and wires up interactions
 * @param {Element} nav The nav element
 */
function buildSearch(nav) {
  const navTools = nav.querySelector('.nav-tools');
  if (!navTools) return;

  const searchIcon = navTools.querySelector('.icon-search');
  if (!searchIcon) return;

  // Make the search icon container a clickable button
  const searchBtn = searchIcon.closest('a') || searchIcon.closest('p') || searchIcon.parentElement;
  searchBtn.classList.add('nav-search-btn');
  searchBtn.setAttribute('role', 'button');
  searchBtn.setAttribute('tabindex', '0');
  if (searchBtn.tagName === 'A') searchBtn.removeAttribute('href');

  // Create overlay DOM
  const overlay = document.createElement('div');
  overlay.className = 'nav-search-overlay';
  overlay.innerHTML = `<div class="nav-search-bar">
      <div class="nav-search-container">
        <input type="text" class="nav-search-input" placeholder="Search" autocomplete="off" />
        <button class="nav-search-close" aria-label="Close search">\u00d7</button>
      </div>
      <div class="nav-search-results"></div>
    </div>
    <div class="nav-search-backdrop"></div>`;
  nav.append(overlay);

  let queryIndex = null;

  async function fetchIndex() {
    if (queryIndex) return queryIndex;
    try {
      const resp = await fetch('/query-index.json');
      const json = await resp.json();
      const isWmEds2 = window.location.pathname.includes('/wm-eds/2/');
      queryIndex = (json.data || []).filter((item) => {
        if (item.path === '/nav') return false;
        if (isWmEds2) return item.path.includes('/wm-eds/2/');
        return true;
      });
    } catch {
      queryIndex = [];
    }
    return queryIndex;
  }

  function renderResults(results, container) {
    if (results.length === 0) {
      container.innerHTML = '<p class="nav-search-no-results">No results found</p>';
      return;
    }
    container.innerHTML = results.map((r) => {
      const desc = r.description
        ? r.description.replace(/<[^>]*>/g, '').substring(0, 140)
        : '';
      return `<a href="${r.path}" class="nav-search-result">
        <span class="nav-search-result-title">${r.title}</span>
        ${desc ? `<span class="nav-search-result-desc">${desc}</span>` : ''}
      </a>`;
    }).join('');
  }

  const input = overlay.querySelector('.nav-search-input');
  const resultsEl = overlay.querySelector('.nav-search-results');
  const closeBtn = overlay.querySelector('.nav-search-close');
  const backdrop = overlay.querySelector('.nav-search-backdrop');

  let debounce;
  input.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(async () => {
      const query = input.value.trim().toLowerCase();
      if (query.length < 2) {
        resultsEl.innerHTML = '';
        return;
      }
      const index = await fetchIndex();
      const filtered = index.filter(
        (item) => (item.title && item.title.toLowerCase().includes(query))
          || (item.description && item.description.toLowerCase().includes(query)),
      );
      renderResults(filtered, resultsEl);
    }, 250);
  });

  function toggleSearchOverlay() {
    const isActive = overlay.classList.toggle('active');
    if (isActive) {
      input.value = '';
      resultsEl.innerHTML = '';
      setTimeout(() => input.focus(), 100);
    }
  }

  searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSearchOverlay();
  });

  closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
  backdrop.addEventListener('click', () => overlay.classList.remove('active'));
}

/**
 * Rebuilds nav DOM with Deloitte structure (brand, sections, tools)
 */
function rebuildDeloitteNav(nav) {
  const brand = nav.querySelector('.nav-brand');
  const sections = nav.querySelector('.nav-sections');
  const tools = nav.querySelector('.nav-tools');

  /* Brand: Deloitte SVG logo */
  if (brand) {
    brand.innerHTML = '<p><a href="/test/deloitte/us/en/">Deloitte</a></p>';
  }

  /* Sections: primary nav items with sub-links */
  if (sections) {
    sections.innerHTML = `<div class="default-content-wrapper"><ul>
      <li><p>Who we are</p><ul>
        <li><a href="#">About Deloitte</a></li>
        <li><a href="#">Our shared values</a></li>
        <li><a href="#">Facts &amp; figures</a></li>
        <li><a href="#">Governance</a></li>
        <li><a href="#">Newsroom</a></li>
        <li><a href="#">Contact us</a></li>
      </ul></li>
      <li><p>What we do</p><ul>
        <li><a href="#">AI &amp; Engineering</a></li>
        <li><a href="#">Audit &amp; Assurance</a></li>
        <li><a href="#">Consulting</a></li>
        <li><a href="#">Financial Advisory</a></li>
        <li><a href="#">Risk Advisory</a></li>
        <li><a href="#">Tax &amp; Legal</a></li>
        <li><a href="#">Case Studies</a></li>
        <li><a href="#">All Services</a></li>
      </ul></li>
      <li><p>Our Thinking</p><ul>
        <li><a href="/content/test/deloitte/us/en/insights/index">Deloitte Insights</a></li>
        <li><a href="#">Industry research</a></li>
        <li><a href="/content/test/deloitte/us/en/dbriefs-webcasts/upcoming-webcasts/index">Dbriefs webcasts</a></li>
        <li><a href="#">Tech Trends 2026</a></li>
        <li><a href="#">TMT Predictions</a></li>
        <li><a href="#">CFO Insights</a></li>
      </ul></li>
      <li><p>Careers</p><ul>
        <li><a href="#">Job search</a></li>
        <li><a href="#">Students &amp; early careers</a></li>
        <li><a href="#">Experienced professionals</a></li>
        <li><a href="#">Life at Deloitte</a></li>
        <li><a href="#">Alumni</a></li>
      </ul></li>
    </ul></div>`;

    /* Re-apply nav-drop + event listeners */
    sections.querySelectorAll('.default-content-wrapper > ul > li').forEach((item) => {
      if (item.querySelector('ul')) {
        item.classList.add('nav-drop');
        item.setAttribute('aria-expanded', 'false');
        item.addEventListener('mouseenter', () => {
          if (isDesktop.matches) {
            sections.querySelectorAll('.nav-drop').forEach((d) => {
              d.setAttribute('aria-expanded', 'false');
              delete d.dataset.locked;
            });
            item.setAttribute('aria-expanded', 'true');
          }
        });
        item.addEventListener('mouseleave', () => {
          if (isDesktop.matches && item.dataset.locked !== 'true') {
            item.setAttribute('aria-expanded', 'false');
          }
        });
        item.addEventListener('click', () => {
          if (isDesktop.matches) {
            const isLocked = item.dataset.locked === 'true';
            sections.querySelectorAll('.nav-drop').forEach((d) => delete d.dataset.locked);
            if (isLocked) {
              item.setAttribute('aria-expanded', 'false');
            } else {
              sections.querySelectorAll('.nav-drop').forEach((d) => d.setAttribute('aria-expanded', 'false'));
              item.setAttribute('aria-expanded', 'true');
              item.dataset.locked = 'true';
            }
          }
        });
      }
    });
  }

  /* Tools: placeholder for icons (built by decorateDeloitteNav) */
  if (tools) {
    tools.innerHTML = '';
  }

  /* Close dropdowns when clicking outside */
  document.addEventListener('click', (e) => {
    if (isDesktop.matches && !nav.contains(e.target)) {
      sections?.querySelectorAll('.nav-drop').forEach((d) => {
        d.setAttribute('aria-expanded', 'false');
        delete d.dataset.locked;
      });
    }
  });
}

/**
 * Decorates the Deloitte-specific nav with logo, mega-menu, and toolbar icons
 */
function decorateDeloitteNav(nav) {
  /* Replace brand text with SVG logo */
  const brand = nav.querySelector('.nav-brand');
  if (brand) {
    const brandLink = brand.querySelector('a');
    if (brandLink) {
      const img = document.createElement('img');
      img.src = '/icons/deloitte-logo.svg';
      img.alt = 'Deloitte';
      img.width = 100;
      img.height = 19;
      img.loading = 'eager';
      brandLink.textContent = '';
      brandLink.appendChild(img);
    }
  }

  /* Build Deloitte toolbar icons */
  const tools = nav.querySelector('.nav-tools');
  if (tools) {
    tools.innerHTML = '';

    const icons = [
      { label: 'Search', cls: 'dt-search', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10.5" cy="10.5" r="7"/><path d="m15.5 15.5 5 5"/></svg>' },
      { label: 'US - EN', cls: 'dt-globe', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><ellipse cx="12" cy="12" rx="4" ry="10"/></svg>' },
      { label: 'Contact', cls: 'dt-contact', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>' },
      { label: 'My Deloitte', cls: 'dt-profile', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>' },
    ];

    icons.forEach(({ label, cls, svg }) => {
      const btn = document.createElement('button');
      btn.className = `dt-tool-btn ${cls}`;
      btn.setAttribute('aria-label', label);
      btn.innerHTML = svg;
      if (cls === 'dt-globe') {
        const span = document.createElement('span');
        span.className = 'dt-locale-label';
        span.textContent = 'US';
        btn.appendChild(span);
      }
      tools.appendChild(btn);
    });
  }

  /* Wire up mega-menu panel animation */
  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    const items = navSections.querySelectorAll('.default-content-wrapper > ul > li');
    items.forEach((item) => {
      const subUl = item.querySelector('ul');
      if (!subUl) return;

      /* Wrap sub-ul in a mega-menu panel for animation */
      const panel = document.createElement('div');
      panel.className = 'dt-mega-panel';
      /* Organise links into columns */
      const links = subUl.querySelectorAll('a');
      const colWrap = document.createElement('div');
      colWrap.className = 'dt-mega-links';
      links.forEach((a, i) => {
        const linkItem = document.createElement('a');
        linkItem.href = a.href;
        linkItem.textContent = a.textContent;
        linkItem.style.setProperty('--i', i);
        colWrap.appendChild(linkItem);
      });
      panel.appendChild(colWrap);

      /* Add featured right-side content for select panels */
      const label = (item.querySelector('p') || item.querySelector('a'))?.textContent?.trim();
      const featured = document.createElement('div');
      featured.className = 'dt-mega-featured';
      if (label === 'What we do') {
        featured.innerHTML = `<div class="dt-featured-card">
          <h4>Industries</h4>
          <a href="#">Consumer</a><a href="#">Energy, Resources &amp; Industrials</a>
          <a href="#">Financial Services</a><a href="#">Government &amp; Public Services</a>
          <a href="#">Life Sciences &amp; Health Care</a><a href="#">Technology, Media &amp; Telecom</a>
        </div>`;
        panel.appendChild(featured);
      } else if (label === 'Our Thinking') {
        featured.innerHTML = `<div class="dt-featured-card">
          <h4>Featured</h4>
          <a href="/content/test/deloitte/us/en/insights/index">2026 Global Human Capital Trends</a>
          <a href="/content/test/deloitte/us/en/insights/index">Tech Trends 2026</a>
          <a href="/content/test/deloitte/us/en/insights/index">2026 Industry Outlooks</a>
          <a href="/content/test/deloitte/us/en/dbriefs-webcasts/upcoming-webcasts/index">Upcoming Dbriefs</a>
        </div>`;
        panel.appendChild(featured);
      } else if (label === 'Careers') {
        featured.innerHTML = `<div class="dt-featured-card">
          <h4>Explore</h4>
          <a href="#">Why Deloitte</a>
          <a href="#">Benefits &amp; Well-being</a>
          <a href="#">Inclusion &amp; Diversity</a>
        </div>`;
        panel.appendChild(featured);
      }

      subUl.replaceWith(panel);

      /* Add chevron icon */
      const trigger = item.querySelector('p') || item.querySelector('a');
      if (trigger && !trigger.querySelector('.dt-chevron')) {
        const chevron = document.createElement('span');
        chevron.className = 'dt-chevron';
        chevron.innerHTML = '<svg viewBox="0 0 12 8" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m1 1.5 5 5 5-5"/></svg>';
        trigger.appendChild(chevron);
      }
    });
  }
}

/**
 * Decorates a nav element from a fragment
 */
function decorateNav(fragment, id) {
  const nav = document.createElement('nav');
  nav.id = id;
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  /* Strip all pill-button styling from nav links */
  nav.querySelectorAll('.button').forEach((btn) => {
    btn.classList.remove('button', 'primary');
  });
  nav.querySelectorAll('.button-container').forEach((bc) => {
    bc.classList.remove('button-container');
  });

  /* Normalise internal hrefs: strip /content prefix so links work on publish */
  nav.querySelectorAll('a[href^="/content/"]').forEach((a) => {
    a.setAttribute('href', a.getAttribute('href').replace('/content/', '/'));
  });

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections
      .querySelectorAll(':scope .default-content-wrapper > ul > li')
      .forEach((navSection) => {
        if (navSection.querySelector('ul')) {
          navSection.classList.add('nav-drop');
        }
        /* Hover-to-open on desktop */
        navSection.addEventListener('mouseenter', () => {
          if (isDesktop.matches) {
            toggleAllNavSections(navSections);
            navSections.querySelectorAll('.nav-drop').forEach((d) => delete d.dataset.locked);
            navSection.setAttribute('aria-expanded', 'true');
          }
        });
        navSection.addEventListener('mouseleave', () => {
          if (isDesktop.matches && navSection.dataset.locked !== 'true') {
            navSection.setAttribute('aria-expanded', 'false');
          }
        });
        /* Click-to-lock on desktop */
        navSection.addEventListener('click', () => {
          if (isDesktop.matches) {
            const isLocked = navSection.dataset.locked === 'true';
            navSections.querySelectorAll('.nav-drop').forEach((d) => delete d.dataset.locked);
            if (isLocked) {
              navSection.setAttribute('aria-expanded', 'false');
            } else {
              toggleAllNavSections(navSections);
              navSection.setAttribute('aria-expanded', 'true');
              navSection.dataset.locked = 'true';
            }
          }
        });
      });
  }

  document.addEventListener('click', (e) => {
    if (isDesktop.matches && !nav.contains(e.target)) {
      toggleAllNavSections(navSections, false);
      navSections.querySelectorAll('.nav-drop').forEach((d) => delete d.dataset.locked);
    }
  });

  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="${id}"
    aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => {
    toggleMenu(nav, navSections, isDesktop.matches);
  });

  return nav;
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const { pathname } = window.location;
  const isWmEds2 = pathname.includes('/wm-eds/2/') || pathname.includes('media-library');

  const isDeloitte = pathname.includes('/test/deloitte/');

  let navPath;
  if (navMeta) {
    navPath = new URL(navMeta, window.location).pathname;
  } else if (isWmEds2) {
    navPath = '/content/wm-eds/2/main-nav';
  } else {
    navPath = '/nav';
  }

  let fragment = await loadFragment(navPath);
  // Fallback: try with/without /content/ prefix
  if (!fragment) {
    const altPath = navPath.startsWith('/content/')
      ? navPath.replace('/content/', '/')
      : `/content${navPath}`;
    fragment = await loadFragment(altPath);
  }
  block.textContent = '';

  const nav = decorateNav(fragment, 'nav');

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';

  if (isDeloitte) {
    navWrapper.classList.add('deloitte-nav');
    rebuildDeloitteNav(nav);
    decorateDeloitteNav(nav);
  } else {
    buildSearch(nav);
    /* Add Shop link next to search (matches source nav) */
    const mainTools = nav.querySelector('.nav-tools');
    if (mainTools) {
      const shopLink = document.createElement('a');
      shopLink.href = 'https://www.walmart.com/';
      shopLink.target = '_blank';
      shopLink.rel = 'noopener';
      shopLink.className = 'nav-shop-link';
      shopLink.textContent = 'Shop';
      mainTools.append(shopLink);
    }
  }

  navWrapper.append(nav);
  block.append(navWrapper);

  /* IIAJ sub-nav: only on supplier/IIAJ pages, not media-library or other wm-eds/2 pages */
  const needsSubNav = isWmEds2 && window.location.pathname.includes('/suppliers/');
  if (needsSubNav) {
    let subFrag = await loadFragment('/content/wm-eds/2/nav');
    if (!subFrag) subFrag = await loadFragment('/wm-eds/2/nav');
    if (subFrag) {
      const subNav = decorateNav(subFrag, 'sub-nav');
      const subWrapper = document.createElement('div');
      subWrapper.className = 'nav-wrapper sub-nav-wrapper';
      subWrapper.append(subNav);
      block.append(subWrapper);
    }
  }
}
