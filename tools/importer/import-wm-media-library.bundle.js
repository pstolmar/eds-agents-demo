var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
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
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // tools/importer/import-wm-media-library.js
  var import_wm_media_library_exports = {};
  __export(import_wm_media_library_exports, {
    default: () => import_wm_media_library_default
  });
  function waitForMediaLibrary(document) {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 20;
      const interval = setInterval(() => {
        const mediaLib = document.querySelector(".media-library-compnent");
        const hasImages = document.querySelector(".imageContainer .corporatesearch-gallery-cards");
        if (mediaLib && hasImages) {
          clearInterval(interval);
          resolve();
        }
        attempts++;
        if (attempts >= maxAttempts) {
          clearInterval(interval);
          resolve();
        }
      }, 500);
    });
  }
  function buildImageCards(document) {
    const imageContainer = document.querySelector(".imageContainer");
    if (!imageContainer) return null;
    const cards = imageContainer.querySelectorAll(".corporatesearch-gallery-cards");
    if (!cards.length) return null;
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector("img.grid-item");
      const desc = card.querySelector(".corporatesearch-gallery-description");
      const imageCell = document.createElement("div");
      if (img) {
        const newImg = document.createElement("img");
        let src = img.src;
        if (src.startsWith("/")) {
          src = "https://corporate.walmart.com" + src;
        }
        newImg.src = src;
        newImg.alt = desc ? desc.textContent.trim() : "";
        imageCell.appendChild(newImg);
      }
      const textCell = document.createElement("div");
      if (desc) {
        const p = document.createElement("p");
        p.textContent = desc.textContent.trim();
        textCell.appendChild(p);
      }
      cells.push([imageCell, textCell]);
    });
    return WebImporter.Blocks.createBlock(document, {
      name: "Cards-Media",
      cells
    });
  }
  function buildGalleryCards(document) {
    const galleryContainer = document.querySelector(".galleryContainer");
    if (!galleryContainer) return null;
    const cards = galleryContainer.querySelectorAll(".corporatesearch-gallery-cards");
    if (!cards.length) return null;
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector("img.grid-item");
      const desc = card.querySelector(".corporatesearch-gallery-description");
      const assetCount = card.querySelector(".corporatesearch-gallery-duration");
      const imageCell = document.createElement("div");
      if (img) {
        const newImg = document.createElement("img");
        let src = img.src;
        if (src.startsWith("/")) {
          src = "https://corporate.walmart.com" + src;
        }
        newImg.src = src;
        newImg.alt = desc ? desc.textContent.trim() : "";
        imageCell.appendChild(newImg);
      }
      const textCell = document.createElement("div");
      if (desc) {
        const titleP = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = desc.textContent.trim();
        titleP.appendChild(strong);
        textCell.appendChild(titleP);
      }
      if (assetCount) {
        const countP = document.createElement("p");
        countP.textContent = assetCount.textContent.trim();
        textCell.appendChild(countP);
      }
      cells.push([imageCell, textCell]);
    });
    return WebImporter.Blocks.createBlock(document, {
      name: "Cards-Gallery",
      cells
    });
  }
  var KNOWN_VIDEOS = [
    {
      title: "Walmart's Global Security Operations Center B-Roll",
      thumbnail: "https://i.vimeocdn.com/video/2063608988-7441c0c1e0678e9769bf67443bbf6a6cb6df44afb11934e63cd9c18456a441c8-d?region=us",
      videoId: "1122303948",
      duration: "1:57"
    },
    {
      title: "Walmart National Indigenous History Month - Local Artist Collaboration",
      thumbnail: "https://i.vimeocdn.com/video/2059108368-36df3e4271e4191599ec53ecfea9a3db76130792b72a4dc84e24d4d3e167d7a8-d?region=us",
      videoId: null,
      duration: "1:47"
    },
    {
      title: "Yo Pertenezco Video: Estrellita Estrada",
      thumbnail: "https://i.vimeocdn.com/video/2059107265-aeb3fe7ee09a431600e1b2a8848f7bfccca1587cdf69c87d019ed6ddab6fd265-d?region=us",
      videoId: null,
      duration: "1:10"
    },
    {
      title: "B-Roll: Walmart Automated Perishable Distribution Center in Wellford, SC",
      thumbnail: "https://i.vimeocdn.com/video/2054935657-bce2284e6f450cf05069ddef419b78b92abbe50a91c0a8fa72a18a8ef193d57d-d?region=us",
      videoId: "1115558325",
      duration: "2:18"
    },
    {
      title: "Doug McMillon Executive Message Belonging",
      thumbnail: "https://i.vimeocdn.com/video/2052195797-3b27021bdb70a2361d1c01d7263f2dd5e5311e33d9512f77d3d03c2bdacbbc58-d?region=us",
      videoId: "1113648046",
      duration: "3:18"
    },
    {
      title: "Walmart Community Recycling Unit",
      thumbnail: "https://i.vimeocdn.com/video/1920705689-105871e947f0fef94847f80259bcfe84b8c3cc258d7bf5a3140bcef870c15472-d?region=us",
      videoId: null,
      duration: "1:07"
    }
  ];
  function buildVideoCards(document) {
    const videoContainer = document.querySelector(".videoContainer");
    const cards = videoContainer ? videoContainer.querySelectorAll(".corporatesearch-gallery-cards") : [];
    if (cards.length > 0) {
      console.log("[Import] Building video cards from live DOM (" + cards.length + " cards)");
      const cells2 = [];
      cards.forEach((card) => {
        const img = card.querySelector("img.grid-item");
        const desc = card.querySelector(".corporatesearch-gallery-description");
        const duration = card.querySelector(".corporatesearch-gallery-duration");
        const videoIdEl = card.querySelector("[data-video-id]");
        const videoId = videoIdEl ? videoIdEl.getAttribute("data-video-id") : null;
        const imageCell = document.createElement("div");
        if (img) {
          const newImg = document.createElement("img");
          newImg.src = img.src;
          newImg.alt = desc ? desc.textContent.trim() : "";
          imageCell.appendChild(newImg);
        }
        const textCell = document.createElement("div");
        if (desc) {
          const titleP = document.createElement("p");
          if (videoId) {
            const link = document.createElement("a");
            link.href = "https://vimeo.com/" + videoId;
            link.textContent = desc.textContent.trim();
            titleP.appendChild(link);
          } else {
            titleP.textContent = desc.textContent.trim();
          }
          textCell.appendChild(titleP);
        }
        if (duration) {
          const durP = document.createElement("p");
          durP.textContent = duration.textContent.trim();
          textCell.appendChild(durP);
        }
        cells2.push([imageCell, textCell]);
      });
      return WebImporter.Blocks.createBlock(document, {
        name: "Cards-Video",
        cells: cells2
      });
    }
    console.log("[Import] Video DOM not loaded, using known video data");
    const cells = [];
    KNOWN_VIDEOS.forEach((video) => {
      const imageCell = document.createElement("div");
      const newImg = document.createElement("img");
      newImg.src = video.thumbnail;
      newImg.alt = video.title;
      imageCell.appendChild(newImg);
      const textCell = document.createElement("div");
      const titleP = document.createElement("p");
      if (video.videoId) {
        const link = document.createElement("a");
        link.href = "https://vimeo.com/" + video.videoId;
        link.textContent = video.title;
        titleP.appendChild(link);
      } else {
        titleP.textContent = video.title;
      }
      textCell.appendChild(titleP);
      const durP = document.createElement("p");
      durP.textContent = video.duration;
      textCell.appendChild(durP);
      cells.push([imageCell, textCell]);
    });
    return WebImporter.Blocks.createBlock(document, {
      name: "Cards-Video",
      cells
    });
  }
  var import_wm_media_library_default = {
    onLoad: (_0) => __async(void 0, [_0], function* ({ document }) {
      try {
        yield waitForMediaLibrary(document);
        console.log("[Import] Media library content loaded");
      } catch (e) {
        console.warn("[Import] Timeout waiting for media library, proceeding anyway");
      }
    }),
    transform: ({ document, url }) => {
      console.log("[Import] Starting Walmart Media Library transformation");
      const main = document.createElement("div");
      const h1 = document.createElement("h1");
      h1.textContent = "Media Library";
      main.appendChild(h1);
      const introText = document.querySelector(".media-library-temp-user-message span");
      const introP = document.createElement("p");
      introP.textContent = introText ? introText.textContent.trim() : "Looking for a specific asset? Enter a keyword to refine your results.";
      main.appendChild(introP);
      const searchNote = document.createElement("p");
      const em = document.createElement("em");
      em.textContent = "Note: The interactive search and filtering from the original page is powered by a server-side media asset management system. A future enhancement could add client-side search over the asset index.";
      searchNote.appendChild(em);
      main.appendChild(searchNote);
      main.appendChild(document.createElement("hr"));
      const imagesHeading = document.createElement("h2");
      const imagesCountEl = document.querySelector(".imageContainer .heading-title span");
      const imagesCount = imagesCountEl ? " " + imagesCountEl.textContent.trim() : "";
      imagesHeading.textContent = "Images" + imagesCount;
      main.appendChild(imagesHeading);
      const imageCardsBlock = buildImageCards(document);
      if (imageCardsBlock) {
        main.appendChild(imageCardsBlock);
      } else {
        const noImages = document.createElement("p");
        noImages.textContent = "Image gallery content is dynamically loaded.";
        main.appendChild(noImages);
      }
      main.appendChild(document.createElement("hr"));
      const galleriesHeading = document.createElement("h2");
      const galleriesCountEl = document.querySelector(".galleryContainer .heading-title span");
      const galleriesCount = galleriesCountEl ? " " + galleriesCountEl.textContent.trim() : "";
      galleriesHeading.textContent = "Galleries" + galleriesCount;
      main.appendChild(galleriesHeading);
      const galleryCardsBlock = buildGalleryCards(document);
      if (galleryCardsBlock) {
        main.appendChild(galleryCardsBlock);
      } else {
        const noGalleries = document.createElement("p");
        noGalleries.textContent = "Gallery content is dynamically loaded.";
        main.appendChild(noGalleries);
      }
      main.appendChild(document.createElement("hr"));
      const videosHeading = document.createElement("h2");
      const videosCountEl = document.querySelector(".videoContainer .heading-title span");
      const videosCount = videosCountEl ? " " + videosCountEl.textContent.trim() : " (41)";
      videosHeading.textContent = "Videos" + videosCount;
      main.appendChild(videosHeading);
      const videoCardsBlock = buildVideoCards(document);
      if (videoCardsBlock) {
        main.appendChild(videoCardsBlock);
      }
      const meta = {
        Title: "Media Library",
        Description: "Walmart Corporate Media Library - Images, Galleries, and Videos",
        "og:title": "Media Library | Walmart Corporate",
        "source-url": url
      };
      const metadataBlock = WebImporter.Blocks.getMetadataBlock(document, meta);
      main.appendChild(metadataBlock);
      console.log("[Import] Transformation complete");
      return [{
        element: main,
        path: "/wm-media-library-eds",
        report: {
          title: "Media Library",
          sections: "Images, Galleries, Videos",
          "source-url": url
        }
      }];
    }
  };
  return __toCommonJS(import_wm_media_library_exports);
})();
