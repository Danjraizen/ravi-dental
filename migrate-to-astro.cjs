const fs = require("fs");
const path = require("path");

const root = __dirname;
const srcDir = path.join(root, "src");
const publicDir = path.join(root, "public");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (["node_modules", "src", "public", "dist"].includes(entry.name)) return [];
      return walk(fullPath);
    }
    return entry.name.endsWith(".html") ? [fullPath] : [];
  });
}

function copyFile(from, to) {
  ensureDir(path.dirname(to));
  fs.copyFileSync(from, to);
}

function pageOutputPath(htmlPath) {
  const rel = path.relative(root, htmlPath);
  if (rel === "index.html") return path.join(srcDir, "pages", "index.astro");
  if (rel === "404.html") return path.join(srcDir, "pages", "404.astro");
  if (rel.endsWith(`${path.sep}index.html`)) {
    return path.join(srcDir, "pages", rel.replace(/index\.html$/, "index.astro"));
  }
  return path.join(srcDir, "pages", rel.replace(/\.html$/, ".astro"));
}

function relativeImport(fromFile, targetFile) {
  let rel = path.relative(path.dirname(fromFile), targetFile).replace(/\\/g, "/");
  if (!rel.startsWith(".")) rel = `./${rel}`;
  return rel;
}

function between(source, start, end, label, file) {
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end, startIndex + start.length);
  if (startIndex === -1 || endIndex === -1) {
    throw new Error(`Could not find ${label} in ${file}`);
  }
  return source.slice(startIndex + start.length, endIndex);
}

function sliceInclusive(source, start, end, label, file) {
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end, startIndex + start.length);
  if (startIndex === -1 || endIndex === -1) {
    throw new Error(`Could not find ${label} in ${file}`);
  }
  return source.slice(startIndex, endIndex + end.length);
}

function findMainStart(source, file) {
  const match = source.match(/<main id="main-content">/);
  if (!match || match.index === undefined) {
    throw new Error(`Could not find main start in ${file}`);
  }
  return match.index;
}

function migratePage(htmlPath) {
  const html = fs.readFileSync(htmlPath, "utf8");
  const head = between(html, "<head>", "</head>", "head", htmlPath).trim();
  const bodyStart = html.indexOf("<body>");
  const mainStart = findMainStart(html, htmlPath);
  const mainEnd = html.indexOf("</main>", mainStart);
  const scriptStart = html.indexOf('<script src="/js/scripts.js"></script>', mainEnd);

  if (bodyStart === -1 || mainEnd === -1 || scriptStart === -1) {
    throw new Error(`Could not find expected page shell in ${htmlPath}`);
  }

  const navbar = html.slice(bodyStart + "<body>".length, mainStart).trim();
  const main = html.slice(mainStart, mainEnd + "</main>".length);
  const footerAndFloat = html.slice(mainEnd + "</main>".length, scriptStart).trim();

  const out = pageOutputPath(htmlPath);
  ensureDir(path.dirname(out));
  const layoutImport = relativeImport(out, path.join(srcDir, "layouts", "Layout.astro"));
  const content = `---
import Layout from ${JSON.stringify(layoutImport)};

const head = ${JSON.stringify(head)};
const navbar = ${JSON.stringify(navbar)};
const footer = ${JSON.stringify(footerAndFloat)};
---

<Layout head={head} navbar={navbar} footer={footer}>
${main}
</Layout>
`;
  fs.writeFileSync(out, content, "utf8");
}

ensureDir(path.join(srcDir, "pages"));
ensureDir(path.join(srcDir, "layouts"));
ensureDir(path.join(srcDir, "components"));
ensureDir(path.join(srcDir, "styles"));
ensureDir(path.join(srcDir, "assets"));
ensureDir(path.join(srcDir, "scripts"));
ensureDir(path.join(srcDir, "types"));
ensureDir(publicDir);

fs.writeFileSync(
  path.join(root, "package.json"),
  `${JSON.stringify(
    {
      scripts: {
        dev: "astro dev",
        build: "astro build",
        preview: "astro preview",
      },
      dependencies: {
        astro: "^5.13.0",
      },
      devDependencies: {
        typescript: "^5.5.0",
      },
    },
    null,
    2,
  )}\n`,
  "utf8",
);

fs.writeFileSync(
  path.join(root, "astro.config.mjs"),
  `import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://mogappairdentalclinic.com",
  output: "static",
});
`,
  "utf8",
);

fs.writeFileSync(
  path.join(root, "tsconfig.json"),
  `{
  "extends": "astro/tsconfigs/strict"
}
`,
  "utf8",
);

fs.writeFileSync(
  path.join(srcDir, "components", "Head.astro"),
  `---
const { html } = Astro.props;
---

<Fragment set:html={html} />
`,
  "utf8",
);

fs.writeFileSync(
  path.join(srcDir, "components", "Navbar.astro"),
  `---
const { html } = Astro.props;
---

<Fragment set:html={html} />
`,
  "utf8",
);

fs.writeFileSync(
  path.join(srcDir, "components", "Footer.astro"),
  `---
const { html } = Astro.props;
---

<Fragment set:html={html} />
`,
  "utf8",
);

fs.writeFileSync(
  path.join(srcDir, "layouts", "Layout.astro"),
  `---
import Head from "../components/Head.astro";
import Navbar from "../components/Navbar.astro";
import Footer from "../components/Footer.astro";

const { head, navbar, footer } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <Head html={head} />
  </head>
  <body>
    <Navbar html={navbar} />
    <slot />
    <Footer html={footer} />
    <script is:inline src="/js/scripts.js"></script>
  </body>
</html>
`,
  "utf8",
);

fs.writeFileSync(path.join(srcDir, "styles", ".gitkeep"), "", "utf8");
fs.writeFileSync(path.join(srcDir, "assets", ".gitkeep"), "", "utf8");
fs.writeFileSync(path.join(srcDir, "scripts", ".gitkeep"), "", "utf8");
fs.writeFileSync(path.join(srcDir, "types", ".gitkeep"), "", "utf8");

copyFile(path.join(root, "robots.txt"), path.join(publicDir, "robots.txt"));
copyFile(path.join(root, "sitemap.xml"), path.join(publicDir, "sitemap.xml"));
copyFile(path.join(root, "logo orofacial.png"), path.join(publicDir, "logo orofacial.png"));
copyFile(path.join(root, "logo-full.png"), path.join(publicDir, "logo-full.png"));
copyFile(path.join(root, "logo-icon.png"), path.join(publicDir, "logo-icon.png"));
copyFile(path.join(root, "css", "styles.css"), path.join(publicDir, "css", "styles.css"));
copyFile(path.join(root, "js", "scripts.js"), path.join(publicDir, "js", "scripts.js"));

walk(root).forEach(migratePage);

console.log(`Migrated ${walk(root).length} HTML pages into Astro.`);
