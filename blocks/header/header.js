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
      queryIndex = (json.data || []).filter((item) => item.path !== '/nav');
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
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
      navSection.addEventListener('click', () => {
        if (isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });
  }

  // Close dropdowns when clicking outside the nav
  document.addEventListener('click', (e) => {
    if (isDesktop.matches && !nav.contains(e.target)) {
      toggleAllNavSections(navSections, false);
    }
  });

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  // build search overlay
  buildSearch(nav);

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
