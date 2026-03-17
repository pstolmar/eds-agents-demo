/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import cardsParser from './parsers/cards.js';
import columnsParser from './parsers/columns.js';

// TRANSFORMER IMPORTS
import walmartCleanupTransformer from './transformers/walmart-cleanup.js';

// PARSER REGISTRY
const parsers = {
  'cards': cardsParser,
  'columns': columnsParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  walmartCleanupTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'supplier-content',
  description: 'Content page with secondary navigation, breadcrumbs, body content with headings, lists, links, and optional embedded resources',
  urls: [
    'https://corporate.walmart.com/suppliers/investing-in-american-jobs/about-us-manufacturing-initiative',
    'https://corporate.walmart.com/suppliers/investing-in-american-jobs/manufacturing-resources/site-selection-guide',
    'https://corporate.walmart.com/suppliers/investing-in-american-jobs/manufacturing-resources/economic-development-contacts',
    'https://corporate.walmart.com/suppliers/investing-in-american-jobs/manufacturing-resources/walmart-external-resources-reshoring-initiative',
    'https://corporate.walmart.com/suppliers/investing-in-american-jobs/manufacturing-resources/non-governmental-resources',
    'https://corporate.walmart.com/suppliers/investing-in-american-jobs/manufacturing-resources/state-and-federal-government-resources',
    'https://corporate.walmart.com/suppliers/investing-in-american-jobs/manufacturing-resources/financing-resources',
    'https://corporate.walmart.com/suppliers/investing-in-american-jobs/manufacturing-resources/supply-chain-resources',
    'https://corporate.walmart.com/suppliers/investing-in-american-jobs/packaging/packaging',
    'https://corporate.walmart.com/suppliers/investing-in-american-jobs/packaging/product-certification',
    'https://corporate.walmart.com/suppliers/investing-in-american-jobs/events/annual-open-call/open-call-2026',
    'https://corporate.walmart.com/suppliers/investing-in-american-jobs/events/annual-open-call',
    'https://corporate.walmart.com/suppliers/investing-in-american-jobs/become-a-supplier',
  ],
  blocks: [
    {
      name: 'cards',
      instances: ['.article-list-3-0'],
    },
    {
      name: 'columns',
      instances: ['.block-fifty-fifty-v3'],
    },
  ],
};

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

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

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
