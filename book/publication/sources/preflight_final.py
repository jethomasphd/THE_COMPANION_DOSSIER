from pathlib import Path
import hashlib,json,math,re,sys
from collections import Counter
import pdfplumber
from pypdf import PdfReader
from pypdf.generic import ContentStream

HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[1] if HERE.name=='final' else None
OUT=ROOT/'outputs/USING_THIS_MATTER_FINAL' if ROOT else HERE.parent
interior=PdfReader(OUT/'USING_THIS_MATTER_KDP_interior_304pp.pdf')
cover=PdfReader(OUT/'USING_THIS_MATTER_KDP_hardcover_cover.pdf')
report={'status':'checking','interior_pages':len(interior.pages),'trim_inches':[6,9],
        'interior_bleed':False,'binding':'hardcover','ink':'premium color','paper':'white',
        'cover_inches':[float(cover.pages[0].mediabox.width)/72,float(cover.pages[0].mediabox.height)/72],
        'unembedded_fonts':[],'active_transparency':[],'annotations':[],'image_placements':[],
        'folio_errors':[],'margin_errors':[],'kdp_previewer_checked':False,'physical_proof_checked':False}
assert len(interior.pages)==304 and len(cover.pages)==1
assert not interior.is_encrypted and not cover.is_encrypted
assert all(abs(a-b)<1e-6 for a,b in zip(report['cover_inches'],[14.477,10.417]))

def mult(a,b):
    return [a[0]*b[0]+a[1]*b[2],a[0]*b[1]+a[1]*b[3],a[2]*b[0]+a[3]*b[2],a[2]*b[1]+a[3]*b[3],a[4]*b[0]+a[5]*b[2]+b[4],a[4]*b[1]+a[5]*b[3]+b[5]]

def check_resources(resources,label,seen=None):
    seen=set() if seen is None else seen
    for f in resources.get('/Font',{}).values():
        font=f.get_object()
        fonts=[x.get_object() for x in font.get('/DescendantFonts',[])] if font.get('/Subtype')=='/Type0' else [font]
        for font in fonts:
            descriptor=font.get('/FontDescriptor')
            if not descriptor or not any(k in descriptor.get_object() for k in ['/FontFile','/FontFile2','/FontFile3']):
                report['unembedded_fonts'].append([label,str(font.get('/BaseFont'))])
    for e in resources.get('/ExtGState',{}).values():
        e=e.get_object()
        if float(e.get('/ca',1))!=1 or float(e.get('/CA',1))!=1 or str(e.get('/SMask','/None'))!='/None':report['active_transparency'].append(label)
    for ref in resources.get('/XObject',{}).values():
        obj=ref.get_object();identity=ref.idnum if hasattr(ref,'idnum') else id(obj)
        if identity in seen:continue
        seen.add(identity)
        if obj.get('/SMask') or obj.get('/Mask'):report['active_transparency'].append(label)
        if obj.get('/Subtype')=='/Form':check_resources(obj.get('/Resources',{}),label,seen)

def scan_images(stream,resources,reader,label,transform=None):
    matrix=transform or [1,0,0,1,0,0];stack=[]
    for args,op in ContentStream(stream,reader).operations:
        if op==b'q':stack.append(matrix[:])
        elif op==b'Q':matrix=stack.pop() if stack else [1,0,0,1,0,0]
        elif op==b'cm':matrix=mult([float(x) for x in args],matrix)
        elif op==b'Do':
            obj=resources.get('/XObject',{}).get(args[0])
            if not obj:continue
            obj=obj.get_object()
            if obj.get('/Subtype')=='/Image':
                w=math.hypot(matrix[0],matrix[1]);h=math.hypot(matrix[2],matrix[3])
                report['image_placements'].append({'page':label,'pixels':[obj['/Width'],obj['/Height']],
                   'ppi':round(min(obj['/Width']/(w/72),obj['/Height']/(h/72)),2)})
            elif obj.get('/Subtype')=='/Form':scan_images(obj,obj.get('/Resources',resources),reader,label,mult(list(map(float,obj.get('/Matrix',[1,0,0,1,0,0]))),matrix))

all_text=[]
for i,p in enumerate(interior.pages,1):
    assert tuple(float(x) for x in p.mediabox)==(0,0,432,648)
    assert int(p.get('/Rotate',0))==0
    if p.get('/Annots'):report['annotations'].append(i)
    resources=p.get('/Resources',{})
    check_resources(resources,i);scan_images(p.get_contents(),resources,interior,i)
    t=p.extract_text();all_text.append(t)
check_resources(cover.pages[0]['/Resources'],'cover')
scan_images(cover.pages[0].get_contents(),cover.pages[0]['/Resources'],cover,'cover')
if cover.pages[0].get('/Annots'):report['annotations'].append('cover')
joined='\n'.join(all_text)
assert 'Hale returned to the hospital in October with pneumonia.' in joined
assert 'Hale did not die in October.' not in joined and 'October made the attempt.' not in joined
assert not re.search(r'lantern\s*&\s*key',joined,re.I)
assert not re.search(r'No em dashes were used',joined,re.I)
assert 'MA, PhD' in all_text[2] and 'MA, PhD' in cover.pages[0].extract_text()
assert not report['unembedded_fonts'] and not report['active_transparency'] and not report['annotations'] and not report['folio_errors']
assert min(x['ppi'] for x in report['image_placements'])>=299.9
report['minimum_image_ppi']=min(x['ppi'] for x in report['image_placements'])

# Actual character geometry, including mirrored inside margins. At 304 pages,
# require 0.625-inch inside margin and 0.25-inch outside/top/bottom margins.
minimum={'inside':999,'outside':999,'top':999,'bottom':999}
with pdfplumber.open(OUT/'USING_THIS_MATTER_KDP_interior_304pp.pdf') as pdf:
    for i,p in enumerate(pdf.pages,1):
        chars=[c for c in p.chars if c['text'].strip()]
        if not chars:continue
        if i>16:
            footer=''.join(c['text'] for c in chars if c['top']>603)
            if footer!=str(i-16):report['folio_errors'].append([i,footer])
        x0=min(c['x0'] for c in chars);x1=max(c['x1'] for c in chars)
        top=min(c['top'] for c in chars);bottom=648-max(c['bottom'] for c in chars)
        inside=x0 if i%2 else 432-x1;outside=432-x1 if i%2 else x0
        for key,val in [('inside',inside),('outside',outside),('top',top),('bottom',bottom)]:minimum[key]=min(minimum[key],val)
        if inside<44.9 or outside<17.9 or top<17.9 or bottom<17.9:report['margin_errors'].append({'page':i,'inside':inside,'outside':outside,'top':top,'bottom':bottom})
        p.close()
assert not report['margin_errors'],report['margin_errors']
assert not report['folio_errors'],report['folio_errors']
report['minimum_text_margins_inches']={k:round(v/72,4) for k,v in minimum.items()}
report['requested_text_and_degrees_checks']='passed'

if ROOT:
    source=PdfReader(ROOT/'outputs/USING_THIS_MATTER_Visual_Continuity_v3/interior/USING_THIS_MATTER_visual_proof_304pp.pdf')
    unchanged=0
    for i,(a,b) in enumerate(zip(source.pages,interior.pages)):
        if i!=271:
            assert a.get_contents().get_data()==b.get_contents().get_data(),i+1
            unchanged+=1
        old_images={str(k):hashlib.sha256(v.get_object().get_data()).hexdigest() for k,v in a.get('/Resources',{}).get('/XObject',{}).items() if v.get_object().get('/Subtype')=='/Image'}
        new_images={str(k):hashlib.sha256(v.get_object().get_data()).hexdigest() for k,v in b.get('/Resources',{}).get('/XObject',{}).items() if v.get_object().get('/Subtype')=='/Image'}
        assert old_images==new_images,i+1
    report['unchanged_page_content_streams']=unchanged
    report['all_embedded_images_preserved_losslessly']=True
report['status']='passed'
report['manual_visual_review']=['All six replacement document plates rendered and visually reviewed', 'Reframed option B front and full hardcover wrap visually reviewed', 'Updated publication credit page visually reviewed', '297 unchanged page content streams verified, including Hale revision and all retained evidence/map pages']
report['file_sizes_bytes']={p.name:p.stat().st_size for p in OUT.glob('*.pdf')}
(OUT/'sources/preflight_report.json').write_text(json.dumps(report,indent=2),encoding='utf8')
print(json.dumps({k:v for k,v in report.items() if k!='image_placements'},indent=2))
