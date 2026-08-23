#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { lookup } from "node:dns/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const NETWORK_UNAVAILABLE = 20;

let packageJson;
let lockfile;
try {
  packageJson = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
  lockfile = JSON.parse(await readFile(resolve(root, "package-lock.json"), "utf8"));
} catch {
  console.error("DEPENDENCY_CONFIG_INVALID: package.json and package-lock.json must both be readable JSON.");
  process.exit(1);
}

const declared = { ...(packageJson.dependencies || {}), ...(packageJson.devDependencies || {}) };
const lockedRoot = { ...(lockfile.packages?.[""]?.dependencies || {}), ...(lockfile.packages?.[""]?.devDependencies || {}) };
if (JSON.stringify(Object.entries(declared).sort()) !== JSON.stringify(Object.entries(lockedRoot).sort())) {
  console.error("DEPENDENCY_CONFIG_INVALID: package.json dependencies do not match package-lock.json root dependencies.");
  process.exit(1);
}

function runCi(args, timeout) {
  return spawnSync(npm, ["ci", ...args], {
    cwd: root,
    stdio: "inherit",
    timeout,
    env: { ...process.env, npm_config_audit: "false", npm_config_fund: "false" },
  });
}

async function registryDnsAvailable() {
  try {
    await Promise.race([
      lookup("registry.npmjs.org"),
      new Promise((_, reject) => setTimeout(() => reject(new Error("DNS lookup timeout")), 5000)),
    ]);
    return true;
  } catch {
    return false;
  }
}

console.log("Trying npm cache first (offline mode)...");
const offline = runCi(["--offline", "--no-audit", "--fund=false"], 60000);
if (offline.status === 0) {
  console.log("Dependencies restored from local npm cache.");
  process.exit(0);
}

if (!await registryDnsAvailable()) {
  console.error("DEPENDENCY_NETWORK_UNAVAILABLE: registry.npmjs.org cannot be resolved. Continue with npm run verify:offline and use remote CI/Vercel as the build gate.");
  process.exit(NETWORK_UNAVAILABLE);
}

console.log("Registry DNS is available; trying one bounded online npm ci...");
const online = runCi(["--prefer-offline", "--no-audit", "--fund=false"], 180000);
if (online.status === 0) {
  console.log("Dependencies installed successfully.");
  process.exit(0);
}

console.error("DEPENDENCY_INSTALL_FAILED: npm registry is reachable, but npm ci did not complete successfully.");
process.exit(online.status || 1);
