# philippjauss.gate107.com

> [www.philippjauss.gate107.com](https://www.philippjauss.gate107.com) — Personal website of Philipp Jauss.

## Quick Start

```bash
# Install dependencies
npm install

# Full production build
npm run build

# Development (watch + rebuild on changes)
npm run watch

# Serve the built site locally
npm run serve
```

## Structure

```
├── src/              # Source files (edit here)
│   ├── css/
│   │   └── site.scss # Main stylesheet
│   ├── img/          # Images
│   ├── *.html        # Pages
│   └── sw.js         # Service worker source
├── app/              # Build output (git-ignored)
├── build.mjs         # Build script
├── Makefile          # CLI shortcuts (make build, make watch...)
└── package.json
```

## Build Pipeline

1. **Sass** → compressed CSS with autoprefixer
2. **Images** → optimized JPEG/PNG + WebP generation via Sharp
3. **HTML** → CSS/JS inlined, then minified
4. **Service Worker** → Workbox caching manifest injected
5. **Static files** → copied to output

## Pages

- **Home** — Photo gallery
- **Ich** (About) — About me
- **CV** — Resume
- **Kontakt** (Contact) — Contact info

## Tech Stack

- **Sass** (Dart Sass) + **PostCSS** (Autoprefixer)
- **Sharp** for image optimization
- **Workbox** for PWA service worker
- **Cheerio** + **html-minifier-terser** for HTML processing
- **ES Modules** (Node.js)
