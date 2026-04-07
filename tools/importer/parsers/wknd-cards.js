/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards block (WKND image lists).
 * Source: https://wknd.site/
 * Handles both .cmp-contentfragmentlist and .cmp-image-list (adventure carousel).
 * Each .cmp-image-list__item has: image link, title link, description span.
 * Block library: each row = [image, content]
 */
export default function parse(element, { document }) {
  const items = element.querySelectorAll('.cmp-image-list__item');
  const cells = [];

  items.forEach((item) => {
    const img = item.querySelector('.cmp-image__image, img');
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = item.querySelector('.cmp-image-list__item-title');
    const descSpan = item.querySelector('.cmp-image-list__item-description');

    const contentCell = [];

    if (titleSpan && titleLink) {
      const strong = document.createElement('strong');
      const a = document.createElement('a');
      a.href = titleLink.getAttribute('href');
      a.textContent = titleSpan.textContent.trim();
      strong.appendChild(a);
      contentCell.push(strong);
    } else if (titleSpan) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent.trim();
      contentCell.push(strong);
    }

    if (descSpan && descSpan.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = descSpan.textContent.trim();
      contentCell.push(p);
    }

    cells.push([img || '', contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards', cells });
  element.replaceWith(block);
}
