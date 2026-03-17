/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns block.
 * Base: columns. Source: corporate.walmart.com/suppliers/investing-in-american-jobs
 * Source selector: .block-fifty-fifty-v3
 * Source DOM structure:
 *   .block-fifty-fifty-v3
 *     .block5050-component-v3
 *       .content-block.style-50-50
 *         .content-block-block-v3.content-block-image-v3 (image side - CSS background-image)
 *           .content-block-image-wrap[style="background-image: url(...)"]
 *         .content-block-block-v3.content-block-solid-v3 (text side)
 *           .content-block-content-v3
 *             .content-block-title-v3 (title div)
 *             .content-block-text-v3 (description div)
 *             a[href] (CTA link)
 *
 * Block library structure (columns):
 * Each row has 2 cells: [cell1, cell2] side by side
 */
export default function parse(element, { document }) {
  // Extract background image URL from CSS background-image style
  const imageWrap = element.querySelector('.content-block-image-wrap[style*="background-image"]');
  let imageCell = [];
  if (imageWrap) {
    const style = imageWrap.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(([^)]+)\)/);
    if (match) {
      const img = document.createElement('img');
      let src = match[1].replace(/['"]/g, '');
      if (src.startsWith('/')) {
        src = `https://corporate.walmart.com${src}`;
      }
      img.src = src;
      img.alt = imageWrap.getAttribute('alt') || '';
      imageCell.push(img);
    }
  }

  // Extract title from .content-block-title-v3
  const titleEl = element.querySelector('.content-block-title-v3');

  // Extract description from .content-block-text-v3
  const descEl = element.querySelector('.content-block-text-v3');

  // Extract CTA link
  const contentContainer = element.querySelector('.content-block-content-v3');
  const ctaLink = contentContainer
    ? contentContainer.querySelector('a[href]')
    : element.querySelector('.content-block-solid-v3 a[href]');

  // Build content cell
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
    const link = document.createElement('a');
    link.href = ctaLink.getAttribute('href');
    link.textContent = ctaLink.textContent.trim();
    contentCell.push(link);
  }

  // Determine column order: reversed layout means content-left, image-right
  const isReversed = !!element.querySelector('.content-block-layout-reversed');
  const cells = [];

  if (imageCell.length > 0 && contentCell.length > 0) {
    if (isReversed) {
      cells.push([contentCell, imageCell]);
    } else {
      cells.push([imageCell, contentCell]);
    }
  } else if (contentCell.length > 0) {
    cells.push([contentCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
  element.replaceWith(block);
}
