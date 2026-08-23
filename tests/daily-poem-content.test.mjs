import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";
import { dailyPoemId } from "../src/data/daily.js";
import { poems, poemsById } from "../src/data/poems.js";

test("publishes 春行寄兴 as a complete, distinct daily poem", async () => {
  assert.equal(dailyPoemId, "spring-path");
  const poem = poemsById["spring-path"];
  assert.ok(poem);
  assert.equal(poem.title, "春行寄兴");
  assert.equal(poem.author, "李华");
  assert.equal(poem.dynasty, "唐");
  assert.deepEqual(poem.lines, [
    "宜阳城下草萋萋",
    "涧水东流复向西",
    "芳树无人花自落",
    "春山一路鸟空啼",
  ]);
  assert.equal(poem.notes.length, poem.lines.length);
  assert.ok(poem.translation.length > 0);
  assert.ok(poem.appreciation.length >= 100 && poem.appreciation.length <= 180);
  assert.equal(poems.filter((item) => item.layout === poem.layout).length, 1);
  await access(new URL(`../public${poem.image}`, import.meta.url));
});
