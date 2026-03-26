/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards block.
 * Base: cards. Source: deloitte.com/us/en.html
 * Source selector: .cmp-promo-container--single-row-multi-columns
 * Source DOM structure:
 *   .cmp-promo-container--single-row-multi-columns
 *     .cmp-title > .cmp-title__text (h3 "The latest from Deloitte")
 *     .cmp-promo-container__content
 *       .cmp-promo-container__content-item (per card)
 *         a[href]
 *           .cmp-promo__content
 *             .cmp-promo__content__title (h3 title)
 *             .cmp-promo__content__desc (p description)
 *             .cmp-promo__content-type__read-time (tag e.g. "Perspective", "Article")
 *           img (card image)
 *
 * Block library structure (cards):
 * Each row = 1 card with 2 cells: [image, content]
 * Content cell: strong title + p description + optional CTA link
 */
export default function parse(element, { document }) {
  const cardItems = element.querySelectorAll('.cmp-promo-container__content-item, .cmp-promo--featured-primary, .cmp-promo--standard');
  const cells = [];

  // Deduplicate cards by href, preferring items that have images
  const cardMap = new Map();
  const cardOrder = [];

  cardItems.forEach((item) => {
    const link = item.querySelector('a[href]');
    const href = link ? link.getAttribute('href') : null;
    const img = item.querySelector('img');

    if (href && cardMap.has(href)) {
      // Replace with this version if it has an image and the existing one doesn't
      if (img && !cardMap.get(href).querySelector('img')) {
        cardMap.set(href, item);
      }
      return;
    }

    const key = href || `item-${cardMap.size}`;
    cardMap.set(key, item);
    cardOrder.push(key);
  });

  cardOrder.forEach((key) => {
    const item = cardMap.get(key);
    if (!item) return;

    const link = item.querySelector('a[href]');
    const img = item.querySelector('img.fluidimage, img.js-image-rendition, img:not(.cmp-co-branding-img)');
    const titleEl = item.querySelector('.cmp-promo__content__title, h3');
    const descEl = item.querySelector('.cmp-promo__content__desc, .cmp-promo__content__description, p');
    const tagEl = item.querySelector('.cmp-promo__content-type__read-time, .cmp-promo__content-type');

    // Image cell
    const imageCell = [];
    if (img) {
      imageCell.push(img);
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

    if (descEl && descEl.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = descEl.textContent.trim();
      contentCell.push(p);
    }

    if (link && link.getAttribute('href')) {
      const a = document.createElement('a');
      a.href = link.getAttribute('href');
      a.textContent = titleEl ? titleEl.textContent.trim() : 'Read more';
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
