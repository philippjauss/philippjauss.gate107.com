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
│   │   └── site.css  # Main stylesheet
│   ├── img/          # Images
│   ├── *.html        # Pages
│   └── sw.js         # Service worker source
├── app/              # Build output (committed — served directly by the webserver)
├── build.mjs         # Build script
└── package.json
```

## Build Pipeline

1. **CSS** → copied to output, then autoprefixed
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

- **PostCSS** (Autoprefixer) for CSS
- **Sharp** for image optimization
- **Workbox** for PWA service worker
- **Cheerio** + **html-minifier-terser** for HTML processing
- **ES Modules** (Node.js)
