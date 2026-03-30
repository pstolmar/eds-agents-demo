/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Deloitte sections. Adds section breaks and section-metadata blocks.
 *
 * WebImporter.Blocks.createBlock() produces TABLE elements (not DIVs). The block
 * name is stored as text in the first row header cell. This transformer finds
 * block tables by matching their header text to the block name from the template.
 *
 * Runs only in afterTransform (after block parsing).
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

/**
 * Find a block table by matching the header text to the block name.
 * WebImporter.Blocks.createBlock() creates tables like:
 *   <table><tr><td>Block Name</td></tr><tr><td>content</td></tr></table>
 */
function findBlockTable(root, blockName) {
  const tables = root.querySelectorAll('table');
  const normalized = blockName.toLowerCase().replace(/-/g, ' ');
  for (const table of tables) {
    const firstRow = table.querySelector('tr:first-child');
    if (firstRow) {
      const headerCell = firstRow.querySelector('td, th');
      if (headerCell) {
        const text = headerCell.textContent.trim().toLowerCase();
        if (text === blockName.toLowerCase() || text === normalized) {
          return table;
        }
      }
    }
  }
  return null;
}

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { document } = payload;
    const template = payload.template;

    if (!template || !template.sections || template.sections.length < 2) {
      return;
    }

    // Step 1: Flatten intermediate wrapper DIVs from the live AEM page
    // (experiencefragment, responsivegrid, cmp-container, aem-Grid wrappers).
    // Block elements are TABLEs (from createBlock), so only DIVs are unwrapped.
    let changed = true;
    while (changed) {
      changed = false;
      Array.from(element.children).forEach((child) => {
        if (child.tagName === 'DIV') {
          while (child.firstChild) {
            element.insertBefore(child.firstChild, child);
          }
          child.remove();
          changed = true;
        }
      });
    }

    // Step 2: Process sections in reverse order to avoid DOM position shifts
    const sections = [...template.sections].reverse();

    sections.forEach((section) => {
      const blockName = section.blocks && section.blocks[0];
      if (!blockName) return;

      // Find the block TABLE by its header text
      const sectionEl = findBlockTable(element, blockName);
      if (!sectionEl) return;

      // Add section-metadata block if section has a style.
      // Insert before the next <hr> so it's the last item in the section.
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        let nextHr = sectionEl.nextElementSibling;
        while (nextHr && nextHr.tagName !== 'HR') {
          nextHr = nextHr.nextElementSibling;
        }
        if (nextHr) {
          nextHr.before(sectionMetadata);
        } else {
          element.appendChild(sectionMetadata);
        }
      }

      // Add section break (hr) before each section except the first.
      // Walk back through ALL consecutive headings so section headings
      // end up in the correct section.
      if (section.id !== template.sections[0].id) {
        const hr = document.createElement('hr');
        let insertBefore = sectionEl;
        let prev = sectionEl.previousElementSibling;
        while (prev && /^H[1-6]$/.test(prev.tagName)) {
          insertBefore = prev;
          prev = prev.previousElementSibling;
        }
        insertBefore.before(hr);
      }
    });
  }
}
