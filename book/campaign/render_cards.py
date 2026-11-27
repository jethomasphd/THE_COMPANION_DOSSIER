#!/usr/bin/env python3
"""
Render the campaign's social cards from the website's own data.

Every card is drawn by campaign/card.html from book/evidence.js, so the
recovered posts on the website and the posts in the campaign never drift apart.
Edit evidence.js, re-run this script, and every card is redrawn.

    pip install playwright        # once; then: playwright install chromium
    python book/campaign/render_cards.py            # from the repository root

Outputs (JPEG, quality 90):
    book/campaign/cards/post-<id>-portrait.jpg   1080 x 1350  (Instagram / Threads feed)
    book/campaign/cards/post-<id>-story.jpg      1080 x 1920  (Stories / Reels / TikTok cover)
    book/campaign/cards/post-<id>-landscape.jpg  1200 x 675   (X / LinkedIn / Bluesky)
    book/campaign/cards/quote-<key>-<format>.jpg
    book/assets/og-card.jpg                      1200 x 630   (link preview for /book)
"""
from __future__ import annotations

import functools
import http.server
import json
import re
import socketserver
import threading
from pathlib import Path

from playwright.sync_api import sync_playwright

BOOK = Path(__file__).resolve().parents[1]          # .../book
REPO = BOOK.parent
OUT = BOOK / "campaign" / "cards"
SIZES = {"portrait": (1080, 1350), "story": (1080, 1920), "landscape": (1200, 675)}


def campaign_ids() -> tuple[list[str], list[str]]:
    """Read which posts and quotes are flagged for the campaign in evidence.js."""
    src = (BOOK / "evidence.js").read_text(encoding="utf-8")
    posts = re.findall(r'id:\s*"([\w-]+)"[^{}]*?campaign:\s*true', src, flags=re.S)
    block = re.search(r"window\.CAMPAIGN_QUOTES\s*=\s*\{(.*?)\n\};", src, flags=re.S)
    quotes = re.findall(r'^\s{2}([\w-]+):\s*\{', block.group(1), flags=re.M) if block else []
    return posts, quotes


def serve(root: Path) -> tuple[socketserver.TCPServer, int]:
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(root))
    handler.log_message = lambda *a, **k: None  # quiet
    httpd = socketserver.TCPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd, httpd.server_address[1]


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    posts, quotes = campaign_ids()
    print(f"Campaign posts: {posts}")
    print(f"Campaign quotes: {quotes}")
    httpd, port = serve(REPO)
    base = f"http://127.0.0.1:{port}/book/campaign/card.html"
    jobs: list[tuple[str, Path, tuple[int, int]]] = []
    for pid in posts:
        for fmt, size in SIZES.items():
            jobs.append((f"{base}?post={pid}&format={fmt}", OUT / f"post-{pid}-{fmt}.jpg", size))
    for key in quotes:
        for fmt, size in SIZES.items():
            jobs.append((f"{base}?quote={key}&format={fmt}", OUT / f"quote-{key}-{fmt}.jpg", size))
    jobs.append((f"{base}?og=1", BOOK / "assets" / "og-card.jpg", (1200, 630)))

    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        page = browser.new_page(viewport={"width": 1200, "height": 1920}, device_scale_factor=1)
        for url, dest, (w, h) in jobs:
            page.set_viewport_size({"width": w, "height": h})
            page.goto(url)
            page.wait_for_selector("body[data-ready='1']", timeout=15000)
            page.wait_for_timeout(250)
            page.locator(".card").screenshot(path=str(dest), type="jpeg", quality=90)
            print(f"  -> {dest.relative_to(REPO)}")
        browser.close()
    httpd.shutdown()
    manifest = sorted(p.name for p in OUT.glob("*.jpg"))
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(f"Done. {len(jobs)} cards rendered.")


if __name__ == "__main__":
    main()
