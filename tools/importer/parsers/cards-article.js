/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-article block
 *
 * Source: https://blog.adobe.com/en/topics/digital-transformation
 * Base Block: cards
 *
 * Block Structure (from markdown example):
 * - Row 1: Block name header ("Cards-Article")
 * - Row 2+: One row per article card: image | category, title, description, date
 *
 * Source HTML Pattern (from captured DOM):
 * <div class="article-feed appear">
 *   <div class="article-cards">
 *     <a class="article-card" href="...">
 *       <div class="article-card-image">
 *         <picture><img src="..." alt="..."></picture>
 *       </div>
 *       <div class="article-card-body">
 *         <p class="article-card-category"><a>Category</a></p>
 *         <h3>Title</h3>
 *         <p class="article-card-description">Description</p>
 *         <p class="article-card-date">Date</p>
 *       </div>
 *     </a>
 *     ...
 *   </div>
 * </div>
 *
 * Generated: 2026-02-10
 */
export default function parse(element, { document }) {
  // Find all article cards within the element
  // VALIDATED: .article-card exists in captured DOM (12 instances)
  const cards = element.querySelectorAll('.article-card, a[class*="article-card"]');

  const cells = [];

  cards.forEach((card) => {
    // Extract image
    // VALIDATED: .article-card-image picture img exists in captured DOM
    const imageEl = card.querySelector('.article-card-image picture img') ||
                    card.querySelector('.article-card-image img') ||
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
    // VALIDATED: .article-card-category a exists in captured DOM
    const categoryEl = card.querySelector('.article-card-category a') ||
                       card.querySelector('.article-card-category') ||
                       card.querySelector('[class*="category"] a');

    // VALIDATED: h3 exists in captured DOM within .article-card-body
    const titleEl = card.querySelector('h3') ||
                    card.querySelector('h2') ||
                    card.querySelector('[class*="title"]');

    // VALIDATED: .article-card-description exists in captured DOM
    const descEl = card.querySelector('.article-card-description') ||
                   card.querySelector('p:not([class*="date"]):not([class*="category"])');

    // VALIDATED: .article-card-date exists in captured DOM
    const dateEl = card.querySelector('.article-card-date') ||
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
  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Article', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
