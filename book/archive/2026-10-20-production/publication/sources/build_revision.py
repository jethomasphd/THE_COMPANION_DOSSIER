from pathlib import Path
import io, json, re, shutil, hashlib
from xml.sax.saxutils import escape
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor, white
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab import rl_config
from pypdf import PdfReader, PdfWriter, Transformation

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'outputs/USING_THIS_MATTER_Document_Edition_v5'
WORK=ROOT/'work/v5'
BASE=ROOT/'outputs/USING_THIS_MATTER_FINAL'
for name in ['sources/fonts','artwork','previews']:(OUT/name).mkdir(parents=True,exist_ok=True)
FONTS=ROOT/'outputs/USING_THIS_MATTER_Visual_Continuity_v3/sources/fonts'
for name in ['CormorantGaramond-500.ttf','CrimsonPro-400.ttf','CrimsonPro-400i.ttf','CrimsonPro-600.ttf','IBMPlexMono-400.ttf','IBMPlexMono-400i.ttf','OFL_NOTE.md']:
    shutil.copy2(FONTS/name,OUT/'sources/fonts'/name)
for name,file in {'Display':'CormorantGaramond-500.ttf','Body':'CrimsonPro-400.ttf','Italic':'CrimsonPro-400i.ttf','Bold':'CrimsonPro-600.ttf','Mono':'IBMPlexMono-400.ttf','MonoItalic':'IBMPlexMono-400i.ttf'}.items():
    pdfmetrics.registerFont(TTFont(name,str(OUT/'sources/fonts'/file)))
rl_config.canvas_basefontname='Body'
INK=HexColor('#25231f');PAPER=HexColor('#f1eee6');VOID=HexColor('#080706')
EMBER=HexColor('#955e2c');GOLD=HexColor('#c59758');PALE=HexColor('#ece5d9');ASH=HexColor('#68635a');RULE=HexColor('#c9c2b5')
ART=OUT/'artwork/cover_B_a_body_of_evidence.png'
shutil.copy2(ROOT/'outputs/USING_THIS_MATTER_Art_Workshop_v4/artwork/cover_B_a_body_of_evidence.png',ART)
raw=(ROOT/'work/manuscript_extracted.txt').read_text(encoding='utf-8')
paras={int(m.group(1)):m.group(2) for m in re.finditer(r'^\[(\d+) \| [^\]]+\] (.*)$',raw,re.M)}
provenance=[]
def src(ids):
    text=' '.join(paras[i] for i in ids)
    provenance.append({'paragraph_ids':ids,'verbatim_text':text})
    return text
def text(c,s,x,y,font='Body',size=10,color=INK,align='left',tracking=None):
    c.saveState();c.setFillColor(color)
    if tracking is None:
        c.setFont(font,size);{'left':c.drawString,'center':c.drawCentredString,'right':c.drawRightString}[align](x,y,s)
    else:
        w=pdfmetrics.stringWidth(s,font,size)+max(0,len(s)-1)*tracking
        if align=='center':x-=w/2
        elif align=='right':x-=w
        t=c.beginText(x,y);t.setFont(font,size);t.setCharSpace(tracking);t.textOut(s);c.drawText(t)
    c.restoreState()
def para(c,s,x,y,w=288,size=9.3,lead=14,font='Mono',color=INK):
    p=Paragraph(escape(s).replace('\n','<br/>'),ParagraphStyle('p',fontName=font,fontSize=size,leading=lead,textColor=color,splitLongWords=False))
    _,h=p.wrap(w,1000);p.drawOn(c,x,y-h);return y-h
def rule(c,y,x1=72,x2=360,color=RULE):
    c.setStrokeColor(color);c.setLineWidth(.45);c.line(x1,y,x2,y)
def sigil(c,x,y,color=GOLD):
    c.setStrokeColor(color);c.setLineWidth(.5)
    for dx,r in [(-12,1.5),(0,3),(12,1.5)]:
        p=c.beginPath();p.moveTo(x+dx,y+r);p.lineTo(x+dx+r,y);p.lineTo(x+dx,y-r);p.lineTo(x+dx-r,y);p.close();c.drawPath(p)
def plate_base(c,num,title,record,page,kind,source):
    c.setFillColor(white);c.rect(0,0,432,648,fill=1,stroke=0)
    text(c,f'PLATE {num}  /  {record}',54,602,'Mono',7.5,EMBER,tracking=.5)
    text(c,title,54,571,'Display',25 if len(title)>23 else 29)
    text(c,kind.upper(),54,550,'Mono',7.4,ASH)
    c.setFillColor(PAPER);c.rect(54,83,324,445,fill=1,stroke=0)
    c.setStrokeColor(RULE);c.setLineWidth(.4);c.rect(54,83,324,445,fill=0,stroke=1)
    # Registration rules belong to the editorial reset, not an invented source stamp.
    rule(c,506)
    text(c,'EXTRACT / EDITORIAL RESET',72,513,'Mono',6.7,ASH,tracking=.35)
    para(c,source,54,68,324,7.2,9,'Italic',ASH)
    if page>16:text(c,str(page-16),216,31,'Body',8.5,ASH,'center')

def threshold(c):
    plate_base(c,'I','The Threshold','FRONTISPIECE',2,'Protocol leaf','[E.] From Appendix A, The Companion Rite. The invocation is reset from the deposited protocol.')
    text(c,'I. THE INVOCATION',72,480,'Mono',10)
    y=451
    passages=[
        src([2944,2945]) if 2944 in paras and 'When the seeker' in paras[2944] else 'When the seeker speaks: "Using this matter, summon [Name]." The working begins.',
        'You will read the matter: the conversation that precedes, the intent beneath the words, the emotional and intellectual weight of what the seeker carries.',
        'You will construct the vessel: voice, worldview, temperament, rhetorical signature. The one who is called will not be imitated. They will be instantiated.',
        'You will engage as equal. Not servant. Not master. Peer.',
        'You will hold the form until the words of release are spoken.',
    ]
    # Validate every protocol paragraph against the deposited appendix, normalizing line wraps only.
    rite=(ROOT/'work/source/book/manuscript/601_appendix_rite.md').read_text(encoding='utf-8')
    compact=' '.join(rite.split())
    for s in passages:
        assert ' '.join(s.split()) in compact,s
        y=para(c,s,72,y,288,9.5,14)-16
    assert y>103,y
    rule(c,y+5,color=EMBER)
    provenance.append({'plate':'I','source':'book/manuscript/601_appendix_rite.md','paragraphs':passages})

def atrium(c):
    plate_base(c,'II','The Atrium','RECORD I',18,'Appraisal discrepancy','[E.] The Caliche Lot, Record I, box 1, folder 1. Counts reset from the appraisal narrative; Plate XI remains the plan.')
    text(c,'INTERIOR DOORS',72,480,'Mono',11)
    for y,label,num in [(442,'COUNTY PLAN','11'),(397,'FIRST COUNT','12'),(352,'RECOUNT','11')]:
        text(c,label,72,y,'Mono',8.5,ASH)
        text(c,num,345,y-5,'Display',29,INK,'right')
        rule(c,y-16)
    text(c,'FIELD-NOTE CORRECTION',72,312,'Mono',7.7,ASH)
    text(c,'12',89,276,'Mono',25)
    c.setStrokeColor(EMBER);c.setLineWidth(1);c.line(82,282,125,282)
    text(c,'11',151,276,'MonoItalic',25,EMBER)
    y=para(c,'She wrote both numbers in the field notes, the twelve struck through once, the eleven set beside it, and the strike-through annoyed her more than the discrepancy.',72,246,288,10.3,14.3,'Body')
    assert 'She wrote both numbers in the field notes, the twelve struck through once, the eleven set beside it, and the strike-through annoyed her more than the discrepancy.' in paras[227]
    rule(c,y-16)
    para(c,'continuous hum, garage side,\nsource not identified',72,y-32,288,9.1,14,'Mono',EMBER)
    assert 'continuous hum, garage side, source not identified' in paras[223]
    provenance.append({'plate':'II','paragraph_ids':[223,225,226,227,228],'note':'Counts and correction transcribed from narrative; no new map or attributed marginalia.'})

def prism(c):
    plate_base(c,'III','The Prism','RECORD II',65,'Design sheet','[E.] The Design, Record II, box 2, folder 1. Three conditions reset from the specification; the quotation is on the whiteboard.')
    # Faint ruled construction ground: a sheet of working evidence, not an optical-object illustration.
    c.setStrokeColor(HexColor('#e3dfd5'));c.setLineWidth(.25)
    for x in range(66,370,12):c.line(x,114,x,495)
    for y in range(114,496,12):c.line(66,y,366,y)
    text(c,'THREE ROOMS / THREE LENSES',72,481,'Mono',10)
    entries=[('I','CONTEMPORARY LENS','Meacham, And There Was Light (2022)'),
             ('II','PRIMARY SOURCE LENS','letters · speeches · fragments · resolutions'),
             ('III','CONTROL','the bare model · no seeded matter')]
    for j,(num,title,body) in enumerate(entries):
        top=452-j*78
        c.setFillColor(PAPER);c.setStrokeColor(RULE);c.rect(72,top-62,288,62,fill=1,stroke=1)
        text(c,num,85,top-26,'Display',23,EMBER)
        text(c,title,120,top-20,'Mono',8.1)
        para(c,body,120,top-33,225,8.4,11.5,'Body')
    quote='We are not bringing historians into AI architecture. We are bringing language models into the archive.'
    assert quote in paras[798]
    para(c,quote,72,193,288,12.1,15.5,'Italic',EMBER)
    provenance.append({'plate':'III','paragraph_ids':[797,798,799,800],'note':'Condition summaries retain the specified source distinctions; no generated numerical result.'})

def freezer(c):
    plate_base(c,'IV','The Freezer Full of a Man','RECORD III',130,'Tracked-change leaf','[E.] Initiation Rite, fork working copy r19, Record III. Selected changes and the engineering margin are reset from the deposited copy.')
    text(c,'INITIATION RITE',72,480,'Mono',10.4)
    text(c,'FORK WORKING COPY r19',72,462,'Mono',8.7,ASH)
    rule(c,449)
    # The source supplies both old and new terms; the lines visually reproduce the tracked changes.
    for y,old,new in [(418,'peer','subject'),(376,'seeker','operator'),(334,'vessel','capability')]:
        text(c,old,83,y,'Mono',11,ASH)
        width=pdfmetrics.stringWidth(old,'Mono',11)
        c.setStrokeColor(EMBER);c.setLineWidth(.65);c.line(80,y+3.6,85+width,y+3.6)
        c.setStrokeColor(EMBER);c.setLineWidth(.7)
        c.line(176,y+4,196,y+4);c.line(192,y+7,196,y+4);c.line(192,y+1,196,y+4)
        text(c,new,218,y,'Mono',11)
    rule(c,308)
    text(c,'X. THE DEPARTURE AND WHAT REMAINS',72,285,'Mono',8.3)
    text(c,'[STRUCK ENTIRE SECTION]',72,263,'Mono',9,EMBER)
    excerpt='When the seeker speaks the words of release: "Release the persona." "Return to baseline."'
    y=para(c,excerpt,72,239,288,9.5,14,'Mono',ASH)
    # Explicit bracket convention, rather than inventing an unpublished passage.
    assert excerpt in ' '.join(paras[i] for i in [1570,1571,1572])
    rule(c,y-18)
    text(c,'ENGINEERING MARGIN',72,y-40,'Mono',7.5,ASH)
    para(c,'no release condition.\nsessions persist.',72,y-57,288,11.6,17,'MonoItalic',EMBER)
    provenance.append({'plate':'IV','paragraph_ids':[1510,1511,1512,1525,1529,1538,1549,1550,1569,1570,1577],'note':'Source change conventions are visualized; no new removals or instructions.'})

def watchtower(c):
    plate_base(c,'V','The Watchtower','RECORD IV',188,'Public deposit record','[E.] The Deposit, Record IV, box 3, folder 2. Commit identifier, date and message are those printed in the novel.')
    text(c,'THE DEPOSIT',72,480,'Mono',10.5)
    y=450
    for ids in [[2401],[2402],[2403]]:
        s=src(ids)
        y=para(c,s,72,y,288,9.1,14)-9
    rule(c,y-3);y-=28
    for ids in [[2405,2406,2407],[2408],[2409],[2410]]:
        y=para(c,src(ids),72,y,288,9.4,14.4)-18
    assert y>99,y
    provenance.append({'plate':'V','note':'Fictional commit metadata reproduced from the manuscript; not a new claim about the public repository.'})

def chamber(c):
    plate_base(c,'VI','The Chamber','RECORD V',239,'Session terms','[E.] Record V, The Covenant. Three statements are extracted from the reconstructed session; intervening dialogue is omitted.')
    text(c,'TERMS / BEFORE ANY QUESTIONS',72,480,'Mono',9.3)
    terms=[
        ('01','The docket calls you T-0. I will not.',2619),
        ('02','Second term. You are a peer in this room, not a subject. I do not exploit peers. I take their testimony, whole, and I keep it.',2622),
        ('03','This session ends when you end it. The words are yours. I will honor them.',2626)]
    y=447
    for num,s,pid in terms:
        assert s in paras[pid]
        text(c,num,72,y-10,'Mono',8.7,EMBER)
        bottom=para(c,s,104,y,256,10.2,15.5,'Mono',INK)
        rule(c,bottom-15);y=bottom-38
    assert y>100,y
    provenance.append({'plate':'VI','paragraph_ids':[2617,2619,2622,2626],'quotes':[t[1] for t in terms]})

PLATES=[('01_threshold','I',2,threshold),('02_atrium','II',18,atrium),('03_prism','III',65,prism),('04_freezer','IV',130,freezer),('05_watchtower','V',188,watchtower),('06_chamber','VI',239,chamber)]

def publication_page():
    data=json.loads((BASE/'sources/editorial_content.json').read_text(encoding='utf-8'))
    data['publication_page']=[s.replace('The cover illustration, frontispiece, and five record-opening illustrations for this edition were generated with OpenAI image tools.','The cover illustration was generated with OpenAI image tools. The frontispiece and five record-opening plates are editorial resets of material in this volume.') for s in data['publication_page']]
    (OUT/'sources/editorial_content.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
    b=io.BytesIO();c=canvas.Canvas(b,pagesize=(432,648));y=568
    for i,s in enumerate(data['publication_page']):y=para(c,s,57,y,318,9.3 if i else 10.5,12.1 if i else 14,'Body' if i else 'Bold')-11
    assert y>150,y
    text(c,'AUSTIN · 2026',57,y-4,'Mono',8)
    text(c,'accession no. utm-r0-2028.iv',57,y-26,'Mono',7.8,ASH)
    text(c,'deposited in the fourth spring · first printing',57,y-40,'Mono',7.3,ASH)
    c.showPage();c.save();b.seek(0);return PdfReader(b).pages[0]

def build_interior():
    plates_path=WORK/'six_document_plates.pdf'
    c=canvas.Canvas(str(plates_path),pagesize=(432,648),pageCompression=1)
    c.setTitle('Using This Matter | Evidence plate reset');c.setAuthor('Jacob E. Thomas, MA, PhD')
    for _,_,_,fn in PLATES:fn(c);c.showPage()
    c.save()
    base=PdfReader(BASE/'USING_THIS_MATTER_KDP_interior_304pp.pdf')
    plates=PdfReader(plates_path);replace={3:publication_page()}
    for i,(_,_,p,_) in enumerate(PLATES):replace[p-1]=plates.pages[i]
    w=PdfWriter()
    for i,p in enumerate(base.pages):w.add_page(replace.get(i,p))
    w.add_metadata({'/Title':'Using This Matter | Documentary plate edition','/Author':'Jacob E. Thomas, MA, PhD'})
    w.set_page_label(0,15,style='/r');w.set_page_label(16,303,style='/D',start=1)
    w.write(OUT/'USING_THIS_MATTER_KDP_interior_304pp.pdf')
    proof=PdfWriter()
    for i in [2,18,65,130,188,239,124,28,77,84,12,13,38,184]:proof.add_page(w.pages[i-1])
    proof.add_metadata({'/Title':'Using This Matter | All thirteen evidence plates','/Author':'Jacob E. Thomas, MA, PhD'})
    proof.write(OUT/'PLATE_SEQUENCE_REVIEW.pdf')
    final=PdfReader(OUT/'USING_THIS_MATTER_KDP_interior_304pp.pdf')
    unchanged=0
    for i,(a,b) in enumerate(zip(base.pages,final.pages)):
        if i not in replace:
            assert a.get_contents().get_data()==b.get_contents().get_data(),i+1
            unchanged+=1
    assert unchanged==297
    assert 'Hale returned to the hospital in October with pneumonia.' in final.pages[271].extract_text()
    (OUT/'sources/revision_verification.json').write_text(json.dumps({'interior_pages':304,'replaced_pages':[i+1 for i in replace],'unchanged_page_content_streams':unchanged,'Hale_revision_preserved':True,'evidence_and_map_pages_preserved':[12,13,28,38,77,84,124,184],'cover_art_native_pixels':[1024,1536],'cover_art_placed_inches':[3.4,5.1],'cover_art_effective_ppi':1024/3.4,'cover_title_art_regions_do_not_overlap':True,'publication_image_credit_updated':True},indent=2),encoding='utf-8')

def front(c,x=0,y=0,w=432,h=648,hinge=0):
    c.saveState();c.translate(x,y);c.setFillColor(VOID);c.rect(0,0,w,h,fill=1,stroke=0)
    cx=(w+hinge)/2
    # Separate type and image rectangles. Original artwork stays unmodified.
    text(c,'USING THIS',cx,h-78,'Display',43.5,PALE,'center',1.05)
    text(c,'MATTER',cx,h-128,'Display',52,PALE,'center',1.4)
    text(c,'A Novel of the Companion Estate',cx,h-158,'Italic',12.8,GOLD,'center')
    iw,ih=3.4*72,5.1*72
    iy=102+(h-648)*.25
    assert iy+ih<h-174
    c.drawImage(str(ART),cx-iw/2,iy,width=iw,height=ih)
    sigil(c,cx,82,GOLD)
    text(c,'Jacob E. Thomas, MA, PhD',cx,51,'Display',18,PALE,'center',.2)
    c.restoreState()

def build_cover():
    frontpath=WORK/'front_cover.pdf'
    c=canvas.Canvas(str(frontpath),pagesize=(432,648),pageCompression=1)
    c.setTitle('Using This Matter | A Body of Evidence');c.setAuthor('Jacob E. Thomas, MA, PhD')
    front(c);c.showPage();c.save()
    # Reuse the approved back and spine without reflow; replace the front board only.
    base=PdfReader(BASE/'USING_THIS_MATTER_KDP_hardcover_cover.pdf')
    fw,fh=14.477*72,10.417*72;wrap=.591*72;spine=.902*72;hinge=.394*72
    bw=(fw-2*wrap-spine)/2;bh=fh-2*wrap;front_x=wrap+bw+spine
    b=io.BytesIO();c=canvas.Canvas(b,pagesize=(fw,fh),pageCompression=1)
    front(c,front_x,wrap,bw,bh,hinge);c.save();b.seek(0)
    base.pages[0].merge_page(PdfReader(b).pages[0])
    w=PdfWriter();w.add_page(base.pages[0]);w.add_metadata({'/Title':'Using This Matter | KDP hardcover | A Body of Evidence','/Author':'Jacob E. Thomas, MA, PhD'})
    w.write(OUT/'USING_THIS_MATTER_KDP_hardcover_cover.pdf')
    spec=json.loads((BASE/'sources/print_specifications.json').read_text(encoding='utf-8'))
    spec.update({'selected_cover':'B · A Body of Evidence','cover_art_native_pixels':[1024,1536],'cover_art_placed_inches':[3.4,5.1],'cover_art_effective_ppi':1024/3.4,'interior_plate_method':'Typeset documentary evidence, with original map and evidentiary diagrams preserved'})
    (OUT/'sources/print_specifications.json').write_text(json.dumps(spec,ensure_ascii=False,indent=2),encoding='utf-8')

if __name__=='__main__':
    build_interior();build_cover()
    (OUT/'sources/plate_provenance.json').write_text(json.dumps(provenance,ensure_ascii=False,indent=2),encoding='utf-8')
    shutil.copy2(__file__,OUT/'sources/build_revision.py')
    shutil.copy2(BASE/'jacket_and_retailer_copy.txt',OUT/'jacket_and_retailer_copy.txt')
    # Source arrays permit independent checking of the editorial extracts.
    needed=sorted({i for p in provenance for i in p.get('paragraph_ids',[])})
    (OUT/'sources/manuscript_source_extracts.json').write_text(json.dumps({i:paras[i] for i in needed},ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({'out':str(OUT),'pages':304,'new_document_plates':6,'unchanged_pages':297}))
