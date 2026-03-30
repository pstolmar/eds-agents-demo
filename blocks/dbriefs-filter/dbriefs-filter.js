const CARDS_PER_PAGE = 12;
const FILTER_KEY_PARAM = 'activeFacetKey';
const FILTER_VALUE_PARAM = 'activeFacetValue';

/* Primary filter tabs — maps display name to data-category value */
const PRIMARY_TABS = [
  { label: 'All', key: null, value: null },
  { label: 'Financial Executives', key: 'primary-secondary-subject', value: 'Financial Executives' },
  { label: 'Tax Executives', key: 'primary-secondary-subject', value: 'Tax Executives' },
  { label: 'Industries', key: 'primary-secondary-subject', value: 'Industries' },
  { label: 'Private Companies', key: 'primary-secondary-subject', value: 'Private Companies' },
  { label: 'M&A and Restructuring', key: 'primary-secondary-subject', value: 'M&A and Restructuring' },
  { label: 'Technology Executives', key: 'primary-secondary-subject', value: 'Technology Executives' },
];

function esc(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function parseCards(block) {
  const rows = [...block.children];
  const cards = [];
  rows.forEach((row) => {
    const cols = [...row.children];
    if (cols.length < 2) return;
    const imgCol = cols[0];
    const textCol = cols[1];
    const picture = imgCol.querySelector('picture');
    const img = imgCol.querySelector('img');
    const h3 = textCol.querySelector('h3');
    const paragraphs = [...textCol.querySelectorAll('p')];
    const links = [...textCol.querySelectorAll('a')];

    /* Extract structured data from paragraphs */
    let date = '';
    let eventType = '';
    let description = '';
    let categories = '';
    let registerUrl = '';
    let detailUrl = '';

    paragraphs.forEach((p) => {
      const text = p.textContent.trim();
      if (!text) return;
      /* Skip paragraphs that are just a link (handled separately) */
      if (p.children.length === 1 && p.children[0].tagName === 'A') return;
      if (!date && (/^\d{1,2}\s\w{3,4}\.?\s\d{4}|^[A-Z][a-z]{2}\.\s\d{1,2}\s[A-Z]/.test(text)
        || /\d{1,2}:\d{2}\s[ap]\.m\./.test(text)
        || /20\d{2},/.test(text))) {
        date = text;
      } else if (/^Virtual\s*[:|]/i.test(text)) {
        eventType = text;
      } else if (/^categories:/i.test(text)) {
        categories = text.replace(/^categories:\s*/i, '');
      } else if (!description && text.length > 20) {
        description = text;
      }
    });

    links.forEach((a) => {
      const t = a.textContent.trim().toLowerCase();
      if (t === 'register') registerUrl = a.href;
      else if (t === 'view details') detailUrl = a.href;
      else if (!detailUrl) detailUrl = a.href;
    });

    cards.push({
      title: h3?.textContent?.trim() || '',
      date,
      eventType,
      description,
      categories: categories ? categories.split(',').map((c) => c.trim()) : [],
      registerUrl,
      detailUrl,
      imgSrc: img?.getAttribute('src') || '',
      imgAlt: img?.getAttribute('alt') || '',
      picture: picture ? picture.cloneNode(true) : null,
    });
  });
  return cards;
}

function getActiveFilter() {
  const params = new URLSearchParams(window.location.search);
  const key = params.get(FILTER_KEY_PARAM);
  const value = params.get(FILTER_VALUE_PARAM);
  if (key && value) return { key, value };
  return null;
}

function setActiveFilter(key, value) {
  const url = new URL(window.location.href);
  if (key && value) {
    url.searchParams.set(FILTER_KEY_PARAM, key);
    url.searchParams.set(FILTER_VALUE_PARAM, value);
  } else {
    url.searchParams.delete(FILTER_KEY_PARAM);
    url.searchParams.delete(FILTER_VALUE_PARAM);
  }
  window.history.pushState({}, '', url);
}

function filterCards(allCards, filter) {
  if (!filter) return allCards;
  return allCards.filter((card) => card.categories
    .some((cat) => cat.toLowerCase() === filter.value.toLowerCase()));
}

function countByTab(allCards) {
  const counts = {};
  counts.All = allCards.length;
  PRIMARY_TABS.forEach((tab) => {
    if (tab.value) {
      counts[tab.label] = allCards.filter((c) => c.categories
        .some((cat) => cat.toLowerCase() === tab.value.toLowerCase())).length;
    }
  });
  return counts;
}

function createCardEl(card) {
  const li = document.createElement('li');
  li.className = 'dbriefs-card';

  /* Date badge */
  const dateParts = card.date.match(/(\d{1,2})\s(\w{3,4}\.?)/);
  const badge = dateParts
    ? `<span class="dbriefs-card-badge"><span class="dbriefs-badge-day">${dateParts[1]}</span><span class="dbriefs-badge-month">${dateParts[2]}</span></span>`
    : '';

  let imgHtml = '';
  if (card.picture) {
    imgHtml = card.picture.outerHTML;
  } else if (card.imgSrc) {
    imgHtml = `<img src="${esc(card.imgSrc)}" alt="${esc(card.imgAlt)}" loading="lazy">`;
  }

  li.innerHTML = `
    <div class="dbriefs-card-image">
      ${imgHtml}
      ${badge}
    </div>
    <div class="dbriefs-card-body">
      <h3>${esc(card.title)}</h3>
      ${card.eventType ? `<p class="dbriefs-card-type">${esc(card.eventType)}</p>` : ''}
      ${card.date ? `<p class="dbriefs-card-date">${esc(card.date)}</p>` : ''}
      ${card.description ? `<p class="dbriefs-card-desc">${esc(card.description)}</p>` : ''}
      <div class="dbriefs-card-actions">
        ${card.registerUrl ? `<a href="${esc(card.registerUrl)}" class="dbriefs-btn-register" target="_blank" rel="noopener">Register</a>` : ''}
        ${card.detailUrl ? `<a href="${esc(card.detailUrl)}" class="dbriefs-btn-details">View details</a>` : ''}
      </div>
    </div>
  `;
  return li;
}

function renderCards(container, cards, showMoreBtn, page = 1) {
  const visible = cards.slice(0, page * CARDS_PER_PAGE);
  container.replaceChildren();
  visible.forEach((card) => container.appendChild(createCardEl(card)));
  if (showMoreBtn) {
    showMoreBtn.style.display = visible.length < cards.length ? '' : 'none';
  }
  return visible.length;
}

function buildFilterTabs(counts, activeFilter) {
  const nav = document.createElement('nav');
  nav.className = 'dbriefs-tabs';
  PRIMARY_TABS.forEach((tab) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'dbriefs-tab';
    const count = counts[tab.label] || 0;
    btn.textContent = `${tab.label} (${count})`;
    btn.dataset.key = tab.key || '';
    btn.dataset.value = tab.value || '';
    if ((!activeFilter && !tab.value)
      || (activeFilter && activeFilter.value === tab.value)) {
      btn.classList.add('active');
    }
    nav.appendChild(btn);
  });
  return nav;
}

export default function decorate(block) {
  const allCards = parseCards(block);
  block.textContent = '';

  /* Read initial filter from URL */
  let activeFilter = getActiveFilter();
  let currentPage = 1;

  const counts = countByTab(allCards);

  /* Filter tabs */
  const tabs = buildFilterTabs(counts, activeFilter);
  block.appendChild(tabs);

  /* Results count */
  const resultsBar = document.createElement('div');
  resultsBar.className = 'dbriefs-results-bar';
  block.appendChild(resultsBar);

  /* Card grid */
  const grid = document.createElement('ul');
  grid.className = 'dbriefs-grid';
  block.appendChild(grid);

  /* Show More */
  const showMore = document.createElement('div');
  showMore.className = 'dbriefs-show-more';
  showMore.innerHTML = '<button type="button">Show more</button>';
  block.appendChild(showMore);

  function update() {
    const filtered = filterCards(allCards, activeFilter);
    currentPage = 1;
    renderCards(grid, filtered, showMore, currentPage);
    resultsBar.textContent = `Showing ${Math.min(CARDS_PER_PAGE, filtered.length)} of ${filtered.length} webcasts`;

    /* Update active tab */
    tabs.querySelectorAll('.dbriefs-tab').forEach((btn) => {
      btn.classList.toggle(
        'active',
        (!activeFilter && !btn.dataset.value)
        || (activeFilter && btn.dataset.value === activeFilter.value),
      );
    });
  }

  /* Tab click handler */
  tabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.dbriefs-tab');
    if (!btn) return;
    const { key, value } = btn.dataset;
    activeFilter = key && value ? { key, value } : null;
    setActiveFilter(key || null, value || null);
    update();
  });

  /* Show More handler */
  showMore.querySelector('button').addEventListener('click', () => {
    currentPage += 1;
    const filtered = filterCards(allCards, activeFilter);
    const shown = renderCards(grid, filtered, showMore, currentPage);
    resultsBar.textContent = `Showing ${shown} of ${filtered.length} webcasts`;
  });

  /* Browser back/forward */
  window.addEventListener('popstate', () => {
    activeFilter = getActiveFilter();
    update();
  });

  update();
}
