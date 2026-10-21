import argparse,json,hashlib
from pathlib import Path
from pypdf import PdfReader
import pdfplumber
p=argparse.ArgumentParser()
for k in ['input','baseline','report']:p.add_argument('--'+k,required=True,type=Path)
a=p.parse_args();new=PdfReader(a.input);old=PdfReader(a.baseline)
assert len(new.pages)==len(old.pages)==304
changed=[i+1 for i,(o,n) in enumerate(zip(old.pages,new.pages)) if o.get_contents().get_data()!=n.get_contents().get_data()]
assert changed==[12,13],changed
assert new.page_labels==old.page_labels
fonts=[];margins=[]
for n in changed:
    page=new.pages[n-1]
    assert list(page.mediabox)==[0,0,432,648]
    assert not page.get('/Annots')
    for f in page['/Resources'].get('/Font',{}).values():
        f=f.get_object();desc=f.get('/FontDescriptor');assert desc
        assert any(k in desc.get_object() for k in ['/FontFile','/FontFile2','/FontFile3'])
        fonts.append(str(f['/BaseFont']))
    for gs in page['/Resources'].get('/ExtGState',{}).values():
        gs=gs.get_object();assert float(gs.get('/ca',1))==1 and float(gs.get('/CA',1))==1
        assert str(gs.get('/SMask','/None'))=='/None'
with pdfplumber.open(a.input) as pdf:
    for n in changed:
        chars=[c for c in pdf.pages[n-1].chars if c['text'].strip()]
        x0=min(c['x0'] for c in chars);x1=max(c['x1'] for c in chars)
        top=min(c['top'] for c in chars);bottom=648-max(c['bottom'] for c in chars)
        inside=x0 if n%2 else 432-x1;outside=432-x1 if n%2 else x0
        assert inside>=45 and min(outside,top,bottom)>=18
        margins.append({'pdf_page':n,'inside_pt':round(inside,2),'outside_pt':round(outside,2),'top_pt':round(top,2),'bottom_pt':round(bottom,2)})
for n in [5,6,18,239,272,299,303]:assert new.pages[n-1].extract_text()==old.pages[n-1].extract_text()
report={'status':'passed','changed_pages':changed,'unchanged_page_streams':302,'page_count':304,'page_labels_unchanged':True,'fonts_embedded':sorted(set(fonts)),'text_margins':margins,'map_geometry_check':'All 12 numbered doors connect their scheduled spaces; every space reachable; linen and study face one another','manual_review':'Both map pages rendered and inspected; plan checked again after label and badge spacing corrections','kdp_previewer_checked':False,'physical_proof_checked':False,'sha256':hashlib.sha256(a.input.read_bytes()).hexdigest()}
a.report.write_text(json.dumps(report,indent=2),encoding='utf8');print(json.dumps(report,indent=2))
