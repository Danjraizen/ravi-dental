const fs = require("fs");
const path = require("path");

const pagesRoot = path.join(__dirname, "src", "pages");

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    return entry.name.endsWith(".astro") ? [fullPath] : [];
  });
}

const addressReplacements = [
  [
    "7/706, above MedPlus, 7th Block, Brindawan Colony, Mogappair, Chennai, Tamil Nadu 600037",
    "No 911, HIG, 35HG+G8M, 1st Main Rd, Mogappair Eri Scheme, Mogappair, Chennai, Greater Chennai, Tamil Nadu 600037",
  ],
  [
    "7/706, above MedPlus, 7th Block, Brindawan Colony, Mogappair",
    "No 911, HIG, 35HG+G8M, 1st Main Rd, Mogappair Eri Scheme, Mogappair",
  ],
  [
    "7/706, Brindawan Colony",
    "No 911, HIG, 35HG+G8M, 1st Main Rd, Mogappair Eri Scheme",
  ],
  [
    "No 911, 1st Main Rd, Mogappair Eri Scheme, Mogappair, Chennai, Greater Chennai, Tamil Nadu 600037",
    "No 911, HIG, 35HG+G8M, 1st Main Rd, Mogappair Eri Scheme, Mogappair, Chennai, Greater Chennai, Tamil Nadu 600037",
  ],
  [
    "No 911, 1st Main Rd, Mogappair Eri Scheme, Mogappair",
    "No 911, HIG, 35HG+G8M, 1st Main Rd, Mogappair Eri Scheme, Mogappair",
  ],
  [
    "No 911, 1st Main Rd, Mogappair Eri Scheme",
    "No 911, HIG, 35HG+G8M, 1st Main Rd, Mogappair Eri Scheme",
  ],
];

const mapEmbedSrc =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.323014539886!2d80.1758291!3d13.078703299999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5263aae9d4c407%3A0xc23577cb74e4a6e6!2sDr.%20Ravi's%20Dental%20and%20Orofacial%20pain%20clinic!5e0!3m2!1sen!2sin!4v1785599189894!5m2!1sen!2sin";

const teamImages = [
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
  "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80",
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80",
];

const mobileCloseButton =
  '<button type=\\"button\\" class=\\"mobile-close\\" aria-label=\\"Close menu\\"><i class=\\"fas fa-times\\"></i></button>';

let updated = 0;

for (const file of walk(pagesRoot)) {
  let source = fs.readFileSync(file, "utf8");
  let next = source;

  for (const [from, to] of addressReplacements) {
    next = next.split(from).join(to);
  }

  next = next.replace(
    /src="https:\/\/www\.google\.com\/maps\/embed\?pb=[^"]*"/g,
    `src="${mapEmbedSrc}"`,
  );
  next = next
    .split('referrerpolicy="no-referrer-when-downgrade"')
    .join('referrerpolicy="strict-origin-when-cross-origin"');

  if (
    file === path.join(pagesRoot, "index.astro") ||
    file === path.join(pagesRoot, "about", "index.astro")
  ) {
    for (const image of teamImages) {
      next = next
        .split(`src="${image}" alt="Dr.`)
        .join('src="/team-avatar.svg" alt="Dr.');
    }
  }

  if (!next.includes('class=\\"mobile-close\\"')) {
    next = next
      .split('<nav class=\\"mobile-nav\\">')
      .join(`<nav class=\\"mobile-nav\\">${mobileCloseButton}`);
  }

  if (next !== source) {
    fs.writeFileSync(file, next, "utf8");
    updated += 1;
  }
}

console.log(`Updated ${updated} Astro page files.`);
