/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-featured block
 *
 * Source: https://blog.adobe.com/en/topics/digital-transformation
 * Base Block: cards
 *
 * Block Structure (from markdown example):
 * - Row 1: Block name header ("Cards-Featured")
 * - Row 2+: One row per featured card: image | category, title, description, date
 *
 * Source HTML Pattern (from captured DOM):
 * <div class="featured-article">
 *   <div><div>
 *     <a class="featured-article-card" href="...">
 *       <div class="featured-article-card-image">
 *         <picture><img src="..." alt="..."></picture>
 *       </div>
 *       <div class="featured-article-card-body">
 *         <div class="featured-article-card-category"><a>category</a></div>
 *         <h3>Title</h3>
 *         <p class="featured-article-card-description">Description</p>
 *         <p class="featured-article-card-date">Date</p>
 *       </div>
 *     </a>
 *   </div></div>
 * </div>
 *
 * Generated: 2026-02-10
 */
export default function parse(element, { document }) {
  // Find featured article card(s) within the element
  // VALIDATED: .featured-article-card exists in captured DOM
  const cards = element.querySelectorAll('.featured-article-card, a[class*="featured"]');

  const cells = [];

  cards.forEach((card) => {
    // Extract image
    // VALIDATED: .featured-article-card-image picture img exists in captured DOM
    const imageEl = card.querySelector('.featured-article-card-image picture img') ||
                    card.querySelector('.featured-article-card-image img') ||
                    card.querySelector('picture img');

    // Build image cell
    const imageCell = document.createElement('div');
    if (imageEl) {
      const img = document.createElement('img');
      img.src = imageEl.src;
      img.alt = imageEl.alt || '';
      imageCell.appendChild(img);
    }

    // Extract text content
    // VALIDATED: .featured-article-card-category a exists in captured DOM
    const categoryEl = card.querySelector('.featured-article-card-category a') ||
                       card.querySelector('.featured-article-card-category') ||
                       card.querySelector('[class*="category"] a');

    // VALIDATED: h3 exists in captured DOM within .featured-article-card-body
    const titleEl = card.querySelector('h3') ||
                    card.querySelector('h2') ||
                    card.querySelector('[class*="title"]');

    // VALIDATED: .featured-article-card-description exists in captured DOM
    const descEl = card.querySelector('.featured-article-card-description') ||
                   card.querySelector('p:not([class*="date"]):not([class*="category"])');

    // VALIDATED: .featured-article-card-date exists in captured DOM
    const dateEl = card.querySelector('.featured-article-card-date') ||
                   card.querySelector('[class*="date"]');

    // Build text cell with all content elements
    const textCell = document.createElement('div');

    if (categoryEl) {
      const categoryP = document.createElement('p');
      const categoryLink = document.createElement('a');
      categoryLink.href = categoryEl.href || categoryEl.closest('a')?.href || '#';
      categoryLink.textContent = categoryEl.textContent.trim();
      categoryP.appendChild(categoryLink);
      textCell.appendChild(categoryP);
    }

    if (titleEl) {
      const h3 = document.createElement('h3');
      h3.textContent = titleEl.textContent.trim();
      textCell.appendChild(h3);
    }

    if (descEl) {
      const p = document.createElement('p');
      p.textContent = descEl.textContent.trim();
      textCell.appendChild(p);
    }

    if (dateEl) {
      const dateP = document.createElement('p');
      dateP.textContent = dateEl.textContent.trim();
      textCell.appendChild(dateP);
    }

    // Each card is one row with 2 columns: image | text content
    cells.push([imageCell, textCell]);
  });

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Featured', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
