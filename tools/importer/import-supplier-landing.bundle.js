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

  // tools/importer/import-supplier-landing.js
  var import_supplier_landing_exports = {};
  __export(import_supplier_landing_exports, {
    default: () => import_supplier_landing_default
  });

  // tools/importer/parsers/hero.js
  function parse(element, { document }) {
    const iframe = element.querySelector('iframe[src*="vimeo"], iframe[src*="youtube"]');
    let videoUrl = null;
    if (iframe) {
      const src = iframe.getAttribute("src") || "";
      const vimeoMatch = src.match(/vimeo\.com\/(?:video\/)?(\d+)/);
      const ytMatch = src.match(/youtube\.com\/embed\/([^?]+)/);
      if (vimeoMatch) {
        videoUrl = `https://vimeo.com/${vimeoMatch[1]}`;
      } else if (ytMatch) {
        videoUrl = `https://www.youtube.com/watch?v=${ytMatch[1]}`;
      }
    }
    const bgImage = element.querySelector('img[class*="hero"], img[class*="background"], .media-hero-2 img, img');
    const titleContainer = element.querySelector('.title-container-large, [class*="title-container"]');
    const headings = titleContainer ? Array.from(titleContainer.querySelectorAll("p, h1, h2")) : Array.from(element.querySelectorAll('h1, h2, [class*="title"] > p'));
    const descContainer = element.querySelector('.description-container, [class*="description-container"]');
    const descriptions = descContainer ? Array.from(descContainer.querySelectorAll("p")) : [];
    const ctaLinks = Array.from(element.querySelectorAll('a.content-block-cta-v3, a[class*="cta"], a[href]'));
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (headings.length > 0) {
      const h1 = document.createElement("h1");
      h1.textContent = headings.map((h) => h.textContent.trim()).join(" ");
      contentCell.push(h1);
    }
    descriptions.forEach((desc) => {
      if (desc.textContent.trim()) {
        contentCell.push(desc);
      }
    });
    if (videoUrl) {
      const videoLink = document.createElement("a");
      videoLink.href = videoUrl;
      videoLink.textContent = videoUrl;
      contentCell.push(videoLink);
    }
    ctaLinks.forEach((link) => {
      if (link.textContent.trim() && link.getAttribute("href")) {
        contentCell.push(link);
      }
    });
    if (contentCell.length > 0) {
      cells.push([contentCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero", cells });
    element.replaceWith(block);
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

  // tools/importer/parsers/carousel.js
  function parse3(element, { document }) {
    const items = element.querySelectorAll(".carousel-item-wrapper-3");
    const cells = [];
    items.forEach((item) => {
      const link = item.querySelector("a.carousel-item-link-3, a[href]");
      const img = item.querySelector("img.carousel-image-3, img");
      const titleEl = item.querySelector("h5.item-title, h5");
      const descEl = item.querySelector('.item-description-3, [class*="description"]');
      const imageCell = [];
      if (img) {
        const newImg = document.createElement("img");
        let src = img.getAttribute("src") || img.getAttribute("data-src") || "";
        if (src.startsWith("/")) {
          src = `https://corporate.walmart.com${src}`;
        }
        newImg.src = src;
        newImg.alt = img.getAttribute("alt") || "";
        imageCell.push(newImg);
      }
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
      const block = WebImporter.Blocks.createBlock(document, { name: "carousel", cells });
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/cards.js
  function parse4(element, { document }) {
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

  // tools/importer/import-supplier-landing.js
  var parsers = {
    "hero": parse,
    "columns": parse2,
    "carousel": parse3,
    "cards": parse4
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "supplier-landing",
    description: "Main landing page for Investing in American Jobs with hero video, CTA banners, partner carousel, and news feed",
    urls: [
      "https://corporate.walmart.com/suppliers/investing-in-american-jobs"
    ],
    blocks: [
      {
        name: "hero",
        instances: [".media-hero-2-0"]
      },
      {
        name: "columns",
        instances: [".block-fifty-fifty-v3"]
      },
      {
        name: "carousel",
        instances: [".carousel-3\\.0"]
      },
      {
        name: "cards",
        instances: [".article-list-3-0"]
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
  var import_supplier_landing_default = {
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
  return __toCommonJS(import_supplier_landing_exports);
})();
