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

  // tools/importer/import-wknd-adventures.js
  var import_wknd_adventures_exports = {};
  __export(import_wknd_adventures_exports, {
    default: () => import_wknd_adventures_default
  });

  // tools/importer/parsers/wknd-hero.js
  function parse(element, { document }) {
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

  // tools/importer/parsers/wknd-cards.js
  function parse2(element, { document }) {
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

  // tools/importer/import-wknd-adventures.js
  var parsers = {
    "hero": parse,
    "cards": parse2
  };
  var PAGE_TEMPLATE = {
    name: "wknd-adventures",
    description: "WKND adventures listing page with category filter tabs and adventure card grid",
    urls: ["https://wknd.site/content/wknd/us/en/adventures.html"],
    blocks: [
      { name: "hero", instances: [".cmp-teaser--hero .cmp-teaser"] },
      { name: "cards", instances: [".image-list .cmp-image-list"] }
    ]
  };
  var transformers = [transform];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((fn) => {
      try {
        fn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        document.querySelectorAll(selector).forEach((element) => {
          pageBlocks.push({ name: blockDef.name, selector, element });
        });
      });
    });
    return pageBlocks;
  }
  var import_wknd_adventures_default = {
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
            console.error(`Parse error ${block.name}:`, e);
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
      return [{ element: main, path, report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) } }];
    }
  };
  return __toCommonJS(import_wknd_adventures_exports);
})();
