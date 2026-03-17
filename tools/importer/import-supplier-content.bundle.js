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

  // tools/importer/import-supplier-content.js
  var import_supplier_content_exports = {};
  __export(import_supplier_content_exports, {
    default: () => import_supplier_content_default
  });

  // tools/importer/parsers/cards.js
  function parse(element, { document }) {
    const cardItems = element.querySelectorAll(".card-item");
    const cells = [];
    cardItems.forEach((item) => {
      const link = item.querySelector("a[href]");
      const img = item.querySelector("img");
      const titleEl = item.querySelector("h6, .card-item-text-title");
      const bodyEl = item.querySelector(".card-item-text-body p, .card-item-text-body");
      const imageCell = [];
      if (img) {
        const newImg = document.createElement("img");
        let src = img.getAttribute("data-src") || img.getAttribute("src") || "";
        if (src.startsWith("/")) {
          src = `https://corporate.walmart.com${src}`;
        }
        newImg.src = src;
        newImg.alt = img.getAttribute("alt") || "";
        imageCell.push(newImg);
      }
      const contentCell = [];
      if (titleEl && titleEl.textContent.trim()) {
        const titleP = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = titleEl.textContent.trim();
        titleP.appendChild(strong);
        contentCell.push(titleP);
      }
      if (bodyEl && bodyEl.textContent.trim()) {
        const p = document.createElement("p");
        p.textContent = bodyEl.textContent.trim();
        contentCell.push(p);
      }
      if (link && link.getAttribute("href")) {
        const a = document.createElement("a");
        a.href = link.getAttribute("href");
        a.textContent = titleEl ? titleEl.textContent.trim() : "Read More";
        contentCell.push(a);
      }
      if (imageCell.length > 0 || contentCell.length > 0) {
        cells.push([imageCell, contentCell]);
      }
    });
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document, { name: "cards", cells });
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/columns.js
  function parse2(element, { document }) {
    const imageWrap = element.querySelector('.content-block-image-wrap[style*="background-image"]');
    let imageCell = [];
    if (imageWrap) {
      const style = imageWrap.getAttribute("style") || "";
      const match = style.match(/background-image:\s*url\(([^)]+)\)/);
      if (match) {
        const img = document.createElement("img");
        let src = match[1].replace(/['"]/g, "");
        if (src.startsWith("/")) {
          src = `https://corporate.walmart.com${src}`;
        }
        img.src = src;
        img.alt = imageWrap.getAttribute("alt") || "";
        imageCell.push(img);
      }
    }
    const titleEl = element.querySelector(".content-block-title-v3");
    const descEl = element.querySelector(".content-block-text-v3");
    const contentContainer = element.querySelector(".content-block-content-v3");
    const ctaLink = contentContainer ? contentContainer.querySelector("a[href]") : element.querySelector(".content-block-solid-v3 a[href]");
    const contentCell = [];
    if (titleEl && titleEl.textContent.trim()) {
      const h2 = document.createElement("h2");
      h2.textContent = titleEl.textContent.trim();
      contentCell.push(h2);
    }
    if (descEl && descEl.textContent.trim()) {
      const p = document.createElement("p");
      p.textContent = descEl.textContent.trim();
      contentCell.push(p);
    }
    if (ctaLink && ctaLink.getAttribute("href")) {
      const link = document.createElement("a");
      link.href = ctaLink.getAttribute("href");
      link.textContent = ctaLink.textContent.trim();
      contentCell.push(link);
    }
    const isReversed = !!element.querySelector(".content-block-layout-reversed");
    const cells = [];
    if (imageCell.length > 0 && contentCell.length > 0) {
      if (isReversed) {
        cells.push([contentCell, imageCell]);
      } else {
        cells.push([imageCell, contentCell]);
      }
    } else if (contentCell.length > 0) {
      cells.push([contentCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns", cells });
    element.replaceWith(block);
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

  // tools/importer/import-supplier-content.js
  var parsers = {
    "cards": parse,
    "columns": parse2
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "supplier-content",
    description: "Content page with secondary navigation, breadcrumbs, body content with headings, lists, links, and optional embedded resources",
    urls: [
      "https://corporate.walmart.com/suppliers/investing-in-american-jobs/about-us-manufacturing-initiative",
      "https://corporate.walmart.com/suppliers/investing-in-american-jobs/manufacturing-resources/site-selection-guide",
      "https://corporate.walmart.com/suppliers/investing-in-american-jobs/manufacturing-resources/economic-development-contacts",
      "https://corporate.walmart.com/suppliers/investing-in-american-jobs/manufacturing-resources/walmart-external-resources-reshoring-initiative",
      "https://corporate.walmart.com/suppliers/investing-in-american-jobs/manufacturing-resources/non-governmental-resources",
      "https://corporate.walmart.com/suppliers/investing-in-american-jobs/manufacturing-resources/state-and-federal-government-resources",
      "https://corporate.walmart.com/suppliers/investing-in-american-jobs/manufacturing-resources/financing-resources",
      "https://corporate.walmart.com/suppliers/investing-in-american-jobs/manufacturing-resources/supply-chain-resources",
      "https://corporate.walmart.com/suppliers/investing-in-american-jobs/packaging/packaging",
      "https://corporate.walmart.com/suppliers/investing-in-american-jobs/packaging/product-certification",
      "https://corporate.walmart.com/suppliers/investing-in-american-jobs/events/annual-open-call/open-call-2026",
      "https://corporate.walmart.com/suppliers/investing-in-american-jobs/events/annual-open-call",
      "https://corporate.walmart.com/suppliers/investing-in-american-jobs/become-a-supplier"
    ],
    blocks: [
      {
        name: "cards",
        instances: [".article-list-3-0"]
      },
      {
        name: "columns",
        instances: [".block-fifty-fifty-v3"]
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
  var import_supplier_content_default = {
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
  return __toCommonJS(import_supplier_content_exports);
})();
