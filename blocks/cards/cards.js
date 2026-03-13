import { createOptimizedPicture } from '../../scripts/aem.js';

const MONTHS = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];
const CARDS_PER_ROW = 4;

function extractDateFromUrl(url) {
  const match = url?.match(/\/(\d{4})\/(\d{2})\/(\d{2})\//);
  if (!match) return null;
  const [, y, m, d] = match;
  return `${MONTHS[parseInt(m, 10) - 1]} ${parseInt(d, 10)}, ${y}`;
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      const hasPic = div.querySelector('picture') || div.querySelector('img');
      if (div.children.length === 1 && hasPic) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });

    /* If card body has a link, make whole card clickable and extract date */
    const body = li.querySelector('.cards-card-body');
    const bodyLink = body?.querySelector('a');
    if (bodyLink) {
      const href = bodyLink.getAttribute('href');

      /* Extract date from news-style URL */
      const dateStr = extractDateFromUrl(href);
      if (dateStr) {
        const dateEl = document.createElement('p');
        dateEl.className = 'cards-card-date';
        dateEl.textContent = dateStr;
        body.prepend(dateEl);
      }

      /* Remove link paragraph — whole card becomes clickable */
      const linkP = bodyLink.closest('p');
      if (linkP) linkP.remove();

      /* Wrap li contents in an anchor */
      const cardLink = document.createElement('a');
      cardLink.href = href;
      cardLink.className = 'cards-card-link';
      while (li.firstChild) cardLink.appendChild(li.firstChild);
      li.appendChild(cardLink);
    }

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]),
    );
  });

  block.replaceChildren(ul);

  /* Show More — only when there are more cards than one row */
  const allCards = [...ul.querySelectorAll('li')];
  if (allCards.length > CARDS_PER_ROW) {
    let visible = CARDS_PER_ROW;
    allCards.forEach((card, i) => {
      if (i >= CARDS_PER_ROW) card.classList.add('cards-hidden');
    });

    const showMore = document.createElement('div');
    showMore.className = 'cards-show-more';
    showMore.innerHTML = '<button type="button">Show More</button>';
    block.appendChild(showMore);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function revealNextRow(animClass) {
      const next = Math.min(visible + CARDS_PER_ROW, allCards.length);
      for (let i = visible; i < next; i += 1) {
        const card = allCards[i];
        card.classList.remove('cards-hidden');
        if (!reducedMotion) {
          card.classList.add(animClass);
          card.style.animationDelay = `${(i - visible) * 0.12}s`;
        }
      }
      visible = next;
      if (visible >= allCards.length) showMore.style.display = 'none';
    }

    showMore.querySelector('button').addEventListener('click', () => {
      revealNextRow('cards-reveal');
    });

    /* Scroll-effects toggle: ?extras=scroll enables IntersectionObserver auto-reveal */
    const extras = new URLSearchParams(window.location.search).get('extras') || '';
    const scrollEnabled = extras.split(',').some((t) => t.trim() === 'scroll');
    if (scrollEnabled) {
      block.classList.add('cards-scroll-active');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && visible < allCards.length) {
            revealNextRow('cards-scroll-reveal');
          }
        });
      }, { rootMargin: '200px 0px' });
      observer.observe(showMore);
    }
  }
}
