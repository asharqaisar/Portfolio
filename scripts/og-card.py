"""
Renders the social share card -> app/opengraph-image.png

Kept in the repo (not .cache) because .cache is wiped between sessions.
Design matches the Monolith world: ink ground, lime accent, hairline obelisk.

    python3 scripts/og-card.py
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "app" / "opengraph-image.png"

W, H = 1200, 630
INK = (2, 6, 23)      # void
BONE = (248, 250, 252)  # chalk
DIM = (148, 163, 184)  # mute
BRASS = (174, 243, 63)  # lime

PAD_X, PAD_Y = 88, 80


def font(name: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(ROOT / "fonts" / name), size)


def tracked(draw, xy, text, fnt, fill, spacing=0.0):
    """Draw text with manual letter-spacing (PIL has no tracking option)."""
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=fnt, fill=fill, anchor="lt")
        x += fnt.getlength(ch) + spacing
    return x


def radial_bloom(cx, cy, radius, strength):
    """Small gradient upscaled to full size - cheap and smooth."""
    n = 128
    yy, xx = np.mgrid[0:n, 0:n]
    d = np.sqrt((xx / n - cx) ** 2 + (yy / n - cy) ** 2) / radius
    a = np.clip(1.0 - d, 0, 1) ** 2.2 * strength
    return np.clip(a * 255, 0, 255).astype(np.uint8)


def linear_mask(stops, length, vertical=True):
    """stops: [(pos, alpha), ...] -> 1D float ramp of `length`."""
    xs = np.array([s[0] for s in stops])
    ys = np.array([s[1] for s in stops])
    t = np.linspace(0, 1, length)
    return np.interp(t, xs, ys)


def main():
    img = Image.new("RGB", (W, H), INK)
    dr = ImageDraw.Draw(img)

    # brass bloom, upper right
    bloom = Image.fromarray(radial_bloom(0.82, 0.08, 0.95, 1.0), mode="L").resize(
        (W, H), Image.BICUBIC
    )
    img.paste(Image.new("RGB", (W, H), BRASS), (0, 0), bloom.point(lambda v: int(v * 0.30)))

    # obelisk hairline
    ramp = linear_mask([(0, 0), (0.42, 0.85), (0.78, 0.15), (1, 0)], H)
    line = Image.new("RGB", (1, H), BRASS)
    line.putalpha(Image.fromarray((ramp * 255).astype(np.uint8), mode="L"))
    img.alpha_composite(line, dest=(W - 132, 0)) if img.mode == "RGBA" else img.paste(
        line, (W - 132, 0), line.getchannel("A")
    )

    # brass tick on the obelisk
    dr.rectangle([W - 124 - 17, 108, W - 124, 108 + 17], fill=BRASS)

    serif = font("InstrumentSerif-Regular.ttf", 112)
    mono_sm = font("JetBrainsMono-Regular.ttf", 19)
    mono_md = font("JetBrainsMono-Regular.ttf", 29)
    mono_lg = font("JetBrainsMono-Regular.ttf", 21)

    # top label
    dr.rectangle([PAD_X, PAD_Y + 6, PAD_X + 7, PAD_Y + 13], fill=BRASS)
    tracked(dr, (PAD_X + 21, PAD_Y), "PORTFOLIO / 2026", mono_sm, DIM, spacing=5)

    # name
    tracked(dr, (PAD_X, 232), "Ashar Qaisar", serif, BONE, spacing=-1)

    # hairline rule
    rule_y = 232 + 128
    dr.rectangle([PAD_X, rule_y, PAD_X + 260, rule_y], fill=(51, 55, 69))

    # role
    tracked(
        dr,
        (PAD_X, rule_y + 30),
        "Full-Stack Developer · AI Integration Engineer",
        mono_md,
        BRASS,
        spacing=0.5,
    )

    # bottom contact line
    tracked(
        dr,
        (PAD_X, H - PAD_Y - 26),
        "noahext994@gmail.com · +92 316 4413714 · Gujranwala, PK",
        mono_lg,
        DIM,
        spacing=1,
    )

    img.save(OUT, "PNG", optimize=True)
    print(f"wrote {OUT.relative_to(ROOT)}  {img.size[0]}x{img.size[1]}  {OUT.stat().st_size:,} bytes")


if __name__ == "__main__":
    main()
