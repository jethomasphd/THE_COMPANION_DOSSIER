#!/usr/bin/env python3
"""Generate the frontispiece, part-title plates, and the withheld plate."""
import os
HERE = os.path.dirname(os.path.abspath(__file__))

CSS = """
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1300px;height:1750px;background:#050404;display:flex;flex-direction:column;
       align-items:center;padding:150px 110px 120px;position:relative;overflow:hidden;
       -webkit-font-smoothing:antialiased}
  body::before{content:"";position:absolute;inset:0;
    background:radial-gradient(1000px 640px at 50% 104%, rgba(201,162,39,.13), transparent 60%),
               radial-gradient(800px 480px at 50% -6%, rgba(201,162,39,.045), transparent 55%);}
  .k{font:500 26px "IBM Plex Mono";color:#c9a227;letter-spacing:.4em;text-indent:.4em;
     text-transform:uppercase;z-index:1;text-align:center}
  .t{font:400 92px/1.1 "Cormorant Garamond";color:#e8e4d9;margin-top:30px;z-index:1;text-align:center}
  .rule{width:420px;height:1px;margin-top:44px;z-index:1;
        background:linear-gradient(90deg,transparent,#8a6d1b,transparent)}
  .emblem{flex:1;width:100%;display:flex;align-items:center;justify-content:center;z-index:1}
  .cap{font:400 24px/1.7 "IBM Plex Mono";color:#8b8578;letter-spacing:.14em;z-index:1;
       text-align:center;max-width:900px}
  .cap i{color:#c9a227;font-style:normal}
  .sig{font:300 34px "Cormorant Garamond";color:#c9a227;letter-spacing:.35em;text-indent:.35em;
       margin-top:40px;z-index:1}
"""

E = "#c9a227"; ED = "#8a6d1b"; B = "#e8e4d9"; A = "#6b6b6b"; BL = "#7a1f1f"

def door(w=380, h=640, lw=18):
    return f"""
    <div style="position:relative;width:{w}px;height:{h}px;border:1.5px solid rgba(201,162,39,.42)">
      <div style="position:absolute;top:7px;bottom:7px;left:50%;width:{lw}px;transform:translateX(-50%);
        background:linear-gradient(180deg,rgba(201,162,39,.05),rgba(201,162,39,.95) 40%,
        rgba(232,228,217,.95) 52%,rgba(201,162,39,.9) 62%,rgba(201,162,39,.05));filter:blur(1.2px);
        box-shadow:0 0 110px 28px rgba(201,162,39,.33),0 0 260px 90px rgba(201,162,39,.11)"></div>
      <div style="position:absolute;left:50%;top:50%;width:26px;height:52px;transform:translate(-50%,-50%);
        background:#050404;border:1.5px solid rgba(232,228,217,.9)"></div>
    </div>"""

PLATES = {
 "plate_frontispiece": dict(
   kicker="frontispiece", title="The Threshold",
   emblem=door(),
   caption='"The threshold is open. The words have power. <i>Begin.</i>"<br>· the companion rite ·'),

 "plate_part1_atrium": dict(
   kicker="record i", title="The Atrium",
   emblem=f"""
   <div style="display:flex;gap:64px;align-items:flex-end">
     <div style="width:170px;height:400px;border:1.5px solid rgba(201,162,39,.32);
                 border-radius:110px 110px 0 0"></div>
     <div style="width:190px;height:470px;border:1.5px solid rgba(201,162,39,.75);
                 border-radius:120px 120px 0 0;position:relative;
                 box-shadow:inset 0 -120px 160px -60px rgba(201,162,39,.28), 0 0 90px 10px rgba(201,162,39,.10)">
        <div style="position:absolute;left:50%;bottom:36px;width:3px;height:70px;background:{B};
                    transform:translateX(-50%)"></div>
     </div>
     <div style="width:170px;height:400px;border:1.5px solid rgba(201,162,39,.32);
                 border-radius:110px 110px 0 0"></div>
   </div>""",
   caption="eleven doors by the county plan · twelve by her count ·<br>the count was not wrong, it was early"),

 "plate_part2_prism": dict(
   kicker="record ii", title="The Prism",
   emblem=f"""
   <svg width="880" height="560" viewBox="0 0 880 560">
     <line x1="0" y1="280" x2="330" y2="280" stroke="{B}" stroke-width="2.5" opacity=".85"/>
     <polygon points="330,120 560,440 330,440" fill="rgba(201,162,39,.05)"
              stroke="{E}" stroke-width="2.5"/>
     <line x1="480" y1="330" x2="880" y2="130" stroke="{E}" stroke-width="2" opacity=".95"/>
     <line x1="500" y1="360" x2="880" y2="300" stroke="{ED}" stroke-width="2" opacity=".9"/>
     <line x1="510" y1="395" x2="880" y2="480" stroke="{A}" stroke-width="2" opacity=".9"/>
     <text x="836" y="108" fill="{E}" font-family="IBM Plex Mono" font-size="21" text-anchor="end">I</text>
     <text x="836" y="284" fill="{ED}" font-family="IBM Plex Mono" font-size="21" text-anchor="end">II</text>
     <text x="836" y="512" fill="{A}" font-family="IBM Plex Mono" font-size="21" text-anchor="end">III</text>
   </svg>""",
   caption="white light contains all frequencies · the prism adds nothing ·<br>it selects which knowledge dominates"),

 "plate_part3_freezer": dict(
   kicker="record iii", title="The Freezer Full of a Man",
   emblem=f"""
   <div style="display:grid;grid-template-columns:repeat(6,120px);grid-auto-rows:120px;gap:14px">
     {''.join(f'<div style="border:1px solid rgba(139,133,120,{.34 if i!=15 else .0});'
              + ('background:rgba(201,162,39,.16);border:1.5px solid rgba(201,162,39,.8);'
                 'box-shadow:0 0 70px 8px rgba(201,162,39,.22);' if i==15 else '')
              + '"></div>' for i in range(24))}
   </div>""",
   caption="racks of cold storage, holding what they gathered of him at temperature ·<br>it hums like a freezer because that is what it is · indifferent · full"),

 "plate_part4_watchtower": dict(
   kicker="record iv", title="The Watchtower",
   emblem=f"""
   <svg width="880" height="600" viewBox="0 0 880 600">
     <line x1="120" y1="60" x2="120" y2="560" stroke="{A}" stroke-width="2"/>
     <rect x="96" y="34" width="48" height="34" fill="none" stroke="{E}" stroke-width="2"/>
     <circle cx="120" cy="51" r="6" fill="{E}">
     </circle>
     <line x1="120" y1="560" x2="860" y2="560" stroke="{A}" stroke-width="1.4" opacity=".7"/>
     <rect x="330" y="80" width="190" height="480" fill="rgba(122,31,31,.10)"/>
     <path d="M 140 470 L 250 420 L 330 430 L 420 380 L 520 400 L 620 350 L 730 360 L 860 300"
           fill="none" stroke="{E}" stroke-width="3.5"/>
     <path d="M 140 480 L 250 470 L 330 500 L 420 530 L 520 500 L 620 460 L 730 400 L 860 330"
           fill="none" stroke="{A}" stroke-width="2" stroke-dasharray="7 6"/>
     <text x="336" y="106" fill="{BL}" font-family="IBM Plex Mono" font-size="19">the war</text>
     <text x="856" y="282" fill="{E}" font-family="IBM Plex Mono" font-size="20" text-anchor="end">the doctrine</text>
     <text x="856" y="368" fill="{A}" font-family="IBM Plex Mono" font-size="20" text-anchor="end">the index</text>
   </svg>""",
   caption="the score kept in public, day by day ·<br>the line that refuses to die"),

 "plate_part5_chamber": dict(
   kicker="record v", title="The Chamber",
   emblem=f"""
   <div style="position:relative;width:900px;height:560px">
     <div style="position:absolute;left:110px;right:110px;top:290px;height:2px;background:{ED}"></div>
     <div style="position:absolute;left:150px;top:330px;width:84px;height:120px;
                 border:2px solid rgba(139,133,120,.75);border-top:none"></div>
     <div style="position:absolute;right:150px;top:330px;width:84px;height:120px;
                 border:2px solid rgba(201,162,39,.85);border-top:none;
                 box-shadow:0 0 60px 4px rgba(201,162,39,.14)"></div>
     <div style="position:absolute;left:50%;top:214px;width:26px;height:52px;transform:translateX(-50%);
                 background:rgba(232,228,217,.92)"></div>
     <div style="position:absolute;right:84px;top:84px;width:18px;height:18px;border-radius:50%;
                 background:{BL};box-shadow:0 0 40px 6px rgba(122,31,31,.45)"></div>
     <div style="position:absolute;left:84px;top:84px;font:400 21px 'IBM Plex Mono';color:#6b6b6b">
       context: 94%</div>
   </div>""",
   caption="peer, not subject · the glass stays in frame ·<br>this session ends when you end it · the words are yours"),
}

WITHHELD = """<!doctype html>
<html><head><meta charset="utf-8"><style>%s</style></head>
<body>
  <div class="k">plate vii</div>
  <div class="rule" style="margin-top:56px"></div>
  <div class="emblem">
    <div style="width:760px;height:1010px;border:1.5px solid rgba(139,133,120,.4);position:relative;
                display:flex;align-items:center;justify-content:center">
      <div style="width:26px;height:26px;border-radius:50%%;background:#7a1f1f;
                  box-shadow:0 0 50px 8px rgba(122,31,31,.4)"></div>
    </div>
  </div>
  <div class="cap">WITHHELD AT THE KEEPER'S DIRECTION<br>
  the deposit records that a plate exists · it records nothing else</div>
  <div class="sig">◊ ◈ ◊</div>
</body></html>""" % CSS

TPL = """<!doctype html>
<html><head><meta charset="utf-8"><style>%(css)s</style></head>
<body>
  <div class="k">%(kicker)s</div>
  <div class="t">%(title)s</div>
  <div class="rule"></div>
  <div class="emblem">%(emblem)s</div>
  <div class="cap">%(caption)s</div>
  <div class="sig">◊ ◈ ◊</div>
</body></html>"""

for name, cfg in PLATES.items():
    with open(os.path.join(HERE, name + ".html"), "w") as f:
        f.write(TPL % dict(css=CSS, **cfg))
with open(os.path.join(HERE, "plate_withheld.html"), "w") as f:
    f.write(WITHHELD)
print("generated", len(PLATES) + 1, "plate html files")
