/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion block (tabbed FAQ).
 * Base: accordion. Source: corporate.walmart.com/askwalmart
 * Source selector: .tabs-3-component
 * Source DOM structure:
 *   .tabs-3-component
 *     .wrapper.tabs-wrap (contains ul[role="tablist"] with li > a[role="tab"])
 *     .tab-content-tabs
 *       .tab-pane-tabs[role="tabpanel"] (one per tab)
 *         span.print-show (tab name)
 *         .cmp-container
 *           .accordion-2.0
 *             .accordion-container-component-2
 *               div (items wrapper)
 *                 div (per item)
 *                   .accordion-item-component-2
 *                     a.item-title-2 > .buttonClass > .item-header-text-2 (question)
 *                     .item-content-2 > .cmp-container > .richtext > .rte-styles (answer)
 *
 * Block library structure (accordion):
 * Multiple rows with 2 cells each: [question | answer].
 *
 * Output: For each tab, creates an h2 heading + accordion block,
 * separated by <hr> section breaks.
 */
export default function parse(element, { document }) {
  const tabNames = ['Customers', 'Purpose', 'Suppliers', 'General'];
  const tabPanes = element.querySelectorAll('.tab-pane-tabs');

  if (!tabPanes.length) return;

  const fragment = document.createDocumentFragment();

  tabPanes.forEach((pane, index) => {
    if (index >= tabNames.length) return; // Skip empty extra panes

    const items = pane.querySelectorAll('.accordion-item-component-2');
    if (!items.length) return;

    // Add section break before each tab section (except the first)
    if (index > 0) {
      fragment.appendChild(document.createElement('hr'));
    }

    // Add category heading
    const heading = document.createElement('h2');
    heading.textContent = tabNames[index];
    fragment.appendChild(heading);

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

      // Build answer cell - clone the rich text content
      const answerCell = document.createDocumentFragment();
      if (rteEl) {
        // Clone child nodes to preserve links, lists, formatting
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
  });

  element.replaceWith(fragment);
}
