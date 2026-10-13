"""
Track the chroma-green card face in the hand frames for the certification lab.

Usage:
  python track-green-card.py --out public/lab/hand  scripts/lab/source/hand-A.jpg
  python track-green-card.py --out public/lab/hand --video hand-push.mp4 --frames 48

Writes frame-XXX.webp, occluder-XXX.webp (frame pixels covering the card, e.g. the thumb, for the
first and last frame) and frames.json with the card's 4 corners (TL, TR, BR, BL) per frame.
"""

import argparse
import json
import os
import subprocess
import tempfile

import cv2
import numpy as np


def green_mask(bgr):
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
    mask = cv2.inRange(hsv, (40, 110, 90), (85, 255, 255))
    b, g, r = cv2.split(bgr.astype(np.int16))
    dominance = ((g - np.maximum(r, b)) > 40).astype(np.uint8) * 255
    mask = cv2.bitwise_and(mask, dominance)
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel, iterations=2)
    return mask


def order_corners(pts):
    c = pts.mean(axis=0)
    ang = np.arctan2(pts[:, 1] - c[1], pts[:, 0] - c[0])
    pts = pts[np.argsort(ang)]
    start = np.argmin(pts[:, 0] + pts[:, 1])
    return np.roll(pts, -start, axis=0)


def intersect(l1, l2):
    (vx1, vy1, x1, y1), (vx2, vy2, x2, y2) = l1, l2
    a = np.array([[vx1, -vx2], [vy1, -vy2]])
    b = np.array([x2 - x1, y2 - y1])
    t = np.linalg.solve(a, b)
    return np.array([x1 + vx1 * t[0], y1 + vy1 * t[0]])


def find_card(mask):
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    if not contours:
        return None
    contour = max(contours, key=cv2.contourArea)
    hull = cv2.convexHull(contour)
    peri = cv2.arcLength(hull, True)
    approx = None
    for eps in np.linspace(0.01, 0.12, 40):
        a = cv2.approxPolyDP(hull, eps * peri, True)
        if len(a) == 4:
            approx = a.reshape(4, 2).astype(np.float64)
            break
    if approx is None:
        rect = cv2.minAreaRect(contour)
        approx = cv2.boxPoints(rect).astype(np.float64)
    approx = order_corners(approx)

    # Refine: fit a line to hull points along the middle of each edge, then intersect neighbours,
    # which recovers the sharp corner behind the card's rounded corners.
    hull_pts = cv2.approxPolyDP(hull, 0.5, True).reshape(-1, 2).astype(np.float64)
    dense = []
    for i in range(len(hull_pts)):
        p, q = hull_pts[i], hull_pts[(i + 1) % len(hull_pts)]
        n = max(2, int(np.linalg.norm(q - p)))
        dense.append(np.linspace(p, q, n, endpoint=False))
    dense = np.concatenate(dense)

    lines = []
    for i in range(4):
        p, q = approx[i], approx[(i + 1) % 4]
        d = q - p
        length = np.linalg.norm(d)
        u = d / length
        rel = dense - p
        along = rel @ u
        perp = np.abs(rel @ np.array([-u[1], u[0]]))
        sel = dense[(along > 0.18 * length) & (along < 0.82 * length) & (perp < 6)]
        if len(sel) < 8:
            lines.append((u[0], u[1], p[0], p[1]))
            continue
        vx, vy, x0, y0 = cv2.fitLine(sel.astype(np.float32), cv2.DIST_HUBER, 0, 0.01, 0.01).flatten()
        lines.append((vx, vy, x0, y0))

    corners = [intersect(lines[(i - 1) % 4], lines[i]) for i in range(4)]
    return order_corners(np.array(corners))


def occluder_rgba(bgr, mask, corners):
    poly = np.zeros(mask.shape, np.uint8)
    cv2.fillPoly(poly, [np.round(corners).astype(np.int32)], 255)
    poly = cv2.dilate(poly, np.ones((5, 5), np.uint8))
    soft_green = cv2.GaussianBlur(mask, (5, 5), 0)
    alpha = cv2.bitwise_and(poly, 255 - soft_green)
    # Keep only substantial blobs (fingers); drops the thin card-edge slivers and corner wedges.
    solid = cv2.morphologyEx((alpha > 128).astype(np.uint8), cv2.MORPH_OPEN, np.ones((9, 9), np.uint8))
    count, labels, stats, _ = cv2.connectedComponentsWithStats(solid)
    keep = np.zeros_like(solid)
    min_area = 0.01 * cv2.contourArea(corners.astype(np.float32))
    for i in range(1, count):
        if stats[i, cv2.CC_STAT_AREA] >= min_area:
            keep[labels == i] = 1
    keep = cv2.dilate(keep, np.ones((5, 5), np.uint8))
    alpha = cv2.bitwise_and(alpha, keep * 255)
    alpha = cv2.erode(alpha, np.ones((3, 3), np.uint8))
    out = bgr.copy()
    b, g, r = cv2.split(out)
    g = np.minimum(g, np.minimum(np.maximum(r, b), (r.astype(np.float32) * 0.75 + b * 0.25 + 5).astype(np.uint8)))
    out = cv2.merge([b, g, r])
    return np.dstack([out, alpha])


def extract_video_frames(video, count, tmp):
    probe = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", video],
        capture_output=True,
        text=True,
        check=True,
    )
    duration = float(probe.stdout.strip())
    fps = count / duration
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-i", video, "-vf", f"fps={fps}", os.path.join(tmp, "f-%03d.png")],
        check=True,
    )
    return sorted(os.path.join(tmp, f) for f in os.listdir(tmp) if f.startswith("f-"))[:count]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("images", nargs="*")
    ap.add_argument("--video")
    ap.add_argument("--frames", type=int, default=48)
    ap.add_argument("--out", required=True)
    ap.add_argument("--quality", type=int, default=82)
    args = ap.parse_args()

    os.makedirs(args.out, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        paths = extract_video_frames(args.video, args.frames, tmp) if args.video else args.images
        frames = []
        height = width = 0
        bg = None
        for i, path in enumerate(paths):
            bgr = cv2.imread(path)
            height, width = bgr.shape[:2]
            if bg is None:
                patch = np.concatenate([bgr[:20, :20].reshape(-1, 3), bgr[:20, -20:].reshape(-1, 3)])
                bg = np.median(patch, axis=0)[::-1].astype(int).tolist()
            mask = green_mask(bgr)
            corners = find_card(mask)
            if corners is None:
                raise SystemExit(f"No green card found in {path}")
            name = f"frame-{i:03d}.webp"
            cv2.imwrite(os.path.join(args.out, name), bgr, [cv2.IMWRITE_WEBP_QUALITY, args.quality])
            entry = {"src": name, "corners": np.round(corners, 2).tolist()}
            if i == 0 or i == len(paths) - 1:
                occ = f"occluder-{i:03d}.webp"
                cv2.imwrite(os.path.join(args.out, occ), occluder_rgba(bgr, mask, corners), [cv2.IMWRITE_WEBP_QUALITY, 90])
                entry["occluder"] = occ
            frames.append(entry)

    manifest = {"width": width, "height": height, "background": bg, "frames": frames}
    with open(os.path.join(args.out, "frames.json"), "w") as f:
        json.dump(manifest, f, indent=1)
    print(json.dumps({"frames": len(frames), "first": frames[0]["corners"], "bg": bg}))


if __name__ == "__main__":
    main()
