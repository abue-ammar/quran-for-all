/**
 * Script to auto-update the service worker cache version on build
 * This creates a unique version based on timestamp to ensure cache busting
 */

import { readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SW_PATH = resolve(__dirname, "../public/sw.js");
const PACKAGE_PATH = resolve(__dirname, "../package.json");

function generateVersion() {
  // Read package.json for the app version
  const packageJson = JSON.parse(readFileSync(PACKAGE_PATH, "utf-8"));
  const appVersion = packageJson.version || "1.0.0";

  // Create a build timestamp (just date, not full timestamp for readability)
  const now = new Date();
  const buildId = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}.${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;

  return `${appVersion}-${buildId}`;
}

function updateServiceWorker() {
  const newVersion = generateVersion();

  console.log(
    `[update-sw-version] Updating service worker cache version to: ${newVersion}`
  );

  let swContent = readFileSync(SW_PATH, "utf-8");

  // Update the CACHE_VERSION constant
  swContent = swContent.replace(
    /const CACHE_VERSION = ["'].*["'];/,
    `const CACHE_VERSION = "${newVersion}";`
  );

  writeFileSync(SW_PATH, swContent, "utf-8");

  console.log(`[update-sw-version] Service worker updated successfully!`);
}

updateServiceWorker();
