# Retaking the README and store media

How to redo the screenshots, GIFs and videos in `docs/images/` (README) and `docs/store/` (Chrome Web Store) after the UI changes. Written for a coding agent working with one person who performs the clicks. macOS only: it uses `screencapture`, AppleScript and Touch ID.

Contents: [1 Files](#1-what-exists) · [2 Privacy rules](#2-privacy-rules-this-is-a-public-repo) · [3 Prerequisites](#3-prerequisites) · [4 Window setup](#4-window-setup) · [5 Recorder](#5-the-recorder) · [6 Take scripts](#6-take-scripts) · [7 Processing](#7-processing) · [8 Store images](#8-store-images) · [9 Publishing the videos](#9-publishing-the-videos-on-github) · [10 Pitfalls](#10-pitfalls-checklist)

## 1. What exists

| File (`docs/images/`) | Shows | README width |
|---|---|---|
| `setup-auto.gif`, `setup-touchid.gif` | The welcome/setup flow, Full auto and Touch ID / Face ID | 380 |
| `settings-auto.gif`, `settings-touchid.gif` | Locked settings, unlocking, the editor | 360 |
| `right-click-menu.png` | The context menu on a sign-in page | 420 |
| `rejected-banner.png` | The red "password rejected" banner and the `!` toolbar badge | 620 |
| `signin-auto.mp4`, `signin-touchid.mp4` | A real sign-in, in real time, ending on the signed-in portal | n/a |

**The two MP4s are not linked by filename.** The README embeds them as GitHub `user-attachments` URLs under "See it work". Replacing the file in `docs/images/` changes the repo copy only. See [section 9](#9-publishing-the-videos-on-github).

Store images (`docs/store/`) and their order are described in [`store-listing.md`](store-listing.md).

## 2. Privacy rules (this is a public repo)

- Real credentials will be on screen while recording. They must be blurred in **every frame of every output**.
- Raw recordings are unblurred and large (hundreds of MB). Keep them in a temp directory outside the repo. Delete them, and any frame dumps, once the outputs are approved.
- Never write into the repo or this guide: the person's email, home or temp paths, Chrome window ids, the extension id, or real passwords. Use placeholders such as `<window-id>`, `<ext-id>`, `X,Y,W,H`.
- Blur the **URL bar** (the OneLogin URL carries a long token) and the **profile avatar** in anything that shows the browser frame.
- The README media may show the real school pages. **Store images must not** show the Collegiate School logo or other school branding (see `store-listing.md`).
- Assets only: no `dist/` change, no version bump. Don't commit unless asked.

## 3. Prerequisites

- macOS, Google Chrome, `ffmpeg` (with `libx264` and `drawtext`), ImageMagick (`magick`), Python 3.
- The terminal app needs **Screen Recording** permission. Check with `screencapture -x test.png` and confirm the image is not black.
- Capture is Retina (2x): a 1440x900 pt region records at 2880x1800 px. Every pixel box below is in **recorded pixels**. Derive boxes from real frames each time; never reuse numbers from another machine or layout.
- Build and load the extension: `npm run build`, then load the repo root (or `npm run unpacked` output) in a **dedicated Chrome window** with only CSNYPass pinned, the bookmarks bar hidden (Cmd+Shift+B) and no other extensions in the toolbar.
- `npm run build` after UI edits, then reload the extension on `chrome://extensions` so the recording shows the current code.

## 4. Window setup

- Fix the test window's bounds with AppleScript, e.g. `tell application "Google Chrome" to set bounds of window id <window-id> to {60, 60, 1500, 960}`, then bring it frontmost (`set index of window id <window-id> to 1`, `activate`).
- **Target the window by id.** Ids change whenever Chrome is closed and reopened, and the "front window" is often the person's own browsing. List every window with its tabs and URLs before each session, and again if a call fails with "can't get window".
- The terminal and other apps must stay **outside** the capture rectangle. Take a stills snapshot first and look at it.
- Popup recordings (settings unlock) need a **blank background**: navigate the test tab to `about:blank`. Any real page leaves stray text at the popup's edge that can't be cropped away.
- Setup recordings use the welcome page: `chrome-extension://<ext-id>/popup/welcome.html` (find `<ext-id>` on `chrome://extensions`).

## 5. The recorder

`scripts/media/rec.py` records a region and stops when you create a stop file:

```bash
python3 scripts/media/rec.py /tmp/take.mov X,Y,W,H /tmp/take.stop 4 240 &   # 4 s lead-in, 240 s cap
# ...the person performs the take, then says "done"...
touch /tmp/take.stop
```

Why it exists: `screencapture -v` started as a background job and stopped with `kill -INT` exits **without saving the file**, and a fixed `-V <seconds>` limit makes the person wait after finishing. The script starts `screencapture` in its own session with SIGINT restored, then interrupts it cleanly.

Protocol for every take:

1. **Dry run first** (start, `touch` the stop file at about 3 s) after any change to the script. Check the file exists and `ffprobe` reads it.
2. Tell the person "recording starts in N seconds, go now" with the **exact clicks and pauses**, and that they reply "done" when finished.
3. On "done": `touch` the stop file, wait about 5 s, then `ffprobe -show_entries stream=width,height,duration`.
4. **Verify the take yourself before asking the person anything**: build a contact sheet and look at it:
   `ffmpeg -i take.mov -vf "fps=1,scale=300:-1,drawtext=text='%{pts\:hms}':x=4:y=4:fontsize=14:fontcolor=red,tile=6x4" -frames:v 1 contact.png`
5. If the take ended by itself (no stop file from you) or shows the wrong page, say so plainly and ask for a redo. Don't call it fine.

Capture shape: record the **whole window** (`60,60,1440,900` for the bounds above) when a macOS sheet (the Touch ID prompt, the passkey sheet) may land outside the popup or card, and crop in post. Region capture is fine for the setup card.

## 6. Take scripts

One take at a time. For each: set the starting state, start the recorder, give the person the steps, wait for "done", verify, process, show the result. **Do not start the next step until the person approves.** When the result needs a visual judgement, open it for them in Preview (`open file.png`, `open <folder>`) with a short note on what each panel is and how to reply (see [8.2](#82-the-workflow-step-by-step)); don't ask them to browse a folder.

Recommended order (fewest state resets): right-click still → Full auto setup → Full auto settings → Full auto sign-in → rejected banner → Touch ID setup → Touch ID settings → Touch ID sign-in.

Things the person has to be told, every time:

- **A locked state is created by reloading the extension.** Open `chrome://extensions` in a **new tab** (not the recording tab), click the reload arrow on CSNYPass, go back, click the toolbar icon and confirm it says **Settings locked**, then click the page to close the popup. An unlock from an earlier take stays valid for 30 minutes.
- **Switching Full auto ↔ Touch ID without a full reset:** open settings, Sign-in & settings protection, choose the mode (for Full auto, tick "Use my OneLogin password to unlock settings"), Save, then reload the extension to lock it.
- **Full reset for the setup clips:** settings, bottom of the page, **Clear all saved data**. The welcome tab opens (otherwise toolbar icon, **Set up CSNYPass**). Leave it on the first screen.
- Say which toolbar icon: the **key icon** at the top right of Chrome, not the puzzle piece.
- Say what to do at the end: usually "leave the popup open, don't click Save".

| Asset | Start state | Steps (about 1 s pause on each screen) |
|---|---|---|
| `right-click-menu.png` | A supported sign-in page open in the test window | Still, not video: `screencapture -T 5 -R X,Y,W,H out.png`. During the 5 s, right-click empty page space and hold still so the CSNYPass items show. |
| `setup-auto.gif` | Cleared data, welcome tab, first screen | Let's set it up, then email and OneLogin password, Continue, Full auto and a settings password, Finish setup, then 2 s on "You're all set!". About 16 s. |
| `setup-touchid.gif` | Same | Same, but choose Touch ID / Face ID, leave the unlock duration at its default, Finish setup, confirm the macOS passkey sheet with the fingerprint, then 2 s on "You're all set!". |
| `settings-auto.gif` | Full auto, locked, `about:blank` | Toolbar icon, type the unlock password, Unlock, editor, 3 s, stop (no Save). |
| `settings-touchid.gif` | Touch ID, locked, `about:blank` | Toolbar icon, Unlock with Touch ID / Face ID, wait about 2 s on the prompt, fingerprint, editor, 3 s. |
| `rejected-banner.png` | Signed out of the school sites, blank new tab | **Costs two failed logins on the real account: say so first.** In settings save a deliberately wrong OneLogin password, open the portal, let CSNYPass try twice. The red banner and `!` badge appear; touch nothing, capture the whole window (`screencapture -x -R ...`). Then restore the real password. |
| `signin-auto.mp4` | Full auto, signed out of Blackbaud and OneLogin, blank new tab, whole-window recording | Open the school portal from the address bar, let CSNYPass fill the steps, stop once the portal has loaded. |
| `signin-touchid.mp4` | Touch ID mode with the **Every sign-in** unlock duration, signed out, blank new tab | Same; the "Unlock to sign in" window and the Touch ID sheet appear. |

Warn the person that signing out in the test window may sign out other windows that share the profile.

## 7. Processing

Work in a temp directory outside the repo. Put filter graphs in **bash scripts** and run them with `bash script.sh`.

**Find the boxes.** Extract single frames (`ffmpeg -ss <t> -i take.mov -frames:v 1 f.png`), view them, and convert displayed coordinates back to pixels using the viewer's scale factor. A box is `crop=W:H:X:Y` in recorded pixels. Boxes you need: URL bar (whole row, always), profile avatar (always), and each email / username / password field on every step. Also hide private tab titles in the tab strip.

**Blur.** Per region: `split`, `crop`, `boxblur=20:4`, `overlay`, time-boxed with `enable`:

```text
[0:v]split=3[v][e][p];
[e]crop=EW:EH:EX:EY,boxblur=20:4[eb];
[p]crop=PW:PH:PX:PY,boxblur=20:4[pb];
[v][eb]overlay=EX:EY:enable='between(t,T1,T2)'[o1];
[o1][pb]overlay=PX:PY:enable='between(t,T1,T2)'[o2]
```

`boxblur` rejects a radius of 25 or more; use 20 or less. For stills, use ImageMagick (`magick in.png ( +clone -crop WxH+X+Y +repage -blur 0x14 ) -geometry +X+Y -composite out.png`).

**Blur windows must cover the cross-fades.** Fields appear and vanish during transitions, and a single unblurred frame leaks. This happened twice: an email visible for a few frames at the start of a sheet fade-out, and the typed-password dots on the one frame at exactly the end time of a blur window (`between(t,a,b)` can miss the frame at `b`). Start each box a few frames early, end it after the next screen has fully replaced the field, and pad edges by about 30 ms.

**Debug with source time.** Draw the source timestamp after the blur and **before** `trim`, then tile frames around each transition:
`...,drawtext=text='%{pts}':x=4:y=4:fontsize=40:fontcolor=red,trim=A:B,setpts=PTS-STARTPTS,fps=20,scale=200:-1,tile=8x3`.
Blur times are source times. `-ss` before `-i` resets timestamps, so use it for sampling only, never when reading blur times.

**Check every frame of every output**, not a sample. For a GIF, tile all of its frames: `ffmpeg -i out.gif -vf "scale=170:-1,tile=13x4" -frames:v 1 all.png`. For an MP4, check every frame around each field, fade and sheet transition at 30 fps. Look for readable email, password, username or URL text.

**Speed-ups (GIFs only).** Split into head, typing and tail with `trim` and `setpts`, then `concat`: head 1x, typing `setpts=(PTS-STARTPTS)/3` (setup) or `/4` (settings unlock), tail 1x. **Never speed up the sign-in videos.** They are real time.

**Crop.** Crop to the whole card or popup with margin. Check the **tallest state** (for example the Protection step with the settings-password fields); crops have cut off the card bottom before. Trim blank lead-in frames (the page before the popup opens).

**GIF encode.** `fps=8` to `10`, `scale=500:-1` to `560:-1` with `flags=lanczos`, then a two-step palette:

```text
split[s0][s1];[s0]palettegen=stats_mode=diff:max_colors=256[pal];[s1][pal]paletteuse=dither=sierra2_4a:diff_mode=rectangle
```

**Keep 256 colours.** 48 to 64 colours turned the green check and the green "Automation on" chip grey and dulled the confetti and background tint. If a file is too big, lower the fps or the width, not the colours. Past results: 0.1 to 3 MB.

**MP4 encode.** `-an -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -movflags +faststart`, `fps=30`, `scale=1800:-2`. End the sign-in videos on the signed-in portal, blurred beyond recognition (`boxblur=50:5` over the page area), for at least 0.5 s.

**macOS shell gotchas.** Don't store a multi-word command in a variable (zsh won't split it). BSD `sed -i` needs a suffix argument; use the editor tool instead. An unmatched glob is an error in zsh (`rm -f dir/*.png` fails on an empty directory).

## 8. Store images

Sizes, order and rules live in [`store-listing.md`](store-listing.md): five 1280x800 screenshots, a 440x280 small tile, an optional 1400x560 marquee, 24-bit PNG with no alpha, no school branding. This section is the recipe used for the 1.2.0 set, written so it can be repeated.

Contents: [8.1 Overview](#81-overview-and-when-to-rebuild) · [8.2 Workflow](#82-the-workflow-step-by-step) · [8.3 Mistakes](#83-mistakes-made-and-the-fixes) · [8.4 Style spec](#84-layout-and-style-spec)

### 8.1 Overview and when to rebuild

The store set is seven files in `docs/store/`. Each has a few UI "cards" (a popup, the welcome card, the macOS Touch ID prompt) on a styled background with a headline.

**Check what is stale first, by eye.** Put each store image next to the same screen from the current README clip and look. Text can match while the artwork has changed: the old welcome screenshot had an outdated key illustration even though every word was right, and only a side-by-side showed it.

**Two sources for the UI cards:**
- **Frames from the README GIFs** (no new capture). The settings GIFs are recorded at about 1 px per CSS px, so popups and the passkey prompt come out crisp. The setup GIFs are scaled to about 0.8x, so the welcome and setup cards need about 1.3x upscaling and come out a little soft.
- **A fresh 2x still** (`screencapture -R ...`, or `-o -l <window-number>` for one window) when a card must be sharp. Use the demo-data rules in [section 2](#2-privacy-rules-this-is-a-public-repo) if you capture anew.

Work in a temp directory outside the repo. Set `REPO` to the repo root, then `cd` into the temp directory:

```bash
export REPO=/path/to/CSNYPass      # the repo root
mkdir -p /tmp/store-work && cd /tmp/store-work
```

### 8.2 The workflow, step by step

**The Preview rule (applies to every gate).** Whenever the person has to judge something visual, build **one clear sheet**, open it for them with `open sheet.png` (macOS Preview), and say in a short list what each panel is and exactly how to reply. Don't make them dig through a folder. Three gates below use this: A (which frames), B (are the crops right), C (the finished images). The person liked this a lot, so keep doing it.

**Step 1: find what is stale (opens `cmp.png`).**

```bash
# Store image beside the matching frame of the current README clip.
# The crop numbers are examples; adjust them to each image.
ffmpeg -v error -y -ss 0.3 -i "$REPO/docs/images/setup-auto.gif" -frames:v 1 gif-setup1.png
magick "$REPO/docs/store/screenshot-1-welcome.png" -crop 640x720+560+40 +repage -resize 62% store1.png
magick montage store1.png gif-setup1.png -tile 2x1 -geometry +8+8 -background '#aaaaaa' cmp.png
open cmp.png
```

Do the same for the Protection step (store screenshot 2 vs a `setup-touchid.gif` frame) and any other card you intend to keep. Anything that differs is rebuilt.

**Step 2: choose the frames (Gate A, opens `picks.png`).** Decode every frame, make numbered contact sheets, look at them yourself, shortlist, then show the person only the chosen frames.

```bash
mkdir -p auto tid setup
ffmpeg -v error -y -i "$REPO/docs/images/settings-auto.gif" auto/f-%03d.png
ffmpeg -v error -y -i "$REPO/docs/images/settings-touchid.gif" tid/f-%03d.png
ffmpeg -v error -y -i "$REPO/docs/images/setup-auto.gif" setup/f-%03d.png

# Numbered contact sheet. Labels count from 0 but file names start at 001, so label N is f-(N+1).
n=$(ls auto | wc -l); rows=$(( (n+9)/10 ))
ffmpeg -v error -y -i "$REPO/docs/images/settings-auto.gif" \
  -vf "scale=230:-1,drawtext=text='%{n}':x=4:y=4:fontsize=14:fontcolor=red,tile=10x$rows" \
  -frames:v 1 contact-auto.png
open contact-auto.png

# Final picks for the person, side by side at 100%.
# This session: locked Full auto, editor, locked Touch ID, passkey prompt.
magick montage auto/f-007.png auto/f-031.png tid/f-007.png tid/f-030.png \
  -tile 4x1 -geometry +8+8 -background '#aaaaaa' picks.png
open picks.png cmp.png
```

A good frame is stable (not mid-fade), shows the whole card, and has **no mouse cursor over the card**. If cursor position decides between frames, zoom on that spot across the candidates (`magick f.png -crop 240x120+300+0 +repage -scale 200% crop-N.png`, then `magick montage` them). Use `ffmpeg drawtext` for labels, not ImageMagick `-annotate` (see [8.3](#83-mistakes-made-and-the-fixes)).

What to write when you open the sheets (example):

> `picks.png` shows the four picks left to right: locked Full auto (frame 7), the editor (frame 31), locked Touch ID (frame 7 of the other clip), the passkey prompt (frame 30). `cmp.png` shows store screenshots 1 and 2 beside the current setup UI. Reply "approved", "approved but keep #1 as is", or a frame number to change.

**Step 3: measure, then cut.** Measure every edge from pixels; never assume numbers from a previous run. Each GIF crop is different.

```python
# Measuring helpers (run with python3 - <<'EOF' ... EOF)
from PIL import Image
import numpy as np
a = np.array(Image.open("auto/f-007.png").convert("L")).astype(int)

# 1. Left/right edge: print a row across the edge. A 1 px border dip, then the interior.
print([int(v) for v in a[200, 50:66]])
# 2. Top edge: print a column. The toolbar strip sits above the card.
print([int(v) for v in a[0:24, 250]])
# 3. Bottom edge: scan UP from the frame bottom for the first shadow pixel. The footer divider
#    line inside the popup is NOT the bottom edge.
y = a.shape[0] - 1
while y > 100 and a[y, 250] >= 249:
    y -= 1
print("lowest non-white row", y)

# On the frame that has the cursor (here the passkey prompt):
sheet = np.array(Image.open("tid/f-030.png").convert("L")).astype(int)
# 4. A cursor: bounding box of very dark pixels in the region where you can see it.
ys, xs = np.where(sheet[150:215, 280:380] < 110)
print("cursor bbox", xs.min() + 280, xs.max() + 280, ys.min() + 150, ys.max() + 150)
# 5. Words on a text line (to find where a blur must start): columns with dark pixels, split at gaps.
cols = np.where((sheet[57:69, 10:480] < 170).sum(axis=0) > 0)[0] + 10
print("text spans columns", cols.min(), "to", cols.max())
```

To find exactly where a long string starts or ends (for the extension ID), zoom 8x with a red tick every 10 px and read the tick lines: `magick f.png -crop 120x22+150+52 +repage -filter point -scale 800% -stroke red -draw "line 0,0 0,176" -draw "line 80,0 80,176" ... ticks.png`.

Examples measured on the 1.2.0 clips (re-measure each time): the settings GIFs' popup interior is 384 px wide (24 rem, matching `--popup-width`) starting about x=53, y=8, and 334 / 512 / 282 px tall for locked Full auto / editor / locked Touch ID; the passkey prompt is a 482x309 box at x=4, y=5 (radius 11); the welcome card in `setup-auto.gif` is 439x486 at x=41, y=73 (radius 16, because that GIF is about 0.81x).

The cut-out script (adapt the boxes, frame names and the patch/blur rectangles):

```python
import os
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

OUT = "stills"
os.makedirs(OUT, exist_ok=True)


def patch_rect(im, box, color):                 # paint out a mouse cursor with flat colour
    ImageDraw.Draw(im).rectangle(box, fill=color)


def blur_region(im, box, radius):               # feathered blur, so no hard rectangle shows
    region = im.crop(box).filter(ImageFilter.GaussianBlur(radius))
    mask = Image.new("L", region.size, 0)
    ImageDraw.Draw(mask).rectangle((2, 2, region.size[0] - 3, region.size[1] - 3), fill=255)
    im.paste(region, box[:2], mask.filter(ImageFilter.GaussianBlur(1.5)))


def rounded_alpha(size, radius, ss=4):          # antialiased rounded-rectangle alpha
    w, h = size
    big = Image.new("L", (w * ss, h * ss), 0)
    ImageDraw.Draw(big).rounded_rectangle((0, 0, w * ss - 1, h * ss - 1), radius=radius * ss, fill=255)
    return big.resize((w, h), Image.LANCZOS)


def finish(im, box, radius, name, scale=2):     # crop, soften GIF dither, 2x Lanczos, round
    x, y, w, h = box
    card = im.crop((x, y, x + w, y + h)).filter(ImageFilter.GaussianBlur(0.35))
    card = card.resize((w * scale, h * scale), Image.LANCZOS)
    card = card.filter(ImageFilter.UnsharpMask(radius=1.2, percent=45, threshold=2)).convert("RGBA")
    card.putalpha(rounded_alpha(card.size, radius * scale))
    card.save(os.path.join(OUT, name))
    print(name, card.size)


load = lambda p: Image.open(p).convert("RGB")
WHITE = (253, 253, 253)

finish(load("auto/f-007.png"), (53, 8, 384, 334), 10, "s1_locked_auto.png")
finish(load("auto/f-031.png"), (53, 8, 384, 512), 10, "s2_editor.png")

im = load("tid/f-007.png")                      # cursor tip sits on the popup's top edge
g = np.array(im.convert("L")).astype(int)
ys, xs = np.where(g[0:40, 400:445] < 150)
patch_rect(im, (xs.min() + 400 - 3, 0, min(xs.max() + 400 + 3, 436), ys.max() + 3), WHITE)
finish(im, (53, 8, 384, 282), 10, "s3_locked_touchid.png")

im = load("tid/f-030.png")                      # macOS passkey prompt
patch_rect(im, (318, 165, 331, 186), WHITE)     # cursor
blur_region(im, (207, 55, 409, 72), 3.2)        # the <ext-id> inside chrome-extension://...
finish(im, (4, 5, 482, 309), 11, "s4_passkey_sheet.png")

finish(load("setup/f-001.png"), (41, 73, 439, 486), 16, "s5_welcome.png")
```

The corner radii are the card's own (popup 10, macOS sheet 11, welcome card 20 CSS px = 16 px at 0.81x). The popup corners in the frames are actually square, so rounding only trims plain white.

**Step 4: verify the cut-outs and show them (Gate B, opens `stills-preview.png`).** Three checks, then open the preview.

```python
from PIL import Image
import numpy as np

names = ["s1_locked_auto", "s2_editor", "s3_locked_touchid", "s4_passkey_sheet", "s5_welcome"]
ims = [Image.open(f"stills/{n}.png") for n in names]

# (a) All stills on a blue backdrop: shows the crops, corners and any leftover edge.
H = max(i.size[1] for i in ims) + 40
W = sum(i.size[0] for i in ims) + 40 * (len(ims) + 1)
bg = Image.new("RGB", (W, H), (120, 150, 200))
x = 40
for i in ims:
    bg.paste(i, (x, 20), i)
    x += i.size[0] + 40
bg.resize((W // 2, H // 2), Image.LANCZOS).save("stills-preview.png")

# (b) Every corner at 5x over magenta: any grey page fringe or cursor remnant is obvious.
S, Z, tiles = 48, 5, []
for im in ims:
    w, h = im.size
    back = Image.new("RGBA", im.size, (255, 0, 255, 255))
    back.alpha_composite(im)
    for (cx, cy) in [(0, 0), (w - S, 0), (0, h - S), (w - S, h - S)]:
        tiles.append(back.crop((cx, cy, cx + S, cy + S)).resize((S * Z, S * Z), Image.NEAREST))
sheet = Image.new("RGB", (S * Z * 4 + 50, S * Z * len(ims) + 10 * (len(ims) + 1)), (40, 40, 40))
for i, t in enumerate(tiles):
    r, c = divmod(i, 4)
    sheet.paste(t.convert("RGB"), (10 + c * (S * Z + 10), 10 + r * (S * Z + 10)))
sheet.save("corners-check.png")

# (c) Straight edges, as numbers: dark pixels should only be real UI (header divider, scrollbar track).
for n, im in zip(names, ims):
    a = np.array(im.convert("RGBA")).astype(int)
    h, w, _ = a.shape
    r = 40
    edge = lambda band: f"{band.min():4.0f}/{band.mean():4.0f}"
    print(f"{n:20s} L {edge(a[r:h-r, 0:2, :3].mean(axis=2))}  R {edge(a[r:h-r, w-2:w, :3].mean(axis=2))}"
          f"  T {edge(a[0:2, r:w-r, :3].mean(axis=2))}  B {edge(a[h-2:h, r:w-r, :3].mean(axis=2))}")
```

```bash
open stills-preview.png
```

Say what is in the preview, say the cursor and the extension ID were handled, mention honest limits (the welcome card is softer; blurred fields are grey boxes), and ask for approval of the crops.

**Step 5: copy gate (no image yet).** List every headline, sub line, bullet and caption per image in **one message** and check each against [`store-listing.md`](store-listing.md) and the manifest so nothing contradicts them. Take edits and decide where extra points go: this session the person asked for the 2-wrong-tries limit and the right-click pause to appear, so they became bullets on the welcome screenshot, which had room (five bullets still lined up with the card height). Keep the safety copy factual (`stops after 2 wrong tries`, `pause with a right-click`).

**Step 6: build the page.** One Python generator writes one HTML file containing every screen; `:target` shows the one named by the URL hash. It inlines the icons (an external `<use>` across `file://` pages is blocked) and uses the repo's logo.

```python
import os, re, shutil

REPO = os.environ["REPO"]
HERE = os.getcwd()
shutil.copy(os.path.join(REPO, "icons/logo.svg"), os.path.join(HERE, "logo.svg"))
sprite = open(os.path.join(REPO, "icons/sprite.svg")).read()


def symbol(name):
    return re.search(r'<symbol[^>]*id="%s"[^>]*>(.*?)</symbol>' % name, sprite, re.S).group(1)


def sprite_icon(name):                          # Phosphor glyphs are filled paths
    return '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">%s</svg>' % symbol(name)


def svg(inner):                                 # simple line icons drawn to match
    return ('<svg viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="16" '
            'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">%s</svg>' % inner)


ICONS = {
    "lock": sprite_icon("lock-simple"),
    "check": svg('<polyline points="56,136 104,184 200,76"/>'),
    "globe": svg('<circle cx="128" cy="128" r="88"/><ellipse cx="128" cy="128" rx="36" ry="88"/>'
                 '<line x1="40" y1="128" x2="216" y2="128"/>'),
    "no": svg('<circle cx="128" cy="128" r="88"/><line x1="66" y1="66" x2="190" y2="190"/>'),
    "shield": svg('<path d="M128 28 L208 56 V120 C208 172 172 208 128 228 C84 208 48 172 48 120 V56 Z"/>'
                  '<polyline points="94,126 120,152 166,100"/>'),
    "pause": svg('<circle cx="128" cy="128" r="88"/><line x1="104" y1="96" x2="104" y2="160"/>'
                 '<line x1="152" y1="96" x2="152" y2="160"/>'),
    "arrow": svg('<line x1="48" y1="128" x2="208" y2="128"/><polyline points="144,64 208,128 144,192"/>'),
}


def bullet(icon, text):
    return '<li><i>%s</i><div><b>%s</b></div></li>' % (ICONS[icon], text)


def brand():
    return '<div class="brand"><img src="logo.svg" alt=""><span>CSNYPass</span></div>'


def card(src, x, y, w):
    return '<img class="card" src="stills/%s" style="left:%dpx;top:%dpx;width:%dpx">' % (src, x, y, w)


screens = {
    # layout A: text left, one card right
    "s1": '<section id="s1" class="screen a"><div class="left">%s<h1>School sign-in,<br>filled for you</h1>'
          '<p class="sub">Set up once, and CSNYPass handles the repeated email and username steps.</p>'
          '<ul class="bul">%s</ul></div>%s</section>'
          % (brand(), "".join([bullet("check", "Free and open source"),
                               bullet("lock", "Encrypted on your device"),
                               bullet("shield", "Stops after 2 wrong tries"),
                               bullet("pause", "Pause with a right-click"),
                               bullet("globe", "Works in Chrome and Edge")]),
             card("s5_welcome.png", 640, 96, 540)),
    "s5": '<section id="s5" class="screen a"><div class="left">%s<h1>Encrypted, on your<br>device only</h1>'
          '<ul class="bul">%s</ul></div>%s</section>'
          % (brand(), "".join([bullet("lock", "AES-256-GCM encryption"),
                               bullet("no", "No servers, analytics or tracking"),
                               bullet("globe", "Runs only on the three sign-in sites"),
                               bullet("check", "Open source (MIT)")]),
             card("s2_editor.png", 672, 52, 522)),
    # layout B: pill, centred header, two cards with an arrow
    "s3": '<section id="s3" class="screen b"><div class="pill navy">Full auto</div><h1>No prompts. Just signed in.</h1>'
          '<p class="sub">Settings stay locked behind a password only you know.</p>%s'
          '<div class="cap" style="left:172px;top:586px;width:396px">Enter your password to open settings</div>'
          '<div class="arrow" style="left:613px;top:356px">%s</div>%s</section>'
          % (card("s1_locked_auto.png", 172, 227, 396), ICONS["arrow"], card("s2_editor.png", 712, 227, 396)),
    "s4": '<section id="s4" class="screen b"><div class="pill orange">Touch ID / Face ID</div>'
          '<h1>Unlock with your fingerprint or face</h1>'
          '<p class="sub">Your saved login stays locked until it is really you.</p>%s'
          '<div class="arrow" style="left:556px;top:449px">%s</div>%s</section>'
          % (card("s3_locked_touchid.png", 72, 314, 446), ICONS["arrow"], card("s4_passkey_sheet.png", 648, 296, 560)),
    "promo-small": '<section id="promo-small" class="screen small"><img class="mark" src="logo.svg" alt="">'
                   '<div class="name">CSNYPass</div><div class="tag">Sign in to school in one click</div></section>',
    "promo-marquee": '<section id="promo-marquee" class="screen marquee"><div class="mleft">'
                     '<div class="mbrand"><img src="logo.svg" alt=""><span>CSNYPass</span></div>'
                     '<h2>Sign in to school in one click</h2>'
                     '<p>Fills your school sign-in steps. Encrypted, and only on your device.</p>'
                     '<div class="chips"><span class="pill navy">Full auto</span>'
                     '<span class="pill orange">Touch ID / Face ID</span></div></div>%s</section>'
                     % card("s2_editor.png", 938, 44, 353),
}

CSS = """
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;color:#14243D;-webkit-font-smoothing:antialiased}
.screen{display:none;position:relative;overflow:hidden;
  background:radial-gradient(circle at 100% 100%,#FDF1DE 0,rgba(253,241,222,0) 38%),
             linear-gradient(135deg,#E2EBF8 0%,#F3F6FB 52%,#F3F6FB 100%)}
.screen:target{display:block}
.a,.b{width:1280px;height:800px}.small{width:440px;height:280px}.marquee{width:1400px;height:560px}
h1{color:#00306B;font-weight:700;letter-spacing:-.022em}.sub{color:#3B4A62}
.card{position:absolute;height:auto;filter:drop-shadow(0 22px 34px rgba(0,48,107,.22)) drop-shadow(0 2px 5px rgba(0,48,107,.10))}
.a .left{position:absolute;left:85px;top:0;bottom:0;width:520px;display:flex;flex-direction:column;justify-content:center}
.brand{display:flex;align-items:center;gap:14px;margin-bottom:38px}.brand img{width:40px;height:40px}
.brand span{font-size:23px;font-weight:700;color:#00306B;letter-spacing:-.01em}
.a h1{font-size:58px;line-height:1.08;margin-bottom:26px}
.a .sub{font-size:25px;line-height:1.42;margin-bottom:30px;max-width:470px}
.bul{list-style:none;display:flex;flex-direction:column;gap:18px}
.bul li{display:flex;align-items:center;gap:16px}
.bul i{flex:none;width:36px;height:36px;border-radius:50%;background:#E3ECF8;color:#00306B;display:grid;place-items:center}
.bul i svg{width:19px;height:19px}.bul b{font-size:23px;font-weight:700;color:#14243D;letter-spacing:-.005em}
.b .pill{position:absolute;left:50%;top:44px;transform:translateX(-50%);font-size:15px;padding:0 20px;height:32px;line-height:32px;white-space:nowrap}
.b h1{position:absolute;left:0;right:0;top:92px;text-align:center;font-size:54px;line-height:64px}
.b .sub{position:absolute;left:0;right:0;top:158px;text-align:center;font-size:24px}
.cap{position:absolute;text-align:center;font-size:19px;font-weight:700;color:#3B4A62}
.arrow{position:absolute;width:54px;height:54px;border-radius:50%;background:#00306B;color:#fff;display:grid;place-items:center;box-shadow:0 8px 18px -6px rgba(0,48,107,.55)}
.arrow svg{width:26px;height:26px;stroke-width:20}
.pill{display:inline-block;border-radius:999px;color:#fff;font-weight:700;letter-spacing:.09em;text-transform:uppercase}
.pill.navy{background:#00306B}.pill.orange{background:#C2410C}
.small .mark{position:absolute;left:50%;top:26px;width:104px;height:104px;margin-left:-52px;filter:drop-shadow(0 8px 12px rgba(0,48,107,.22))}
.small .name{position:absolute;left:0;right:0;top:136px;text-align:center;font-size:42px;font-weight:700;color:#00306B;letter-spacing:-.02em;line-height:52px}
.small .tag{position:absolute;left:0;right:0;top:198px;text-align:center;font-size:18px;font-weight:600;color:#3B4A62}
.mleft{position:absolute;left:120px;top:0;bottom:0;width:780px;display:flex;flex-direction:column;justify-content:center}
.mbrand{display:flex;align-items:center;gap:22px;margin-bottom:28px}
.mbrand img{width:100px;height:100px;filter:drop-shadow(0 8px 12px rgba(0,48,107,.22))}
.mbrand span{font-size:70px;font-weight:700;color:#00306B;letter-spacing:-.025em}
.mleft h2{font-size:42px;color:#00306B;font-weight:700;letter-spacing:-.02em;margin-bottom:16px}
.mleft p{font-size:24px;color:#3B4A62;margin-bottom:28px}
.chips{display:flex;gap:14px}.chips .pill{font-size:15px;height:32px;line-height:32px;padding:0 20px}
"""

open(os.path.join(HERE, "store.html"), "w").write(
    '<!doctype html><html><head><meta charset="utf-8"><title>store</title><style>%s</style></head><body>%s</body></html>'
    % (CSS, "".join(screens.values())))
print("wrote store.html:", ", ".join(screens))
```

**Step 7: render and review (Gate C, opens the output folder).**

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
mkdir -p out
for spec in s1:1280,800 s3:1280,800 s4:1280,800 s5:1280,800 promo-small:440,280 promo-marquee:1400,560; do
  id=${spec%%:*}; size=${spec##*:}
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --window-size=$size --virtual-time-budget=3000 --screenshot=out/$id.raw.png \
    "file://$PWD/store.html#$id" >/dev/null 2>&1
  magick out/$id.raw.png -background white -alpha remove -alpha off -depth 8 out/$id.png && rm out/$id.raw.png
  echo "$id $(magick identify -format '%wx%h %[channels]' out/$id.png)"     # expect exact size and "srgb"
done
open out
```

Look at every render yourself at full size first (spacing, clipped text, bullet count against the card height). Then tell the person what was built (a table of file, size, which old file it replaces), the honest limits, and any choice you made that they may want to undo (for example five bullets), and ask them to approve or name changes ("drop the Edge bullet", "smaller headline"). Iterate per image.

**Step 8: install and document.** Copy to `docs/store/` under the **same filenames** so the listing order is unchanged (`s1` is `screenshot-1-welcome.png`, `s3` is `screenshot-3-full-auto.png`, `s4` is `screenshot-4-touch-id.png`, `s5` is `screenshot-5-privacy.png`, plus both promo tiles). Update the Assets section of [`store-listing.md`](store-listing.md) (descriptions, the version shown, which images were rebuilt). Run the privacy scan from section 2, delete the frame dumps, stills and renders, and don't commit unless asked.

### 8.3 Mistakes made and the fixes

| Problem | Fix |
|---|---|
| ImageMagick `-annotate` and `montage -label` silently produce nothing when no font is found, and `2>/dev/null` hid the error | Label with `ffmpeg drawtext`, or skip labels. Don't silence stderr while debugging. |
| Contact-sheet label N is not `f-N` | Labels count from 0, file names from 001: label N is `f-(N+1)`. |
| The popup and the page behind it are both near-white, so threshold edge detection failed | Use the 1 px border dip on a row or column, and scan **up from the frame bottom** for the shadow. The footer divider is not the bottom edge. |
| Popup corners in the frames are square | Rounding in the template only trims plain white, so it is safe. |
| A mouse cursor sits on the card in many frames | Pick another frame first. Patch with flat colour only if every candidate has it. |
| The old welcome screenshot had an outdated key illustration | Compare against the current clip before deciding what to keep. |
| The sprite has only some icons, and `<use>` across `file://` pages is blocked | Inline the sprite glyphs and draw the others as line icons. |
| Python inside a multi-line shell string kept breaking, and the working directory resets between commands | Use `python3 - <<'EOF'` here-docs and absolute paths. |
| Images missing from a headless screenshot | `--virtual-time-budget=3000`. The screenshot size equals `--window-size`. |
| Welcome card softer than the popups | It is upscaled about 1.3x from a 0.8x GIF. Say so; offer a fresh 2x still if sharpness matters. |

### 8.4 Layout and style spec

Matches the existing images; change it only on purpose.

- Canvas gradient: `#E2EBF8` top-left, `#F3F6FB` through the middle, a warm cream `#FDF1DE` glow in the bottom-right corner.
- Colours: navy `#00306B` (headlines, Full auto pill, arrow circle), burnt orange `#C2410C` (Touch ID / Face ID pill), slate `#3B4A62` (subtitles), `#14243D` (bullet text), `#E3ECF8` (round icon chips).
- Type: Helvetica Neue bold. Headlines about 54 to 58 px with slightly tight tracking, subtitles about 24 px.
- Layout A (screens 1 and 5): text column on the left (logo, headline, sub, icon bullets), one card on the right, vertically balanced. Layout B (screens 3 and 4): pill, centred headline and sub, then two cards with a navy circular arrow between them and an optional caption under the left card.
- Card widths used (1x CSS px): screen 3 popups 396, screen 4 locked popup 446 and passkey prompt 560, screen 5 editor 522, welcome card 540, marquee editor 353.
- Promo small: centred logo (104 px), name, one-line tagline. Marquee: left logo with the name, headline, sub and two pills, right the editor card.
- Cards get a CSS `drop-shadow` (a soft blue 22 px shadow plus a tight 2 px one) so the shadow follows the rounded alpha edge.
- Output: PNG, 24-bit, no alpha (`magick ... -alpha remove -alpha off`), exact sizes, no school branding, nothing real on screen.

## 9. Publishing the videos on GitHub

GitHub only creates `user-attachments` URLs when a file is dragged into a README, issue or PR editor. **Give the person these steps and wait for the links. Don't assume they exist.**

1. Open the README on GitHub and click the pencil (edit), or open a new issue or PR comment box.
2. Drag in `docs/images/signin-auto.mp4`. GitHub inserts a `https://github.com/user-attachments/assets/...` URL.
3. Do the same for `signin-touchid.mp4`.
4. Paste both URLs to the agent (or over the two bare URLs under "See it work" in `README.md`).
5. After pushing, check that both videos play.

## 10. Pitfalls checklist

1. A locked state needs an extension reload. Confirm "Settings locked" before recording.
2. The wrong window or tab is targeted after Chrome is reopened. List windows first.
3. A take with no file, or one that ended early. Probe and look at a contact sheet before saying anything.
4. The terminal or another app overlaps the capture rectangle.
5. Blur leaks at transitions. Check every frame.
6. Palette cut below 256 colours; a GIF that is too heavy; sign-in videos accidentally sped up.
7. README widths no longer fit after a crop changes the aspect ratio.
8. The README's video URLs still point at the old uploads.
9. Do one capture step at a time, wait for "done", and don't move on (or start store images) until told.
10. Delete raw recordings and frame dumps when finished.
11. Show visual results with `open` (Preview or Finder) and say what to look at and how to reply; never leave the person to dig for files.
12. Store images: compare each old image with the current UI before keeping it, measure edges from pixels, and run the blur and edge checks in [8.2](#82-the-workflow-step-by-step).
