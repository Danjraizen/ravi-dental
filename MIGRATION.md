# Astro Migration Handoff

## Migration Checklist

- [x] Created a minimal Astro project with TypeScript configuration.
- [x] Avoided Tailwind, React, and unnecessary UI libraries.
- [x] Preserved existing page content and route structure.
- [x] Extracted only the shared document layout, head renderer, navbar renderer, and footer renderer.
- [x] Preserved the original CSS at `/css/styles.css`.
- [x] Preserved the original JavaScript at `/js/scripts.js`.
- [x] Preserved logo assets and existing public asset paths.
- [x] Preserved `robots.txt` and `sitemap.xml`.
- [x] Preserved per-page title, description, canonical, Open Graph, Twitter, robots, and structured data markup.
- [x] Built the Astro site successfully.

## Files Moved Or Mirrored

- `index.html` -> `src/pages/index.astro`
- `404.html` -> `src/pages/404.astro`
- `about/index.html` -> `src/pages/about/index.astro`
- `contact/index.html` -> `src/pages/contact/index.astro`
- `gallery/index.html` -> `src/pages/gallery/index.astro`
- `services/**/index.html` -> `src/pages/services/**/index.astro`
- `pain-treatments/**/index.html` -> `src/pages/pain-treatments/**/index.astro`
- `css/styles.css` -> `public/css/styles.css`
- `js/scripts.js` -> `public/js/scripts.js`
- `logo orofacial.png` -> `public/logo orofacial.png`
- `logo-full.png` -> `public/logo-full.png`
- `logo-icon.png` -> `public/logo-icon.png`
- `robots.txt` -> `public/robots.txt`
- `sitemap.xml` -> `public/sitemap.xml`

## Project Structure

- `src/pages/` contains migrated routes.
- `src/layouts/Layout.astro` contains the shared document shell.
- `src/components/Head.astro` preserves per-page head markup.
- `src/components/Navbar.astro` preserves per-page navigation markup and active state.
- `src/components/Footer.astro` preserves footer and floating WhatsApp markup.
- `src/styles/`, `src/assets/`, `src/scripts/`, and `src/types/` are present for future migration work.
- `public/` contains assets that must keep their original absolute URLs.

## Files Requiring Manual Review

- `src/pages/404.astro`: the original 404 page used more compact HTML than the rest of the site; it was migrated successfully, but should be included in visual QA.
- `src/pages/contact/index.astro`: contact form behavior is preserved as static JavaScript validation only; any production form submission integration should be confirmed separately.
- `public/css/styles.css`: preserved exactly for visual stability; no design cleanup was performed.
- `public/js/scripts.js`: preserved as plain JavaScript; no framework rewrite was performed.
- `public/sitemap.xml`: preserved from the original static site; confirm final production URLs before launch if the domain changes.

## Potential Migration Risks

- Astro may minify built HTML output, so source formatting differs even though rendered markup and assets are preserved.
- External runtime dependencies remain unchanged: Google Fonts, Font Awesome CDN, Unsplash images, Google Maps iframe, and WhatsApp link.
- Existing mojibake-like text sequences such as `â€”` were preserved because content rewriting was intentionally avoided.
- The original HTML files remain in place as source/reference artifacts; Astro serves pages from `src/pages`.
- npm reported dependency audit findings after installing Astro. They were not remediated during this zero-regression migration.

## Post-Migration Improvements

These are recommendations for a later sprint only:

- Extract typed SEO/frontmatter data instead of storing raw head markup per page.
- Replace raw navbar/footer HTML props with stable Astro components once visual regression tests exist.
- Extract reusable Hero, Service Card, Pain Card, Doctor Card, Review Card, CTA, and Sidebar components.
- Move CSS into `src/styles` after visual baselines are captured.
- Add screenshot regression testing for key desktop and mobile breakpoints.
- Review and fix preserved text encoding issues if the client approves content cleanup.
