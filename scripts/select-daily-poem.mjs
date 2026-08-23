import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { poems } from "../src/data/poems.js";
import { findSchoolExclusion, loadSchoolExclusions } from "./lib/school-exclusion.mjs";

const root = resolve(import.meta.dirname, "..");
const recordPath = resolve(root, "data/learning-record.json");
const dailyPath = resolve(root, "src/data/daily.js");
const today = new Date().toISOString().slice(0, 10);
const record = JSON.parse(await readFile(recordPath, "utf8"));
const exclusions = await loadSchoolExclusions(root);
const learned = new Set(record.learned.map((entry) => entry.id));
const eligiblePoems = poems.filter((poem) => !findSchoolExclusion(exclusions.entries, {
  title: poem.title,
  author: poem.author,
  incipit: poem.lines?.[0],
}));

if (!eligiblePoems.length) {
  throw new Error("No eligible poems remain after applying the junior/senior high exclusion library.");
}

const selected = eligiblePoems.find((poem) => !learned.has(poem.id)) || eligiblePoems[new Date(today).getUTCDate() % eligiblePoems.length];

await writeFile(dailyPath, `// This file is updated by scripts/select-daily-poem.mjs.\nexport const dailyPoemId = "${selected.id}";\n`);

if (!learned.has(selected.id)) {
  record.learned.unshift({ id: selected.id, date: today, status: "published" });
  await writeFile(recordPath, `${JSON.stringify(record, null, 2)}\n`);
}

console.log(`Daily poem: ${selected.title} (${selected.id})`);
