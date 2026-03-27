/* eslint-disable */
/* global WebImporter */

/**
 * Parser: dbriefs-filter
 * Extracts webcast cards from the Angular-rendered Dbriefs page.
 * Converts them into a dbriefs-filter block with image + content rows.
 */
export default function parse(element, { document }) {
  // The Angular app renders event cards — try multiple selector strategies
  const selectors = [
    '.event-card',
    '[class*="event-card"]',
    '[class*="webcast-card"]',
    '[class*="card-item"]',
    'app-event-card',
    'df-event-card',
  ];

  let cardEls = [];
  for (const sel of selectors) {
    cardEls = element.querySelectorAll(sel);
    if (cardEls.length > 0) break;
  }

  /* Fallback: find repeated card-like items (container with >3 children each having img+heading) */
  if (cardEls.length === 0) {
    const containers = element.querySelectorAll('div, ul, section');
    for (const container of containers) {
      const children = [...container.children];
      if (children.length >= 3) {
        const withImg = children.filter(c => c.querySelector('img') && (c.querySelector('h3') || c.querySelector('h4') || c.querySelector('a')));
        if (withImg.length >= 3) {
          cardEls = withImg;
          break;
        }
      }
    }
  }

  if (cardEls.length === 0) {
    console.warn('dbriefs-filter parser: No webcast cards found');
    return;
  }

  const cells = [];

  cardEls.forEach((card) => {
    const img = card.querySelector('img');
    const heading = card.querySelector('h3') || card.querySelector('h4') || card.querySelector('[class*="title"]');
    const links = card.querySelectorAll('a');
    const allText = card.querySelectorAll('p, span, div');

    // Build image cell
    const imgCell = document.createElement('div');
    if (img) {
      const pic = document.createElement('picture');
      const newImg = document.createElement('img');
      newImg.src = img.src || img.getAttribute('data-src') || '';
      newImg.alt = img.alt || '';
      newImg.loading = 'lazy';
      pic.appendChild(newImg);
      imgCell.appendChild(pic);
    }

    // Build content cell
    const contentCell = document.createElement('div');

    // Title
    if (heading) {
      const h3 = document.createElement('h3');
      h3.textContent = heading.textContent.trim();
      contentCell.appendChild(h3);
    }

    // Extract date, type, description from text elements
    let dateText = '';
    let typeText = '';
    let descText = '';
    allText.forEach((el) => {
      const text = el.textContent.trim();
      if (!text || text.length < 3) return;
      if (heading && text === heading.textContent.trim()) return;
      if (/\d{1,2}:\d{2}\s*[ap]\.?m\.?/i.test(text) || /\d{4},?\s*\d{1,2}:\d{2}/.test(text) || /^\w{3,4}\.\s*\d{1,2}\s\w{3,4}\.?\s\d{4}/i.test(text)) {
        if (!dateText) dateText = text;
      } else if (/^Virtual\s*[:|]/i.test(text) || /Dbriefs|Event/i.test(text) && text.length < 40) {
        if (!typeText) typeText = text;
      } else if (text.length > 20 && !descText) {
        descText = text;
      }
    });

    if (dateText) {
      const p = document.createElement('p');
      p.textContent = dateText;
      contentCell.appendChild(p);
    }
    if (typeText) {
      const p = document.createElement('p');
      p.textContent = typeText;
      contentCell.appendChild(p);
    }
    if (descText) {
      const p = document.createElement('p');
      p.textContent = descText;
      contentCell.appendChild(p);
    }

    // Links (register + details)
    links.forEach((link) => {
      const text = link.textContent.trim();
      if (text && link.href) {
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = text;
        const p = document.createElement('p');
        p.appendChild(a);
        contentCell.appendChild(p);
      }
    });

    // Categories — look for hidden category metadata
    const catEl = card.querySelector('[class*="category"], [class*="subject"], [data-category]');
    if (catEl) {
      const catP = document.createElement('p');
      catP.textContent = `categories: ${catEl.textContent.trim()}`;
      contentCell.appendChild(catP);
    }

    cells.push([imgCell, contentCell]);
  });

  if (cells.length === 0) return;

  const blockTable = WebImporter.Blocks.createBlock(document, {
    name: 'Dbriefs Filter',
    cells,
  });

  element.replaceWith(blockTable);
}
