# Geometry retained from the deposited estate plan. Loaded as AST by build_plates.py.
ROOMS = [('A', 'Entry', '/The_Atrium'), ('B', 'Living', '/The_Symposium'), ('C', 'Kitchen', '/The_Watchtower'), ('D', 'Dining', '/The_Boardroom'), ('E', 'Bedroom 1', '/The_5_Lamps'), ('F', 'Bedroom 2', '/The_Aerodrome'), ('G', 'Bedroom 3', '/The_Chair'), ('H', 'Bath', '/The_Magic_Lantern'), ('I', 'Linen', '/The_Harness'), ('J', 'Study', 'the rite'), ('K', 'Utility', '/from_beyond'), ('L', 'Garage', '/Narratives/Endor'), ('M', 'Workroom', '/Mask_vs_Mirror')]

def map_page(c):
    heading(c, 'plate xi · the estate', 'A House with Chambers')
    text(c, 'as surveyed by the county · as keyed by the estate', 216, 512, 'Italic', 10, ASH, 'center')
    x0, y0, scale = (53, 135, 0.301)

    def line(a, b, color=INK, width=0.65):
        c.setStrokeColor(color)
        c.setLineWidth(width)
        c.line(x0 + a[0] * scale, y0 + (2100 - a[1]) * scale, x0 + b[0] * scale, y0 + (2100 - b[1]) * scale)
    pts = [(0, 1100), (1060, 1100), (1060, 1730), (260, 1730), (260, 1560), (0, 1560), (0, 1100)]
    for a, b in zip(pts, pts[1:]):
        line(a, b, width=1.15)
    for a, b in [((80, 1100), (80, 1330)), ((200, 1100), (200, 1330)), ((380, 1100), (380, 1330)), ((490, 1100), (490, 1330)), ((570, 1100), (570, 1330)), ((670, 1100), (670, 1500)), ((860, 1100), (860, 1730)), ((0, 1330), (670, 1330)), ((100, 1330), (100, 1560)), ((260, 1390), (260, 1730)), ((530, 1390), (530, 1730)), ((670, 1500), (1060, 1500)), ((670, 1600), (860, 1600)), ((0, 1180), (80, 1180)), ((100, 1390), (670, 1390))]:
        line(a, b)
    line((860, 1330), (1060, 1330), EMBER, 1.1)
    doors = [(305, 1390), (704, 1500), (877, 1500), (106, 1360), (283, 1330), (144, 1330), (427, 1330), (517, 1330), (670, 1352), (615, 1330), (40, 1180), (923, 1330)]
    circles = []
    for num, (x, y) in enumerate(doors, 1):
        xx = x0 + x * scale
        yy = y0 + (2100 - y) * scale
        c.setFillColor(white)
        if num in [4, 9]:
            c.rect(xx - 2, yy - 6, 4, 13, fill=1, stroke=0)
        else:
            c.rect(xx - 6, yy - 2, 13, 4, fill=1, stroke=0)
        c.setStrokeColor(EMBER if num == 12 else ASH)
        c.setLineWidth(0.5)
        if num in [4, 9]:
            c.line(xx, yy - 6, xx + 10, yy - 6)
            c.arc(xx - 10, yy - 6, xx + 10, yy + 14, 0, 90)
        else:
            c.line(xx - 6, yy, xx - 6, yy - 10)
            c.arc(xx - 6, yy - 10, xx + 14, yy + 10, 180, 90)
        nx, ny = (xx - 10, yy + 3) if num in [4, 9] else (xx + 1, yy - 12 if num == 11 else yy + 11)
        circles.append((nx, ny, num))
    labels = [('bath', (40, 1143)), ('G', (100, 1245)), ('F', (290, 1210)), ('H', (435, 1210)), ('I', (530, 1210)), ('cl.', (620, 1210)), ('J', (765, 1210)), ('M', (960, 1210)), ('E', (50, 1455)), ('A', (180, 1470)), ('B', (390, 1570)), ('C', (595, 1570)), ('K', (765, 1550)), ('D', (765, 1680)), ('L', (960, 1545))]
    for s, (x, y) in labels:
        text(c, s, x0 + x * scale, y0 + (2100 - y) * scale, 'Display' if len(s) == 1 else 'Body', 14 if len(s) == 1 else 7, EMBER if s == 'M' else INK, 'center')
    text(c, 'hall', x0 + 460 * scale, y0 + (2100 - 1370) * scale, 'Mono', 7, ASH, 'center')
    text(c, 'front door', x0 + 190 * scale, y0 + (2100 - 1598) * scale, 'Body', 8, ASH, 'center')
    xx = x0 + 150 * scale
    yy = y0 + (2100 - 1560) * scale
    c.setFillColor(white)
    c.rect(xx, yy - 2, 50 * scale, 4, fill=1, stroke=0)
    c.setStrokeColor(INK)
    c.line(xx, yy, xx, yy + 15)
    c.arc(xx - 15, yy - 15, xx + 15, yy + 15, 0, 90)
    for a, b in [((880, 1640), (960, 1640)), ((960, 1640), (960, 1680)), ((960, 1680), (880, 1680)), ((880, 1680), (880, 1640))]:
        line(a, b, ASH, 0.45)
    text(c, 'freezer', x0 + 920 * scale, y0 + (2100 - 1665) * scale, 'Body', 7, ASH, 'center')
    for nx, ny, num in circles:
        c.setFillColor(white)
        c.setStrokeColor(EMBER if num == 12 else ASH)
        c.setLineWidth(0.5)
        c.circle(nx, ny, 5.8, fill=1, stroke=1)
        text(c, str(num), nx, ny - 2.5, 'Mono', 7, EMBER if num == 12 else INK, 'center')
    text(c, 'N', 378, 472, 'Mono', 7, ASH, 'center')
    c.setStrokeColor(ASH)
    c.line(378, 450, 378, 464)
    text(c, 'letters: rooms · circles: doors · not to scale', 216, 202, 'Mono', 7.1, ASH, 'center')
    para(c, 'The workroom conversion postdates the county plan. Door 12 is recorded in the walk-through inventory.', 64, 173, 304, 10, 13, 'Italic', INK, 1)
    sigil(c, 216, 106)
    folio(c, 12)

def key_page(c):
    heading(c, 'plate xi · continued', 'The Key')
    text(c, 'each room labeled twice', 216, 512, 'Italic', 11, ASH, 'center')
    y = 483
    for code, name, directory in ROOMS:
        text(c, code, 65, y, 'Mono', 8, EMBER)
        text(c, name, 91, y, 'Body', 11)
        text(c, directory, 229, y, 'Mono', 7.2, INK)
        y -= 19
    y -= 10
    text(c, 'DOOR SCHEDULE', 65, y, 'Mono', 8, EMBER, tracking=1.1)
    y -= 22
    schedule = ['1 hall to living · 2 kitchen to utility', '3 utility to garage · 4 bedroom 1', '5 bedroom 2 · 6 bedroom 3 · 7 bath', '8 linen · 9 study · 10 closet', '11 en suite · 12 workroom, not on the plan']
    for s in schedule:
        text(c, s, 65, y, 'Mono', 8, INK)
        y -= 15
    para(c, 'Door count, county plan: 11.\nDoor count, as walked: 12.', 65, y - 12, 302, 11, 15, 'Italic', INK, 0)
    folio(c, 13)
