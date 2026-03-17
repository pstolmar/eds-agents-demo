/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import embedParser from './parsers/embed.js';

// TRANSFORMER IMPORTS
import walmartCleanupTransformer from './transformers/walmart-cleanup.js';

// PARSER REGISTRY
const parsers = {
  'embed': embedParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  walmartCleanupTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'partner-story',
  description: 'Partner story page with hero image/video, company details, impact statistics, and embedded media about supplier partnerships',
  urls: [
    'https://corporate.walmart.com/suppliers/investing-in-american-jobs/partners-in-change/naterra-international',
    'https://corporate.walmart.com/suppliers/investing-in-american-jobs/partners-in-change/fischer-and-wieser-farmstead',
    'https://corporate.walmart.com/suppliers/investing-in-american-jobs/partners-in-change/milos',
    'https://corporate.walmart.com/suppliers/investing-in-american-jobs/partners-in-change/Ferrero',
    'https://corporate.walmart.com/suppliers/investing-in-american-jobs/partners-in-change/athletic-brewing',
    'https://corporate.walmart.com/suppliers/investing-in-american-jobs/partners-in-change/pholicious',
    'https://corporate.walmart.com/suppliers/investing-in-american-jobs/partners-in-change/freshpet',
    'https://corporate.walmart.com/suppliers/investing-in-american-jobs/partners-in-change/proud-source',
    'https://corporate.walmart.com/suppliers/investing-in-american-jobs/partners-in-change/igloo',
    'https://corporate.walmart.com/suppliers/investing-in-american-jobs/partners-in-change/grind-goods',
    'https://corporate.walmart.com/suppliers/investing-in-american-jobs/partners-in-change/nordic-ware',
  ],
  blocks: [
    {
      name: 'embed',
      instances: ['.video-2\\.0'],
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
