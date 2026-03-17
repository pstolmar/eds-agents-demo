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

  // tools/importer/import-partner-story.js
  var import_partner_story_exports = {};
  __export(import_partner_story_exports, {
    default: () => import_partner_story_default
  });

  // tools/importer/parsers/embed.js
  function parse(element, { document }) {
    const iframe = element.querySelector("iframe");
    if (!iframe) return;
    let videoUrl = iframe.getAttribute("src") || "";
    const vimeoMatch = videoUrl.match(/player\.vimeo\.com\/video\/(\d+)/);
    if (vimeoMatch) {
      videoUrl = `https://vimeo.com/${vimeoMatch[1]}`;
    }
    const youtubeMatch = videoUrl.match(/youtube\.com\/embed\/([^?&]+)/);
    if (youtubeMatch) {
      videoUrl = `https://www.youtube.com/watch?v=${youtubeMatch[1]}`;
    }
    const cells = [];
    const link = document.createElement("a");
    link.href = videoUrl;
    link.textContent = videoUrl;
    cells.push([[link]]);
    const block = WebImporter.Blocks.createBlock(document, { name: "embed", cells });
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

  // tools/importer/import-partner-story.js
  var parsers = {
    "embed": parse
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "partner-story",
    description: "Partner story page with hero image/video, company details, impact statistics, and embedded media about supplier partnerships",
    urls: [
      "https://corporate.walmart.com/suppliers/investing-in-american-jobs/partners-in-change/naterra-international",
      "https://corporate.walmart.com/suppliers/investing-in-american-jobs/partners-in-change/fischer-and-wieser-farmstead",
      "https://corporate.walmart.com/suppliers/investing-in-american-jobs/partners-in-change/milos",
      "https://corporate.walmart.com/suppliers/investing-in-american-jobs/partners-in-change/Ferrero",
      "https://corporate.walmart.com/suppliers/investing-in-american-jobs/partners-in-change/athletic-brewing",
      "https://corporate.walmart.com/suppliers/investing-in-american-jobs/partners-in-change/pholicious",
      "https://corporate.walmart.com/suppliers/investing-in-american-jobs/partners-in-change/freshpet",
      "https://corporate.walmart.com/suppliers/investing-in-american-jobs/partners-in-change/proud-source",
      "https://corporate.walmart.com/suppliers/investing-in-american-jobs/partners-in-change/igloo",
      "https://corporate.walmart.com/suppliers/investing-in-american-jobs/partners-in-change/grind-goods",
      "https://corporate.walmart.com/suppliers/investing-in-american-jobs/partners-in-change/nordic-ware"
    ],
    blocks: [
      {
        name: "embed",
        instances: [".video-2\\.0"]
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
  var import_partner_story_default = {
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
  return __toCommonJS(import_partner_story_exports);
})();
