/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel block (WKND homepage).
 * Source: https://wknd.site/ — .cmp-carousel--hero
 * Each .cmp-carousel__item contains a teaser with image, h2, description, CTA.
 * Block library: each row = 1 slide: [image, content]
 */
export default function parse(element, { document }) {
  const items = element.querySelectorAll('.cmp-carousel__item');
  const cells = [];

  items.forEach((item) => {
    const img = item.querySelector('.cmp-image__image, img');
    const title = item.querySelector('.cmp-teaser__title, h2');
    const desc = item.querySelector('.cmp-teaser__description');
    const cta = item.querySelector('.cmp-teaser__action-link, a[href]');

    const contentCell = [];
    if (title) contentCell.push(title);
    if (desc) contentCell.push(desc);
    if (cta) contentCell.push(cta);

    cells.push([img || '', contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel', cells });
  element.replaceWith(block);
}
