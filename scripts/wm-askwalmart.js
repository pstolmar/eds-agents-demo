/* AskWalmart FAQ — tabbed categories + on-page search */
export default function decorateAskWalmart() {
  const main = document.querySelector('main');
  if (!main) return;

  /* ── collect all H2 + accordion pairs across all sections ── */
  const sections = [...main.querySelectorAll(':scope > .section')];
  const categories = [];

  sections.forEach((sec) => {
    const h2 = sec.querySelector('h2');
    const accordion = sec.querySelector('.accordion');
    if (h2 && accordion) {
      categories.push({ h2, accordion, section: sec });
    }
  });

  if (categories.length < 2) return;

  /* ── hero area: first section always has the H1 + image ── */
  const heroSection = sections[0];
  const wrapper = heroSection.querySelector('.default-content-wrapper');
  if (!wrapper) return;

  /* Remove the H2 and accordion from the hero section (keep H1+img+H4) */
  const heroH2 = heroSection.querySelector('h2');
  if (heroH2) heroH2.remove();
  const heroAccWrap = heroSection.querySelector('.accordion-wrapper');
  if (heroAccWrap) heroAccWrap.remove();

  /* ── build search bar ── */
  const searchBar = document.createElement('div');
  searchBar.className = 'aw-search-bar';
  searchBar.innerHTML = '<input type="text" placeholder="Search..." />'
    + '<button class="aw-search-btn">Search FAQs</button>';
  wrapper.appendChild(searchBar);
  const searchInput = searchBar.querySelector('input');

  /* ── build tab container ── */
  const tabContainer = document.createElement('div');
  tabContainer.className = 'aw-tabs';

  const tabBar = document.createElement('div');
  tabBar.className = 'aw-tab-bar';
  tabBar.setAttribute('role', 'tablist');

  const tabPanels = document.createElement('div');
  tabPanels.className = 'aw-tab-panels';

  const tabs = [];
  categories.forEach((cat, i) => {
    const label = cat.h2.textContent.trim();

    /* tab button */
    const tab = document.createElement('button');
    tab.className = 'aw-tab';
    tab.textContent = label;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    tab.dataset.index = i;
    tabBar.appendChild(tab);
    tabs.push(tab);

    /* panel */
    const panel = document.createElement('div');
    panel.className = 'aw-tab-panel';
    panel.setAttribute('role', 'tabpanel');
    if (i !== 0) panel.style.display = 'none';
    panel.appendChild(cat.accordion);
    tabPanels.appendChild(panel);

    /* remove remaining FAQ-only sections (not the hero section) */
    if (cat.section !== heroSection) {
      cat.section.remove();
    }
  });

  tabContainer.appendChild(tabBar);
  tabContainer.appendChild(tabPanels);

  /* insert tabs after the hero section */
  const tabSection = document.createElement('div');
  tabSection.className = 'section aw-faq-section';
  tabSection.appendChild(tabContainer);
  heroSection.after(tabSection);

  /* ── search filtering ── */
  function showAllItems() {
    tabPanels.querySelectorAll('details').forEach((d) => {
      d.style.display = '';
    });
    tabPanels.querySelectorAll('.aw-no-results')
      .forEach((n) => n.remove());
  }

  /* ── tab switching ── */
  function activateTab(idx) {
    tabs.forEach((t, j) => {
      t.setAttribute('aria-selected', j === idx ? 'true' : 'false');
    });
    [...tabPanels.children].forEach((p, j) => {
      p.style.display = j === idx ? '' : 'none';
    });
  }

  tabBar.addEventListener('click', (e) => {
    const tab = e.target.closest('.aw-tab');
    if (!tab) return;
    activateTab(Number(tab.dataset.index));
    /* clear search when switching tabs */
    searchInput.value = '';
    showAllItems();
  });

  function doSearch() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
      showAllItems();
      return;
    }

    /* show all panels so results are visible across categories */
    [...tabPanels.children].forEach((p) => {
      p.style.display = '';
    });
    tabs.forEach((t) => t.setAttribute('aria-selected', 'false'));

    let totalMatches = 0;
    [...tabPanels.children].forEach((panel) => {
      panel.querySelectorAll('.aw-no-results')
        .forEach((n) => n.remove());
      const items = panel.querySelectorAll('details');
      let panelMatches = 0;
      items.forEach((d) => {
        const text = d.textContent.toLowerCase();
        const match = text.includes(query);
        d.style.display = match ? '' : 'none';
        if (match) panelMatches += 1;
      });
      totalMatches += panelMatches;
      if (panelMatches === 0) panel.style.display = 'none';
    });

    if (totalMatches === 0) {
      const msg = document.createElement('p');
      msg.className = 'aw-no-results';
      msg.textContent = 'No results found. Try a different search.';
      tabPanels.prepend(msg);
    }
  }

  searchInput.addEventListener('input', () => {
    clearTimeout(searchInput.debounce);
    searchInput.debounce = setTimeout(doSearch, 250);
  });
  const searchBtn = searchBar.querySelector('.aw-search-btn');
  searchBtn.addEventListener('click', doSearch);
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doSearch();
  });

  /* ── remove trailing junk (Adobe tracking link) ── */
  main.querySelectorAll('a[href*="demdex.net"]').forEach((a) => {
    const p = a.closest('p');
    if (p) p.remove();
  });
}
