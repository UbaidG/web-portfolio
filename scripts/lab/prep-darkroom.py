"""Prepares darkroom assets: removes the painted drying lines from the wall plate,
compresses the tray, and chroma-keys the clothes peg.

Usage: python scripts/lab/prep-darkroom.py
"""
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / "scripts/lab/source"
OUT = ROOT / "public/lab/darkroom"
OUT.mkdir(parents=True, exist_ok=True)

# Wall: the lines are thin bright strokes; isolate them with a top-hat and inpaint.
wall = cv2.imread(str(RAW / "darkroom-plate.jpg"))
gray = cv2.cvtColor(wall, cv2.COLOR_BGR2GRAY)
tophat = cv2.morphologyEx(gray, cv2.MORPH_TOPHAT, cv2.getStructuringElement(cv2.MORPH_RECT, (1, 9)))
mask = (tophat > 10).astype(np.uint8) * 255
band = np.zeros_like(mask)
band[110:260, 120:] = 255
mask = cv2.bitwise_and(mask, band)
mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_RECT, (25, 1)))
mask = cv2.dilate(mask, cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5)))
clean = cv2.inpaint(wall, mask, 6, cv2.INPAINT_TELEA)
cv2.imwrite(str(OUT / "wall.webp"), clean, [cv2.IMWRITE_WEBP_QUALITY, 82])

tray = cv2.imread(str(RAW / "darkroom-tray.jpg"))
cv2.imwrite(str(OUT / "tray.webp"), tray, [cv2.IMWRITE_WEBP_QUALITY, 82])

# Peg: key the green, despill, crop to content and downsize.
peg = cv2.imread(str(RAW / "peg.jpg")).astype(np.float32)
b, g, r = peg[..., 0], peg[..., 1], peg[..., 2]
key = g - np.maximum(r, b)
alpha = np.clip(1.0 - (key - 40) / 60.0, 0, 1)
g2 = np.minimum(g, np.maximum(r, b))
peg[..., 1] = g2
rgba = np.dstack([peg, alpha * 255]).clip(0, 255).astype(np.uint8)
ys, xs = np.where(alpha > 0.1)
rgba = rgba[ys.min() : ys.max() + 1, xs.min() : xs.max() + 1]
h, w = rgba.shape[:2]
scale = 220 / h
rgba = cv2.resize(rgba, (round(w * scale), 220), interpolation=cv2.INTER_AREA)
cv2.imwrite(str(OUT / "peg.webp"), rgba, [cv2.IMWRITE_WEBP_QUALITY, 90])
print("peg", rgba.shape, "wall mask px", int((mask > 0).sum()))
