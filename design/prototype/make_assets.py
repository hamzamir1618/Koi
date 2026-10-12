"""Recolour the source art into flat duotone webp assets for each palette in palettes.json."""
import json, pathlib, sys
import numpy as np
from PIL import Image

here = pathlib.Path(__file__).parent
art = here.parent / "source-art"
P = json.loads((here / "palettes.json").read_text())

def rgb(h): return [int(h[i:i + 2], 16) for i in (1, 3, 5)]

def save(im, out, maxh=None):
    if maxh and im.height > maxh:
        im = im.resize((round(im.width * maxh / im.height), maxh), Image.LANCZOS)
    out.parent.mkdir(parents=True, exist_ok=True)
    im.save(out, "WEBP", quality=90, method=6)

def tint(src, col):
    a = np.array(Image.open(src).convert("RGBA")); a[..., :3] = rgb(col); return Image.fromarray(a)

def duo(src, dark, light, thr):
    a = np.array(Image.open(src).convert("RGBA")).astype(np.int32)
    lum = (a[..., 0] * 299 + a[..., 1] * 587 + a[..., 2] * 114) // 1000
    a[..., :3] = np.where((lum < thr)[..., None], np.array(rgb(dark)), np.array(rgb(light)))
    return Image.fromarray(a.astype(np.uint8))

def build(name, out_dir):
    p = P[name]; o = pathlib.Path(out_dir)
    dragon, koi, wave = art / "dragon painting.png", art / "koi fishes.png", art / "chinese-wave.png"
    save(tint(dragon, p["ink"]), o / "dragon-ink.webp")
    save(duo(koi, p["paper"], p["cobalt"], 150), o / "koi-tide.webp")
    save(duo(koi, p["paper"], p["red"], 150), o / "koi-gate.webp")
    save(duo(koi, p["red"], p["paper"], 150), o / "koi-red.webp")
    for layer, (body, line) in p["wave"].items():
        save(duo(wave, body, line, 225), o / f"wave-{layer}.webp")
    blossom = Image.open(art / "cherry blossom branch.png").convert("RGBA")
    if name != "vibrant":  # pull the branch's own pinks toward the palette by desaturating slightly
        rgb_ = blossom.convert("RGB"); from PIL import ImageEnhance
        rgb_ = ImageEnhance.Color(rgb_).enhance(0.8); rgb_.putalpha(blossom.getchannel("A")); blossom = rgb_
    save(blossom, o / "blossom.webp", 1400)

if __name__ == "__main__":
    name = sys.argv[1]; out = sys.argv[2] if len(sys.argv) > 2 else here / "assets" / name
    build(name, out); print("assets ->", out)
