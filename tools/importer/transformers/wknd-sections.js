/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND sections.
 * Adds section breaks and section-metadata blocks based on template sections.
 * Runs in afterTransform only.
 */
export default function transform(hookName, element, payload) {
  if (hookName === 'afterTransform') {
    const { template } = payload;
    if (!template || !template.sections || template.sections.length < 2) return;

    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element.getRootNode() };

    // Process sections in reverse order to avoid offset issues
    const sections = [...template.sections].reverse();

    sections.forEach((section) => {
      // Find the section element using the selector
      let sectionEl;
      if (Array.isArray(section.selector)) {
        for (const sel of section.selector) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
      } else {
        sectionEl = element.querySelector(section.selector);
      }

      if (!sectionEl) return;

      // Add section-metadata block if section has a style
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.parentElement.insertBefore(metaBlock, sectionEl.nextSibling);
      }

      // Add section break (hr) before section, but not for the first section
      const isFirst = section === template.sections[0];
      if (!isFirst) {
        const hr = document.createElement('hr');
        sectionEl.parentElement.insertBefore(hr, sectionEl);
      }
    });
  }
}
