/* eslint-disable */
/* global WebImporter */

/**
 * Parser for standalone accordion FAQ blocks (no tab wrapper).
 * Base: accordion. Source: corporate.walmart.com/suppliers/walmart-growth-summit
 * Source selector: .accordion-2\.0
 * Source DOM structure:
 *   .accordion-2.0
 *     .accordion-container-component-2
 *       h5 (category heading, e.g. "General FAQ")
 *       div (items wrapper)
 *         div (per item)
 *           .accordion-item-component-2
 *             a.item-title-2 > .buttonClass > .item-header-text-2 (question)
 *             .item-content-2 > .cmp-container > .richtext > .rte-styles (answer)
 *
 * Block library structure (accordion):
 * Multiple rows with 2 cells each: [question | answer].
 *
 * Output: h2 category heading + accordion block for each .accordion-2.0 element.
 */
export default function parse(element, { document }) {
  const container = element.querySelector('.accordion-container-component-2');
  if (!container) return;

  // Extract category heading from the h5 inside the accordion container
  const h5 = container.querySelector('h5');
  const categoryName = h5 ? h5.textContent.trim() : '';

  const items = element.querySelectorAll('.accordion-item-component-2');
  if (!items.length) return;

  const fragment = document.createDocumentFragment();

  // Add category heading if present
  if (categoryName) {
    const heading = document.createElement('h2');
    heading.textContent = categoryName;
    fragment.appendChild(heading);
  }

  // Build accordion cells
  const cells = [];
  items.forEach((item) => {
    const titleEl = item.querySelector('.item-header-text-2');
    const question = titleEl ? titleEl.textContent.trim() : '';
    if (!question) return;

    const contentEl = item.querySelector('.item-content-2');
    const rteEl = contentEl ? contentEl.querySelector('.rte-styles') : null;

    // Build question cell
    const questionCell = document.createDocumentFragment();
    const qText = document.createElement('p');
    qText.textContent = question;
    questionCell.appendChild(qText);

    // Build answer cell — clone the rich text content
    const answerCell = document.createDocumentFragment();
    if (rteEl) {
      Array.from(rteEl.childNodes).forEach((node) => {
        answerCell.appendChild(node.cloneNode(true));
      });
    }

    cells.push([[questionCell], [answerCell]]);
  });

  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, {
      name: 'accordion',
      cells,
    });
    fragment.appendChild(block);
  }

  element.replaceWith(fragment);
}
