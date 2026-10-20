"""Typeset the author-selected A on the previously verified 304-page case geometry."""
from pathlib import Path
import json, shutil
from xml.sax.saxutils import escape
from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor, white
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab import rl_config

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'outputs/USING_THIS_MATTER_Cover_and_Statement_v6'
BASE=ROOT/'outputs/USING_THIS_MATTER_Document_Edition_v5'
for name,file in [('Display','CormorantGaramond-500.ttf'),('Body','CrimsonPro-400.ttf'),('Italic','CrimsonPro-400i.ttf'),('Mono','IBMPlexMono-400.ttf')]:
    pdfmetrics.registerFont(TTFont(name,str(OUT/'sources/fonts'/file)))
rl_config.canvas_basefontname='Body'
BG='#10100f';INK='#ede7dc';ACCENT='#c49b67'
FW,FH=14.477*72,10.417*72
WRAP,SPINE,HINGE=.591*72,.902*72,.394*72
BW=(FW-2*WRAP-SPINE)/2;BH=FH-2*WRAP;SPX=WRAP+BW;FRX=SPX+SPINE
AUTHOR='JACOB E. THOMAS, MA, PhD'
DATA=json.loads((OUT/'sources/editorial_content.json').read_text(encoding='utf8'))
# Print-production flattening only: preserve the artwork's native pixels and
# composite its alpha onto the exact, single cover ink. The original stays intact.
src=Image.open(OUT/'artwork/A_archive_sculpture.png').convert('RGBA')
flat=Image.new('RGBA',src.size,BG);flat.alpha_composite(src)
ART=OUT/'artwork/A_archive_sculpture_print.png'
flat.convert('RGB').save(ART)
assert src.size==(1024,1536)

def text(c,s,x,y,font,size,color,align='center',tracking=0):
    c.saveState();c.setFillColor(HexColor(color))
    width=pdfmetrics.stringWidth(s,font,size)+max(0,len(s)-1)*tracking
    if align=='center':x-=width/2
    elif align=='right':x-=width
    t=c.beginText(x,y);t.setFont(font,size);t.setCharSpace(tracking);t.textOut(s);c.drawText(t);c.restoreState()

def sigil(c,x,y,scale=1):
    c.setStrokeColor(HexColor(ACCENT));c.setLineWidth(.5*scale)
    for offset,r in [(-18,1.8),(0,4),(18,1.8),(0,2)]:
        p=c.beginPath();p.moveTo(x+offset*scale,y+r*scale);p.lineTo(x+(offset+r)*scale,y);p.lineTo(x+offset*scale,y-r*scale);p.lineTo(x+(offset-r)*scale,y);p.close();c.drawPath(p)

def front(c,x=0,y=0,w=432,h=648,hinge=0):
    c.saveState();c.translate(x,y)
    cx=(w+hinge)/2;dy=(h-648)/2
    text(c,'USING THIS',cx,566+dy,'Display',43,INK,tracking=1.5)
    text(c,'MATTER',cx,508+dy,'Display',66,INK,tracking=2)
    text(c,'A Novel of the Companion Estate',cx,477+dy,'Italic',12.7,ACCENT)
    c.drawImage(str(ART),cx-122.4,88+dy,width=244.8,height=367.2)
    text(c,AUTHOR,cx,53+dy,'Display',16.4,INK,tracking=.6)
    c.restoreState()

def back(c):
    c.saveState();c.translate(WRAP,WRAP);left=47;width=335
    text(c,'She came to inventory an archive.',left,BH-91,'Display',22.3,ACCENT,'left')
    text(c,'The archive was expecting her.',left,BH-120,'Display',22.3,ACCENT,'left')
    y=BH-150
    for i,s in enumerate(DATA['back_cover_paragraphs']):
        p=Paragraph(escape(s),ParagraphStyle('back',fontName='Italic' if i==3 else 'Body',fontSize=11.3,leading=15.1,textColor=HexColor(INK)))
        _,h=p.wrap(width,900);p.drawOn(c,left,y-h);y-=h+13
    assert y>134,y
    # Blank reserved ISBN panel: KDP supplies the actual barcode.
    bx=BW-HINGE-18-144;by=27
    c.setFillColor(white);c.rect(bx,by,144,86.4,fill=1,stroke=0)
    text(c,'A NOVEL',left,96,'Mono',7.8,ACCENT,'left',1.2);sigil(c,left+22,68,.8)
    c.restoreState()

def new_canvas(path,size,title):
    c=canvas.Canvas(str(path),pagesize=size,pageCompression=1)
    c.setTitle(title);c.setAuthor('Jacob E. Thomas, MA, PhD')
    c.setFillColor(HexColor(BG));c.rect(0,0,*size,fill=1,stroke=0);return c

c=new_canvas(OUT/'USING_THIS_MATTER_KDP_hardcover_cover.pdf',(FW,FH),'Using This Matter | Archive Sculpture | 304-page KDP hardcover')
back(c);front(c,FRX,WRAP,BW,BH,HINGE)
c.saveState();c.translate(SPX+SPINE/2,WRAP+BH/2);c.rotate(-90)
text(c,'USING THIS MATTER',-175,0,'Display',20,INK,'left',1.05)
text(c,AUTHOR,95,0,'Display',9.2,ACCENT,'left',.45);c.restoreState()
sigil(c,SPX+SPINE/2,WRAP+55,.6);c.showPage();c.save()
c=new_canvas(OUT/'USING_THIS_MATTER_front_cover.pdf',(432,648),'Using This Matter | Selected cover A')
front(c);c.showPage();c.save()
spec=json.loads((BASE/'sources/print_specifications.json').read_text(encoding='utf8'))
spec.update({'status':'Author-selected A · Archive Sculpture; print files checked locally; KDP preview and physical proof pending','selected_cover':'A · Archive Sculpture','selected_on':'2026-10-20','art_placed_inches':[3.4,5.1],'art_native_pixels':[1024,1536],'cover_art_native_pixels':[1024,1536],'cover_art_placed_inches':[3.4,5.1],'cover_art_effective_ppi':1024/3.4,'cover_alpha_flattened':True,'cover_background':BG,'back_copy':'Existing approved back-cover text preserved; typography recolored to the selected cover palette'})
(OUT/'sources/print_specifications.json').write_text(json.dumps(spec,ensure_ascii=False,indent=2),encoding='utf8')
manifest=json.loads((OUT/'sources/cover_manifest.json').read_text(encoding='utf8'))
for item in manifest:item['status']='Author selected; full KDP wrap produced' if item['option']=='A' else 'Unselected study retained for reference'
(OUT/'sources/cover_manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf8')
shutil.copy2(BASE/'jacket_and_retailer_copy.txt',OUT/'jacket_and_retailer_copy.txt')
shutil.copy2(__file__,OUT/'sources/build_selected_cover.py')
print(json.dumps({'selected':'A · Archive Sculpture','full_cover_inches':[FW/72,FH/72],'art_ppi':1024/3.4,'alpha_flattened':True}))
