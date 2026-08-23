#!/usr/bin/env node
import { resolve } from "node:path";
import { findSchoolExclusion, loadSchoolExclusions } from "./lib/school-exclusion.mjs";

const root = resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);

function valueFor(flag) {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] || "" : "";
}

const candidate = {
  title: valueFor("--title") || args.find((arg) => !arg.startsWith("--")) || "",
  author: valueFor("--author"),
  incipit: valueFor("--incipit"),
};

if (!candidate.title && !candidate.incipit) {
  console.error("Usage: npm run check:exclusion -- --title <篇名> [--author <作者>] [--incipit <首句>]");
  process.exit(1);
}

const library = await loadSchoolExclusions(root);
const match = findSchoolExclusion(library.entries, candidate);

if (match) {
  console.error(JSON.stringify({
    allowed: false,
    reason: "候选篇目命中初高中课程标准排除库",
    matchedBy: match.matchedBy,
    match: {
      id: match.entry.id,
      level: match.entry.level,
      title: match.entry.title,
      author: match.entry.author,
    },
  }, null, 2));
  process.exit(2);
}

console.log(JSON.stringify({ allowed: true, candidate }, null, 2));
