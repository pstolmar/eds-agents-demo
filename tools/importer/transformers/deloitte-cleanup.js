/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Deloitte cleanup. Selectors from captured DOM of deloitte.com/us/en.html
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie/consent dialogs
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '[class*="onetrust"]',
      '[id*="onetrust"]',
      '[class*="cookie"]',
      '[id*="CybotCookiebot"]',
      '.optanon-alert-box-wrapper',
    ]);

    // Remove breadcrumb container
    WebImporter.DOMUtils.remove(element, [
      '.breadcrumb-language-container',
    ]);

    // Focus on main content area only — strip everything outside [role="main"]
    const mainContent = element.querySelector('[role="main"], main');
    if (mainContent) {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
      while (mainContent.firstChild) {
        element.appendChild(mainContent.firstChild);
      }
    }
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove remaining non-content elements
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      'nav',
      'noscript',
      'iframe',
      'link',
      'source',
    ]);

    // Note: .cmp-sticky-bar elements are NOT removed here — the section
    // transformer converts them to headings (default content) instead.

    // Clean data attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-track');
      el.removeAttribute('data-cmp-clickable');
      el.removeAttribute('data-clientlibs');
      el.removeAttribute('data-component');
      el.removeAttribute('onclick');
    });
  }
}
