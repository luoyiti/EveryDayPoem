#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const index = path.join(dist, "client", "index.html");
const worker = path.join(root, "worker", "index.js");
const hosting = path.join(root, ".openai", "hosting.json");
const resources = [
  [path.join(root, "data", "school-curriculum-exclusions.json"), "school-curriculum-exclusions.json"],
  [path.join(root, "prompts", "chatgpt-work-daily-task.md"), "chatgpt-work-daily-task.md"],
  [path.join(root, "docs", "daily-task-plan.md"), "daily-task-plan.md"],
];

for (const file of [index, worker, hosting, ...resources.map(([source]) => source)]) {
  if (!existsSync(file)) throw new Error("Missing Sites build input: " + file);
}

mkdirSync(path.join(dist, "server"), { recursive: true });
mkdirSync(path.join(dist, ".openai"), { recursive: true });
copyFileSync(worker, path.join(dist, "server", "index.js"));
copyFileSync(hosting, path.join(dist, ".openai", "hosting.json"));
mkdirSync(path.join(dist, "client", "resources"), { recursive: true });
for (const [source, filename] of resources) {
  copyFileSync(source, path.join(dist, "client", "resources", filename));
}

console.log("Prepared hosting build and published task/exclusion resources.");
