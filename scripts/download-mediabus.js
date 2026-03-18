#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * download-mediabus.js — Download remote DAM images to local mediabus.
 * Scans wm-eds/2 .plain.html files, downloads up to MAX_PER_PAGE images
 * per page, saves to /content/wm-eds/2/media/, and rewrites src attributes
 * to point to local copies.
 *
 * Usage: node scripts/download-mediabus.js [--dry-run]
 */

import {
  readdir, readFile, writeFile, mkdir,
} from 'node:fs/promises';
import { createWriteStream, existsSync } from 'node:fs';
import {
  join, extname, dirname, relative,
} from 'node:path';
import { createHash } from 'node:crypto';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const CONTENT_ROOT = '/workspace/content/wm-eds/2';
const MEDIA_DIR = join(CONTENT_ROOT, 'media');
const MAX_PER_PAGE = 20;
const DRY_RUN = process.argv.includes('--dry-run');

/* Recursively find all .plain.html files */
async function findHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const full = join(dir, entry.name);
      if (entry.isDirectory() && entry.name !== 'media') {
        return findHtmlFiles(full);
      }
      if (entry.isFile() && entry.name.endsWith('.plain.html')) {
        return [full];
      }
      return [];
    }),
  );
  return nested.flat();
}

/* Extract unique remote image URLs from HTML string */
function extractImageUrls(html) {
  const regex = /src="(https?:\/\/[^"]+\.(jpg|jpeg|png|gif|svg|webp|JPG|JPEG|PNG|GIF|SVG|WEBP)(?:\?[^"]*)?)"/gi;
  const matches = [...html.matchAll(regex)];
  return [...new Set(matches.map((m) => m[1]))];
}

/* Generate a short content-hash filename for a URL */
function urlToFilename(url) {
  const hash = createHash('md5').update(url).digest('hex').slice(0, 12);
  /* Get extension from URL path (ignore query params) */
  const urlPath = new URL(url).pathname;
  let ext = extname(urlPath).toLowerCase();
  if (!ext || ext.length > 6) ext = '.jpg'; /* Fallback */
  return `media_${hash}${ext}`;
}

/* Download a single image */
async function downloadImage(url, destPath) {
  try {
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; EDS-Mediabus/1.0)' },
      signal: AbortSignal.timeout(15000),
    });
    if (!resp.ok) {
      console.log(`  SKIP (${resp.status}) ${url}`);
      return false;
    }
    const body = Readable.fromWeb(resp.body);
    await pipeline(body, createWriteStream(destPath));
    return true;
  } catch (err) {
    console.log(`  FAIL ${url} — ${err.message}`);
    return false;
  }
}

/* Process a single page URL for download */
async function processUrl(url, globalUrlMap, stats) {
  const filename = urlToFilename(url);
  const destPath = join(MEDIA_DIR, filename);

  if (globalUrlMap.has(url)) {
    return 0; /* Already downloaded from another page */
  }

  if (existsSync(destPath)) {
    console.log(`  EXISTS ${filename}`);
    globalUrlMap.set(url, filename);
    stats.totalSkipped += 1;
    return 0;
  }

  if (DRY_RUN) {
    console.log(`  WOULD download → ${filename}`);
    globalUrlMap.set(url, filename);
    return 1;
  }

  const ok = await downloadImage(url, destPath);
  if (ok) {
    console.log(`  ✓ ${filename}`);
    globalUrlMap.set(url, filename);
    stats.totalDownloaded += 1;
    return 1;
  }
  stats.totalFailed += 1;
  return 0;
}

/* Process a single HTML file */
async function processFile(file, globalUrlMap, stats) {
  const relPath = relative(CONTENT_ROOT, file);
  const html = await readFile(file, 'utf8');
  const urls = extractImageUrls(html);

  if (!urls.length) {
    console.log(`📄 ${relPath} — no remote images`);
    return;
  }

  const pageUrls = urls.slice(0, MAX_PER_PAGE);
  const skippedCount = urls.length - pageUrls.length;

  console.log(`📄 ${relPath} — ${urls.length} images (downloading ${pageUrls.length}${skippedCount ? `, skipping ${skippedCount}` : ''})`);

  /* Download sequentially to avoid overwhelming the server */
  const pageDownloads = await pageUrls.reduce(async (accP, url) => {
    const acc = await accP;
    const count = await processUrl(url, globalUrlMap, stats);
    return acc + count;
  }, Promise.resolve(0));

  /* Rewrite HTML to use local media paths */
  if (!DRY_RUN && pageDownloads > 0) {
    const updated = pageUrls.reduce((htm, url) => {
      const filename = globalUrlMap.get(url);
      if (!filename) return htm;
      const fileDir = dirname(file);
      const mediaRelPath = relative(fileDir, MEDIA_DIR);
      const localSrc = `${mediaRelPath}/${filename}`;
      return htm.replaceAll(`src="${url}"`, `src="${localSrc}"`);
    }, html);
    if (updated !== html) {
      await writeFile(file, updated, 'utf8');
      stats.filesUpdated += 1;
    }
  }
}

async function main() {
  console.log('\n🗂️  Mediabus Image Downloader');
  console.log(`   Content root: ${CONTENT_ROOT}`);
  console.log(`   Media dir:    ${MEDIA_DIR}`);
  console.log(`   Max/page:     ${MAX_PER_PAGE}`);
  if (DRY_RUN) console.log('   MODE: DRY RUN (no downloads or edits)\n');
  else console.log('');

  /* Ensure media directory exists */
  if (!DRY_RUN) {
    await mkdir(MEDIA_DIR, { recursive: true });
  }

  const htmlFiles = await findHtmlFiles(CONTENT_ROOT);
  console.log(`Found ${htmlFiles.length} content files\n`);

  const globalUrlMap = new Map(); /* url -> local filename */
  const stats = {
    totalDownloaded: 0,
    totalSkipped: 0,
    totalFailed: 0,
    filesUpdated: 0,
  };

  /* Process files sequentially */
  await htmlFiles.reduce(async (prev, file) => {
    await prev;
    return processFile(file, globalUrlMap, stats);
  }, Promise.resolve());

  console.log('\n📊 Summary:');
  console.log(`   Downloaded: ${stats.totalDownloaded}`);
  console.log(`   Already existed: ${stats.totalSkipped}`);
  console.log(`   Failed: ${stats.totalFailed}`);
  console.log(`   Files updated: ${stats.filesUpdated}`);
  console.log(`   Unique images: ${globalUrlMap.size}\n`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
