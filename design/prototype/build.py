"""Bundle koi.src.html into single shareable HTML files, one per palette, with every asset inlined.

    python build.py            -> ../exports/koi-vibrant.html and ../exports/koi-muted.html
    python build.py muted      -> just the muted one
"""
import base64, json, pathlib, re, sys

here = pathlib.Path(__file__).parent
src = (here / "koi.src.html").read_text(encoding="utf-8")
palettes = json.loads((here / "palettes.json").read_text())

def build(name):
    pal = palettes[name]
    css = "\n".join(f"  --{k}:{v};" for k, v in pal.items() if isinstance(v, str))
    cache = {}
    def inline(m):
        f = m.group(1)
        if f not in cache:
            cache[f] = "data:image/webp;base64," + base64.b64encode((here / "assets" / name / f).read_bytes()).decode()
        return cache[f]
    out = src.replace("  /*PALETTE*/", css).replace("/*PAL_JSON*/{}", json.dumps(pal))
    out = re.sub(r"assets/([\w-]+\.webp)", inline, out)
    dest = here.parent / "exports" / f"koi-{name}.html"
    dest.write_text(out, encoding="utf-8")
    print(f"{dest.name}  {len(out) / 1024 / 1024:.2f} MB")

for n in (sys.argv[1:] or palettes):
    build(n)
