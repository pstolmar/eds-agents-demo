/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero block (WKND standalone teaser).
 * Source: https://wknd.site/ — .teaser.cmp-teaser--hero (outside carousel)
 * Large background image with overlay: h2 title, description, CTA.
 * Block library: row1 = [image], row2 = [content: h2 + description + CTA]
 */
export default function parse(element, { document }) {
  const img = element.querySelector('.cmp-image__image, img');
  const title = element.querySelector('.cmp-teaser__title, h2');
  const desc = element.querySelector('.cmp-teaser__description');
  const cta = element.querySelector('.cmp-teaser__action-link, a[href]');

  const cells = [];

  if (img) {
    cells.push([img]);
  }

  const contentCell = [];
  if (title) contentCell.push(title);
  if (desc) contentCell.push(desc);
  if (cta) contentCell.push(cta);
  cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
