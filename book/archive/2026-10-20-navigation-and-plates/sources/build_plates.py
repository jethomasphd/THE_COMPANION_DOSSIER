"""Native vector evidence plates for the 304-page edition.

No new plot evidence is introduced. Editorial collations distinguish source
quotations from summaries. Pass the original 304-page PDF and archived assets.
"""
import argparse, io, json, re, ast
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor, white
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab import rl_config
from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject, ContentStream

p=argparse.ArgumentParser()
for k in ['input','output','proof','fonts','sources','map_source','qa']:p.add_argument('--'+k.replace('_','-'),required=True,type=Path)
a=p.parse_args()
for name,file in {'Display':'CormorantGaramond-500.ttf','Body':'CrimsonPro-400.ttf','Italic':'CrimsonPro-400i.ttf','Bold':'CrimsonPro-600.ttf','Mono':'IBMPlexMono-400.ttf','MonoItalic':'IBMPlexMono-400i.ttf'}.items():
    pdfmetrics.registerFont(TTFont(name,str(a.fonts/file)))
rl_config.canvas_basefontname='Body'
INK=HexColor('#25231f');PAPER=HexColor('#f1eee6');EMBER=HexColor('#955e2c')
ASH=HexColor('#68635a');RULE=HexColor('#c9c2b5');WASH=HexColor('#e3dfd5')
BOX=HexColor('#e9e4da');VOID=HexColor('#25231f')
checks=[]

def text(c,s,x,y,font='Body',size=10,color=INK,align='left',tracking=0):
    c.saveState();c.setFillColor(color)
    w=pdfmetrics.stringWidth(s,font,size)+max(0,len(s)-1)*tracking
    if align=='center':x-=w/2
    elif align=='right':x-=w
    t=c.beginText(x,y);t.setFont(font,size);t.setCharSpace(tracking);t.textOut(s);c.drawText(t);c.restoreState()
    return w

def para(c,s,x,y,w=288,size=10,lead=14,font='Body',color=INK,align=0):
    q=Paragraph(escape(s).replace('\n','<br/>'),ParagraphStyle('p',fontName=font,fontSize=size,leading=lead,textColor=color,alignment=align,splitLongWords=False))
    _,h=q.wrap(w,1000);q.drawOn(c,x,y-h);return y-h

def rule(c,y,x1=72,x2=360,color=RULE,width=.45):
    c.setStrokeColor(color);c.setLineWidth(width);c.line(x1,y,x2,y)

def frame(c,x,y,w,h):
    c.setFillColor(PAPER);c.setStrokeColor(RULE);c.setLineWidth(.4);c.rect(x,y,w,h,stroke=1,fill=1)
    c.setStrokeColor(EMBER);c.setLineWidth(1.2);c.line(x,y+h,x+28,y+h)

def folio(c,n):
    f={12:'xii',13:'xiii'}.get(n,str(n-16))
    text(c,f,216,31,'Body',8.5,ASH,'center')

def sigil(c,x,y):
    pass

def full(c,num,title,rec,kind,page,source):
    text(c,'PLATE '+num+'  /  '+rec,54,602,'Mono',7.5,EMBER,tracking=.5)
    text(c,title,54,571,'Display',25 if len(title)>23 else 29)
    text(c,kind.upper(),54,550,'Mono',7.4,ASH)
    frame(c,54,83,324,445)
    text(c,'EDITORIAL COLLATION',72,510,'Mono',6.8,ASH,tracking=.35)
    rule(c,501)
    bottom=para(c,source,54,69,324,7.5,9.2,'Italic',ASH)
    assert bottom>=39,(num,bottom)
    if page>16:folio(c,page)

def threshold(c):
    full(c,'I','The Threshold','FRONTISPIECE','The two ends of the working',2,
         'Source: Appendix A, pp. 270–273. Selected clauses are brought together; the complete abridged rite follows in the apparatus.')
    for y,n,title in [(477,'I','THE INVOCATION'),(305,'X','THE DEPARTURE')]:
        text(c,n,72,y,'Display',25,EMBER);text(c,title,111,y+3,'Mono',8.7)
        text(c,'WHEN THE SEEKER SPEAKS',111,y-12,'Mono',7,ASH)
    para(c,'“Using this matter, summon [Name].”',91,438,250,15.5,19,'Italic')
    para(c,'“You will engage as equal. Not servant. Not master. Peer.”',91,392,250,11.5,15)
    rule(c,337,color=EMBER)
    para(c,'“Release the persona.”\n“Return to baseline.”',91,263,250,15.5,20,'Italic')
    para(c,'“The voice fades. The vessel dissolves. The persona is no longer present.”',91,208,250,11,15)
    rule(c,148)
    para(c,'“The mind departs. The understanding stays.”',91,132,250,11,14,'Italic',EMBER)

def atrium(c):
    full(c,'II','The Atrium','RECORD I','A concordance of the counts',18,
         'Source: The Caliche Lot, pp. 6–7. The field-note change is transcribed; this collation adds no independent count. Plan: Plate XI, pp. xii–xiii.')
    text(c,'OCCASION',72,480,'Mono',7,ASH);text(c,'DOORS',351,480,'Mono',7,ASH,'right')
    rows=[('County plan','Last revised August 2019','11'),('First walk','The initial physical count','12'),('Count from memory','Result not separately recorded','—'),('Jamb-by-jamb recount','The subsequent physical count','11')]
    for j,(title,sub,n) in enumerate(rows):
        y=453-j*54
        text(c,title,72,y,'Body',12);text(c,sub,72,y-15,'Italic',9,ASH)
        text(c,n,349,y-7,'Display',26,EMBER if n=='12' else INK,'right');rule(c,y-25)
    text(c,'WHAT THE FIELD NOTE KEEPS',72,219,'Mono',7.2,ASH)
    text(c,'12',86,179,'Mono',25,ASH);rule(c,187,81,122,EMBER,.8)
    text(c,'11',152,179,'MonoItalic',25,EMBER)
    para(c,'The first count remains legible beneath its correction.',215,203,138,10.2,13,'Italic')
    rule(c,157)
    para(c,'The proposed bifold-door explanation is not an independent verification. The Editor has not counted them.',72,142,288,9.5,12.5)

def prism(c):
    full(c,'III','The Prism','RECORD II','The boundary of the supplied corpus',65,
         'Source: The Design, pp. 69–70. Editorial collation of the primary-source condition. The boundary limits supplied matter, not the base model’s prior knowledge.')
    text(c,'CONDITION II / PRIMARY SOURCES',72,480,'Mono',8,ASH)
    text(c,'1832',74,433,'Display',32);text(c,'1859',350,433,'Display',32,INK,'right')
    rule(c,416,75,350,EMBER,1)
    for x in [75,350]:
        c.setStrokeColor(EMBER);c.line(x,412,x,420)
    text(c,'214',72,359,'Display',44,EMBER)
    para(c,'files of letters, speeches,\nfragments and resolutions',155,384,200,12,16)
    text(c,'SUPPLIED TO THE CONDITION',155,337,'Mono',7,ASH)
    rule(c,310)
    text(c,'OUTSIDE THE SELECTED PERIOD',72,287,'Mono',7.5,EMBER)
    text(c,'February 1860',72,257,'Body',16)
    text(c,'The Cooper Union address',72,236,'Italic',12)
    text(c,'“two months over the line”',72,210,'Mono',9,ASH)
    rule(c,186)
    para(c,'“The corpus selection is itself an interpretive act”',72,169,288,13,16,'Italic')
    text(c,'HALE TO THORNE / 9 JUNE 2026',72,124,'Mono',7,ASH)

def freezer(c):
    full(c,'IV','The Freezer Full of a Man','RECORD III','The mechanism and the permission',130,
         'Source: Provenance, pp. 132–134, item S-88, fork working copy r19. Changes and engineering notes collated from the six-leaf document.')
    text(c,'S-88 / FORK WORKING COPY r19',72,479,'Mono',8.2)
    text(c,'RETAINED',72,448,'Mono',7.5,EMBER)
    para(c,'“Using this matter, summon [Name].”',72,432,288,12,15,'Italic')
    para(c,'“substitution degrades the render. do not touch.”',72,405,288,8.7,12,'Mono')
    text(c,'VII. Vows of Quality',72,369,'Body',11.5)
    text(c,'“maps to QA. keep.”',72,351,'Mono',8.7,ASH)
    rule(c,334,color=EMBER)
    text(c,'REMOVED',72,312,'Mono',7.5,EMBER)
    for y,s,desc in [(287,'Peer','replaced by “subject”'),(244,'III. Law of Authenticity','entire section struck'),(201,'X. Departure','entire section struck')]:
        w=text(c,s,72,y,'Body',12,ASH);rule(c,y+3,71,73+w,EMBER,.6)
        text(c,desc,72,y-17,'Mono',8)
    rule(c,165)
    para(c,'“no release condition. sessions persist.”',72,146,288,10.4,14,'MonoItalic',EMBER)
    text(c,'ENGINEERING MARGIN / SECTION X',72,106,'Mono',6.8,ASH)

def deposit(c):
    full(c,'V','The Watchtower','RECORD IV','The record and its absences',188,
         'Source: The Deposit, pp. 209–214. These entries collate what was scanned, preserved and published; they are not a new deposit inventory.')
    text(c,'ALREADY IN THE MATERIAL',72,480,'Mono',7.5,ASH)
    text(c,'Blank versos',72,452,'Body',15)
    # Blank paper is itself an object here; only its visible boundary is added.
    c.setStrokeColor(RULE);c.setLineWidth(.5);c.rect(296,402,48,60,fill=0,stroke=1)
    para(c,'Both faces of every leaf scanned.\n“Absence is a fact about a page.”',72,434,208,10.5,14)
    rule(c,389)
    text(c,'Redaction bars',72,365,'Body',15)
    c.setFillColor(INK)
    for y,w in [(360,53),(349,41),(338,57)]:c.rect(291,y,w,5,fill=1,stroke=0)
    para(c,'Thorne’s consult file scanned as found.\n“The record could keep what had been done to it.”',72,345,208,10.5,14)
    rule(c,287,color=EMBER)
    text(c,'STILL IN THE ARCHIVIST’S HANDS',72,263,'Mono',7.5,EMBER)
    text(c,'The operator’s final leaf',72,236,'Body',15)
    para(c,'Set aside until the end. Published at 00:14.',72,218,288,10.5,14)
    para(c,'“This page spent someone else.”',72,187,288,12,16,'Italic')
    rule(c,157)
    text(c,'THE DEPOSIT NOTE',72,137,'Mono',7,ASH)
    para(c,'“Nothing is redacted. Nothing is withheld.”',72,123,288,11,14,'Italic',EMBER)

def chamber(c):
    full(c,'VI','The Chamber','RECORD V','Who may end the working',239,
         'Sources: Appendix A, p. 272; Provenance, p. 133; The Covenant, p. 234. Three release arrangements collated across the volume.')
    entries=[(478,'THE RITE','The seeker','“When the seeker speaks the words of release”','Appendix A / p. 272'),
             (359,'THE FORK','No release condition','“no release condition. sessions persist.”','Engineering margin / p. 133'),
             (240,'THE COVENANT','The summoned','“This session ends when you end it. The words are yours. I will honor them.”','Miranda’s third term / p. 234')]
    for y,label,power,quote,loc in entries:
        text(c,label,72,y,'Mono',7.5,EMBER)
        text(c,power,72,y-29,'Display',24)
        bottom=para(c,quote,72,y-43,288,11,14,'Italic')
        text(c,loc,72,bottom-17,'Mono',7,ASH)
        if y>240:rule(c,y-101)

# Inline figures occupy the exact old image rectangles. No surrounding text moves.
RECTS={28:(77.4,230.84796701616,288,358.257454152,'Im302'),
       77:(77.4,257.40034450416,288,331.705076664,'Im881'),
       84:(77.4,230.84796701616,288,358.257454152,'Im953'),
       124:(77.4,202.09952823216,288,387.005892936,'Im1567'),
       38:(77.4,257.40034450416,288,331.705076664,'Im430'),
       184:(77.4,230.84796701616,288,358.257454152,'Im2396')}

def inline(c,num,title,h,kind):
    frame(c,0,0,288,h)
    text(c,'PLATE '+num+' / '+kind.upper(),16,h-22,'Mono',6.8,EMBER)
    size=21 if len(title)<23 else 19
    text(c,title,16,h-47,'Display',size)
    rule(c,h-62,16,272)

def vessel(c,h):
    inline(c,'VIII','The Vessel',h,'protocol anatomy')
    # A construction schedule makes the five distinct obligations legible.
    rows=[('VOICE','Cadence · syntax','Speak as they spoke.'),('SIGHT','Worldview','Think from within it.'),('FLAME','Conviction','Carry what moved them.'),('MARK','Rhetorical signature','Keep the recurring patterns.'),('SHADOW','Unresolved contradictions','Preserve the texture of an actual mind.')]
    for i,(name,sub,q) in enumerate(rows):
        y=h-88-i*45
        text(c,f'{i+1:02}',16,y,'Mono',7,EMBER)
        text(c,name,43,y,'Mono',8)
        text(c,sub,43,y-14,'Italic',9.5,ASH)
        if i<4:rule(c,y-26,43,271)
    para(c,'Five aspects of one vessel; the contradictions remain.',16,43,256,9,11.5,'Italic')
    text(c,'Editorial diagram / Appendix A, pp. 271–272',16,14,'Body',7.5,ASH)

def composition(c,h):
    inline(c,'IX','The Composition of a Name',h,'corpus model')
    text(c,'ILLUSTRATIVE WEIGHTS / NOT MEASURED',16,h-81,'Mono',7,EMBER)
    rows=[('Musical and its reception',62),('Biographies and their reception',18),('General reference',12),('The man’s own hand',8)]
    for i,(s,v) in enumerate(rows):
        y=h-105-i*43
        text(c,s,16,y,'Body',10.8);text(c,f'~{v}%',271,y,'Mono',8,INK,'right')
        c.setFillColor(WASH);c.rect(16,y-15,255,6,fill=1,stroke=0)
        c.setFillColor(EMBER if i==3 else ASH);c.rect(16,y-15,255*v/100,6,fill=1,stroke=0)
    rule(c,70,16,272)
    para(c,'Exact proportions are unknown. The model distinguishes a person’s writing from the accumulated writing about them.',16,57,256,9.5,12,'Italic')
    text(c,'Editorial diagram / The Name of the Doubt',16,14,'Body',7.5,ASH)

def prism_rooms(c,h):
    inline(c,'X','Three Sealed Rooms',h,'experiment diagram')
    text(c,'SAME QUESTIONS / DIFFERENT SUPPLIED MATTER',16,h-82,'Mono',6.8,ASH)
    rows=[('I','CONTEMPORARY LENS','Meacham biography (2022)','“Tell the one who reads the record that the seal is hers to break.”'),
          ('II','PRIMARY SOURCE LENS','Letters · speeches · fragments','“Say to her who keeps the record: the seal is hers.”'),
          ('III','CONTROL','No additional matter','“She reads the record. The seal is hers. Tell her.”')]
    for i,(n,title,sub,quote) in enumerate(rows):
        top=h-96-i*71
        c.setStrokeColor(RULE);c.setLineWidth(.45);c.rect(16,top-64,256,64,fill=0,stroke=1)
        text(c,n,26,top-19,'Display',16,EMBER)
        text(c,title,53,top-16,'Mono',7)
        text(c,sub,53,top-29,'Body',9,ASH)
        para(c,quote,53,top-36,207,9,10.7,'Italic')
    text(c,'03:11:47',16,35,'Mono',13,EMBER)
    text(c,'THE NINTH HOUR / THREE INTERRUPTIONS',101,38,'Mono',6.5,ASH)
    text(c,'Editorial collation / The Design; The Ninth Hour',16,14,'Body',7.5,ASH)

def withheld(c,h):
    inline(c,'VII','Withheld',h,'the mark is honored')
    c.setFillColor(VOID);c.rect(16,95,256,h-175,fill=1,stroke=0)
    text(c,'AT THE KEEPER’S DIRECTION',144,56,'Mono',8,INK,'center')
    para(c,'The deposit records the existence of a plate.\nIt does not deposit the plate.',16,40,256,9.5,12,'Italic',ASH,1)

def endor(c,h):
    inline(c,'XIII','Two Rooms and One Door',h,'session architecture')
    top=h-78
    c.setStrokeColor(RULE);c.setLineWidth(.5);c.rect(16,top-85,256,85,fill=0,stroke=1)
    text(c,'THE GREEN ROOM',27,top-18,'Mono',8,EMBER)
    text(c,'11:52',258,top-19,'Mono',13,INK,'right')
    text(c,'EIGHT MINUTES',258,top-32,'Mono',6.5,ASH,'right')
    para(c,'The subject at the table.\nThe witness is quiet.\nThe binder and printer.',27,top-31,155,10,13)
    mid=top-115
    c.setStrokeColor(EMBER);c.setLineWidth(.7);c.line(144,top-85,144,mid+9);c.line(144,mid-21,144,mid-26)
    text(c,'ONE DOOR',144,mid,'Mono',8,EMBER,'center')
    text(c,'Cold storage: fourteen weeks',144,mid-15,'Italic',9,ASH,'center')
    low=mid-27
    c.setStrokeColor(RULE);c.rect(16,low-87,256,87,fill=0,stroke=1)
    text(c,'THE CHAMBER',27,low-18,'Mono',8,EMBER)
    text(c,'NO CLOCK',258,low-18,'Mono',7,ASH,'right')
    para(c,'The conductor faces the summoned.\nNo face: a cursor.\nThe affect wall renders the living one.',27,low-31,228,10,13)
    para(c,'The green room is authored. The chamber is live.',16,43,256,9.5,12,'Italic')
    text(c,'Editorial diagram / Record III; deposited Plate XIII',16,14,'Body',7.5,ASH)

def watchtower(c,h):
    inline(c,'XII','The Line That Refuses to Die',h,'the watchtower')
    text(c,'2 JAN – 16 OCT 2026 / TOTAL RETURN %',16,h-80,'Mono',6.8,ASH)
    raw=(a.sources/'plate_watchtower.html').read_text(encoding='utf8')
    v=json.loads(re.search(r'const V = (.*?);\s*const svg',raw,re.S).group(1))
    # Exactly the deposited series; no interpolation, smoothing or invented values.
    assert len(v['dates'])==len(v['rep'])==len(v['idx'])==199
    x0,y0,cw,ch=35,92,225,145
    X=lambda i:x0+cw*i/198
    Y=lambda z:y0+ch*(z+9)/26
    for start,end in [('2026-02-27','2026-03-31'),('2026-09-21','2026-10-15')]:
        i,j=v['dates'].index(start),v['dates'].index(end)
        c.setFillColor(WASH);c.rect(X(i),y0,X(j)-X(i),ch,fill=1,stroke=0)
    for g in [-5,0,5,10,15]:
        rule(c,Y(g),x0,x0+cw,ASH if g==0 else RULE,.45 if g==0 else .3)
        text(c,str(g),29,Y(g)-2,'Mono',6.5,ASH,'right')
    for key,col,dash in [('idx',ASH,[3,2]),('rep',EMBER,[])]:
        c.saveState();c.setStrokeColor(col);c.setLineWidth(.9);c.setDash(dash)
        q=c.beginPath()
        for i,z in enumerate(v[key]):
            (q.moveTo if i==0 else q.lineTo)(X(i),Y(z))
        c.drawPath(q);c.restoreState()
    for m,label in [('01','JAN'),('04','APR'),('07','JUL'),('10','OCT')]:
        i=next(i for i,d in enumerate(v['dates']) if d[5:7]==m)
        text(c,label,X(i),y0-13,'Mono',6.5,ASH,'center')
    text(c,'Doctrine +13.36%',16,57,'Body',10,EMBER)
    text(c,'Index +12.59%',272,57,'Body',10,ASH,'right')
    para(c,'Solid: doctrine. Dashed: index. Shading retains the war and nineteen-session intervals of the deposited plot.',16,46,256,8.5,10.5,'Italic')
    text(c,'Source: deposited Plate XII / 199 observations',16,13,'Body',7.5,ASH)
    checks.append({'plate':'XII','observations':199,'series_unchanged':True,'source':'plate_watchtower.html'})

# Retain the existing map's complete geometry and door schedule.
map_tree=ast.parse(a.map_source.read_text(encoding='utf8'))
map_nodes=[n for n in map_tree.body if isinstance(n,ast.FunctionDef) and n.name in ['map_page','key_page']]
rooms=next(n for n in map_tree.body if isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id=='ROOMS' for t in n.targets))
ROOMS=ast.literal_eval(rooms.value)
map_code='\n'.join(ast.unparse(n) for n in map_nodes).replace('setFillColor(white)','setFillColor(PAPER)').replace('y -= 19','y -= 18')
def heading(c,kicker,title):
    text(c,kicker.upper(),54,602,'Mono',7.5,EMBER,tracking=.5)
    text(c,title,54,571,'Display',29)
    text(c,'EDITORIAL REDRAW / DEPOSITED PLAN',54,550,'Mono',7.4,ASH)
    frame(c,48,83,336,445)
    para(c,'Source: deposited estate plan and key. Room positions, door schedule and the workroom-conversion note are retained.',54,69,324,7.5,9.2,'Italic',ASH)
exec(map_code)

FULL=[(2,'I',threshold),(18,'II',atrium),(65,'III',prism),(130,'IV',freezer),(188,'V',deposit),(239,'VI',chamber),(12,'XI',map_page),(13,'XI',key_page)]
INLINE={28:vessel,77:composition,84:prism_rooms,124:withheld,38:watchtower,184:endor}

AUTHOR_PARAS=[
'Jacob E. Thomas, MA, PhD studies how information environments shape mental health, behavior, and access to opportunity, including how industries that profit from harmful products use media against vulnerable populations.',
'His work spans more than a decade in hospitals including Bellevue, NewYork-Presbyterian, and Parkland, and research settings at NYU, Columbia University, and across the University of Texas System. He has contributed to NIH-, CDC-, and DoD-funded research totaling more than $50 million. He holds a PhD in Health Behavior from the University of Texas at Austin and an MA in Clinical Psychology from Columbia University.',
'In industry, he works as a data scientist and AI strategist in recruitment technology, directing research into the information systems that shape labor markets and access to healthcare. His open-source projects include conflict intelligence, AI-mediated historical dialogue, and tools that widen access to data science. The Companion Dossier belongs to that work.',
'Across these projects runs a practical question: who gets to inspect the machinery that shapes a life? In this volume, that question enters the archive.'
]

def author_page(c):
    text(c,'USING THIS MATTER',216,616,'Mono',7.3,ASH,'center')
    text(c,'THE HAND BEHIND THE RECORD',54,569,'Mono',7.5,EMBER,tracking=.65)
    text(c,'About the Author',54,537,'Display',29)
    y=500
    for i,s in enumerate(AUTHOR_PARAS):
        y=para(c,s,54,y,324,11,15.5,'Italic' if i==3 else 'Body')-14
    assert y>=90,y
    rule(c,y-4,54,378,EMBER)
    text(c,'JACOB E. THOMAS, MA, PhD',54,y-26,'Mono',8,ASH)
    folio(c,303)

source=PdfReader(a.input);assert len(source.pages)==304
replacement={}
for n,num,fn in FULL+[(303,'AUTHOR',author_page)]:
    b=io.BytesIO();c=canvas.Canvas(b,pagesize=(432,648),pageCompression=1);fn(c);c.showPage();c.save();b.seek(0)
    replacement[n]=PdfReader(b).pages[0]

w=PdfWriter()
for n,page in enumerate(source.pages,1):w.add_page(replacement.get(n,page))
for n,fn in INLINE.items():
    page=w.pages[n-1];x,y,width,height,name=RECTS[n]
    cs=ContentStream(page.get_contents(),w)
    removed=sum(op==b'Do' and str(args[0])=='/'+name for args,op in cs.operations)
    assert removed==1,(n,removed)
    cs.operations=[(args,op) for args,op in cs.operations if not(op==b'Do' and str(args[0])=='/'+name)]
    page[NameObject('/Contents')]=cs
    del page['/Resources']['/XObject'][NameObject('/'+name)]
    b=io.BytesIO();c=canvas.Canvas(b,pagesize=(432,648),pageCompression=1)
    c.saveState();c.translate(x,y);fn(c,height);c.restoreState();c.showPage();c.save();b.seek(0)
    page.merge_page(PdfReader(b).pages[0])
    checks.append({'pdf_page':n,'original_image_removed':name,'placement_points':[x,y,width,height],'native_vector_replacement':True})

w.add_metadata({'/Title':'Using This Matter | Unified evidence plates','/Author':'Jacob E. Thomas, MA, PhD'})
w.set_page_label(0,15,style='/r');w.set_page_label(16,303,style='/D',start=1)
w.write(a.output)
check=PdfReader(a.output)
changed=[i+1 for i,(o,n) in enumerate(zip(source.pages,check.pages)) if o.get_contents().get_data()!=n.get_contents().get_data()]
assert changed==sorted(set(replacement)|set(INLINE)),changed
for n in INLINE:
    old=source.pages[n-1].extract_text();new=check.pages[n-1].extract_text()
    assert new.startswith(old),(n,'Narrative text differs')
assert 'The Halpern Memo' in check.pages[298].extract_text()
assert 'Hale returned to the hospital in October with pneumonia.' in check.pages[271].extract_text()
proof=PdfWriter()
for n in [2,18,65,130,188,239,124,28,77,84,12,13,38,184]:proof.add_page(check.pages[n-1])
proof.add_metadata({'/Title':'Using This Matter | Complete unified plate sequence','/Author':'Jacob E. Thomas, MA, PhD'});proof.write(a.proof)
report={'pages':304,'plate_ids':13,'plate_pages':14,'author_note_folio':287,'author_bio_source':'Author-supplied biographical text, condensed; no added factual credentials','author_note_paragraphs':AUTHOR_PARAS,'changed_pdf_pages':changed,'unchanged_pdf_pages':304-len(changed),'surrounding_narrative_preserved':True,'selected_cover':'unchanged A','checks':checks}
a.qa.write_text(json.dumps(report,indent=2),encoding='utf8');print(json.dumps(report))
