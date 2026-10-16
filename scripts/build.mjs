import * as esbuild from "esbuild";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const watch = process.argv.includes("--watch");

// Bundled UI font (Figtree, OFL). The extension pages load it from popup/fonts/,
// so no request ever leaves the device. Commit the copied files with the source.
const FONT_WEIGHTS = [400, 500, 600, 700, 800];
const fontSrc = path.join(root, "node_modules", "@fontsource", "figtree", "files");
const fontDest = path.join(root, "popup", "fonts");
fs.mkdirSync(fontDest, { recursive: true });
for (const weight of FONT_WEIGHTS) {
  const file = `figtree-latin-${weight}-normal.woff2`;
  fs.copyFileSync(path.join(fontSrc, file), path.join(fontDest, file));
}
// The OFL requires its license to travel with the font files.
fs.copyFileSync(
  path.join(root, "node_modules", "@fontsource", "figtree", "LICENSE"),
  path.join(fontDest, "OFL.txt")
);

const shared = {
  bundle: true,
  target: ["chrome109", "firefox109"],
  sourcemap: true,
  absWorkingDir: root,
  preserveSymlinks: true,
  logLevel: "info",
};

const builds = [
  {
    entryPoints: ["extension/background/index.js"],
    outfile: "dist/background.js",
    format: "iife",
    platform: "browser",
  },
  {
    entryPoints: ["extension/content/index.js"],
    outfile: "dist/content.js",
    format: "iife",
    platform: "browser",
  },
  {
    entryPoints: ["extension/popup/popup.js"],
    outfile: "dist/popup.js",
    format: "iife",
    platform: "browser",
  },
  {
    entryPoints: ["extension/popup/welcome.js"],
    outfile: "dist/welcome.js",
    format: "iife",
    platform: "browser",
  },
  {
    entryPoints: ["extension/popup/unlock.js"],
    outfile: "dist/unlock.js",
    format: "iife",
    platform: "browser",
  },
];

if (watch) {
  const ctx = await esbuild.context(
    builds.map((b) => ({
      ...shared,
      ...b,
    }))
  );
  await ctx.watch();
  console.log("Watching for changes…");
} else {
  for (const b of builds) {
    await esbuild.build({ ...shared, ...b });
  }
}
