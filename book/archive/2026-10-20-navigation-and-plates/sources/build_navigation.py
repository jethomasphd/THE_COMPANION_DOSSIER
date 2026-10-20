"""Replace only the two register pages and plate index in the 304-page edition.

Example from the repository's book directory:
python archive/2026-10-20-navigation/build_navigation.py --input archive/2026-10-20-production/publication/USING_THIS_MATTER_KDP_interior_304pp.pdf --output USING_THIS_MATTER_KDP_interior_304pp.pdf --fonts archive/2026-10-20-production/publication/sources/fonts --data archive/2026-10-20-navigation/navigation.json --proof CONTENTS_AND_PLATES_REVIEW.pdf
"""
import argparse,io,json,re
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
from reportlab import rl_config
from pypdf import PdfReader,PdfWriter

parser=argparse.ArgumentParser()
for name in ['input','output','fonts','data','proof']:parser.add_argument('--'+name,required=True,type=Path)
args=parser.parse_args();data=json.loads(args.data.read_text(encoding='utf8'))
for name,file in [('Display','CormorantGaramond-500.ttf'),('Body','CrimsonPro-400.ttf'),('Italic','CrimsonPro-400i.ttf'),('Mono','IBMPlexMono-400.ttf')]:pdfmetrics.registerFont(TTFont(name,str(args.fonts/file)))
rl_config.canvas_basefontname='Body'
INK=HexColor('#1a1815');ASH=HexColor('#66615a');EMBER=HexColor('#955e2c');RULE=HexColor('#c9c2b5')
LEFT,RIGHT=61,371

def text(c,s,x,y,font='Body',size=10.5,color=INK,align='left',tracking=0):
    c.saveState();c.setFillColor(color)
    width=pdfmetrics.stringWidth(s,font,size)+max(0,len(s)-1)*tracking
    if align=='center':x-=width/2
    elif align=='right':x-=width
    t=c.beginText(x,y);t.setFont(font,size);t.setCharSpace(tracking);t.textOut(s);c.drawText(t);c.restoreState()
    return width

def heading(c,kicker,title):
    text(c,kicker.upper(),216,568,'Mono',7.5,EMBER,'center',1.1)
    text(c,title,216,535,'Display',26,INK,'center')

def folio(c,s):text(c,s,216,31,'Body',8.5,ASH,'center')

def entry(c,title,page,y,x=100,size=10.5,code=None,leaders=True):
    if code:text(c,code,LEFT,y,'Mono',8,ASH)
    width=text(c,title,x,y,'Body',size)
    number=str(page);nw=pdfmetrics.stringWidth(number,'Body',size)
    start=x+width+9;end=RIGHT-nw-9
    assert start<end-3,(title,page,start,end)
    if leaders and end-start>18:
        c.saveState();c.setStrokeColor(RULE);c.setLineWidth(.35);c.setDash(.6,2.8);c.line(start,y+1.9,end,y+1.9);c.restoreState()
    text(c,number,RIGHT,y,'Body',size,INK,'right')

def record(c,rec,y,step=14,gap=17,headgap=22):
    text(c,rec['title'].upper(),LEFT,y,'Mono',7.6,EMBER)
    text(c,str(rec['folio']),RIGHT,y,'Body',10,EMBER,'right')
    y-=headgap
    for row in rec['entries']:
        entry(c,row['title'],row['folio'],y,code=row['code']);y-=step
    return y-gap

def register(c,number):
    if number==0:
        heading(c,'contents of the deposit','A Register of the Estate')
        text(c,'The estate is accessioned; this volume is paginated.',216,506,'Italic',10.3,ASH,'center')
        text(c,'Box and folder references are retained beside the page numbers.',216,491,'Italic',9.5,ASH,'center')
        text(c,'REF.',LEFT,465,'Mono',6.7,ASH);text(c,'PAGE',RIGHT,465,'Mono',6.7,ASH,'right')
        y=444
        for row in data['front_matter']:
            entry(c,row['title'],row['folio'],y,size=10);y-=13
        y-=14
        for rec in data['records'][:2]:y=record(c,rec,y)
        assert y>=84,y
        text(c,'The first number identifies the box; the second, the folder.',216,81,'Italic',9.3,ASH,'center')
        text(c,'Each Record begins a new sequence.',216,68,'Italic',9.3,ASH,'center')
        folio(c,'ix')
    else:
        text(c,'A REGISTER OF THE ESTATE',216,590,'Mono',7.5,ASH,'center',1)
        text(c,'REF.',LEFT,568,'Mono',6.7,ASH);text(c,'PAGE',RIGHT,568,'Mono',6.7,ASH,'right')
        y=545
        for rec in data['records'][2:]:y=record(c,rec,y,13.5,8,18)
        text(c,'THE APPARATUS',LEFT,y,'Mono',7.6,EMBER);y-=20
        for row in data['apparatus']:
            entry(c,row['title'],row['folio'],y,code=row.get('code'),size=10);y-=13.5
        assert y>=50,y  # The last row is 13.5 points above this cursor.
        folio(c,'x')

def plates(c):
    heading(c,'the keeper’s captions','List of Plates')
    text(c,'Page references follow the bound volume.',216,508,'Italic',10,ASH,'center')
    text(c,'PLATE',LEFT,490,'Mono',6.7,ASH);text(c,'PAGE',RIGHT,490,'Mono',6.7,ASH,'right')
    y=471
    for row in data['plates']:
        text(c,row['number'],LEFT,y,'Mono',8,EMBER)
        entry(c,row['title'],row['folio'],y,x=101,size=10.1)
        text(c,row['subtitle'],101,y-11.5,'Italic',8.5,ASH)
        y-=30
    text(c,'Plate VII is bound where it belongs.',216,64,'Italic',9,ASH,'center')
    folio(c,'xi')

source=PdfReader(args.input);assert len(source.pages)==304
def normalized(s):return re.sub(r'\s+','',s).replace('’',"'").lower()
for rec in data['records']:
    for row in rec['entries']:
        page=source.pages[row['pdf_page']-1];txt=normalized(page.extract_text())
        assert normalized(row['title']) in txt,(row['title'],row['pdf_page'])
        assert row['folio']==row['pdf_page']-16
for row in data['apparatus']+data['front_matter']:
    assert normalized(row['title']) in normalized(source.pages[row['pdf_page']-1].extract_text()),row

buffer=io.BytesIO();c=canvas.Canvas(buffer,pagesize=(432,648),pageCompression=1)
c.setTitle('Using This Matter | Contents and plate references');c.setAuthor('Jacob E. Thomas, MA, PhD')
for fn in [lambda:register(c,0),lambda:register(c,1),lambda:plates(c)]:fn();c.showPage()
c.save();buffer.seek(0);new=PdfReader(buffer)
writer=PdfWriter()
for i,p in enumerate(source.pages):writer.add_page(new.pages[i-8] if i in [8,9,10] else p)
writer.add_metadata({k:v for k,v in source.metadata.items() if isinstance(v,str)})
writer.set_page_label(0,15,style='/r');writer.set_page_label(16,303,style='/D',start=1)
writer.write(args.output)
proof=PdfWriter()
for p in new.pages:proof.add_page(p)
proof.add_metadata({'/Title':'Using This Matter | Numbered contents and plate list','/Author':'Jacob E. Thomas, MA, PhD'})
proof.write(args.proof)
check=PdfReader(args.output)
changed=[i+1 for i,(a,b) in enumerate(zip(source.pages,check.pages)) if a.get_contents().get_data()!=b.get_contents().get_data()]
assert changed==[9,10,11],changed
assert 'The Halpern Memo' in check.pages[298].extract_text()
assert 'Hale returned to the hospital in October with pneumonia.' in check.pages[271].extract_text()
print(json.dumps({'pages':304,'changed_pages':changed,'unchanged_pages':301,'chapters':sum(len(r['entries']) for r in data['records']),'plate_entries':len(data['plates'])}))
