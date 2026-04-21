const PAGE_SIZE = 6;

function getMode() {
  const param = new URLSearchParams(window.location.search).get('cards');
  if (param === 'scroll' || param === 'paginate') return param;
  return 'inline';
}

function applyScrollMode(block) {
  block.classList.add('cards--scroll');
  const rows = Array.from(block.children);
  rows.forEach((row) => row.classList.add('cards--hidden'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('cards--hidden');
        entry.target.classList.add('cards--visible');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.05 });

  rows.forEach((row) => io.observe(row));
}

function buildPaginationBar(page, totalPages, onPrev, onNext) {
  const bar = document.createElement('div');
  bar.className = 'cards-pagination';
  bar.innerHTML = `
    <button class="cards-prev" aria-label="Previous page"${page === 0 ? ' disabled' : ''}>ê Prev</button>
    <span class="cards-page-info">Page ${page + 1} of ${totalPages}</span>
    <button class="cards-next" aria-label="Next page"${page >= totalPages - 1 ? ' disabled' : ''}>Next í</button>
  `;
  bar.querySelector('.cards-prev').addEventListener('click', onPrev);
  bar.querySelector('.cards-next').addEventListener('click', onNext);
  return bar;
}

function applyPaginateMode(block) {
  const rows = Array.from(block.children);
  const total = rows.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  let page = 0;

  const wrapper = document.createElement('div');
  wrapper.className = 'cards-paginate-wrapper';
  block.parentNode.insertBefore(wrapper, block);
  wrapper.appendChild(block);

  function render() {
    const start = page * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    rows.forEach((row, i) => {
      row.style.display = (i >= start && i < end) ? '' : 'none';
    });
    // eslint-disable-next-line no-use-before-define
    const newTop = buildPaginationBar(page, totalPages, onPrev, onNext);
    // eslint-disable-next-line no-use-before-define
    const newBottom = buildPaginationBar(page, totalPages, onPrev, onNext);
    topBar.replaceWith(newTop);
    bottomBar.replaceWith(newBottom);
    // eslint-disable-next-line no-use-before-define
    topBar = newTop;
    // eslint-disable-next-line no-use-before-define
    bottomBar = newBottom;
    wrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function onPrev() {
    if (page > 0) { page -= 1; render(); }
  }

  function onNext() {
    if (page < totalPages - 1) { page += 1; render(); }
  }

  let topBar = buildPaginationBar(page, totalPages, onPrev, onNext);
  let bottomBar = buildPaginationBar(page, totalPages, onPrev, onNext);
  wrapper.prepend(topBar);
  wrapper.append(bottomBar);

  block.classList.add('cards--paginate');
  render();
}

function addModeToggle(block) {
  const current = getMode();
  const modes = ['inline', 'scroll', 'paginate'];
  const nav = document.createElement('div');
  nav.className = 'cards-mode-toggle';
  nav.innerHTML = modes.map((m) => `<a href="?cards=${m}" class="cards-mode-btn${m === current ? ' active' : ''}">${m}</a>`).join('');
  block.closest('.section').querySelector('h2').after(nav);
}

export default async function decorate(block) {
  const mode = getMode();
  addModeToggle(block);
  if (mode === 'scroll') applyScrollMode(block);
  else if (mode === 'paginate') applyPaginateMode(block);
}
