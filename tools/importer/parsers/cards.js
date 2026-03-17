/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards block.
 * Base: cards. Source: corporate.walmart.com/suppliers/investing-in-american-jobs
 * Source selector: .article-list-3-0
 *
 * Source DOM structure:
 *   .article-list-3-0
 *     .card-layout
 *       .card-item
 *         a[href]
 *           .card-item-container
 *             .card-item-image > img.lazy-image[data-src]
 *             .card-item-content
 *               .card-item-text-date > .formatted-date
 *               .card-item-text-title > h6
 *               .card-item-text-body > p
 *
 * Block library structure (cards):
 * Each row = 1 card with 2 cells: [image, content]
 * Content cell: p strong title + p description + optional CTA link
 */
export default function parse(element, { document }) {
  const cardItems = element.querySelectorAll('.card-item');
  const cells = [];

  cardItems.forEach((item) => {
    const link = item.querySelector('a[href]');
    const img = item.querySelector('img');
    const titleEl = item.querySelector('h6, .card-item-text-title');
    const bodyEl = item.querySelector('.card-item-text-body p, .card-item-text-body');

    // Image cell
    const imageCell = [];
    if (img) {
      const newImg = document.createElement('img');
      let src = img.getAttribute('data-src') || img.getAttribute('src') || '';
      if (src.startsWith('/')) {
        src = `https://corporate.walmart.com${src}`;
      }
      newImg.src = src;
      newImg.alt = img.getAttribute('alt') || '';
      imageCell.push(newImg);
    }

    // Content cell
    const contentCell = [];

    if (titleEl && titleEl.textContent.trim()) {
      const titleP = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent.trim();
      titleP.appendChild(strong);
      contentCell.push(titleP);
    }

    if (bodyEl && bodyEl.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = bodyEl.textContent.trim();
      contentCell.push(p);
    }

    if (link && link.getAttribute('href')) {
      const a = document.createElement('a');
      a.href = link.getAttribute('href');
      a.textContent = titleEl ? titleEl.textContent.trim() : 'Read More';
      contentCell.push(a);
    }

    if (imageCell.length > 0 || contentCell.length > 0) {
      cells.push([imageCell, contentCell]);
    }
  });

  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'cards', cells });
    element.replaceWith(block);
  }
}
