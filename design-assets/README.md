# Design assets

Everything shipped with the site lives in `client/public/assets/`:

| Folder | What | Source / licence |
|---|---|---|
| `3d/` | 13 blue 3D icons | [3dicons](https://3dicons.co) V1 — **CC0**. "color" renders, background removed and recoloured to brand blue with `keyout.py` |
| `illus/` | 26 illustrations | [unDraw](https://undraw.co/license) — free for commercial use, no attribution required. Recoloured `#6c63ff → #2f55e4` |
| `photos/` | 8 photos | Wikimedia Commons, StockSnap, NASA via rawpixel — all **CC0** |

`credits.json` lists every file with creator, licence and source URL; the public `/credits` page is generated from it (`client/src/content/credits.js`).

Raw downloads used while selecting (not committed): `3dicons-candidates/`, `undraw-candidates/`, `photos-candidates/`, `photos-wikimedia/`.
Rejected on purpose: rawpixel images that carry a visible watermark; Unsplash (blocks automated access); Pexels (403).
