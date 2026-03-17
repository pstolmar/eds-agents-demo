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

  // tools/importer/import-askwalmart.js
  var import_askwalmart_exports = {};
  __export(import_askwalmart_exports, {
    default: () => import_askwalmart_default
  });

  // tools/importer/parsers/accordion.js
  function parse(element, { document }) {
    const tabNames = ["Customers", "Purpose", "Suppliers", "General"];
    const tabPanes = element.querySelectorAll(".tab-pane-tabs");
    if (!tabPanes.length) return;
    const fragment = document.createDocumentFragment();
    tabPanes.forEach((pane, index) => {
      if (index >= tabNames.length) return;
      const items = pane.querySelectorAll(".accordion-item-component-2");
      if (!items.length) return;
      if (index > 0) {
        fragment.appendChild(document.createElement("hr"));
      }
      const heading = document.createElement("h2");
      heading.textContent = tabNames[index];
      fragment.appendChild(heading);
      const cells = [];
      items.forEach((item) => {
        const titleEl = item.querySelector(".item-header-text-2");
        const question = titleEl ? titleEl.textContent.trim() : "";
        if (!question) return;
        const contentEl = item.querySelector(".item-content-2");
        const rteEl = contentEl ? contentEl.querySelector(".rte-styles") : null;
        const questionCell = document.createDocumentFragment();
        const qText = document.createElement("p");
        qText.textContent = question;
        questionCell.appendChild(qText);
        const answerCell = document.createDocumentFragment();
        if (rteEl) {
          Array.from(rteEl.childNodes).forEach((node) => {
            answerCell.appendChild(node.cloneNode(true));
          });
        }
        cells.push([[questionCell], [answerCell]]);
      });
      if (cells.length > 0) {
        const block = WebImporter.Blocks.createBlock(document, {
          name: "accordion",
          cells
        });
        fragment.appendChild(block);
      }
    });
    element.replaceWith(fragment);
  }

  // tools/importer/transformers/walmart-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        ".html-component-2\\.0",
        "#onetrust-consent-sdk",
        '[class*="cookie"]',
        "#px-captcha",
        ".popup"
      ]);
      element.querySelectorAll(".whitespace").forEach((el) => el.remove());
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        ".walmart-hub-header",
        "#header-container",
        "#hamburger-container",
        "#header-search-bar",
        "#user-profile-container",
        ".user-profile-notifications",
        ".cmp-experiencefragment--header"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "footer",
        ".cmp-experiencefragment--footer",
        ".footer"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".in-page-navigation-2-0",
        ".in-page-navigation-component-2",
        ".reference"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".breadcrumb-2\\.0",
        '[class*="breadcrumb"]'
      ]);
      WebImporter.DOMUtils.remove(element, [
        "noscript",
        "link"
      ]);
      element.querySelectorAll("[data-track], [onclick], [data-analytics]").forEach((el) => {
        el.removeAttribute("data-track");
        el.removeAttribute("onclick");
        el.removeAttribute("data-analytics");
      });
    }
  }

  // tools/importer/import-askwalmart.js
  var parsers = {
    "accordion": parse
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "askwalmart",
    description: "FAQ page with tabbed accordion sections for Customers, Purpose, Suppliers, and General categories",
    urls: [
      "https://corporate.walmart.com/askwalmart"
    ],
    blocks: [
      {
        name: "accordion",
        instances: [".tabs-3-component"]
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
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
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_askwalmart_default = {
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
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
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
  return __toCommonJS(import_askwalmart_exports);
})();
