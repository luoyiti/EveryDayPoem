import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import { dailyPoemId } from "../src/data/daily.js";
import { poems, poemsById } from "../src/data/poems.js";
import { findSchoolExclusion, loadSchoolExclusions } from "../scripts/lib/school-exclusion.mjs";

const root = new URL("../", import.meta.url);
const record = JSON.parse(await readFile(new URL("../data/learning-record.json", import.meta.url), "utf8"));
const exclusions = await loadSchoolExclusions(root.pathname);
const appSource = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");

test("daily poem is complete, unique, renderable, and publishable", async () => {
  const poem = poemsById[dailyPoemId];
  assert.ok(poem, `dailyPoemId ${dailyPoemId} must exist in poems.js`);

  for (const field of ["id", "layout", "title", "author", "dynasty", "image", "translation", "appreciation"]) {
    assert.ok(String(poem[field] || "").trim(), `daily poem must include ${field}`);
  }

  assert.ok(Array.isArray(poem.lines) && poem.lines.length >= 2, "daily poem must contain at least two lines");
  assert.equal(poem.notes?.length, poem.lines.length, "notes must align one-to-one with poem lines");
  for (const [index, note] of poem.notes.entries()) {
    assert.ok(note?.term?.trim(), `note ${index + 1} must include a term`);
    assert.ok(note?.text?.trim(), `note ${index + 1} must include explanatory text`);
  }

  assert.ok(poem.appreciation.length >= 100 && poem.appreciation.length <= 180, "appreciation must be 100-180 characters");
  assert.match(poem.image, /^\/assets\/poems\//, "daily image must live under public/assets/poems/");
  await access(new URL(`../public${poem.image}`, import.meta.url));

  assert.equal(poems.filter((item) => item.id === poem.id).length, 1, `duplicate poem id: ${poem.id}`);
  assert.equal(poems.filter((item) => item.title === poem.title && item.author === poem.author).length, 1, `duplicate poem: ${poem.title} / ${poem.author}`);
  assert.equal(poems.filter((item) => item.layout === poem.layout).length, 1, `layout must be unique for the daily poem: ${poem.layout}`);
  assert.ok(appSource.includes(`poem.layout === "${poem.layout}"`), `App.jsx must render layout ${poem.layout}`);

  const published = record.learned.find((entry) => entry.id === poem.id && entry.status === "published");
  assert.ok(published, `learning-record.json must mark ${poem.id} as published`);
  assert.equal(record.learned[0]?.id, poem.id, "daily poem must be the most recent learning record entry");

  const exclusion = findSchoolExclusion(exclusions.entries, {
    title: poem.title,
    author: poem.author,
    incipit: poem.lines[0],
  });
  assert.equal(exclusion, null, `daily poem must not match school exclusion library: ${poem.title}`);
});

test("poem and learning-record identifiers stay unique", () => {
  assert.equal(new Set(poems.map((poem) => poem.id)).size, poems.length, "poem ids must be unique");
  assert.equal(new Set(record.learned.map((entry) => entry.id)).size, record.learned.length, "learning-record ids must be unique");
  for (const entry of record.learned) {
    assert.ok(poemsById[entry.id], `learning record points to missing poem: ${entry.id}`);
  }
});
