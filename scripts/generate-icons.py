#!/usr/bin/env python3
"""Icons are authored as SVG under icons/source/ and rasterized with Node."""

from __future__ import annotations

import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RASTER = ROOT / "scripts" / "rasterize-icons.mjs"


def main() -> None:
    node = shutil.which("node")
    if not node:
        print(
            "Extension icons are generated from icons/source/*.svg via Node.\n"
            "Install Node, run: npm install && npm run icons",
            file=sys.stderr,
        )
        sys.exit(1)
    args = [node, str(RASTER), *sys.argv[1:]]
    raise SystemExit(subprocess.call(args))


if __name__ == "__main__":
    main()
