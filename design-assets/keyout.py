import sys
import numpy as np
from PIL import Image, ImageFilter, ImageOps
from collections import deque

def key_white(im, thresh=246, holes=False):
    """Alpha mask: background = near-white pixels connected to the image border."""
    a = np.asarray(im.convert('RGB')).astype(np.int16)
    h, w, _ = a.shape
    mn = a.min(axis=2)
    bgcand = mn >= thresh
    seen = np.zeros((h, w), bool)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if bgcand[y, x] and not seen[y, x]: seen[y, x] = True; q.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if bgcand[y, x] and not seen[y, x]: seen[y, x] = True; q.append((y, x))
    while q:
        y, x = q.popleft()
        for dy, dx in ((1,0),(-1,0),(0,1),(0,-1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and not seen[ny, nx] and bgcand[ny, nx]:
                seen[ny, nx] = True; q.append((ny, nx))
    # Also remove large enclosed near-white areas (e.g. the hole in a gear); small
    # highlights stay because of the minimum area.
    from scipy import ndimage
    enclosed = ((mn >= 249) & ~seen) if holes else np.zeros_like(seen)
    lab, n = ndimage.label(enclosed)
    if n:
        sizes = ndimage.sum(enclosed, lab, range(1, n + 1))
        for idx, size in enumerate(sizes, start=1):
            if size > 900:
                seen |= lab == idx
    alpha = np.where(seen, 0, 255).astype(np.uint8)
    m = Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(0.8))
    # soften: pixels adjacent to bg that are very light become semi-transparent
    return m

def duotone(rgb, alpha):
    g = ImageOps.autocontrast(ImageOps.grayscale(rgb), cutoff=1)
    c = ImageOps.colorize(g, black=(22, 40, 150), white=(238, 243, 255), mid=(80, 115, 240)).convert('RGBA')
    c.putalpha(alpha); return c
