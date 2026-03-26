/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero block.
 * Base: hero. Source: deloitte.com/us/en.html
 * Source selector: .cmp-cta__homepage-fixed
 * Source DOM structure:
 *   .cmp-cta.cmp-cta__homepage-fixed
 *     .cmp-cta__bg-img (background image via CSS background-image)
 *     .cmp-cta__container
 *       .cmp-title > .cmp-title__text (h1)
 *       .cmp-text > p (description)
 *       a (CTA link with text "Dive into the outlooks")
 *
 * Block library structure (hero):
 * Row 1: Background image (optional)
 * Row 2: Title + Subheading + CTA (optional)
 */
export default function parse(element, { document }) {
  // Extract background image from .cmp-cta__bg-img CSS background-image
  const bgImgEl = element.querySelector('.cmp-cta__bg-img');
  let bgImage = null;
  if (bgImgEl) {
    const style = bgImgEl.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/);
    if (match) {
      bgImage = document.createElement('img');
      bgImage.src = match[1];
      bgImage.alt = '';
    }
  }
  // Fallback: look for a direct img
  if (!bgImage) {
    bgImage = element.querySelector('img');
  }

  // Extract heading (h1 or .cmp-title__text)
  const heading = element.querySelector('h1, .cmp-title__text');

  // Extract description paragraph
  const description = element.querySelector('.cmp-text p, .cmp-cta__container p');

  // Extract CTA link
  const ctaLink = element.querySelector('a[href]:not([class*="logo"])');

  // Build cells matching hero block library structure
  const cells = [];

  // Row 1: Background image
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: Content (heading + description + CTA)
  const contentCell = [];
  if (heading) {
    const h1 = document.createElement('h1');
    h1.textContent = heading.textContent.trim();
    contentCell.push(h1);
  }
  if (description) {
    const p = document.createElement('p');
    p.textContent = description.textContent.trim();
    contentCell.push(p);
  }
  if (ctaLink) {
    const a = document.createElement('a');
    a.href = ctaLink.getAttribute('href');
    // Deduplicate text (live DOM may repeat visible + aria-label text)
    let text = ctaLink.textContent.trim();
    const half = Math.floor(text.length / 2);
    if (text.length > 2 && text.substring(0, half).trim() === text.substring(half).trim()) {
      text = text.substring(0, half).trim();
    }
    a.textContent = text;
    contentCell.push(a);
  }

  if (contentCell.length > 0) {
    cells.push([contentCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
