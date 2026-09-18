"""
Builds a single lookbook PNG from the 21st.dev research in inspiration/,
so the options can be compared side by side instead of by name.

    python3 scripts/make-lookbook.py -> inspiration/lookbook.png

Themes are drawn from their real CSS tokens (light + dark swatch cards).
Components are the real preview renders downloaded from the 21st CDN.
"""

import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
INSP = ROOT / "inspiration"
OUT = INSP / "lookbook.png"

W = 1200
PAD = 28
BG = (14, 14, 16)
PANEL = (22, 22, 25)
INK_DIM = (150, 150, 155)
BONE = (242, 240, 236)

serif = lambda s: ImageFont.truetype(str(ROOT / "fonts/InstrumentSerif-Regular.ttf"), s)
mono = lambda s: ImageFont.truetype(str(ROOT / "fonts/JetBrainsMono-Regular.ttf"), s)


def parse_color(v: str):
    v = v.strip()
    if v.startswith("#"):
        h = v[1:]
        if len(h) == 3:
            h = "".join(c * 2 for c in h)
        try:
            return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))
        except ValueError:
            return (128, 128, 128)
    m = re.match(r"hsl\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*\)", v)
    if m:
        h, s, l = (float(m.group(i)) for i in (1, 2, 3))
        s, l = s / 100, l / 100
        c = (1 - abs(2 * l - 1)) * s
        hp = h / 60
        x = c * (1 - abs(hp % 2 - 1))
        r, g, b = (
            (c, x, 0) if hp < 1 else (x, c, 0) if hp < 2 else (0, c, x) if hp < 3 else (0, x, c) if hp < 4 else (x, 0, c) if hp < 5 else (c, 0, x)
        )
        m2 = l - c / 2
        return tuple(int(255 * (v2 + m2)) for v2 in (r, g, b))
    return (128, 128, 128)


def theme_tokens(path: Path):
    css = path.read_text()
    blocks = {"light": {}, "dark": {}}
    for selector, key in ((r":root\s*\{([^}]*)\}", "light"), (r"\.dark\s*\{([^}]*)\}", "dark")):
        m = re.search(selector, css)
        if not m:
            continue
        for line in m.group(1).splitlines():
            mm = re.match(r"\s*--([a-z0-9-]+):\s*([^;]+);", line)
            if mm:
                blocks[key][mm.group(1)] = mm.group(2).strip()
    return blocks


def hexstr(t):
    return "#%02x%02x%02x" % t


def theme_card(title, tokens, w, h):
    """One theme: light and dark swatch cards side by side, drawn from real tokens."""
    img = Image.new("RGB", (w, h), PANEL)
    d = ImageDraw.Draw(img)
    f_small = mono(13)
    d.text((10, 8), title, font=mono(16), fill=BONE)

    half = w // 2
    for i, mode in enumerate(("light", "dark")):
        tok = tokens.get(mode) or {}
        c = {k: parse_color(v) for k, v in tok.items()}
        bg = c.get("background", (255, 255, 255) if mode == "light" else (17, 17, 17))
        fg = c.get("foreground", (0, 0, 0))
        card = c.get("card", bg)
        border = c.get("border", (200, 200, 200))
        muted_fg = c.get("muted-foreground", fg)
        primary = c.get("primary", (59, 130, 246))
        accent = c.get("accent", primary)

        x0 = i * half + 8
        y0 = 34
        bw, bh = half - 18, h - 44
        d.rectangle([x0, y0, x0 + bw, y0 + bh], fill=bg, outline=(70, 70, 74))

        cx, cy, cw, ch = x0 + 12, y0 + 12, bw - 24, bh - 24
        d.rectangle([cx, cy, cx + cw, cy + ch], fill=card, outline=border)
        # headline bar + body lines
        d.rectangle([cx + 12, cy + 12, cx + 12 + int(cw * 0.52), cy + 26], fill=fg)
        for k in range(3):
            d.rectangle(
                [cx + 12, cy + 36 + k * 9, cx + 12 + int(cw * (0.78 - k * 0.14)), cy + 41 + k * 9],
                fill=muted_fg,
            )
        # chips: primary / accent / muted / border
        d.rectangle([cx + 12, cy + ch - 30, cx + 62, cy + ch - 10], fill=primary)
        d.rectangle([cx + 70, cy + ch - 30, cx + 120, cy + ch - 10], fill=accent)
        d.rectangle([cx + 128, cy + ch - 30, cx + 178, cy + ch - 10], fill=c.get("muted", bg), outline=border)
        d.text((cx + 12, y0 + bh - 44), f"{mode}  bg {hexstr(bg)}  primary {hexstr(primary)}", font=f_small, fill=muted_fg)
    return img


def component_card(label, sub, path, w, h):
    img = Image.new("RGB", (w, h), PANEL)
    d = ImageDraw.Draw(img)
    d.text((10, 8), label, font=mono(16), fill=BONE)
    d.text((10, 28), sub, font=mono(11), fill=INK_DIM)

    box_y = 46
    box_h = h - box_y - 10
    try:
        im = Image.open(path)
        im = im.convert("RGB")
        im.thumbnail((w - 20, box_h), Image.LANCZOS)
        img.paste(im, ((w - im.width) // 2, box_y + (box_h - im.height) // 2))
    except Exception as e:  # pragma: no cover
        d.text((12, box_y + 20), f"preview unavailable: {e}", font=mono(12), fill=(200, 90, 70))
    d.rectangle([8, box_y, w - 8, box_y + box_h], outline=(58, 58, 62))
    return img


def compose(cards, cols, cell_w, cell_h, gap):
    rows = (len(cards) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * cell_w + (cols + 1) * gap, rows * cell_h + (rows + 1) * gap), BG)
    for i, c in enumerate(cards):
        x = gap + (i % cols) * (cell_w + gap)
        y = gap + (i // cols) * (cell_h + gap)
        sheet.paste(c, (x, y))
    return sheet


def main():
    themes = [
        ("1. Modern Minimal (serafimcloud)", "theme/modern-minimal.txt"),
        ("2. Amber Minimal (serafimcloud)", "theme/amber-minimal.txt"),
        ("3. Darkmatter (serafimcloud)", "theme/darkmatter.txt"),
        ("4. Slate Dark (soulrenderlive)", "theme/slate-dark.txt"),
        ("5. Portfolio Pro Dark (satyamsingh)", "theme/portfolio-pro-dark.txt"),
        ("6. 432 Editorial (ben_92bae8ec)", "theme/editorial-432.txt"),
    ]
    theme_cards = [theme_card(t, theme_tokens(INSP / f), 574, 150) for t, f in themes]

    comps = [
        ("A. Portfolio Hero", "id 9037 · waleedkibhen · blur-in name + portrait overlay", "img/9037-portfolio-hero.webp"),
        ("B. Hero Block", "id 10628 · moumensoliman · avatar, staggered text, socials, scroll cue", "img/10628-hero-block.png"),
        ("C. Hero Minimalism", "id 6999 · lyanchouss · quiet full-screen hero", "img/6999-hero-minimalism.png"),
        ("D. Minimalist Hero", "id 4582 · ravikatiyar162 · monochrome portrait + colour disc", "img/4582-minimalist-hero.webp"),
        ("E. Hero Section", "id 8772 · n38693842 · minimal, small animations", "img/8772-hero-section-1.png"),
        ("F. Hero 1", "id 2723 · jahed · minimal gradient background", "img/2723-hero-1.png"),
        ("G. Project Showcase", "id 9607 · jatin-yadav05 · list + cursor-following preview", "img/9607-project-showcase.png"),
        ("H. Condition Grid", "id 25300 · uilayout · alternating project grid", "img/25300-condition-grid.png"),
        ("I. Magic Portfolio (free template)", "id 337 · larsen66 · full Next.js portfolio boilerplate", "img/tpl-magic-portfolio.jpg"),
    ]
    comp_cards = [component_card(a, b, INSP / c, 574, 300) for a, b, c in comps]

    header_h = 96
    sec_h = 46
    themes_sheet = compose(theme_cards, 2, 574, 150, 14)
    comp_sheet = compose(comp_cards, 2, 574, 300, 14)

    total_h = header_h + sec_h + themes_sheet.height + sec_h + comp_sheet.height + 40
    canvas = Image.new("RGB", (W, total_h), BG)
    d = ImageDraw.Draw(canvas)

    d.text((PAD, 24), "21st.dev options for Ashar's portfolio", font=serif(38), fill=BONE)
    d.text(
        (PAD, 70),
        "Themes are real CSS tokens from get_theme (free). Components are real preview renders. Pick a number + a letter.",
        font=mono(12),
        fill=INK_DIM,
    )

    y = header_h + 6
    d.text((PAD, y), "THEMES", font=mono(20), fill=(201, 138, 62))
    y += sec_h - 14
    canvas.paste(themes_sheet, (PAD, y))

    y += themes_sheet.height + 8
    d.text((PAD, y), "HERO + SECTION DIRECTIONS", font=mono(20), fill=(201, 138, 62))
    y += sec_h - 14
    canvas.paste(comp_sheet, (PAD, y))

    canvas.save(OUT, "PNG", optimize=True)
    print(f"wrote {OUT.relative_to(ROOT)} {canvas.size[0]}x{canvas.size[1]} {OUT.stat().st_size:,} bytes")

    # sanity: every cell non-uniform
    g = canvas.convert("L")
    for name, box in [
        ("themes", (PAD, header_h + sec_h - 8, PAD + themes_sheet.width, header_h + sec_h - 8 + themes_sheet.height)),
        ("components", (PAD, y, PAD + comp_sheet.width, y + comp_sheet.height)),
    ]:
        crop = g.crop(box)
        ex = crop.getextrema()
        print(f"  {name}: luma range {ex} {'OK' if ex[1] - ex[0] > 60 else 'SUSPECT'}")


if __name__ == "__main__":
    main()
