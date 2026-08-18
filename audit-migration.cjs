const fs = require("fs");
const path = require("path");

const root = __dirname;
const dist = path.join(root, "dist");

function walk(dir, ext) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath, ext);
    return entry.name.endsWith(ext) ? [fullPath] : [];
  });
}

function routeForFile(file) {
  const rel = path.relative(dist, file).replace(/\\/g, "/");
  if (rel === "index.html") return "/";
  if (rel === "404.html") return "/404.html";
  return `/${rel.replace(/index\.html$/, "")}`;
}

function localTargetExists(url) {
  const clean = url.split("#")[0].split("?")[0];
  if (!clean || clean === "/") return fs.existsSync(path.join(dist, "index.html"));
  if (clean.endsWith("/")) return fs.existsSync(path.join(dist, clean, "index.html"));
  return fs.existsSync(path.join(dist, clean));
}

function attrs(html, attr) {
  const pattern = new RegExp(`${attr}="([^"]+)"`, "g");
  return [...html.matchAll(pattern)].map((match) => match[1]);
}

const htmlFiles = walk(dist, ".html");
const routeHtmlFiles = htmlFiles.filter((file) => {
  const rel = path.relative(dist, file).replace(/\\/g, "/");
  return !/^google[a-z0-9]+\.html$/i.test(rel);
});
const originalHtmlFiles = walk(root, ".html").filter(
  (file) =>
    !file.includes(`${path.sep}src${path.sep}`) &&
    !file.includes(`${path.sep}dist${path.sep}`) &&
    !file.includes(`${path.sep}node_modules${path.sep}`) &&
    !file.includes(`${path.sep}public${path.sep}`) &&
    !file.includes(`${path.sep}.astro${path.sep}`),
);
const routes = routeHtmlFiles.map(routeForFile).sort();
const issues = [];
const externalImages = new Set();
const externalLinks = new Set();
const internalLinks = new Set();
const internalImages = new Set();
const metadata = [];
const accessibilityIssues = [];

function extractMetadata(html) {
  return {
    title: html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || "",
    description: html.match(/<meta name="description" content="([^"]*)"/i)?.[1] || "",
    canonical: html.match(/<link rel="canonical" href="([^"]*)"/i)?.[1] || "",
    robots: html.match(/<meta name="robots" content="([^"]*)"/i)?.[1] || "",
    ogTitle: html.match(/<meta property="og:title" content="([^"]*)"/i)?.[1] || "",
    structuredData: /<script type="application\/ld\+json">/.test(html),
  };
}

for (const file of routeHtmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const route = routeForFile(file);

  const { title, description, canonical, robots, ogTitle, structuredData } = extractMetadata(html);

  metadata.push({ route, title, description, canonical, robots, ogTitle, structuredData });

  if (!title) issues.push({ route, type: "seo", issue: "Missing title" });
  if (route !== "/404.html" && !description) issues.push({ route, type: "seo", issue: "Missing meta description" });
  if (!canonical) issues.push({ route, type: "seo", issue: "Missing canonical link" });
  if (!robots) issues.push({ route, type: "seo", issue: "Missing robots meta" });
  if (route !== "/404.html" && !ogTitle) issues.push({ route, type: "seo", issue: "Missing Open Graph title" });
  if (route !== "/404.html" && !structuredData) {
    issues.push({ route, type: "seo", issue: "Missing structured data" });
  }

  const css = attrs(html, "href").filter((href) => href.endsWith(".css"));
  const scripts = attrs(html, "src").filter((src) => src.endsWith(".js"));
  if (!css.includes("/css/styles.css")) issues.push({ route, type: "css", issue: "Missing /css/styles.css" });
  if (!scripts.includes("/js/scripts.js")) issues.push({ route, type: "js", issue: "Missing /js/scripts.js" });

  for (const href of attrs(html, "href")) {
    if (href.startsWith("http://") || href.startsWith("https://")) {
      externalLinks.add(href);
      continue;
    }
    if (
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("#") ||
      href.startsWith("data:")
    ) {
      continue;
    }
    internalLinks.add(href);
    if (!localTargetExists(href)) {
      issues.push({ route, type: "link", issue: `Broken internal link: ${href}` });
    }
  }

  for (const src of attrs(html, "src")) {
    if (src.startsWith("http://") || src.startsWith("https://")) {
      externalImages.add(src);
      continue;
    }
    if (src.endsWith(".js") || src.startsWith("data:")) continue;
    internalImages.add(src);
    if (!localTargetExists(src)) {
      issues.push({ route, type: "image", issue: `Broken internal image: ${src}` });
    }
  }

  for (const image of html.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\salt="[^"]*"/.test(image[0])) {
      accessibilityIssues.push({ route, type: "image-alt", issue: `Image missing alt: ${image[0].slice(0, 120)}` });
    }
  }

  for (const button of html.matchAll(/<button\b[^>]*>[\s\S]*?<\/button>/gi)) {
    if (!/aria-label="[^"]+"/.test(button[0]) && !/>[\s\S]*\S[\s\S]*<\/button>/.test(button[0])) {
      accessibilityIssues.push({ route, type: "button-name", issue: `Button may be missing accessible name: ${button[0]}` });
    }
  }
}

const originalMetadataByRoute = new Map(
  originalHtmlFiles.map((file) => [routeForFile(file.replace(root, dist)), extractMetadata(fs.readFileSync(file, "utf8"))]),
);
const builtMetadataByRoute = new Map(
  routeHtmlFiles.map((file) => [routeForFile(file), extractMetadata(fs.readFileSync(file, "utf8"))]),
);
const metadataDiffs = [];

for (const [route, original] of originalMetadataByRoute) {
  const built = builtMetadataByRoute.get(route);
  if (!built) {
    metadataDiffs.push({ route, field: "route", original: "present", built: "missing" });
    continue;
  }
  for (const field of Object.keys(original)) {
    if (original[field] !== built[field]) {
      metadataDiffs.push({ route, field, original: original[field], built: built[field] });
    }
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  routesBuilt: routes.length,
  routes,
  internalLinksChecked: [...internalLinks].sort(),
  internalImagesChecked: [...internalImages].sort(),
  externalLinksSeen: [...externalLinks].sort(),
  externalImagesSeen: [...externalImages].sort(),
  metadata,
  metadataDiffs,
  accessibilityIssues,
  issues,
};

fs.writeFileSync(path.join(root, "migration-audit.json"), `${JSON.stringify(report, null, 2)}\n`);

console.log(`Routes built: ${routes.length}`);
console.log(`Internal links checked: ${internalLinks.size}`);
console.log(`Internal images checked: ${internalImages.size}`);
console.log(`External links seen: ${externalLinks.size}`);
console.log(`External images seen: ${externalImages.size}`);
console.log(`Metadata diffs vs original static HTML: ${metadataDiffs.length}`);
console.log(`Static accessibility issues: ${accessibilityIssues.length}`);
console.log(`Issues found: ${issues.length}`);
if (issues.length) {
  for (const item of issues) console.log(`[${item.type}] ${item.route}: ${item.issue}`);
}
