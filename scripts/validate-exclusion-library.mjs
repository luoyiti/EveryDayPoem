#!/usr/bin/env node
import { resolve } from "node:path";
import { findSchoolExclusion, loadSchoolExclusions, normalizeText } from "./lib/school-exclusion.mjs";

const root = resolve(import.meta.dirname, "..");
const library = await loadSchoolExclusions(root);
const errors = [];

for (const field of ["rawEntryCount", "juniorHighEntryCount", "seniorHighEntryCount"]) {
  if (!Number.isInteger(library.policy[field])) errors.push(`policy.${field} must be an integer`);
}

const junior = library.entries.filter((entry) => entry.level === "junior-high");
const senior = library.entries.filter((entry) => entry.level === "senior-high");
if (library.entries.length !== library.policy.rawEntryCount) errors.push("raw entry count does not match policy");
if (junior.length !== library.policy.juniorHighEntryCount) errors.push("junior-high entry count does not match policy");
if (senior.length !== library.policy.seniorHighEntryCount) errors.push("senior-high entry count does not match policy");

const ids = new Set();
for (const entry of library.entries) {
  if (!entry.id || !entry.title || !entry.author) errors.push(`incomplete entry: ${JSON.stringify(entry)}`);
  if (ids.has(entry.id)) errors.push(`duplicate id: ${entry.id}`);
  ids.add(entry.id);
  if (!normalizeText(entry.title)) errors.push(`empty normalized title: ${entry.id}`);
}

const matcherChecks = [
  {
    label: "blocks an exact junior-high poem",
    candidate: { title: "关雎", author: "《诗经》", incipit: "关关雎鸠" },
    expected: true,
  },
  {
    label: "blocks a curriculum alias",
    candidate: { title: "马说", author: "韩愈" },
    expected: true,
  },
  {
    label: "blocks the specified work under a generic tune title",
    candidate: { title: "念奴娇", author: "苏轼", incipit: "大江东去" },
    expected: true,
  },
  {
    label: "allows another work under the same generic tune title",
    candidate: { title: "念奴娇", author: "毛泽东", incipit: "大柏地" },
    expected: false,
  },
  {
    label: "allows a non-junior/senior-high poem",
    candidate: { title: "枫桥夜泊", author: "张继", incipit: "月落乌啼霜满天" },
    expected: false,
  },
];

for (const check of matcherChecks) {
  const matched = Boolean(findSchoolExclusion(library.entries, check.candidate));
  if (matched !== check.expected) errors.push(`matcher check failed: ${check.label}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Exclusion library valid: ${junior.length} junior-high + ${senior.length} senior-high = ${library.entries.length} entries; ${matcherChecks.length} matcher checks passed.`);
