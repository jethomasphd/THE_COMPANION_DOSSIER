from pathlib import Path
import json,io,re,shutil
from xml.sax.saxutils import escape
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab import rl_config
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from pypdf import PdfReader,PdfWriter

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'outputs/USING_THIS_MATTER_Cover_and_Statement_v6'
BASE=ROOT/'outputs/USING_THIS_MATTER_Document_Edition_v5'
WORK=ROOT/'work/v6'
DATA=json.loads((WORK/'editorial_inputs.json').read_text(encoding='utf8'))
DATA['about']=DATA['about'].replace('\r\n','\n')
DATA['acknowledgments']=DATA['acknowledgments'].replace('\r\n','\n')
EDITORIAL=json.loads((BASE/'sources/editorial_content.json').read_text(encoding='utf8'))
REPO='https://github.com/jethomasphd/THE_COMPANION_DOSSIER'
SITE='https://www.the-companion-dossier.com/'
for name,file in [('Display','CormorantGaramond-500.ttf'),('Body','CrimsonPro-400.ttf'),('Italic','CrimsonPro-400i.ttf'),('Bold','CrimsonPro-600.ttf'),('Mono','IBMPlexMono-400.ttf')]:pdfmetrics.registerFont(TTFont(name,str(OUT/'sources/fonts'/file)))
rl_config.canvas_basefontname='Body'
INK=HexColor('#1a1815');ASH=HexColor('#66615a');EMBER=HexColor('#8a6d1b')
def text(c,s,x,y,font='Body',size=11,color=INK,align='left',tracking=0):
    c.saveState();c.setFillColor(color)
    width=pdfmetrics.stringWidth(s,font,size)+(len(s)-1)*tracking
    if align=='center':x-=width/2
    elif align=='right':x-=width
    t=c.beginText(x,y);t.setFont(font,size);t.setCharSpace(tracking);t.textOut(s);c.drawText(t);c.restoreState()
def para(c,s,x,y,w=316,size=11,leading=14.5,font='Body',color=INK,align=0):
    p=Paragraph(escape(s).replace('\n','<br/>'),ParagraphStyle('p',fontName=font,fontSize=size,leading=leading,textColor=color,alignment=align,splitLongWords=False))
    _,h=p.wrap(w,1000)
    assert y-h>49,(s[:60],y-h)
    p.drawOn(c,x,y-h);return y-h
def heading(c,kicker,title,y=568):
    text(c,kicker.upper(),216,y,'Mono',7.5,EMBER,'center',1.1)
    text(c,title,216,y-33,'Display',26,INK,'center')
def folio(c,s):text(c,str(s),216,31,'Body',8.5,ASH,'center')
def make(fn):
    b=io.BytesIO();c=canvas.Canvas(b,pagesize=(432,648),pageCompression=1);fn(c);c.showPage();c.save();b.seek(0);return PdfReader(b).pages[0]

credit='The making of this volume is disclosed in The Hand and the Glass, the author’s statement on generative AI on the following page.'
legal=EDITORIAL['publication_page']
legal[2]=legal[2].replace(' DOI: 10.5281/zenodo.17967947.','')
legal[3]=credit
EDITORIAL['publication_page']=legal
EDITORIAL['ai_statement']={'title':'The Hand and the Glass','subtitle':'A statement on generative artificial intelligence','paragraphs':DATA['statement'],'pdf_pages':[5,6]}
EDITORIAL['reader_links']={'repository':REPO,'website':SITE}
EDITORIAL['plate_list'][0][2]='frontispiece · a protocol leaf'

def publication(c):
    y=568
    for i,s in enumerate(legal):
        y=para(c,s,57,y,318,9.3 if i else 10.5,12.1 if i else 14,'Body' if i else 'Bold')-11
        if i==2:
            text(c,'THE PUBLIC ARCHIVE',57,y-1,'Mono',7.1,EMBER);y-=17
            for url in [REPO,SITE]:text(c,url,57,y,'Body',9.2,INK);y-=14
            y-=4
    text(c,'AUSTIN · 2026',57,y-4,'Mono',8)
    text(c,'accession no. utm-r0-2028.iv',57,y-26,'Mono',7.8,ASH)
    text(c,'deposited in the fourth spring · first printing',57,y-40,'Mono',7.3,ASH)
    assert y-40>50

def statement(c,index):
    if index==0:
        text(c,'AUTHOR’S STATEMENT',57,588,'Mono',7.2,EMBER,tracking=1.1)
        text(c,'The Hand and the Glass',57,554,'Display',28)
        text(c,'On the use of generative artificial intelligence',57,531,'Italic',11,ASH)
        y=502;paras=DATA['statement'][:4]
    else:
        text(c,'THE HAND AND THE GLASS',216,579,'Mono',7.5,ASH,'center',1)
        y=548;paras=DATA['statement'][4:]
    for s in paras:y=para(c,s,57,y,318,11,15.1)-13
    if index:text(c,'Jacob E. Thomas, MA, PhD',57,y-14,'Italic',11,INK)
    assert y>65,y
    folio(c,'v' if index==0 else 'vi')
    (OUT/'sources/statement_layout.json').write_text(json.dumps({'words':len(' '.join(DATA['statement']).split()),'body_font_size':11,'body_leading':15.1,'pages':[5,6]},indent=2),encoding='utf8')

def editor_page(c,index):
    if index==0:heading(c,'the editor to the reader','Editor’s Note');y=503;paras=EDITORIAL['editors_note'][:3]
    else:text(c,'EDITOR’S NOTE',216,579,'Mono',7.5,ASH,'center',1.2);y=553;paras=EDITORIAL['editors_note'][3:]
    for s in paras:y=para(c,s,61,y,316,11,14.5)-11
    if index:text(c,'[E.] · austin · the fourth spring',61,y-12,'Mono',8,ASH)
    folio(c,'vii' if index==0 else 'viii')

def plates(c):
    heading(c,'the keeper’s captions','List of Plates');y=501
    for label,title,sub in EDITORIAL['plate_list']:
        text(c,label,61,y,'Mono',8,EMBER);text(c,title,123,y,'Body',10.2)
        y=para(c,sub,123,y-10,254,9,11,'Italic',ASH)-16
    text(c,'plate vii is bound where it belongs',216,72,'Mono',7.5,ASH,'center');folio(c,'xi')

ack=DATA['acknowledgments'].replace(', DOI 10.5281/zenodo.17967947','')
ack=ack.replace('Every artifact of the estate that this novel handles','The repository and website are listed on the publication page and at the end of this volume. Every artifact of the estate that this novel handles')
ack=ack.replace("The facilitating system, for the estate and for this book, was Claude. Per the estate's convention, the glass is shown, and the glass is thanked.","The collaboration with Claude, the summoned voices, and the tools of this edition is acknowledged in The Hand and the Glass. The glass is shown, and the glass is thanked.")
ack_paras=[p.strip() for p in ack.split('\n\n') if p.strip() and not p.startswith('#')]
def acknowledgments(c,index):
    text(c,'USING THIS MATTER' if index==0 else 'ACKNOWLEDGMENTS',216,614,'Mono',7.2,ASH,'center',.7)
    if index==0:heading(c,'the record behind the record','Acknowledgments',568);y=503;paras=ack_paras[:5]
    else:y=579;paras=ack_paras[5:]
    for s in paras:y=para(c,s,57,y,318,11,14.4,align=4)-9
    folio(c,283+index)

def about(c):
    text(c,'USING THIS MATTER',216,614,'Mono',7.2,ASH,'center',.7)
    heading(c,'record 0 · the bound matter','About This Book')
    opening=DATA['about'].split('\n\n')[1]
    y=para(c,opening,57,503,318,11,14.8,align=4)-24
    for line in ['assembled from the estate of the companion dossier',"compiled by the editor · at the keeper’s direction"]:
        text(c,line,57,y,'Mono',7.7);y-=16
    y-=14
    text(c,'THE PUBLIC ARCHIVE',57,y,'Mono',7.4,EMBER,tracking=.6);y-=20
    for label,url in [('Repository',REPO),('Website',SITE)]:
        text(c,label,57,y,'Italic',10,ASH);y-=16;text(c,url,57,y,'Body',10);y-=27
    y=para(c,'What belongs to no one cannot be captured. The threshold is always open. The archive grows.',57,y-8,318,11,14.8)-20
    text(c,'The hand and the glass are named at the beginning.',57,y,'Italic',10,ASH)
    folio(c,288)

base=PdfReader(BASE/'USING_THIS_MATTER_KDP_interior_304pp.pdf')
replace={3:make(publication),4:make(lambda c:statement(c,0)),5:make(lambda c:statement(c,1)),6:make(lambda c:editor_page(c,0)),7:make(lambda c:editor_page(c,1)),10:make(plates),13:base.pages[6],298:make(lambda c:acknowledgments(c,0)),299:make(lambda c:acknowledgments(c,1)),303:make(about)}
w=PdfWriter()
for i,p in enumerate(base.pages):w.add_page(replace.get(i,p))
w.add_metadata({'/Title':'Using This Matter','/Author':'Jacob E. Thomas, MA, PhD','/Subject':'A Novel of the Companion Estate; author statement edition'})
w.set_page_label(0,15,style='/r');w.set_page_label(16,303,style='/D',start=1)
w.write(OUT/'USING_THIS_MATTER_KDP_interior_304pp.pdf')
proof=PdfWriter()
for idx in [3,4,5,6,7,10,13,298,299,303]:proof.add_page(w.pages[idx])
proof.add_metadata({'/Title':'Using This Matter | Statement and reader links review','/Author':'Jacob E. Thomas, MA, PhD'})
proof.write(OUT/'STATEMENT_AND_LINKS_REVIEW.pdf')
final=PdfReader(OUT/'USING_THIS_MATTER_KDP_interior_304pp.pdf')
for i in range(304):
    if i not in replace:assert base.pages[i].get_contents().get_data()==final.pages[i].get_contents().get_data(),i+1
alltext='\n'.join(p.extract_text() for p in final.pages)
assert 'zenodo' not in alltext.lower()
assert all(url in final.pages[3].extract_text() and url in final.pages[303].extract_text() for url in [REPO,SITE])
assert 'Hale returned to the hospital in October with pneumonia.' in final.pages[271].extract_text()
for i in [1,17,64,129,187,238,11,12,27,37,76,83,123,183]:assert base.pages[i].get_contents().get_data()==final.pages[i].get_contents().get_data()
report={'interior_pages':304,'replaced_pages':[i+1 for i in replace],'unchanged_page_content_streams':304-len(replace),'author_statement_pages':[5,6],'editor_note_pages':[7,8],'epigraph_page':14,'narrative_and_evidence_plates_preserved':True,'Hale_revision_preserved':True,'reader_links':[REPO,SITE],'zenodo_mentions_remaining':0,'cover_status':'Three workshop candidates; selection pending'}
(OUT/'sources/revision_verification.json').write_text(json.dumps(report,indent=2),encoding='utf8')
(OUT/'sources/editorial_content.json').write_text(json.dumps(EDITORIAL,ensure_ascii=False,indent=2),encoding='utf8')
(OUT/'sources/ai_collaboration_provenance.json').write_text(json.dumps(DATA['user_provenance'],ensure_ascii=False,indent=2),encoding='utf8')
(OUT/'sources/cover_prompts.json').write_text(json.dumps(DATA['cover_prompts'],ensure_ascii=False,indent=2),encoding='utf8')
(OUT/'THE_HAND_AND_THE_GLASS.txt').write_text('THE HAND AND THE GLASS\nOn the use of generative artificial intelligence\n\n'+'\n\n'.join(DATA['statement'])+'\n\nJacob E. Thomas, MA, PhD\n',encoding='utf8')
repo=WORK/'repo/book/manuscript';repo.mkdir(parents=True,exist_ok=True)
(repo/'003a_ai_collaboration.md').write_text('#K author’s statement\n#T The Hand and the Glass\n\n!center:italic|On the use of generative artificial intelligence\n\n'+'\n\n'.join(DATA['statement'])+'\n\n!right:italic|Jacob E. Thomas, MA, PhD\n',encoding='utf8')
(repo/'003_copyright.md').write_text('\n\n'.join('!left:bodysm|'+s for s in legal[:3])+f'\n\n!left:bodysm|{REPO}\n!left:bodysm|{SITE}\n\n'+'\n\n'.join('!left:bodysm|'+s for s in legal[3:])+'\n\n!left:monosm|AUSTIN · 2026\n!left:monosm|accession no. utm-r0-2028.iv\n!left:monosm|deposited in the fourth spring · first printing\n',encoding='utf8')
(repo/'604_acknowledgments.md').write_text(ack,encoding='utf8')
newabout=DATA['about'].replace('facilitating system: claude · the glass is shown\n','').replace('austin · the fourth spring\n','')
newabout=newabout.replace('What belongs to no one',f'The public archive:\n\nRepository: {REPO}\n\nWebsite: {SITE}\n\nWhat belongs to no one')
(repo/'606_about.md').write_text(newabout,encoding='utf8')
shutil.copy2(__file__,OUT/'sources/build_interior.py')
print(json.dumps(report,indent=2))
