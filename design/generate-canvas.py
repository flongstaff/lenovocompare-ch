#!/usr/bin/env python3
"""
Signal Precision — Canvas Expression (Refined)
A visual philosophy piece: IBM industrial precision meets Swiss cartographic rigor.
The subtle reference: the TrackPoint — a single red datum in a field of engineered black.
"""

from reportlab.lib.pagesizes import A3
from reportlab.lib.colors import Color, HexColor
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import math
import hashlib
import os

# === Fonts ===
FONT_DIR = os.path.expanduser(
    "~/.claude/plugins/cache/anthropic-agent-skills/example-skills/a5bcdd7e58cd/skills/canvas-design/canvas-fonts"
)
pdfmetrics.registerFont(TTFont("PlexMono", os.path.join(FONT_DIR, "IBMPlexMono-Regular.ttf")))
pdfmetrics.registerFont(TTFont("PlexMonoBold", os.path.join(FONT_DIR, "IBMPlexMono-Bold.ttf")))
pdfmetrics.registerFont(TTFont("PlexSerif", os.path.join(FONT_DIR, "IBMPlexSerif-Regular.ttf")))
pdfmetrics.registerFont(TTFont("PlexSerifBold", os.path.join(FONT_DIR, "IBMPlexSerif-Bold.ttf")))
pdfmetrics.registerFont(TTFont("PlexSerifItalic", os.path.join(FONT_DIR, "IBMPlexSerif-Italic.ttf")))
pdfmetrics.registerFont(TTFont("PlexSerifBI", os.path.join(FONT_DIR, "IBMPlexSerif-BoldItalic.ttf")))
pdfmetrics.registerFont(TTFont("Jura", os.path.join(FONT_DIR, "Jura-Light.ttf")))
pdfmetrics.registerFont(TTFont("JuraMedium", os.path.join(FONT_DIR, "Jura-Medium.ttf")))
pdfmetrics.registerFont(TTFont("Italiana", os.path.join(FONT_DIR, "Italiana-Regular.ttf")))

# === Colors (refined — tighter palette, more intentional hierarchy) ===
BG_OUTER = HexColor("#0c0c0c")
BG = HexColor("#111111")
GRID_FINE = Color(1, 1, 1, 0.018)
GRID_MAJOR = Color(1, 1, 1, 0.035)
GRID_ACCENT = Color(1, 1, 1, 0.06)
FRAME = Color(1, 1, 1, 0.08)
FRAME_INNER = Color(1, 1, 1, 0.04)
MUTED = Color(1, 1, 1, 0.22)
LABEL = Color(1, 1, 1, 0.30)
LABEL_BRIGHT = Color(1, 1, 1, 0.45)
TEXT = Color(1, 1, 1, 0.70)
WHITE = Color(1, 1, 1, 0.90)
RED = HexColor("#da1e28")
RED_SOFT = Color(0.855, 0.118, 0.157, 0.6)
RED_GHOST = Color(0.855, 0.118, 0.157, 0.12)
BLUE_ACCENT = Color(0.059, 0.384, 0.996, 0.55)
BLUE_GHOST = Color(0.059, 0.384, 0.996, 0.15)
BLUE_PALE = Color(0.35, 0.55, 0.85, 0.25)

# === Canvas Setup ===
W, H = A3
OUT = os.path.join(os.path.dirname(__file__), "signal-precision.pdf")
c = canvas.Canvas(OUT, pagesize=A3)

MARGIN = 52
GRID = 24
CX = W / 2
CY = H * 0.555

# ============================================================
# LAYER 0 — Background & Atmosphere
# ============================================================
# Outer bleed
c.setFillColor(BG_OUTER)
c.rect(0, 0, W, H, fill=1, stroke=0)

# Main field (slightly lighter than bleed for depth)
c.setFillColor(BG)
c.rect(MARGIN - 8, MARGIN - 8, W - 2 * MARGIN + 16, H - 2 * MARGIN + 16, fill=1, stroke=0)

# Horizontal scan lines (very subtle texture)
c.setStrokeColor(Color(1, 1, 1, 0.008))
c.setLineWidth(0.2)
for y in range(0, int(H), 2):
    if y % 6 == 0:
        c.line(MARGIN, y, W - MARGIN, y)

# ============================================================
# LAYER 1 — Grid System (engineering paper precision)
# ============================================================
# Fine grid
c.setStrokeColor(GRID_FINE)
c.setLineWidth(0.12)
for x in range(int(MARGIN), int(W - MARGIN) + 1, GRID):
    c.line(x, MARGIN, x, H - MARGIN)
for y in range(int(MARGIN), int(H - MARGIN) + 1, GRID):
    c.line(MARGIN, y, W - MARGIN, y)

# Major grid (every 4 units = 96pt)
c.setStrokeColor(GRID_MAJOR)
c.setLineWidth(0.25)
for x in range(int(MARGIN), int(W - MARGIN) + 1, GRID * 4):
    c.line(x, MARGIN, x, H - MARGIN)
for y in range(int(MARGIN), int(H - MARGIN) + 1, GRID * 4):
    c.line(MARGIN, y, W - MARGIN, y)

# Super-major grid (every 8 units = 192pt)
c.setStrokeColor(GRID_ACCENT)
c.setLineWidth(0.35)
for x in range(int(MARGIN), int(W - MARGIN) + 1, GRID * 8):
    c.line(x, MARGIN, x, H - MARGIN)
for y in range(int(MARGIN), int(H - MARGIN) + 1, GRID * 8):
    c.line(MARGIN, y, W - MARGIN, y)

# ============================================================
# LAYER 2 — Frames & Registration
# ============================================================
# Outer frame
c.setStrokeColor(FRAME)
c.setLineWidth(1.0)
c.rect(MARGIN, MARGIN, W - 2 * MARGIN, H - 2 * MARGIN, fill=0, stroke=1)

# Inner frame
c.setStrokeColor(FRAME_INNER)
c.setLineWidth(0.35)
c.rect(MARGIN + 14, MARGIN + 14, W - 2 * MARGIN - 28, H - 2 * MARGIN - 28, fill=0, stroke=1)

# Corner registration marks
for cx, cy in [(MARGIN, MARGIN), (W - MARGIN, MARGIN), (MARGIN, H - MARGIN), (W - MARGIN, H - MARGIN)]:
    c.setStrokeColor(LABEL)
    c.setLineWidth(0.5)
    for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
        sign_x = 1 if cx == MARGIN else -1
        sign_y = 1 if cy == MARGIN else -1
        # Only draw outward marks
        if (dx * sign_x >= 0) and (dy * sign_y >= 0):
            continue
        c.line(cx, cy, cx + dx * 8, cy + dy * 8)

# Coordinate labels (bottom and top)
c.setFont("PlexMono", 4.5)
c.setFillColor(MUTED)
for i, x in enumerate(range(int(MARGIN), int(W - MARGIN) + 1, GRID * 4)):
    c.drawCentredString(x, MARGIN - 12, f"{i:02d}")
    c.drawCentredString(x, H - MARGIN + 5, f"{i:02d}")
for i, y in enumerate(range(int(MARGIN), int(H - MARGIN) + 1, GRID * 4)):
    c.drawRightString(MARGIN - 6, y - 1.5, f"{i:02d}")

# ============================================================
# LAYER 3 — Angular Protractor (around central datum)
# ============================================================
PROTRACTOR_R = 240

# Outer arc ring
c.setStrokeColor(Color(1, 1, 1, 0.025))
c.setLineWidth(0.3)
c.circle(CX, CY, PROTRACTOR_R, fill=0, stroke=1)
c.circle(CX, CY, PROTRACTOR_R - 12, fill=0, stroke=1)

# Tick marks
for deg in range(0, 360, 2):
    rad = math.radians(deg)
    if deg % 30 == 0:
        tick_inner = PROTRACTOR_R - 12
        tick_outer = PROTRACTOR_R
        alpha = 0.18
        width = 0.5
    elif deg % 10 == 0:
        tick_inner = PROTRACTOR_R - 8
        tick_outer = PROTRACTOR_R
        alpha = 0.08
        width = 0.3
    else:
        tick_inner = PROTRACTOR_R - 4
        tick_outer = PROTRACTOR_R
        alpha = 0.03
        width = 0.15

    x1 = CX + tick_inner * math.cos(rad)
    y1 = CY + tick_inner * math.sin(rad)
    x2 = CX + tick_outer * math.cos(rad)
    y2 = CY + tick_outer * math.sin(rad)

    c.setStrokeColor(Color(1, 1, 1, alpha))
    c.setLineWidth(width)
    c.line(x1, y1, x2, y2)

# Degree labels at cardinal + 30° intervals
c.setFont("PlexMono", 3.8)
for deg in range(0, 360, 30):
    rad = math.radians(deg)
    lx = CX + (PROTRACTOR_R + 10) * math.cos(rad)
    ly = CY + (PROTRACTOR_R + 10) * math.sin(rad)
    c.setFillColor(Color(1, 1, 1, 0.20 if deg % 90 != 0 else 0.35))
    c.drawCentredString(lx, ly - 1.5, f"{deg}")

# ============================================================
# LAYER 4 — Concentric Calibration Rings
# ============================================================
for r in [180, 140, 100, 72, 48, 28]:
    # Opacity increases toward center
    alpha = 0.02 + (180 - r) / 180 * 0.08
    c.setStrokeColor(Color(1, 1, 1, alpha))
    c.setLineWidth(0.3)
    c.circle(CX, CY, r, fill=0, stroke=1)

    # Small radius label at 45°
    if r in [180, 100, 48]:
        lx = CX + r * math.cos(math.radians(45))
        ly = CY + r * math.sin(math.radians(45))
        c.setFont("PlexMono", 3)
        c.setFillColor(Color(1, 1, 1, 0.12))
        c.drawString(lx + 3, ly + 1, f"r={r}")

# Crosshair
c.setStrokeColor(Color(1, 1, 1, 0.06))
c.setLineWidth(0.25)
c.line(CX, CY - PROTRACTOR_R + 14, CX, CY + PROTRACTOR_R - 14)
c.line(CX - PROTRACTOR_R + 14, CY, CX + PROTRACTOR_R - 14, CY)

# Fine tick marks on crosshair
for d in range(-220, 221, GRID):
    if d == 0:
        continue
    tick = 2 if abs(d) % (GRID * 4) != 0 else 4
    c.setStrokeColor(Color(1, 1, 1, 0.08 if tick == 2 else 0.15))
    c.setLineWidth(0.25)
    c.line(CX + d, CY - tick, CX + d, CY + tick)
    c.line(CX - tick, CY + d, CX + tick, CY + d)

# ============================================================
# LAYER 5 — THE RED DATUM (TrackPoint)
# ============================================================
# Graduated glow (many layers for smoothness)
for r_glow in range(40, 4, -1):
    alpha = 0.003 + (40 - r_glow) / 40 * 0.04
    c.setFillColor(Color(0.855, 0.118, 0.157, alpha))
    c.circle(CX, CY, r_glow, fill=1, stroke=0)

# The point itself — crisp, solid
c.setFillColor(RED)
c.circle(CX, CY, 6.5, fill=1, stroke=0)

# Specular highlight (top-left, very subtle)
c.setFillColor(Color(1, 0.4, 0.4, 0.15))
c.circle(CX - 1.5, CY + 1.5, 2.5, fill=1, stroke=0)

# Datum label
c.setFont("PlexMono", 4.5)
c.setFillColor(RED_SOFT)
c.drawString(CX + 12, CY + 12, "REF.DATUM 00")
c.setFont("PlexMono", 3.5)
c.setFillColor(MUTED)
c.drawString(CX + 12, CY + 5, f"POSITION: ({CX:.0f}, {CY:.0f})")

# ============================================================
# LAYER 6 — Measurement Stations (upper zone)
# ============================================================
stations_y = H - MARGIN - 190
num_stations = 8

for i in range(num_stations):
    sx = MARGIN + 72 + i * 90
    sy = stations_y

    # Station outer ring
    c.setStrokeColor(Color(1, 1, 1, 0.08))
    c.setLineWidth(0.4)
    c.circle(sx, sy, 5, fill=0, stroke=1)

    # Inner circle
    c.setStrokeColor(Color(1, 1, 1, 0.04))
    c.setLineWidth(0.2)
    c.circle(sx, sy, 8, fill=0, stroke=1)

    # Center indicator
    if i == 3:
        c.setFillColor(BLUE_ACCENT)
        c.circle(sx, sy, 2.2, fill=1, stroke=0)
        # Blue glow
        c.setFillColor(BLUE_GHOST)
        c.circle(sx, sy, 6, fill=1, stroke=0)
    else:
        c.setFillColor(Color(1, 1, 1, 0.15))
        c.circle(sx, sy, 1.2, fill=1, stroke=0)

    # Station label
    c.setFont("PlexMono", 4)
    c.setFillColor(MUTED if i != 3 else LABEL_BRIGHT)
    c.drawCentredString(sx, sy - 16, f"ST-{i + 1:02d}")

    # Connecting line
    if i < num_stations - 1:
        c.setStrokeColor(Color(1, 1, 1, 0.03))
        c.setLineWidth(0.25)
        c.line(sx + 10, sy, sx + 80, sy)

# Station row label
c.setFont("PlexMono", 3.5)
c.setFillColor(Color(1, 1, 1, 0.12))
c.drawString(MARGIN + 24, stations_y + 18, "MEASUREMENT ARRAY — 8 STATIONS")

# ============================================================
# LAYER 7 — Frequency Analysis Bars (left zone)
# ============================================================
bar_x = MARGIN + 32
bar_base_y = MARGIN + 100
bar_heights = [38, 64, 98, 78, 52, 86, 42, 68, 34, 58, 82, 46, 74, 32, 92, 50]

for i, bh in enumerate(bar_heights):
    by = bar_base_y + i * 30

    # Dark bar body
    c.setFillColor(Color(1, 1, 1, 0.025))
    c.rect(bar_x, by, bh, 12, fill=1, stroke=0)

    # Accent line (top edge)
    is_red = i == 7
    if is_red:
        c.setFillColor(Color(0.855, 0.118, 0.157, 0.4))
    else:
        c.setFillColor(Color(0.059, 0.384, 0.996, 0.2 + (bh / 100) * 0.15))
    c.rect(bar_x, by + 11, bh, 1.2, fill=1, stroke=0)

    # End cap marker
    c.setFillColor(Color(1, 1, 1, 0.08))
    c.rect(bar_x + bh - 1, by, 1, 12, fill=1, stroke=0)

    # Label
    c.setFont("PlexMono", 3.5)
    c.setFillColor(Color(1, 1, 1, 0.18))
    c.drawRightString(bar_x - 5, by + 3, f"F{i + 1:02d}")

# Bar section label
c.setFont("PlexMono", 3.5)
c.setFillColor(Color(1, 1, 1, 0.12))
c.drawString(MARGIN + 24, bar_base_y + len(bar_heights) * 30 + 6, "SPECTRAL ANALYSIS")

# ============================================================
# LAYER 8 — Signal Density Field (right zone, dot matrix)
# ============================================================
dot_ox = W - MARGIN - 210
dot_oy = MARGIN + 100
DSPC = 11
DCOLS = 16
DROWS = 22

for row in range(DROWS):
    for col in range(DCOLS):
        dx = dot_ox + col * DSPC
        dy = dot_oy + row * DSPC

        h = int(hashlib.md5(f"{row}-{col}-v2".encode()).hexdigest()[:2], 16)
        fcx = dot_ox + (DCOLS * DSPC) / 2
        fcy = dot_oy + (DROWS * DSPC) / 2
        dist = math.sqrt((dx - fcx) ** 2 + (dy - fcy) ** 2)

        # Gaussian-ish falloff
        if dist < 40:
            size = 2.0 + (h % 3) * 0.3
            alpha = 0.45 + (h % 5) * 0.08
        elif dist < 70:
            size = 1.4 + (h % 2) * 0.4
            alpha = 0.25 + (h % 4) * 0.04
        elif dist < 100:
            size = 0.9 + (h % 2) * 0.3
            alpha = 0.12 + (h % 3) * 0.03
        else:
            size = 0.6 + (h % 2) * 0.2
            alpha = 0.05 + (h % 3) * 0.015

        # Red signal cluster (subtle — only those who know will see it)
        if 8 <= row <= 13 and 6 <= col <= 11 and dist < 55:
            # Within the cluster, some dots turn red
            if h % 4 == 0:
                c.setFillColor(Color(0.855, 0.118, 0.157, alpha * 0.7))
            else:
                c.setFillColor(Color(0.5, 0.55, 0.7, alpha * 0.5))
        else:
            c.setFillColor(Color(0.4, 0.55, 0.75, alpha * 0.4))

        c.circle(dx, dy, size, fill=1, stroke=0)

# Field label
c.setFont("PlexMono", 3.5)
c.setFillColor(Color(1, 1, 1, 0.12))
c.drawString(dot_ox, dot_oy - 10, "FIELD SURVEY 001 — SIGNAL DENSITY MAP")

# ============================================================
# LAYER 9 — Title Block (top, refined typography)
# ============================================================
title_y = H - MARGIN - 56

# Thin rule above title
c.setStrokeColor(Color(1, 1, 1, 0.06))
c.setLineWidth(0.3)
c.line(MARGIN + 22, title_y + 38, W - MARGIN - 22, title_y + 38)

# Main title — staggered weight
c.setFont("Italiana", 38)
c.setFillColor(WHITE)
c.drawString(MARGIN + 22, title_y, "SIGNAL")

c.setFont("Jura", 38)
c.setFillColor(TEXT)
c.drawString(MARGIN + 188, title_y, "PRECISION")

# Subtitle — serif italic for contrast
c.setFont("PlexSerifItalic", 7.5)
c.setFillColor(Color(1, 1, 1, 0.28))
c.drawString(MARGIN + 22, title_y - 16, "A study in industrial measurement and chromatic datum reference")

# Classification block (top right, tighter)
c.setFont("PlexMono", 4.2)
c.setFillColor(MUTED)
c.drawRightString(W - MARGIN - 22, title_y + 8, "DOC.REF  SP-2026-001")
c.drawRightString(W - MARGIN - 22, title_y - 1, "CLASS    OPEN")
c.drawRightString(W - MARGIN - 22, title_y - 10, "DATUM    47.38\u00b0N  8.54\u00b0E")

# ============================================================
# LAYER 10 — Bottom Information Strip
# ============================================================
strip_y = MARGIN + 20

# Divider
c.setStrokeColor(Color(1, 1, 1, 0.06))
c.setLineWidth(0.3)
c.line(MARGIN + 22, strip_y + 40, W - MARGIN - 22, strip_y + 40)

# Left column: instrument data
c.setFont("PlexMono", 4.2)
c.setFillColor(MUTED)
c.drawString(MARGIN + 22, strip_y + 28, "INSTRUMENT   THINKPAD CALIBRATION STANDARD")
c.drawString(MARGIN + 22, strip_y + 18, "METHOD       SYSTEMATIC OBSERVATION / COMPARATIVE ANALYSIS")
c.drawString(MARGIN + 22, strip_y + 8, "LOCALE       de-CH / SWISS CONFEDERATION")

# Right column: attribution
c.setFont("PlexSerifItalic", 6.5)
c.setFillColor(Color(1, 1, 1, 0.25))
c.drawRightString(W - MARGIN - 22, strip_y + 28, "Signal Precision")
c.setFont("PlexMono", 3.8)
c.setFillColor(MUTED)
c.drawRightString(W - MARGIN - 22, strip_y + 18, "VISUAL PHILOSOPHY  /  2026")
c.drawRightString(W - MARGIN - 22, strip_y + 8, "LENOVOCOMPARE CH")

# ============================================================
# LAYER 11 — Swiss Cross Registration Mark
# ============================================================
sx_cross = W - MARGIN - 40
sy_cross = H - MARGIN - 40
cs = 5

c.setFillColor(RED)
c.rect(sx_cross - cs / 6, sy_cross - cs / 2, cs / 3, cs, fill=1, stroke=0)
c.rect(sx_cross - cs / 2, sy_cross - cs / 6, cs, cs / 3, fill=1, stroke=0)

c.setFont("PlexMono", 3)
c.setFillColor(MUTED)
c.drawRightString(sx_cross - 8, sy_cross - 1.5, "CH")

# Mirror cross (bottom-left corner)
sx_bl = MARGIN + 40
sy_bl = MARGIN + 40
c.setFillColor(Color(1, 1, 1, 0.08))
c.rect(sx_bl - cs / 6, sy_bl - cs / 2, cs / 3, cs, fill=1, stroke=0)
c.rect(sx_bl - cs / 2, sy_bl - cs / 6, cs, cs / 3, fill=1, stroke=0)

# ============================================================
# SAVE
# ============================================================
c.save()
print(f"Canvas saved to: {OUT}")
