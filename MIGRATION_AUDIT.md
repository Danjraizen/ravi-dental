# Astro Migration Audit

Audit date: 2026-08-01

## Scope

This audit checks the Astro migration without refactoring application code. It covers generated routes, internal links, public assets, image references, CSS/JS inclusion, static interaction hooks, SEO metadata preservation, and basic static accessibility signals.

Browser screenshot testing, Lighthouse scoring, and automated click-through testing could not be completed in this environment because browser automation was blocked by local `AppData` access permissions and Lighthouse is not installed in the project.

## Automated Checks Completed

- [x] Production Astro build completed successfully.
- [x] 25 Astro pages generated.
- [x] 25 source Astro routes match 25 built HTML routes.
- [x] All normal local routes return HTTP 200.
- [x] `/404.html` returns HTTP 404 as expected for the not-found route.
- [x] `/css/styles.css` loads.
- [x] `/js/scripts.js` loads.
- [x] Logo assets, `team-avatar.svg`, `robots.txt`, and `sitemap.xml` load.
- [x] 26 internal links checked with no broken internal links found.
- [x] Internal image references checked with no missing local image files found.
- [x] 22 Unsplash image URLs return HTTP 200.
- [x] Google Maps iframe URL returns HTTP 200.
- [x] Font Awesome CDN stylesheet returns HTTP 200.
- [x] Google Fonts stylesheet URL returns HTTP 200.
- [x] All built pages include `/css/styles.css`.
- [x] All built pages include `/js/scripts.js`.
- [x] Mobile menu, dropdown, FAQ, counter, gallery, lightbox, and form-validation JavaScript hooks are present.
- [x] All built pages include mobile menu markup, overlay markup, and the new mobile close button.
- [x] Static accessibility sweep found no missing image `alt` attributes.
- [x] Static accessibility sweep found no nameless buttons.
- [x] SEO metadata was preserved versus original static HTML, except for the intentionally updated contact meta description address.

Generated audit artifacts:

- `migration-audit.json`
- `external-resource-audit.json`

## Findings

### Must Fix Before Deployment

- [ ] Run Lighthouse comparison locally against the original static site and the Astro site. A true "no regression" claim needs measured scores for both versions.
- [ ] Run manual responsive visual QA at mobile, tablet, and desktop widths. Static CSS preservation looks good, but screenshot-level visual parity was not measured in this environment.
- [ ] Run manual interaction QA in a real browser: mobile drawer open/close, mobile dropdowns, desktop dropdowns, FAQ accordion, gallery lightbox, contact form validation, WhatsApp link, and anchor scrolling.

### Should Review Before Deployment

- [ ] `/gallery/` has no structured data. This was not detected as a migration regression against the original metadata, but it is an SEO completeness gap worth reviewing.
- [ ] The contact form still posts to `https://formspree.io/f/YOUR_FORM_ID`; confirm the real production form endpoint before launch.
- [ ] `https://fonts.googleapis.com` returns 404 when requested directly, but this URL is used only as a `preconnect` hint. The actual Google Fonts stylesheet URL returns 200.
- [ ] External assets are still runtime dependencies: Unsplash, Google Fonts, Font Awesome CDN, Google Maps, and WhatsApp.
- [ ] npm install previously reported dependency audit findings in the Astro dependency tree. Review before production deployment.

### Completed After Audit

- [x] Updated the visible address, structured data address, contact meta description, and Google Maps iframe to the exact address: `No 911, HIG, 35HG+G8M, 1st Main Rd, Mogappair Eri Scheme, Mogappair, Chennai, Greater Chennai, Tamil Nadu 600037`.

## Lighthouse Instructions

Run these locally if you want the migration score comparison:

```powershell
# Terminal 1: original static site
node serve.js

# Terminal 2: Astro site
$env:ASTRO_TELEMETRY_DISABLED='1'
npm.cmd run dev -- --host 127.0.0.1

# Terminal 3: Lighthouse, if installed globally or via npx
npx lighthouse http://127.0.0.1:8080/ --output html --output-path lighthouse-original.html
npx lighthouse http://127.0.0.1:4321/ --output html --output-path lighthouse-astro.html
```

Compare Performance, Accessibility, Best Practices, and SEO scores page-by-page for at least:

- `/`
- `/about/`
- `/services/`
- `/services/root-canal-treatment/`
- `/pain-treatments/`
- `/contact/`
- `/gallery/`

## Manual Responsive QA Checklist

- [ ] Desktop 1440px: home, about, services, service detail, pain treatments, contact, gallery.
- [ ] Tablet 768px: home, about, services, service detail, pain treatments, contact, gallery.
- [ ] Mobile 390px: home, about, services, service detail, pain treatments, contact, gallery.
- [ ] Confirm mobile menu opens and closes using the close button, overlay, Escape key, and navigation links.
- [ ] Confirm no content overlaps, no horizontal scrolling, and no text is clipped.

## Deployment Readiness

The migration build is technically healthy, but deployment should wait until the remaining must-fix checklist is complete, especially Lighthouse/manual visual comparison.
