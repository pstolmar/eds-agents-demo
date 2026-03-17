/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: walmart corporate cleanup.
 * Selectors from captured DOM of corporate.walmart.com/suppliers/investing-in-american-jobs
 * Removes non-authorable site chrome: global header, footer, secondary nav, breadcrumbs,
 * cookie/consent, mobile nav, user profile, whitespace, CSS override components.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove elements that could interfere with block parsing
    // CSS override components (.html-component-2.0) contain <style> tags that aren't content
    WebImporter.DOMUtils.remove(element, [
      '.html-component-2\\.0',
      '#onetrust-consent-sdk',
      '[class*="cookie"]',
      '#px-captcha',
      '.popup',
    ]);

    // Remove whitespace spacer components (empty divs used for spacing)
    element.querySelectorAll('.whitespace').forEach((el) => el.remove());

    // Remove "opens in a new tab" screen-reader-only spans (inline with link text)
    element.querySelectorAll('.cmp-link__screen-reader-only').forEach((el) => el.remove());

    // Remove Adobe ID Syncing iframes and demdex tracking
    element.querySelectorAll('iframe[src*="demdex"], a[href*="demdex"]').forEach((el) => {
      const parent = el.parentElement;
      el.remove();
      if (parent && parent.tagName === 'P' && !parent.textContent.trim()) parent.remove();
    });
  }

  if (hookName === H.after) {
    // Remove global header and all header components
    // Found: .walmart-hub-header, #header-container, #hamburger-container, #header
    WebImporter.DOMUtils.remove(element, [
      '.walmart-hub-header',
      '#header-container',
      '#hamburger-container',
      '#header-search-bar',
      '#user-profile-container',
      '.user-profile-notifications',
      '.cmp-experiencefragment--header',
    ]);

    // Remove global footer
    // Found: .cmp-experiencefragment--footer, footer
    WebImporter.DOMUtils.remove(element, [
      'footer',
      '.cmp-experiencefragment--footer',
      '.footer',
    ]);

    // Remove secondary in-page navigation (site chrome, not page content)
    // Found: .in-page-navigation-2-0, .in-page-navigation-component-2
    WebImporter.DOMUtils.remove(element, [
      '.in-page-navigation-2-0',
      '.in-page-navigation-component-2',
      '.reference',
    ]);

    // Remove breadcrumbs (not authorable page content)
    // Found: .breadcrumb-2.0, .breadcrumbComponent
    WebImporter.DOMUtils.remove(element, [
      '.breadcrumb-2\\.0',
      '[class*="breadcrumb"]',
    ]);

    // Remove iframes, tracking scripts, noscript, link tags
    WebImporter.DOMUtils.remove(element, [
      'noscript',
      'link',
    ]);

    // Clean up tracking attributes from all remaining elements
    element.querySelectorAll('[data-track], [onclick], [data-analytics]').forEach((el) => {
      el.removeAttribute('data-track');
      el.removeAttribute('onclick');
      el.removeAttribute('data-analytics');
    });
  }
}
