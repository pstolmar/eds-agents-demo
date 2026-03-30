/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns block.
 * Base: columns. Source: deloitte.com/us/en.html
 * Source selector: .cmp-cta__standard-img--large
 * Source DOM structure:
 *   .cmp-cta.cmp-cta__standard-img.cmp-cta__standard-img--large
 *     .cmp-cta__img-container > img (careers image, left side)
 *     .cmp-cta__text-wrapper
 *       .cmp-cta__container-text
 *         .cmp-title > .cmp-title__text (h3 "Join us")
 *         .cmp-text > p (description)
 *         .cmp-cta__button-wrapper
 *           a (primary CTA "Explore careers")
 *           a (secondary CTA "10 reasons to join Deloitte")
 *
 * Block library structure (columns):
 * Each row has 2 cells: [cell1, cell2] side by side
 */
export default function parse(element, { document }) {
  // Extract image
  const img = element.querySelector('.cmp-cta__img-container img, img');

  // Extract heading
  const heading = element.querySelector('.cmp-title__text, h3');

  // Extract description
  const description = element.querySelector('.cmp-text p, .cmp-cta__container-text p');

  // Extract CTA links
  const ctaLinks = Array.from(element.querySelectorAll('.cmp-cta__button-wrapper a, .cmp-cta__container-text a[href]'));

  // Build image cell
  const imageCell = [];
  if (img) {
    imageCell.push(img);
  }

  // Build content cell
  const contentCell = [];
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    contentCell.push(h2);
  }
  if (description) {
    contentCell.push(description);
  }
  ctaLinks.forEach((link) => {
    if (link.getAttribute('href') && link.textContent.trim()) {
      contentCell.push(link);
    }
  });

  const cells = [];
  if (imageCell.length > 0 && contentCell.length > 0) {
    cells.push([imageCell, contentCell]);
  } else if (contentCell.length > 0) {
    cells.push([contentCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
  element.replaceWith(block);
}
