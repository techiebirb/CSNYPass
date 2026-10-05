import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const sourceDir = path.join(root, "icons", "source");
const iconsDir = path.join(root, "icons");
const variantsDir = path.join(iconsDir, "variants");

const VARIANTS = ["lock-dot", "c-keyhole", "person-key"];
const SIZES = [16, 48, 128];

function parseArgs(argv) {
  const opts = { defaultVariant: null, defaultOnly: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--default" && argv[i + 1]) {
      opts.defaultVariant = argv[++i];
    } else if (arg.startsWith("--default=")) {
      opts.defaultVariant = arg.slice("--default=".length);
    } else if (arg === "--default-only") {
      opts.defaultOnly = true;
    } else if (arg === "--all") {
      /* no-op: all variants is the default */
    }
  }
  if (process.env.ICON_VARIANT) {
    opts.defaultVariant = process.env.ICON_VARIANT;
  }
  return opts;
}

function rasterizeSvg(svgPath, size) {
  const svg = fs.readFileSync(svgPath, "utf8");
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: size },
    background: "transparent",
  });
  return resvg.render().asPng();
}

function writeVariantPngs(name) {
  const svgPath = path.join(sourceDir, `${name}.svg`);
  if (!fs.existsSync(svgPath)) {
    throw new Error(`Missing SVG: ${svgPath}`);
  }
  const outDir = path.join(variantsDir, name);
  fs.mkdirSync(outDir, { recursive: true });
  for (const size of SIZES) {
    const png = rasterizeSvg(svgPath, size);
    const out = path.join(outDir, `icon-${size}.png`);
    fs.writeFileSync(out, png);
    console.log(`Wrote ${out}`);
  }
}

function copyToActive(name) {
  const fromDir = path.join(variantsDir, name);
  for (const size of SIZES) {
    const src = path.join(fromDir, `icon-${size}.png`);
    const dest = path.join(iconsDir, `icon-${size}.png`);
    fs.copyFileSync(src, dest);
    console.log(`Active icon: ${dest}`);
  }
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const toBuild =
    opts.defaultOnly && opts.defaultVariant
      ? [opts.defaultVariant]
      : VARIANTS;

  for (const name of toBuild) {
    if (!VARIANTS.includes(name)) {
      console.error(`Unknown variant "${name}". Expected: ${VARIANTS.join(", ")}`);
      process.exit(1);
    }
    writeVariantPngs(name);
  }

  const active = opts.defaultVariant ?? "lock-dot";
  if (!VARIANTS.includes(active)) {
    console.error(`Unknown default variant "${active}".`);
    process.exit(1);
  }
  copyToActive(active);

  console.log(`\nDefault toolbar/popup icons copied from "${active}".`);
  console.log("Spot-check icons/icon-16.png at 100% zoom in the browser toolbar.");
}

main();
