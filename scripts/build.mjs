import * as esbuild from "esbuild";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const watch = process.argv.includes("--watch");

const shared = {
  bundle: true,
  target: ["chrome109", "firefox109"],
  sourcemap: true,
  absWorkingDir: root,
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
