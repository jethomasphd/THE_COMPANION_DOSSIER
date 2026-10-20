from pathlib import Path
import json, shutil
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab import rl_config
from reportlab.lib.colors import HexColor
from pypdf import PdfReader, PdfWriter

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'outputs/USING_THIS_MATTER_Cover_and_Statement_v6'
WORK=ROOT/'work/v6'
BASE=ROOT/'outputs/USING_THIS_MATTER_Document_Edition_v5'
for d in ['artwork','previews','sources']:(OUT/d).mkdir(parents=True,exist_ok=True)
shutil.copytree(BASE/'sources/fonts',OUT/'sources/fonts',dirs_exist_ok=True)
for name,file in [('Display','CormorantGaramond-500.ttf'),('Body','CrimsonPro-400.ttf'),('Italic','CrimsonPro-400i.ttf'),('Bold','CrimsonPro-600.ttf'),('Mono','IBMPlexMono-400.ttf')]:
    pdfmetrics.registerFont(TTFont(name,str(OUT/'sources/fonts'/file)))
rl_config.canvas_basefontname='Body'

def text(c,s,x,y,font,size,color,align='center',tracking=0):
    c.saveState();c.setFillColor(HexColor(color))
    width=pdfmetrics.stringWidth(s,font,size)+max(0,len(s)-1)*tracking
    if align=='center':x-=width/2
    elif align=='right':x-=width
    t=c.beginText(x,y);t.setFont(font,size);t.setCharSpace(tracking);t.textOut(s);c.drawText(t);c.restoreState()

FILES=[('A','Archive Sculpture','exec-2f16114c-9ea4-48c3-9065-6e98efa4715e.png','A_archive_sculpture.png','#10100f','#ede7dc','#c49b67'),
       ('B','The Unbound Archive','exec-a6c02bb4-07ef-4f93-aa26-8e22ed6b96e7.png','B_unbound_archive.png','#eae4d8','#25231e','#8a572c'),
       ('C','The Emergent Face','exec-697350f8-224f-430f-a076-b4b92dfb2239.png','C_the_emergent_face.png','#151a1c','#efeadf','#c3a47a')]
manifest=[]
for letter,name,src,dst,bg,ink,accent in FILES:
    shutil.copy2(Path('C:/Users/jthomas/.codex/generated_images/01a155a3-c6df-7790-baa1-1bbe5284e6f5')/src,OUT/'artwork'/dst)
    f=WORK/f'cover_{letter}.pdf';c=canvas.Canvas(str(f),pagesize=(432,648),pageCompression=1)
    c.setTitle('Using This Matter | '+name);c.setAuthor('Jacob E. Thomas, MA, PhD')
    c.setFillColor(HexColor(bg));c.rect(0,0,432,648,fill=1,stroke=0)
    # Actual generated alpha is retained: no picture rectangle or matte behind the figure.
    if letter=='A':
        text(c,'USING THIS',216,566,'Display',43,ink,tracking=1.5)
        text(c,'MATTER',216,508,'Display',66,ink,tracking=2)
        text(c,'A Novel of the Companion Estate',216,477,'Italic',12.7,accent)
        c.drawImage(str(OUT/'artwork'/dst),93.6,88,width=244.8,height=367.2,mask='auto')
        text(c,'JACOB E. THOMAS, MA, PhD',216,53,'Display',16.4,ink,tracking=.6)
    elif letter=='B':
        text(c,'USING THIS',216,565,'Display',45,ink,tracking=.7)
        text(c,'MATTER',216,505,'Display',69,ink,tracking=1.1)
        text(c,'A Novel of the Companion Estate',216,475,'Italic',12.7,accent)
        c.drawImage(str(OUT/'artwork'/dst),93.6,87,width=244.8,height=367.2,mask='auto')
        text(c,'Jacob E. Thomas, MA, PhD',216,51,'Display',18.5,ink)
    else:
        text(c,'USING THIS',45,573,'Display',42,ink,'left',1.1)
        text(c,'MATTER',42,509,'Display',75,ink,'left',1.4)
        text(c,'A Novel of the Companion Estate',45,478,'Italic',12.7,accent,'left')
        c.drawImage(str(OUT/'artwork'/dst),100,87,width=244.8,height=367.2,mask='auto')
        text(c,'JACOB E. THOMAS',45,57,'Display',21,ink,'left',.8)
        text(c,'MA, PhD',45,36,'Body',11,accent,'left',.5)
    c.showPage();c.save()
    manifest.append({'option':letter,'title':name,'artwork':'artwork/'+dst,'native_pixels':[1024,1536],'placed_inches':[3.4,5.1],'effective_ppi':1024/3.4,'background':bg,'status':'Cover concept; awaiting selection','alpha_preserved':True})
w=PdfWriter()
for letter,*_ in FILES:w.add_page(PdfReader(WORK/f'cover_{letter}.pdf').pages[0])
w.add_metadata({'/Title':'Using This Matter | Three cover renditions','/Author':'Jacob E. Thomas, MA, PhD','/Subject':'Cover workshop; not a KDP wrap'})
w.write(OUT/'COVER_RENDITIONS.pdf')
(OUT/'sources/cover_manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf8')
shutil.copy2(__file__,OUT/'sources/build_covers.py')
print(json.dumps({'cover_options':3,'ppi':1024/3.4,'output':str(OUT)}))
