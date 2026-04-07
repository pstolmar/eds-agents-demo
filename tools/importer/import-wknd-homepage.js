/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import wkndCarouselParser from './parsers/wknd-carousel.js';
import wkndColumnsParser from './parsers/wknd-columns.js';
import wkndCardsParser from './parsers/wknd-cards.js';
import wkndHeroParser from './parsers/wknd-hero.js';

// TRANSFORMER IMPORTS
import wkndCleanupTransformer from './transformers/wknd-cleanup.js';
import wkndSectionsTransformer from './transformers/wknd-sections.js';

// PARSER REGISTRY
const parsers = {
  'carousel': wkndCarouselParser,
  'columns': wkndColumnsParser,
  'cards': wkndCardsParser,
  'hero': wkndHeroParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'wknd-homepage',
  description: 'WKND homepage with hero, featured adventures carousel, featured articles, and next adventures section',
  urls: [
    'https://wknd.site/',
  ],
  blocks: [
    {
      name: 'carousel',
      instances: ['.cmp-carousel--hero'],
    },
    {
      name: 'columns',
      instances: ['.cmp-teaser--featured'],
    },
    {
      name: 'cards',
      instances: ['.cmp-contentfragmentlist', '.cmp-carousel:not(.cmp-carousel--hero)'],
    },
    {
      name: 'hero',
      instances: ['.teaser.cmp-teaser--hero:not(.cmp-carousel--hero .cmp-teaser--hero)'],
    },
  ],
  sections: [
    {
      id: 'hero-carousel',
      name: 'Hero Carousel',
      selector: '.cmp-carousel--hero',
      style: null,
      blocks: ['carousel'],
      defaultContent: [],
    },
    {
      id: 'featured-article',
      name: 'Featured Article',
      selector: '.cmp-teaser--featured',
      style: null,
      blocks: ['columns'],
      defaultContent: [],
    },
    {
      id: 'recent-articles',
      name: 'Recent Articles',
      selector: '.cmp-contentfragmentlist',
      style: null,
      blocks: ['cards'],
      defaultContent: ['h2.cmp-title__text', '.cmp-teaser__action-link'],
    },
    {
      id: 'next-adventures',
      name: 'Next Adventures',
      selector: '.teaser.cmp-teaser--hero:not(.cmp-carousel--hero .cmp-teaser--hero)',
      style: null,
      blocks: ['hero'],
      defaultContent: ['h2.cmp-title__text'],
    },
    {
      id: 'adventure-carousel',
      name: 'Adventure Carousel',
      selector: '.cmp-carousel:not(.cmp-carousel--hero)',
      style: 'dark',
      blocks: ['cards'],
      defaultContent: ['h3.cmp-title__text', '.cmp-teaser__action-link'],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  wkndCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [wkndSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
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
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;
    const main = document.body;

    // 1. Execute beforeTransform transformers (cleanup cookie banners, tracking)
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

    // 4. Execute afterTransform transformers (remove header/footer, add sections)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index',
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
