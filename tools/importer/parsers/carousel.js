/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel block.
 * Base: carousel. Source: corporate.walmart.com/suppliers/investing-in-american-jobs
 * Source selector: .carousel-3\.0
 * Source DOM structure:
 *   .carousel-3.0
 *     .carousel-slider-component-3
 *       .carousel-items-container (slick slider)
 *         .carousel-item-wrapper-3 (per slide)
 *           .drop-shadow-carousel-3
 *             a.carousel-item-link-3[href]
 *               .carousel-item-3 > img.carousel-image-3
 *               .carousel-item-info > h5.item-title + .item-description-3
 *
 * Block library structure (carousel):
 * Each row = 1 slide with 2 cells: [image, content]
 * Content cell: h2 title + p description + optional CTA link
 */
export default function parse(element, { document }) {
  const items = element.querySelectorAll('.carousel-item-wrapper-3:not(.slick-cloned)');
  const cells = [];
  const seenSrcs = new Set();

  items.forEach((item) => {
    const link = item.querySelector('a.carousel-item-link-3, a[href]');
    const img = item.querySelector('img.carousel-image-3, img');
    const titleEl = item.querySelector('h5.item-title, h5');
    const descEl = item.querySelector('.item-description-3, [class*="description"]');

    // Image cell — deduplicate by src (handles carousels without .slick-cloned)
    const imageCell = [];
    if (img) {
      let src = img.getAttribute('src') || img.getAttribute('data-src') || '';
      if (src.startsWith('/')) {
        src = `https://corporate.walmart.com${src}`;
      }
      if (seenSrcs.has(src)) return; // skip duplicate
      seenSrcs.add(src);
      const newImg = document.createElement('img');
      newImg.src = src;
      newImg.alt = img.getAttribute('alt') || '';
      imageCell.push(newImg);
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
    const block = WebImporter.Blocks.createBlock(document, { name: 'carousel', cells });
    element.replaceWith(block);
  }
}
