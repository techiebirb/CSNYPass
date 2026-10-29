#!/usr/bin/env python3
"""Region screen recorder (macOS) that stops when a stop file appears.

Why not just `screencapture -v`? Started as a background job and stopped with SIGINT, it exits
without saving the file (background shells start children with SIGINT ignored), and a fixed
`-V <seconds>` limit makes the person wait after they finish. This script starts screencapture
in its own session with SIGINT restored, waits for the stop file, then interrupts it cleanly so
the .mov is finalized.

usage: rec.py OUT.mov X,Y,W,H STOPFILE [LEAD_SECONDS] [MAX_SECONDS]

  OUT.mov       where to write the recording (keep it outside the repo; it is unblurred)
  X,Y,W,H       capture rectangle in screen points (Retina records at 2x pixels)
  STOPFILE      `touch` this path to stop; any existing file at that path is removed first
  LEAD_SECONDS  wait before recording starts so the person can switch windows (default 8)
  MAX_SECONDS   safety cap on the recording length (default 240)

Recording includes the cursor (-C). See docs/MEDIA.md for the full workflow.
"""
import os
import signal
import subprocess
import sys
import time


def main(argv):
    if len(argv) < 4:
        print(__doc__)
        return 2
    out, region, stop = argv[1:4]
    lead = float(argv[4]) if len(argv) > 4 else 8
    cap = float(argv[5]) if len(argv) > 5 else 240

    for path in (out, stop):
        if os.path.exists(path):
            os.remove(path)

    time.sleep(lead)
    proc = subprocess.Popen(
        ["screencapture", "-v", "-C", "-R" + region, out],
        start_new_session=True,
        preexec_fn=lambda: signal.signal(signal.SIGINT, signal.SIG_DFL),
    )
    print("recording started", flush=True)
    start = time.time()
    while proc.poll() is None:
        if os.path.exists(stop) or time.time() - start > cap:
            proc.send_signal(signal.SIGINT)
            break
        time.sleep(0.1)
    try:
        proc.wait(timeout=20)
    except subprocess.TimeoutExpired:
        proc.kill()
    print("exit", proc.returncode, "exists", os.path.exists(out), flush=True)
    return 0 if os.path.exists(out) else 1


if __name__ == "__main__":
    sys.exit(main(sys.argv))
