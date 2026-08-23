import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";
import { dailyPoemId } from "../src/data/daily.js";
import { poems, poemsById } from "../src/data/poems.js";

test("publishes 咸阳值雨 as a complete, distinct daily poem", async () => {
  assert.equal(dailyPoemId, "xianyang-rain");

  const poem = poemsById["xianyang-rain"];
  assert.ok(poem);
  assert.equal(poem.title, "咸阳值雨");
  assert.equal(poem.author, "温庭筠");
  assert.equal(poem.dynasty, "唐");
  assert.deepEqual(poem.lines, [
    "咸阳桥上雨如悬",
    "万点空濛隔钓船",
    "还似洞庭春水色",
    "晓云将入岳阳天",
  ]);
  assert.equal(poem.notes.length, poem.lines.length);
  assert.ok(poem.translation.length > 0);
  assert.ok(poem.appreciation.length >= 100 && poem.appreciation.length <= 180);
  assert.equal(poems.filter((item) => item.layout === poem.layout).length, 1);
  await access(new URL(`../public${poem.image}`, import.meta.url));
});
