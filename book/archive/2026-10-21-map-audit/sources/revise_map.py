"""Repair Plate XI against the narrative; preserve all other release pages.

Room sizes and unnumbered circulation gaps are schematic, not surveyed facts.
The county arrangement and the later conversion are separate graphic layers.
"""
import argparse,io,json,hashlib
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab import rl_config
from pypdf import PdfReader,PdfWriter

p=argparse.ArgumentParser()
for k in ['input','output','proof','fonts','report']:p.add_argument('--'+k,required=True,type=Path)
a=p.parse_args()
for name,file in {'Display':'CormorantGaramond-500.ttf','Body':'CrimsonPro-400.ttf','Italic':'CrimsonPro-400i.ttf','Mono':'IBMPlexMono-400.ttf'}.items():pdfmetrics.registerFont(TTFont(name,str(a.fonts/file)))
rl_config.canvas_basefontname='Body'
INK=HexColor('#25231f');PAPER=HexColor('#f1eee6');EMBER=HexColor('#955e2c');ASH=HexColor('#68635a');RULE=HexColor('#c9c2b5')

def text(c,s,x,y,font='Body',size=10,color=INK,align='left'):
    c.setFillColor(color);c.setFont(font,size)
    {'left':c.drawString,'center':c.drawCentredString,'right':c.drawRightString}[align](x,y,s)

def para(c,s,x,y,w=288,size=10,lead=13,font='Body',color=INK):
    q=Paragraph(escape(s).replace('\n','<br/>'),ParagraphStyle('p',fontName=font,fontSize=size,leading=lead,textColor=color,splitLongWords=False))
    _,h=q.wrap(w,1000);q.drawOn(c,x,y-h);return y-h

def rule(c,x1,y1,x2,y2,col=RULE,width=.5,dash=None):
    c.saveState();c.setStrokeColor(col);c.setLineWidth(width)
    if dash:c.setDash(dash)
    c.line(x1,y1,x2,y2);c.restoreState()

def base(c,title,sub,folio):
    text(c,'PLATE XI / '+('THE ESTATE' if folio=='xii' else 'CONTINUED'),54,602,'Mono',7.5,EMBER)
    text(c,title,54,571,'Display',29)
    text(c,sub.upper(),54,550,'Mono',7.3,ASH)
    c.setFillColor(PAPER);c.setStrokeColor(RULE);c.setLineWidth(.4);c.rect(54,83,324,445,fill=1,stroke=1)
    rule(c,54,528,82,528,EMBER,1.2)
    text(c,folio,216,31,'Body',8.5,ASH,'center')

# Abstract plan grid. The outline and broad room arrangement derive from the
# original deposited plate. The linen position is corrected to face the study,
# as the narrative explicitly requires; circulation is intentionally schematic.
ROOMS={
 'en suite':(0,0,80,80),'G':(0,0,200,230),'F':(200,0,380,230),
 'H':(380,0,490,230),'closet':(490,0,680,230),'J':(680,0,860,400),
 'E':(0,230,100,460),'A':(100,310,260,460),'B':(260,310,530,630),
 'I':(530,310,610,400),'C':(530,400,680,630),'K':(680,400,860,500),
 'D':(680,500,860,630),'L':(860,230,1060,630),'M':(860,0,1060,230)}
HALL=[(100,230,680,310),(610,310,680,400)]
# Opening origin, orientation, width, swing direction, badge side, endpoints.
DOORS=[
 (1,300,310,'h',34,'down','up',('hall','B')),
 (2,680,425,'v',34,'right','left',('C','K')),
 (3,860,425,'v',34,'right','left',('K','L')),
 (4,100,255,'v',34,'left','right',('E','hall')),
 (5,260,230,'h',34,'up','down',('F','hall')),
 (6,140,230,'h',34,'up','down',('G','hall')),
 (7,420,230,'h',34,'up','down',('H','hall')),
 (8,610,333,'v',34,'left','right',('I','hall')),
 (9,680,333,'v',34,'right','right',('hall','J')),
 (10,570,230,'h',60,'bifold','down',('closet','hall')),
 (11,30,80,'h',34,'down','down',('en suite','G')),
 (12,920,230,'h',34,'down','up',('M','L'))]
PASSAGES=[(175,310,'h',50,('hall','A')),(260,375,'v',50,('A','B')),
          (530,470,'v',50,('B','C')),(680,560,'v',45,('C','D'))]

def room_at(x,y):
    for k,(x0,y0,x1,y1) in ROOMS.items():
        if x0<x<x1 and y0<y<y1:return k
    if any(x0<x<x1 and y0<y<y1 for x0,y0,x1,y1 in HALL):return 'hall'
    return 'outside'

def endpoints(x,y,o,w):
    return (room_at(x+w/2,y-1),room_at(x+w/2,y+1)) if o=='h' else (room_at(x-1,y+w/2),room_at(x+1,y+w/2))

checks=[];edges=[]
for n,x,y,o,w,s,b,ends in DOORS:
    got=endpoints(x,y,o,w);assert got==ends,(n,got,ends)
    checks.append({'door':n,'joins':got,'status':'later annotation' if n==12 else 'county arrangement'})
    edges.append(ends)
for x,y,o,w,ends in PASSAGES:
    assert endpoints(x,y,o,w)==ends,(x,y,ends,endpoints(x,y,o,w))
    edges.append(ends)
reachable={'A'}
while True:
    expanded=reachable|{v for u,v in edges if u in reachable}|{u for u,v in edges if v in reachable}
    if expanded==reachable:break
    reachable=expanded
assert reachable==set(ROOMS)|{'hall'},reachable
assert DOORS[7][2]==DOORS[8][2] and DOORS[7][5]=='left' and DOORS[8][5]=='right'

X0,Y0,S=56,456,.30
def P(x,y):return X0+x*S,Y0-y*S
def wall(c,x1,y1,x2,y2,col=INK,width=.65,dash=None):rule(c,*P(x1,y1),*P(x2,y2),col,width,dash)
def gap(c,x,y,o,w):
    wall(c,x,y,x+w if o=='h' else x,y if o=='h' else y+w,PAPER,3)

def opening(c,x,y,o,w,sw,col=ASH):
    gap(c,x,y,o,w);xx,yy=P(x,y);r=w*S
    c.saveState();c.setStrokeColor(col);c.setLineWidth(.45)
    if sw=='bifold':
        for a1,b1,a2,b2 in [(x,y,x+w/4,y-w/4),(x+w/4,y-w/4,x+w/2,y),(x+w/2,y,x+w*3/4,y-w/4),(x+w*3/4,y-w/4,x+w,y)]:wall(c,a1,b1,a2,b2,col,.6)
    elif o=='h':
        d=1 if sw=='up' else -1
        c.line(xx,yy,xx,yy+d*r)
        c.arc(xx-r,yy-r,xx+r,yy+r,0,90 if d==1 else -90)
    else:
        d=1 if sw=='right' else -1
        c.line(xx,yy,xx+d*r,yy)
        c.arc(xx-r,yy-r,xx+r,yy+r,-90,90 if d==1 else -90)
    c.restoreState()

def badge(c,n,x,y,col=INK,dashed=False):
    c.saveState();c.setFillColor(PAPER);c.setStrokeColor(col);c.setLineWidth(.5)
    if dashed:c.setDash(1,1)
    c.circle(x,y,4.8,fill=1,stroke=1)
    text(c,str(n),x,y-2.2,'Mono',6.4,col,'center');c.restoreState()

def plan(c):
    base(c,'A House with Chambers','County plan with later annotation','xii')
    text(c,'TRAVIS COUNTY / AUGUST 2019',72,507,'Mono',7.5,ASH)
    text(c,'11 recorded interior doors',72,490,'Italic',11)
    text(c,'N',365,488,'Mono',7,ASH,'center')
    rule(c,365,468,365,481,ASH,.6);rule(c,365,481,362,477,ASH,.6);rule(c,365,481,368,477,ASH,.6)
    # Outer envelope; the conversion does not alter the footprint.
    pts=[(0,0),(1060,0),(1060,630),(260,630),(260,460),(0,460),(0,0)]
    for p1,p2 in zip(pts,pts[1:]):wall(c,*p1,*p2,width=1.1)
    lines=[(200,0,200,230),(380,0,380,230),(490,0,490,230),(680,0,680,630),
           (860,0,860,630),(0,230,680,230),(100,230,100,460),(100,310,610,310),
           (260,310,260,630),(530,310,530,630),(610,310,610,400),(530,400,860,400),
           (680,500,860,500),(80,0,80,80),(0,80,80,80)]
    for line in lines:wall(c,*line)
    wall(c,860,230,1060,230,EMBER,.85,[3,2])
    for x,y,o,w,ends in PASSAGES:gap(c,x,y,o,w)
    for n,x,y,o,w,sw,side,ends in DOORS:
        col=EMBER if n==12 else ASH;opening(c,x,y,o,w,sw,col)
        xx,yy=P(x+w/2 if o=='h' else x,y if o=='h' else y+w/2)
        if o=='h':yy+=9 if side=='up' else -9
        else:xx+=9 if side=='right' else -9
        if n==4:xx=P(x,y)[0]-17
        if n==9:xx=P(x,y)[0]+17
        if n==11:yy=P(x,y)[1]-17
        badge(c,n,xx,yy,col,n==12)
    # Narrative gives these exterior routes, but not exact jamb coordinates.
    for x,y,o,w,sw in [(150,460,'h',50,'up'),(580,630,'h',40,'up'),(1060,470,'v',40,'left')]:opening(c,x,y,o,w,sw)
    labels=[('G','Bed 3',120,152),('F','Bed 2',290,112),('H','Bath',435,112),
            ('J','Study',770,153),('E','Bed 1',48,367),('A','Entry',180,366),
            ('B','Living',390,484),('C','Kitchen',605,517),('D','Dining',770,563),
            ('K','Utility',770,468),('L','Garage',960,416),('M','Workroom',960,104),
            ('I','Linen',566,363)]
    for letter,name,x,y in labels:
        xx,yy=P(x,y);col=EMBER if letter=='M' else INK
        text(c,letter,xx,yy+7,'Display',12,col,'center')
        text(c,name,xx,yy-4,'Body',7.5,col,'center')
    text(c,'en suite',*P(40,33),'Body',6.5,ASH,'center')
    text(c,'CLOSET',*P(580,105),'Mono',6.9,INK,'center')
    text(c,'bifold',*P(580,141),'Italic',7.5,ASH,'center')
    text(c,'hall',*P(365,278),'Italic',8.5,ASH,'center')
    # The rack is identified in the facing key; the freezer is against the house wall.
    xx,yy=P(870,545);c.setStrokeColor(ASH);c.setLineWidth(.5);c.rect(xx,yy-13.5,30,13.5,fill=0,stroke=1)
    text(c,'freezer',xx+15,yy-8.5,'Body',7,ASH,'center')
    text(c,'front door',*P(175,502),'Body',7.5,ASH,'center')
    text(c,'to yard',*P(600,669),'Body',7.5,ASH,'center')
    text(c,'side door',*P(969,514),'Body',7,ASH,'center')
    # Legend separates source layers and unnumbered circulation.
    rule(c,72,226,94,226,INK,.8);text(c,'County arrangement / doors 1–11',105,223,'Body',9.8)
    rule(c,72,207,94,207,EMBER,.85,[3,2]);text(c,'Later annotation / door 12',105,204,'Body',9.8)
    rule(c,72,188,79,188,ASH,.7);rule(c,87,188,94,188,ASH,.7);text(c,'Open passage / no counted door',105,185,'Body',9.8)
    para(c,'The conversion is reported by the second hand (p. 14). The initial count and its correction remain separate entries (pp. 6–7).',72,161,288,10,13)
    para(c,'Editorial schematic, not to scale. Circulation and exterior openings are diagrammed for orientation; exterior doors are excluded from the interior count.',54,69,324,7.5,9.2,'Italic',ASH)

KEY=[('A','Entry','/The_Atrium'),('B','Living','/The_Symposium'),('C','Kitchen','/The_Watchtower'),('D','Dining','/The_Boardroom'),('E','Bedroom 1','/The_5_Lamps'),('F','Bedroom 2','/The_Aerodrome'),('G','Bedroom 3','/The_Chair'),('H','Bath','/The_Magic_Lantern'),('I','Linen / server rack','/The_Harness'),('J','Study','the rite'),('K','Utility hall','/from_beyond'),('L','Garage','/Narratives/Endor'),('M','Workroom / cold room','/Mask_vs_Mirror')]
def key(c):
    base(c,'The Key','Rooms, chambers, and the count','xiii')
    text(c,'ROOM',72,509,'Mono',7,ASH);text(c,'NAME IN THE ESTATE',227,509,'Mono',7,ASH)
    for i,(letter,name,path) in enumerate(KEY):
        y=488-i*17
        text(c,letter,72,y,'Mono',8,EMBER);text(c,name,89,y,'Body',10)
        text(c,path,227,y,'Mono',7.1)
    rule(c,72,268,360,268)
    text(c,'DOOR SCHEDULE',72,249,'Mono',7.5,EMBER)
    labels=['Hall / living','Kitchen / utility','Utility / garage','Hall / bedroom 1','Hall / bedroom 2','Hall / bedroom 3',
            'Hall / bath','Hall / linen rack','Hall / study','Hall / bifold closet','Bedroom 3 / en suite','Garage / workroom']
    for i,label in enumerate(labels):
        col=i//6;row=i%6;x=77+col*148;y=229-row*15
        badge(c,i+1,x,y+2,EMBER if i==11 else ASH,i==11)
        text(c,label,x+11,y-1,'Body',9,EMBER if i==11 else INK)
    rule(c,72,139,360,139)
    text(c,'10: one doorway, two folding leaves.',72,123,'Italic',9.6)
    text(c,'Plan 11  /  first count 12  /  recount 11',72,102,'Mono',7.4,ASH)
    para(c,'Room names and associations follow the deposited plate. Door 12 and the cold-room label belong to the later annotation. Counts: The Caliche Lot, pp. 6–7.',54,69,324,7.5,9.2,'Italic',ASH)

b=io.BytesIO();c=canvas.Canvas(b,pagesize=(432,648),pageCompression=1)
c.setTitle('Using This Matter | Audited estate map');c.setAuthor('Jacob E. Thomas, MA, PhD')
plan(c);c.showPage();key(c);c.showPage();c.save();b.seek(0)
new=PdfReader(b);source=PdfReader(a.input);assert len(source.pages)==304
w=PdfWriter()
for i,page in enumerate(source.pages):w.add_page(new.pages[i-11] if i in [11,12] else page)
w.add_metadata({k:v for k,v in source.metadata.items() if isinstance(v,str)})
w.set_page_label(0,15,style='/r');w.set_page_label(16,303,style='/D',start=1);w.write(a.output)
q=PdfWriter();q.add_page(new.pages[0]);q.add_page(new.pages[1]);q.add_metadata({'/Title':'Using This Matter | Map and key review','/Author':'Jacob E. Thomas, MA, PhD'});q.write(a.proof)
check=PdfReader(a.output)
changed=[i+1 for i,(o,n) in enumerate(zip(source.pages,check.pages)) if o.get_contents().get_data()!=n.get_contents().get_data()]
assert changed==[12,13],changed
assert 'The Halpern Memo' in check.pages[298].extract_text()
assert 'Hale returned to the hospital in October with pneumonia.' in check.pages[271].extract_text()
report={'pages':304,'changed_pdf_pages':changed,'unchanged_page_streams':302,'door_adjacencies':checks,'reachable_spaces':sorted(reachable),'linen_and_study_doors_face_each_other':True,'county_doors':11,'later_annotation_door':12,'room_path_associations_retained':13,'counts_preserved':[11,12,11],
 'drawing_status':'Editorial schematic: exact dimensions, swing directions, unnumbered passage positions and exterior jamb positions are not supplied by the narrative.',
 'narrative_sources':{'5':'Three bedrooms off back hall; kitchen to utility to locked garage','6':'Linen rack across from study; plan 11, first count 12, recount 11','7':'Bifold explanation; study at end of hall; county revision August 2019','14':'Second hand reports garage conversion and cold room','46':'Kitchen exterior door, garage side door, freezer against house wall','201':'Thorne postscript asserts twelve','257':'Child counts twelve; alternatives remain open'}}
a.report.write_text(json.dumps(report,indent=2),encoding='utf8');print(json.dumps(report))
