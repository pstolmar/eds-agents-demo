/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroParser from './parsers/hero.js';
import embedParser from './parsers/embed.js';
import cardsParser from './parsers/cards.js';
import carouselParser from './parsers/carousel.js';
import columnsParser from './parsers/columns.js';

// TRANSFORMER IMPORTS
import deloitteCleanupTransformer from './transformers/deloitte-cleanup.js';
import deloitteSectionsTransformer from './transformers/deloitte-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero': heroParser,
  'embed': embedParser,
  'cards': cardsParser,
  'carousel': carouselParser,
  'columns': columnsParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'deloitte-us-homepage',
  description: 'Deloitte US homepage with hero, featured content sections, and promotional cards',
  urls: [
    'https://www.deloitte.com/us/en.html',
  ],
  blocks: [
    {
      name: 'hero',
      instances: ['.cmp-cta__homepage-fixed'],
    },
    {
      name: 'embed',
      instances: ['.cmp-video__homepage'],
    },
    {
      name: 'cards',
      instances: ['.cmp-promo-container--single-row-multi-columns'],
    },
    {
      name: 'carousel',
      instances: ['.cmp-dual-slider'],
    },
    {
      name: 'columns',
      instances: ['.cmp-cta__standard-img--large'],
    },
  ],
  sections: [
    {
      id: 'hero',
      name: 'Hero Section',
      selector: '.cmp-cta__homepage-fixed',
      style: 'dark',
      blocks: ['hero'],
      defaultContent: [],
    },
    {
      id: 'video',
      name: 'Video Section',
      selector: '.cmp-video__homepage',
      style: 'dark',
      blocks: ['embed'],
      defaultContent: [],
    },
    {
      id: 'our-thinking',
      name: 'Our Thinking Section',
      selector: '.cmp-promo-container--single-row-multi-columns',
      style: 'light',
      blocks: ['cards'],
      defaultContent: ['.cmp-sticky-bar--homepage h3'],
    },
    {
      id: 'our-work',
      name: 'Our Work Section',
      selector: '.cmp-dual-slider',
      style: 'dark',
      blocks: ['carousel'],
      defaultContent: ['.cmp-sticky-bar--homepage h3', "a[href*='client-stories']"],
    },
    {
      id: 'careers',
      name: 'Careers Section',
      selector: '.cmp-cta__standard-img--large',
      style: null,
      blocks: ['columns'],
      defaultContent: ['.cmp-sticky-bar--homepage h3'],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  deloitteCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [deloitteSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;
    const main = document.body;

    // 1. Execute beforeTransform transformers
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate path — override to target test/deloitte directory
    const path = '/test/deloitte/us/en/index';

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
