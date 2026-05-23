#!/usr/bin/env node
// Modern build script for philippjauss.gate107.com
// Replaces Gulp with plain Node.js + sharp + workbox

import { mkdir, copyFile, rm, readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { minify } from 'html-minifier-terser';
import * as cheerio from 'cheerio';
import sharp from 'sharp';
import { injectManifest } from 'workbox-build';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(__dirname, 'src');
const APP = resolve(__dirname, 'app');

// ── Helpers ──────────────────────────────────────────────
function info(msg) { console.log(`  ✓ ${msg}`); }
function run(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, { stdio: 'inherit', ...opts });
  if (res.status !== 0) {
    console.error(`❌ ${cmd} ${args.join(' ')} failed with code ${res.status}`);
    process.exit(1);
  }
}

async function ensureDir(path) {
  await mkdir(path, { recursive: true });
}

// ── Tasks ────────────────────────────────────────────────

async function clean() {
  await rm(APP, { recursive: true, force: true });
  info('Cleaned app/ directory');
}

async function compileSass() {
  await ensureDir(resolve(APP, 'css'));
  run('npx', ['sass', 'src/css/site.scss', 'app/css/site.css', '--no-source-map', '--style=compressed']);
  run('npx', ['postcss', 'app/css/site.css', '--replace', '--no-map']);
  info('Sass compiled & autoprefixed');
}

async function inlineAndMinifyHTML() {
  await ensureDir(APP);
  const files = ['index.html', 'uebermich.html', 'cv.html', 'kontakt.html'];
  for (const file of files) {
    const srcPath = resolve(SRC, file);
    try {
      const html = await readFile(srcPath, 'utf8');
      const $ = cheerio.load(html);

      // Collect CSS links to inline
      const cssLinks = [];
      $('link[inline]').each((_, el) => {
        const href = el.attribs && el.attribs.href;
        if (href) cssLinks.push({ el, href });
      });

      // Read and inline CSS files
      for (const { el, href } of cssLinks) {
        const cssFile = resolve(SRC, 'css', basename(href));
        try {
          const css = await readFile(cssFile, 'utf8');
          $(el).replaceWith(`<style>${css}</style>`);
        } catch {
          console.warn(`⚠ Could not inline ${href}`);
        }
      }

      // Collect JS scripts to inline
      const jsScripts = [];
      $('script[src]').each((_, el) => {
        const src = el.attribs && el.attribs.src;
        if (src) jsScripts.push({ el, src });
      });

      // Read and inline JS files
      for (const { el, src } of jsScripts) {
        const jsFile = resolve(SRC, 'js', basename(src));
        try {
          const js = await readFile(jsFile, 'utf8');
          $(el).replaceWith(`<script>${js}</script>`);
        } catch {
          console.warn(`⚠ Could not inline ${src}`);
        }
      }

      const inlined = $.html();

      // Minify
      const minified = await minify(inlined, {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true,
      });

      await writeFile(resolve(APP, file), minified);
      info(`HTML: ${file} inlined & minified`);
    } catch (err) {
      console.error(`❌ Failed to process ${file}:`, err.message);
    }
  }
}

async function processImages() {
  await ensureDir(resolve(APP, 'img'));
  const files = await readdir(resolve(SRC, 'img'));
  const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

  for (const file of files) {
    const ext = extname(file).toLowerCase();
    if (!imageExts.includes(ext)) continue;

    const srcPath = resolve(SRC, 'img', file);
    const baseName = basename(file, ext);

    // Copy optimized version
    if (['.png', '.gif'].includes(ext)) {
      await sharp(srcPath)
        .png({ effort: 9 })
        .toFile(resolve(APP, 'img', file));
    } else if (['.jpg', '.jpeg'].includes(ext)) {
      await sharp(srcPath)
        .jpeg({ quality: 85, progressive: true })
        .toFile(resolve(APP, 'img', file));
    } else {
      await copyFile(srcPath, resolve(APP, 'img', file));
    }

    // Generate WebP for JPG/PNG
    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      await sharp(srcPath)
        .webp({ quality: 80 })
        .toFile(resolve(APP, 'img', `${baseName}.webp`));
    }

    info(`Image: ${file}`);
  }
}

async function copyStatic() {
  const staticFiles = ['manifest.json', 'robots.txt', 'sitemap.xml', 'favicon.ico', 'cv.pdf', 'cvphilippjauss.pdf'];
  for (const file of staticFiles) {
    const srcPath = resolve(SRC, file);
    try {
      await copyFile(srcPath, resolve(APP, file));
      info(`Copied: ${file}`);
    } catch {
      console.warn(`⚠ Skipping ${file} (not found in src/)`);
    }
  }
}

async function generateServiceWorker() {
  try {
    await injectManifest({
      swSrc: resolve(SRC, 'sw.js'),
      swDest: resolve(APP, 'sw.js'),
      globDirectory: APP,
      globPatterns: [
        '*.{js,html,json,ico}',
        '**/*.{js,html,png,jpg,webp,json,ico}',
      ],
    });
    info('Service worker generated');
  } catch (err) {
    console.error('❌ Service worker generation failed:', err.message);
  }
}

// ── Main ─────────────────────────────────────────────────
const task = process.argv[2] || 'build';

const tasks = {
  clean: async () => { await clean(); },
  sass: async () => { await compileSass(); },
  html: async () => { await inlineAndMinifyHTML(); },
  images: async () => { await processImages(); },
  static: async () => { await copyStatic(); },
  sw: async () => { await generateServiceWorker(); },
  build: async () => {
    console.log('🔨 Building...');
    await clean();
    await compileSass();
    await copyStatic();
    await processImages();
    await inlineAndMinifyHTML();
    await generateServiceWorker();
    console.log('✅ Build complete!\n');
  },
};

if (tasks[task]) {
  await tasks[task]();
} else {
  console.error(`❌ Unknown task: ${task}`);
  console.log('Available tasks: clean, sass, html, images, static, sw, build');
  process.exit(1);
}
