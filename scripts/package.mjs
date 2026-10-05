/**
 * Builds a Chrome Web Store / Edge Add-ons upload zip: release/csnypass-v<version>.zip.
 * Only what the extension loads at runtime goes in: no sources, tests or source maps.
 * Requires the `zip` command (preinstalled on macOS and most Linux).
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8"));
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
if (manifest.version !== pkg.version) {
  throw new Error(`Version mismatch: manifest ${manifest.version} vs package ${pkg.version}`);
}

execFileSync(process.execPath, [path.join(root, "scripts", "build.mjs")], {
  cwd: root,
  stdio: "inherit",
});

const releaseDir = path.join(root, "release");
const stage = path.join(releaseDir, "stage");
const zipPath = path.join(releaseDir, `csnypass-v${manifest.version}.zip`);
fs.rmSync(releaseDir, { recursive: true, force: true });
fs.mkdirSync(path.join(stage, "dist"), { recursive: true });

const copy = (from, to = from) => {
  fs.cpSync(path.join(root, from), path.join(stage, to), { recursive: true });
};

copy("manifest.json");
copy("LICENSE");
copy("popup");

for (const file of fs.readdirSync(path.join(root, "dist")).filter((f) => f.endsWith(".js"))) {
  const code = fs
    .readFileSync(path.join(root, "dist", file), "utf8")
    .replace(/\n?\/\/# sourceMappingURL=.*\n?$/, "\n");
  fs.writeFileSync(path.join(stage, "dist", file), code);
}

execFileSync("zip", ["-r", "-X", zipPath, "."], { cwd: stage, stdio: "inherit" });
fs.rmSync(stage, { recursive: true, force: true });
console.log(`\nCreated ${path.relative(root, zipPath)}`);
