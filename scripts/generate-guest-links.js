/**
 * Reads data/guests.csv (one name per line, header "name")
 * Writes:
 *   - data/guests.json         -> [{ name, slug }]  (used by the website)
 *   - data/guest-links.csv     -> name, link         (what YOU send out)
 *
 * Run with:  npm run gen:links
 *
 * Edit SITE_URL below (or set SITE_URL env var) before generating the
 * final links you'll actually send to people.
 */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const SITE_URL = process.env.SITE_URL || "https://your-site.vercel.app";

const csvPath = path.join(__dirname, "..", "data", "guests.csv");
const jsonOutPath = path.join(__dirname, "..", "data", "guests.json");
const linksOutPath = path.join(__dirname, "..", "data", "guest-links.csv");

function slugify(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function shortId() {
  return crypto.randomBytes(3).toString("hex"); // 6 hex chars, unguessable enough for an invite
}

const raw = fs.readFileSync(csvPath, "utf-8");
const lines = raw
  .split("\n")
  .map((l) => l.trim())
  .filter(Boolean);

// drop header if present
if (lines[0].toLowerCase() === "name") lines.shift();

const seenSlugs = new Set();
const guests = lines.map((name) => {
  let base = slugify(name);
  let slug = `${base}-${shortId()}`;
  while (seenSlugs.has(slug)) slug = `${base}-${shortId()}`;
  seenSlugs.add(slug);
  return { name, slug };
});

fs.writeFileSync(jsonOutPath, JSON.stringify(guests, null, 2));

const linksCsv = [
  "name,link",
  ...guests.map((g) => `"${g.name}",${SITE_URL}/invite/${g.slug}`),
].join("\n");
fs.writeFileSync(linksOutPath, linksCsv);

console.log(`Generated ${guests.length} guest links.`);
console.log(`-> ${jsonOutPath}`);
console.log(`-> ${linksOutPath}`);
