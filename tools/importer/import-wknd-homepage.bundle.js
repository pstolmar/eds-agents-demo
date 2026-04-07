var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-wknd-homepage.js
  var import_wknd_homepage_exports = {};
  __export(import_wknd_homepage_exports, {
    default: () => import_wknd_homepage_default
  });

  // tools/importer/parsers/wknd-carousel.js
  function parse(element, { document }) {
    const items = element.querySelectorAll(".cmp-carousel__item");
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector(".cmp-image__image, img");
      const title = item.querySelector(".cmp-teaser__title, h2");
      const desc = item.querySelector(".cmp-teaser__description");
      const cta = item.querySelector(".cmp-teaser__action-link, a[href]");
      const contentCell = [];
      if (title) contentCell.push(title);
      if (desc) contentCell.push(desc);
      if (cta) contentCell.push(cta);
      cells.push([img || "", contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/wknd-columns.js
  function parse2(element, { document }) {
    const img = element.querySelector(".cmp-image__image, img");
    const pretitle = element.querySelector(".cmp-teaser__pretitle");
    const title = element.querySelector(".cmp-teaser__title, h2");
    const desc = element.querySelector(".cmp-teaser__description");
    const cta = element.querySelector(".cmp-teaser__action-link, a[href]");
    const contentCell = [];
    if (pretitle) {
      const em = document.createElement("em");
      em.textContent = pretitle.textContent.trim();
      contentCell.push(em);
    }
    if (title) contentCell.push(title);
    if (desc) contentCell.push(desc);
    if (cta) contentCell.push(cta);
    const cells = [[img || "", contentCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/wknd-cards.js
  function parse3(element, { document }) {
    const items = element.querySelectorAll(".cmp-image-list__item");
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector(".cmp-image__image, img");
      const titleLink = item.querySelector(".cmp-image-list__item-title-link");
      const titleSpan = item.querySelector(".cmp-image-list__item-title");
      const descSpan = item.querySelector(".cmp-image-list__item-description");
      const contentCell = [];
      if (titleSpan && titleLink) {
        const strong = document.createElement("strong");
        const a = document.createElement("a");
        a.href = titleLink.getAttribute("href");
        a.textContent = titleSpan.textContent.trim();
        strong.appendChild(a);
        contentCell.push(strong);
      } else if (titleSpan) {
        const strong = document.createElement("strong");
        strong.textContent = titleSpan.textContent.trim();
        contentCell.push(strong);
      }
      if (descSpan && descSpan.textContent.trim()) {
        const p = document.createElement("p");
        p.textContent = descSpan.textContent.trim();
        contentCell.push(p);
      }
      cells.push([img || "", contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/wknd-hero.js
  function parse4(element, { document }) {
    const img = element.querySelector(".cmp-image__image, img");
    const title = element.querySelector(".cmp-teaser__title, h2");
    const desc = element.querySelector(".cmp-teaser__description");
    const cta = element.querySelector(".cmp-teaser__action-link, a[href]");
    const cells = [];
    if (img) {
      cells.push([img]);
    }
    const contentCell = [];
    if (title) contentCell.push(title);
    if (desc) contentCell.push(desc);
    if (cta) contentCell.push(cta);
    cells.push(contentCell);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        '[class*="consent"]',
        '[class*="cookie"]',
        'img[src*="demdex.net"]',
        'img[src*="2o7.net"]'
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "header.experiencefragment",
        ".cmp-experiencefragment--header",
        "footer.experiencefragment",
        ".cmp-experiencefragment--footer",
        ".wknd-sign-in-buttons",
        ".sign-in-buttons",
        ".cmp-languagenavigation",
        ".cmp-separator",
        "iframe",
        "link",
        "noscript"
      ]);
      element.querySelectorAll("[data-cmp-data-layer]").forEach((el) => {
        el.removeAttribute("data-cmp-data-layer");
      });
      element.querySelectorAll("[data-cmp-clickable]").forEach((el) => {
        el.removeAttribute("data-cmp-clickable");
      });
    }
  }

  // tools/importer/transformers/wknd-sections.js
  function transform2(hookName, element, payload) {
    if (hookName === "afterTransform") {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element.getRootNode() };
      const sections = [...template.sections].reverse();
      sections.forEach((section) => {
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
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.parentElement.insertBefore(metaBlock, sectionEl.nextSibling);
        }
        const isFirst = section === template.sections[0];
        if (!isFirst) {
          const hr = document.createElement("hr");
          sectionEl.parentElement.insertBefore(hr, sectionEl);
        }
      });
    }
  }

  // tools/importer/import-wknd-homepage.js
  var parsers = {
    "carousel": parse,
    "columns": parse2,
    "cards": parse3,
    "hero": parse4
  };
  var PAGE_TEMPLATE = {
    name: "wknd-homepage",
    description: "WKND homepage with hero, featured adventures carousel, featured articles, and next adventures section",
    urls: [
      "https://wknd.site/"
    ],
    blocks: [
      {
        name: "carousel",
        instances: [".cmp-carousel--hero"]
      },
      {
        name: "columns",
        instances: [".cmp-teaser--featured"]
      },
      {
        name: "cards",
        instances: [".cmp-contentfragmentlist", ".cmp-carousel:not(.cmp-carousel--hero)"]
      },
      {
        name: "hero",
        instances: [".teaser.cmp-teaser--hero:not(.cmp-carousel--hero .cmp-teaser--hero)"]
      }
    ],
    sections: [
      {
        id: "hero-carousel",
        name: "Hero Carousel",
        selector: ".cmp-carousel--hero",
        style: null,
        blocks: ["carousel"],
        defaultContent: []
      },
      {
        id: "featured-article",
        name: "Featured Article",
        selector: ".cmp-teaser--featured",
        style: null,
        blocks: ["columns"],
        defaultContent: []
      },
      {
        id: "recent-articles",
        name: "Recent Articles",
        selector: ".cmp-contentfragmentlist",
        style: null,
        blocks: ["cards"],
        defaultContent: ["h2.cmp-title__text", ".cmp-teaser__action-link"]
      },
      {
        id: "next-adventures",
        name: "Next Adventures",
        selector: ".teaser.cmp-teaser--hero:not(.cmp-carousel--hero .cmp-teaser--hero)",
        style: null,
        blocks: ["hero"],
        defaultContent: ["h2.cmp-title__text"]
      },
      {
        id: "adventure-carousel",
        name: "Adventure Carousel",
        selector: ".cmp-carousel:not(.cmp-carousel--hero)",
        style: "dark",
        blocks: ["cards"],
        defaultContent: ["h3.cmp-title__text", ".cmp-teaser__action-link"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    return pageBlocks;
  }
  var import_wknd_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_wknd_homepage_exports);
})();
