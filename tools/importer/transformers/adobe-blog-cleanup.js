/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for Adobe Blog website cleanup
 * Purpose: Remove non-content elements from Adobe Blog pages
 * Applies to: blog.adobe.com (all templates)
 * Tested: /en/topics/digital-transformation
 * Generated: 2026-02-10
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration workflow (cleaned.html)
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove header/navigation - handled separately
    // EXTRACTED: Found <header class="gnav"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      'header.gnav',
    ]);

    // Remove footer - handled separately
    // EXTRACTED: Found <footer class="global-footer"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      'footer.global-footer',
    ]);

    // Remove filter container - dynamic JS feature not suitable for static import
    // EXTRACTED: Found <div class="filter-container"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.filter-container',
    ]);

    // Remove filter curtain overlay
    // EXTRACTED: Found <div class="filter-curtain hide"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.filter-curtain',
    ]);

    // Remove selected filters container
    // EXTRACTED: Found <div class="selected-container hide"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.selected-container',
    ]);

    // Remove page load indicator
    // EXTRACTED: Found <div id="page-load-ok-milo"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '#page-load-ok-milo',
    ]);

    // Remove load more button - dynamic functionality
    // EXTRACTED: Found <a class="load-more con-button outline"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      'a.load-more',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove remaining non-content elements
    WebImporter.DOMUtils.remove(element, [
      'source',
      'noscript',
    ]);
  }
}
