/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns block (WKND featured article teaser).
 * Source: https://wknd.site/ — .cmp-teaser--featured
 * Two-column layout: image left, pretitle + h2 + description + CTA right.
 * Block library: each row = [col1, col2]
 */
export default function parse(element, { document }) {
  const img = element.querySelector('.cmp-image__image, img');
  const pretitle = element.querySelector('.cmp-teaser__pretitle');
  const title = element.querySelector('.cmp-teaser__title, h2');
  const desc = element.querySelector('.cmp-teaser__description');
  const cta = element.querySelector('.cmp-teaser__action-link, a[href]');

  const contentCell = [];
  if (pretitle) {
    const em = document.createElement('em');
    em.textContent = pretitle.textContent.trim();
    contentCell.push(em);
  }
  if (title) contentCell.push(title);
  if (desc) contentCell.push(desc);
  if (cta) contentCell.push(cta);

  const cells = [[img || '', contentCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
  element.replaceWith(block);
}
