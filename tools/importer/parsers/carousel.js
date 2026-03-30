/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel block.
 * Base: carousel. Source: deloitte.com/us/en.html
 * Source selector: .cmp-dual-slider
 * Source DOM structure:
 *   .cmp-dual-slider
 *     .cmp-dual-slider__container
 *       .cmp-dual-slider__slide-item (per slide)
 *         .cmp-title > .cmp-title__text (h3 title)
 *         .cmp-text > p (description)
 *         a.cmp-button__link (CTA "Read the full story")
 *     a (Explore more client stories - separate link outside slider)
 *
 * Block library structure (carousel):
 * Each row = 1 slide with 2 cells: [image, content]
 * Content cell: h2 title + p description + optional CTA link
 * Note: Deloitte case studies have no images, using text-only slides
 */
export default function parse(element, { document }) {
  const items = element.querySelectorAll('.cmp-dual-slider__slide-item, [class*="slide-item"]');
  const cells = [];

  items.forEach((item) => {
    const titleEl = item.querySelector('.cmp-title__text, h3');
    const descEl = item.querySelector('.cmp-text p, p');
    const ctaLink = item.querySelector('a[href]');
    const img = item.querySelector('img');

    // Image cell (may be empty for text-only slides)
    const imageCell = [];
    if (img) {
      imageCell.push(img);
    }

    // Content cell
    const contentCell = [];
    if (titleEl && titleEl.textContent.trim()) {
      const h2 = document.createElement('h2');
      h2.textContent = titleEl.textContent.trim();
      contentCell.push(h2);
    }
    if (descEl && descEl.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = descEl.textContent.trim();
      contentCell.push(p);
    }
    if (ctaLink && ctaLink.getAttribute('href')) {
      const a = document.createElement('a');
      a.href = ctaLink.getAttribute('href');
      a.textContent = ctaLink.textContent.trim() || 'Read the full story';
      contentCell.push(a);
    }

    if (contentCell.length > 0) {
      cells.push([imageCell, contentCell]);
    }
  });

  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'carousel', cells });
    element.replaceWith(block);
  }
}
