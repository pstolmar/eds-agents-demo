/**
 * News Filter Block — renders topic filter buttons for news listing.
 * Filters cards in the next sibling section.
 */

const TOPICS = [
  'Business', 'Community', 'Finance', 'Health & Wellness',
  'Innovation', 'International', 'Working at Walmart',
];

export default function decorate(block) {
  block.textContent = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'news-filter-bar';

  const searchWrap = document.createElement('div');
  searchWrap.className = 'news-filter-search';
  searchWrap.innerHTML = '<input type="text" placeholder="Search news..." class="news-search-input">';
  wrapper.appendChild(searchWrap);

  const topicsWrap = document.createElement('div');
  topicsWrap.className = 'news-filter-topics';

  function filterCards() {
    const activeTopics = [...topicsWrap.querySelectorAll('.news-topic-btn.active')]
      .map((b) => b.dataset.topic.toLowerCase());
    const searchText = block.querySelector('.news-search-input')?.value.toLowerCase() || '';
    const isFiltering = activeTopics.length > 0 || searchText.length > 0;

    const nextSection = block.closest('.section')?.nextElementSibling;
    if (!nextSection) return;

    const cardsBlock = nextSection.querySelector('.cards');
    const showMoreBtn = cardsBlock?.querySelector('.cards-show-more');
    const cards = nextSection.querySelectorAll('.cards > ul > li');

    cards.forEach((card) => {
      const text = card.textContent.toLowerCase();
      const matchesTopic = activeTopics.length === 0
        || activeTopics.some((t) => text.includes(t));
      const matchesSearch = !searchText || text.includes(searchText);

      if (isFiltering) {
        /* When filtering: bypass pagination, show/hide based on filter match */
        card.classList.remove('cards-hidden');
        card.style.display = (matchesTopic && matchesSearch) ? '' : 'none';
      } else {
        /* No filter: restore inline display and let pagination CSS handle visibility */
        card.style.display = '';
      }
    });

    /* Hide "Show More" while filtering, restore when cleared */
    if (showMoreBtn) {
      showMoreBtn.style.display = isFiltering ? 'none' : '';
    }

    /* When clearing filters, re-apply pagination hidden state */
    if (!isFiltering) {
      cards.forEach((card, i) => {
        if (i >= 4) card.classList.add('cards-hidden');
        else card.classList.remove('cards-hidden');
      });
      if (showMoreBtn) showMoreBtn.style.display = '';
    }
  }

  TOPICS.forEach((topic) => {
    const btn = document.createElement('button');
    btn.className = 'news-topic-btn';
    btn.textContent = topic;
    btn.dataset.topic = topic;
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      filterCards();
    });
    topicsWrap.appendChild(btn);
  });

  const clearBtn = document.createElement('button');
  clearBtn.className = 'news-clear-btn';
  clearBtn.textContent = 'Clear all';
  clearBtn.addEventListener('click', () => {
    topicsWrap.querySelectorAll('.news-topic-btn').forEach((b) => b.classList.remove('active'));
    filterCards();
  });
  topicsWrap.appendChild(clearBtn);

  wrapper.appendChild(topicsWrap);
  block.appendChild(wrapper);

  const searchInput = block.querySelector('.news-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', filterCards);
  }
}
