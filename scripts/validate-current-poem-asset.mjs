import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { dailyPoemId } from "../src/data/daily.js";
import { poemsById } from "../src/data/poems.js";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");

function fail(message) {
  console.error(`CURRENT_POEM_ASSET_INVALID: ${message}`);
  process.exit(1);
}

const poem = poemsById[dailyPoemId];
if (!poem) fail(`dailyPoemId ${JSON.stringify(dailyPoemId)} is missing from poemsById`);

if (!poem.image) {
  console.log(`Current poem asset check: ${poem.title} has no image; nothing to validate.`);
  process.exit(0);
}

if (!poem.image.startsWith("/assets/poems/")) {
  fail(`${poem.title} image must live under /assets/poems/: ${poem.image}`);
}

const relativePath = poem.image.startsWith("/") ? poem.image.slice(1) : poem.image;
const assetPath = path.join(repoRoot, "public", relativePath);
if (!fs.existsSync(assetPath)) fail(`missing ${relativePath}`);

const bytes = fs.readFileSync(assetPath);
if (path.extname(assetPath).toLowerCase() === ".webp") {
  if (bytes.length < 12) fail(`${relativePath} is too small to be a WebP (${bytes.length} bytes)`);
  if (bytes.toString("ascii", 0, 4) !== "RIFF" || bytes.toString("ascii", 8, 12) !== "WEBP") {
    fail(`${relativePath} does not have a RIFF/WEBP header`);
  }
  const declaredTotal = bytes.readUInt32LE(4) + 8;
  if (declaredTotal !== bytes.length) {
    fail(`${relativePath} is truncated or has trailing corruption: RIFF declares ${declaredTotal} bytes, file has ${bytes.length}`);
  }
}

console.log(`Current poem asset check passed: ${relativePath} (${bytes.length} bytes)`);
