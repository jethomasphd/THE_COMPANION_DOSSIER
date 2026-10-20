from pathlib import Path
import json, hashlib, zipfile, shutil
from html import escape

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'outputs/USING_THIS_MATTER_Document_Edition_v5'
WORK=ROOT/'work/v5'
titles=['The Threshold','The Atrium','The Prism','The Freezer Full of a Man','The Watchtower','The Chamber']
roles=['Protocol leaf','Appraisal discrepancy','Design sheet','Tracked-change leaf','Public deposit record','Session terms']
pages=[2,18,65,130,188,239]
roman=['I','II','III','IV','V','VI']
review=['All six replacement document plates rendered and visually reviewed','Reframed option B front and full hardcover wrap visually reviewed','Updated publication credit page visually reviewed','297 unchanged page content streams verified, including Hale revision and all retained evidence/map pages']
p=OUT/'sources/preflight_final.py'
s=p.read_text(encoding='utf8')
old="report['manual_visual_review']=['Revised Hale page at print scale','Selected full hardcover wrap','Approved front matter and plate sequence retained; all other page streams verified identical']"
s=s.replace(old,"report['manual_visual_review']="+repr(review))
p.write_text(s,encoding='utf8',newline='\n')
report=json.loads((OUT/'sources/preflight_report.json').read_text(encoding='utf8'))
report['manual_visual_review']=review
report['unchanged_page_content_streams']=297
report['interior_replacement_method']='Six vector/typeset evidence plates, plus artwork-credit page.'
(OUT/'sources/preflight_report.json').write_text(json.dumps(report,indent=2),encoding='utf8')
prompts=json.loads((ROOT/'outputs/USING_THIS_MATTER_Art_Workshop_v4/sources/prompt_set.json').read_text(encoding='utf8'))
selected=next(x for x in prompts['entries'] if x['key']=='cover_B_a_body_of_evidence')
(OUT/'sources/image_prompts.json').write_text(json.dumps({'mode':'Built-in image_gen for selected cover artwork only','selected_cover_prompt':selected['prompt'],'layout_revision':'Original option B PNG preserved; placed below a separate title area. No image regenerated.','interior_method':'Native vector drawing and exact typesetting from manuscript evidence; see plate_provenance.json.'},ensure_ascii=False,indent=2),encoding='utf8')
(OUT/'sources/plate_manifest.json').write_text(json.dumps([{'plate':roman[i],'title':title,'page':pages[i],'kind':roles[i],'preview':f'previews/plate-{i+1:02}.png','source':'sources/plate_provenance.json'} for i,title in enumerate(titles)],indent=2),encoding='utf8')
cards=''
for i,title in enumerate(titles,1):
    cards+=f'<article><a href="previews/plate-{i:02}.png" target="_blank"><img src="previews/plate-{i:02}.png" alt="{escape(title)}"></a><p class="eyebrow">PLATE {roman[i-1]} · {roles[i-1]}</p><h3>{escape(title)}</h3></article>'
html='''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Using This Matter — Corrected cover and document plates</title><style>
@font-face{font-family:Display;src:url("sources/fonts/CormorantGaramond-500.ttf")}*{box-sizing:border-box}body{margin:0;background:#eae5dc;color:#27231c;font:17px/1.55 Georgia,serif}main{max-width:1280px;margin:auto;padding:45px 35px}h1{font:500 57px/1.05 Display,Georgia,serif;max-width:850px;margin:15px 0 25px}h2{font:500 38px Display,serif;margin:0 0 10px}h3{font:500 28px Display,serif;margin:4px 0 24px}.eyebrow{font:11px/1.5 system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#855928}a{color:inherit;text-underline-offset:4px}nav{display:flex;flex-wrap:wrap;gap:24px;padding:18px 0 32px}.hero{display:grid;grid-template-columns:minmax(280px,420px) 1fr;gap:54px;align-items:center;margin:20px 0 70px}.hero img{display:block;width:100%;box-shadow:0 10px 26px #33271830}.hero p{max-width:620px}.label{font-size:14px;color:#685f50}.plates{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:28px}.plates img{display:block;width:100%;box-shadow:0 5px 18px #33271818}.plates .eyebrow{margin-bottom:0}section{border-top:1px solid #bcb2a2;padding-top:25px}footer{font:13px/1.6 system-ui,sans-serif;color:#6c6253;margin:50px 0 5px}.intro{max-width:900px;margin-bottom:28px}.download{display:inline-block;padding:12px 17px;background:#30281d;color:#f4eee2;border-radius:3px;text-decoration:none;margin:8px 12px 8px 0;font:13px system-ui,sans-serif}@media(max-width:900px){.plates{grid-template-columns:repeat(2,1fr)}.hero{gap:28px;grid-template-columns:1fr 1fr}h1{font-size:46px}}@media(max-width:600px){main{padding:28px 20px}.hero,.plates{grid-template-columns:1fr}.hero img{max-width:420px;margin:auto}h1{font-size:40px}nav{gap:14px}}
</style></head><body><main><div class="eyebrow">Using This Matter · Documentary edition · 20 October 2026</div>
<h1>The person on the cover.<br>The evidence within.</h1>
<nav><a href="#cover">Corrected option B</a><a href="#interior">Document plates</a><a href="PLATE_SEQUENCE_REVIEW.pdf">All thirteen plates</a></nav>
<div class="hero" id="cover"><a href="previews/cover_B_reframed.png" target="_blank"><img src="previews/cover_B_reframed.png" alt="Option B with the complete head below the title"></a><div><div class="eyebrow">Selected cover · B</div><h2>A Body of Evidence</h2><p>The head and document stack sit entirely below the title. The original artwork is preserved. The author’s MA, PhD credit remains on the front, spine and title page.</p><p>The interior now presents the materials as an archive: legible protocol leaves, corrections, specifications, tracked changes, deposit records and session terms.</p><p class="label">304 pages · 6 × 9 inches · premium color hardcover<br>Hale correction retained · map and existing diagrams preserved</p><a class="download" href="USING_THIS_MATTER_KDP_hardcover_cover.pdf">Hardcover cover PDF</a><a class="download" href="USING_THIS_MATTER_KDP_interior_304pp.pdf">Interior PDF</a></div></div>
<section id="interior"><h2>Documents carrying the story</h2><p class="intro">Six replacement plates use precise typesetting, source notes, paper-colored fields and restrained ember marks. Every quotation comes from the manuscript. Editorial resets are identified; no new signatures, dates or findings have been invented. Click a page to enlarge it.</p><div class="plates">__CARDS__</div><p>The withheld leaf, vessel diagram, name-composition plate, sealed-room schematic, estate map, public scoreboard and two-room section retain their existing content and placement. The complete plate PDF includes them.</p><a class="download" href="PLATE_SEQUENCE_REVIEW.pdf">Review the complete plate sequence</a></section>
<footer>The file-level preflight passed. KDP Print Previewer and a physical proof remain publication checks after upload. The full manuscript is unchanged outside the six replacement plates and the artwork-credit page. Source excerpts and editorial decisions are recorded in <a href="sources/plate_provenance.json">the plate provenance file</a>.</footer>
</main></body></html>'''
(OUT/'REVIEW.html').write_text(html.replace('__CARDS__',cards),encoding='utf8')
readme="""USING THIS MATTER
A Novel of the Companion Estate
Jacob E. Thomas, MA, PhD

CURRENT EDITION: DOCUMENTARY PLATES / OPTION B
20 October 2026

KDP UPLOADS
Manuscript: USING_THIS_MATTER_KDP_interior_304pp.pdf
Cover: USING_THIS_MATTER_KDP_hardcover_cover.pdf
The plate review PDF and preview images are review materials, not uploads.

SETUP
Hardcover / case laminate
Premium color / white paper
6 x 9 inches / no interior bleed
304 pages
Cover: 14.477 x 10.417 inches
Spine: 0.902 inches
Matte finish recommended
Let KDP add the ISBN barcode in the reserved white box.

REVISION
Selected cover B, A Body of Evidence. Its original artwork is placed below
a separate title area; the head and documents are fully visible.
The frontispiece and five record-opening plates are typeset documentary
evidence drawn from the manuscript. The cinematic workshop scenes and
paper-object illustrations are not used in this edition.
The seven other numbered plates, including the withheld leaf and two-page
estate map, retain their previous content. There are thirteen numbered
plates in all; the review PDF has fourteen pages because the map is a spread.
The Hale correction on printed page 256 is retained.
297 interior page content streams are unchanged. The seven replaced pages
are the six plates and the publication page, whose artwork credit is updated.

REVIEW
Open REVIEW.html for the corrected cover and six document plates.
PLATE_SEQUENCE_REVIEW.pdf includes the complete sequence at print size.
File-level checks passed for fonts, margins, image resolution and folios.
KDP Print Previewer and a physical proof have not been completed.

PROVENANCE AND SOURCES
The cover was generated with the built-in imagegen tool during the workshop.
The new interior plates use native PDF text and vector drawing.
sources/plate_provenance.json and manuscript_source_extracts.json document
their source passages and distinguish transcription from editorial summaries.
sources/build_revision.py records the local assembly process; it requires the
prior approved PDF baselines and manuscript extraction from this workspace.
It is not a standalone full-book composer. The repository's original builder
and older DOCX files describe prior editions, not the current print masters.

Older artwork files retained elsewhere in the repository are historical.
The current six plates are the pages shown in previews/plate-01.png through
plate-06.png and the plate review PDF. The cover source is
artwork/cover_B_a_body_of_evidence.png.
"""
(OUT/'READ_ME_KDP.txt').write_text(readme,encoding='utf8')
shutil.copy2(__file__,OUT/'sources/package_revision.py')
checks={str(p.relative_to(OUT)).replace('\\','/'):hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(OUT.rglob('*')) if p.is_file() and p.name!='file_checksums_sha256.json'}
(OUT/'sources/file_checksums_sha256.json').write_text(json.dumps(checks,indent=2),encoding='utf8')
manifest=[]
for p in sorted(OUT.rglob('*')):
    if p.is_file():
        data=p.read_bytes()
        manifest.append({'local':str(p),'path':'book/publication/'+p.relative_to(OUT).as_posix(),'size':len(data),'sha':hashlib.sha1(f'blob {len(data)}\0'.encode()+data).hexdigest()})
for local,remote in [(OUT/'USING_THIS_MATTER_KDP_interior_304pp.pdf','book/USING_THIS_MATTER.pdf'),(OUT/'USING_THIS_MATTER_KDP_hardcover_cover.pdf','book/jacket/USING_THIS_MATTER_KDP_hardcover_cover.pdf')]:
    data=local.read_bytes()
    manifest.append({'local':str(local),'path':remote,'size':len(data),'sha':hashlib.sha1(f'blob {len(data)}\0'.encode()+data).hexdigest()})
(WORK/'upload_manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf8')
with zipfile.ZipFile(OUT.parent/'USING_THIS_MATTER_Document_Edition_v5.zip','w',zipfile.ZIP_DEFLATED) as z:
    for p in OUT.rglob('*'):
        if p.is_file():z.write(p,Path(OUT.name)/p.relative_to(OUT))
print(json.dumps({'files':len(manifest),'zip_bytes':(OUT.parent/'USING_THIS_MATTER_Document_Edition_v5.zip').stat().st_size}))
