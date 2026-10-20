from pathlib import Path
import json,hashlib,zipfile,shutil
from html import escape

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'outputs/USING_THIS_MATTER_Cover_and_Statement_v6'
WORK=ROOT/'work/v6'
data=json.loads((WORK/'editorial_inputs.json').read_text(encoding='utf8'))
cards=''
descriptions=['The original sculptural direction, with a clean paper silhouette on charcoal.','An open, lighter collage on warm ivory, connecting the cover to the documentary interior.','A leaner silhouette, deeper contrast, and more assertive typography.']
for i,entry in enumerate(json.loads((OUT/'sources/cover_manifest.json').read_text(encoding='utf8')),1):
    cards+=f'<article><button class="enlarge" data-src="previews/cover-{i}.png" aria-label="Enlarge option {entry["option"]}"><img src="previews/cover-{i}.png" alt="Cover {entry["option"]}: {entry["title"]}"></button><div class="eyebrow">OPTION {entry["option"]}</div><h2>{entry["title"]}</h2><p>{descriptions[i-1]}</p></article>'
statement=''.join('<p>'+escape(p)+'</p>' for p in data['statement'])
html='''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Using This Matter — Selected cover and The Hand and the Glass</title><style>
@font-face{font-family:Display;src:url("sources/fonts/CormorantGaramond-500.ttf")}@font-face{font-family:Body;src:url("sources/fonts/CrimsonPro-400.ttf")}*{box-sizing:border-box}body{margin:0;background:#e8e4dc;color:#25241f;font:19px/1.5 Body,Georgia,serif}main{max-width:1400px;margin:auto;padding:45px 42px}h1{font:500 60px/1.05 Display,Georgia,serif;margin:12px 0 18px}h2{font:500 31px/1.1 Display,Georgia,serif;margin:8px 0}p{margin:12px 0 18px}.eyebrow{font:11px/1.5 system-ui,sans-serif;color:#895f33;letter-spacing:.13em;text-transform:uppercase}nav{display:flex;gap:24px;flex-wrap:wrap;margin:24px 0 35px;font:14px system-ui,sans-serif}a{color:inherit;text-underline-offset:4px}.covers{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:28px;padding:18px 0 34px}.covers article>p{font-size:17px;max-width:350px}.enlarge{display:block;padding:0;border:0;background:transparent;cursor:zoom-in;width:100%;margin:0 0 18px}.enlarge img{display:block;width:100%;box-shadow:0 8px 22px #25201924}.note{font:13px/1.6 system-ui,sans-serif;color:#5a574e;max-width:950px}.statement{margin:35px auto 25px;padding:55px 66px;max-width:900px;background:#f8f5ee;box-shadow:0 6px 28px #2520190c}.statement h2{font-size:45px;margin:12px 0 4px}.statement .sub{font-style:italic;color:#777164;margin-bottom:28px}.statement p{font-size:21px;line-height:1.6;margin:0 0 21px}.statement .signature{font-style:italic;margin-top:30px}.actions{display:flex;gap:18px;flex-wrap:wrap;margin-top:27px;font:14px system-ui,sans-serif}.actions a{padding:11px 15px;border:1px solid #b8af9f;text-decoration:none}footer{border-top:1px solid #bdb5a7;padding:26px 0;font:13px/1.7 system-ui,sans-serif;margin-top:40px}dialog{max-width:95vw;max-height:96vh;border:0;padding:18px;background:#25241f}dialog::backdrop{background:#000c}dialog img{max-height:85vh;max-width:85vw;display:block}dialog button{float:right;background:none;border:0;color:white;cursor:pointer;padding:0 0 12px;font:16px system-ui,sans-serif}@media(max-width:900px){main{padding:30px 24px}.covers{gap:15px}.covers h2{font-size:25px}.statement{padding:35px}}@media(max-width:650px){h1{font-size:43px}.covers{grid-template-columns:1fr;max-width:430px;margin:auto}.statement{padding:27px 23px}.statement h2{font-size:35px}.statement p{font-size:20px}}
</style></head><body><main><div class="eyebrow">Using This Matter · Selected cover and author’s statement</div><h1>Made from the archive.</h1><p>Option A · Archive Sculpture. Selected by the author for the 304-page premium-color hardcover.</p><nav><a href="#covers">Compare covers</a><a href="#statement">Read the statement</a><a href="COVER_RENDITIONS.pdf">Cover review PDF</a><a href="STATEMENT_AND_LINKS_REVIEW.pdf">Typeset statement and reader links</a></nav><section aria-label="Selected hardcover wrap"><a href="USING_THIS_MATTER_KDP_hardcover_cover.pdf"><img src="previews/selected_wrap.png" alt="Selected option A, full hardcover wrap" style="display:block;width:100%;height:auto"></a><div class="actions"><a href="USING_THIS_MATTER_KDP_hardcover_cover.pdf">KDP hardcover cover</a><a href="USING_THIS_MATTER_front_cover.pdf">Front cover</a><a href="USING_THIS_MATTER_KDP_interior_304pp.pdf">304-page interior</a></div></section><h2 style="margin-top:45px">The cover studies</h2><section class="covers" id="covers">__CARDS__</section><p class="note">Option A is selected and appears in the complete wrap above. B and C remain as workshop references. The three-page cover study PDF is not an upload file. The interior retains its documentary evidence plates and estate map.</p><section class="statement" id="statement"><div class="eyebrow">Author’s statement · now pages v–vi</div><h2>The Hand and the Glass</h2><div class="sub">On the use of generative artificial intelligence</div>__STATEMENT__<p class="signature">Jacob E. Thomas, MA, PhD</p><div class="actions"><a href="THE_HAND_AND_THE_GLASS.txt">Editable statement text</a><a href="USING_THIS_MATTER_KDP_interior_304pp.pdf">Updated 304-page interior</a></div></section><footer>The public archive: <a href="https://github.com/jethomasphd/THE_COMPANION_DOSSIER">GitHub repository</a> · <a href="https://www.the-companion-dossier.com/">The Companion Dossier website</a><br>Reader links replace the Zenodo reference in the current interior. The summoned-persona method is acknowledged through <a href="https://github.com/jethomasphd/THE_COMPANION_DOSSIER/tree/main/from_beyond">/from_beyond</a>. The narrative, map, evidence plates and Hale correction remain intact.</footer></main><dialog id="viewer"><button id="close" aria-label="Close enlarged cover">Close ×</button><img id="full" alt="Enlarged cover"></dialog><script>const d=document.querySelector('#viewer');document.querySelectorAll('.enlarge').forEach(b=>b.addEventListener('click',()=>{document.querySelector('#full').src=b.dataset.src;d.showModal()}));document.querySelector('#close').onclick=()=>d.close();d.addEventListener('click',e=>{if(e.target===d)d.close()});</script></body></html>'''
(OUT/'REVIEW.html').write_text(html.replace('__CARDS__',cards).replace('__STATEMENT__',statement),encoding='utf8')
notes='''USING THIS MATTER — SELECTED COVER A AND AUTHOR STATEMENT
20 October 2026

Open REVIEW.html to compare the three covers and read The Hand and the Glass.
COVER_RENDITIONS.pdf contains three front-cover concepts, not KDP wraps.
The author selected A, Archive Sculpture, on 20 October 2026.
USING_THIS_MATTER_KDP_hardcover_cover.pdf is the selected full wrap.
USING_THIS_MATTER_front_cover.pdf is the separate front cover.

The revised interior is USING_THIS_MATTER_KDP_interior_304pp.pdf.
304 pages, 6 x 9 inches, premium color on white paper, no bleed.
The author statement appears on pages v-vi, immediately after the publication
page. The fictional Editor's Note follows on vii-viii. The epigraph moves to
the formerly blank page xiv, opposite the reading instruction. Body pagination,
narrative text, Hale correction, all document plates, and the map are preserved.
294 page content streams are unchanged from the preceding edition.

STATEMENT_AND_LINKS_REVIEW.pdf collects the changed pages for review.
The publication page and closing page now print the GitHub and website URLs.
Acknowledgments refer readers to those links. No Zenodo reference remains in
the current print interior. Historical sources elsewhere in the repo may retain it.

AI collaboration provenance was supplied by the author in this conversation.
The statement centers the intellectual sovereignty of the author and his human
collaborators, the directed dialogic use of Claude, /from_beyond's
summoned personae, OpenAI production work, and authorial accountability.
Provider names are used without unverified model version numbers.
The statement explains the website and GitHub repository in plain language
and records the Claude Code session, handwritten notes, and outline files.
The conservative page estimate uses the pre-book repository snapshot: 94,744
words of readable web/text material, about 316 pages at 300 words per page.
PDFs, code/data, assets, and private notes are excluded. See the source report.

The cover cutouts were generated with true alpha and laid directly on a single
background. Their native 1024 x 1536 pixels are placed at 3.4 x 5.1 inches
(301 ppi). Alpha is retained in the workshop PDF. The selected print wrap uses native
pixels flattened onto its continuous charcoal background, with embedded fonts.
Do not upload the workshop PDF to KDP.

Build scripts record the local assembly process and require the prior edition
and workspace inputs. They are not standalone full-book composers.
KDP Print Previewer and physical-proof checks remain pending.
'''
(OUT/'READ_ME.txt').write_text(notes,encoding='utf8')
shutil.copy2(__file__,OUT/'sources/package_revision.py')
checks={p.relative_to(OUT).as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(OUT.rglob('*')) if p.is_file() and p.name!='file_checksums_sha256.json'}
(OUT/'sources/file_checksums_sha256.json').write_text(json.dumps(checks,indent=2),encoding='utf8')
manifest=[]
def add(local,remote):
    data=local.read_bytes();manifest.append({'local':str(local),'path':remote,'size':len(data),'sha':hashlib.sha1(f'blob {len(data)}\0'.encode()+data).hexdigest()})
for p in sorted(OUT.rglob('*')):
    if p.is_file():add(p,'book/publication/revision_v6/'+p.relative_to(OUT).as_posix())
for local,remote in [('USING_THIS_MATTER_KDP_interior_304pp.pdf','book/USING_THIS_MATTER.pdf'),('USING_THIS_MATTER_KDP_interior_304pp.pdf','book/publication/USING_THIS_MATTER_KDP_interior_304pp.pdf'),('sources/editorial_content.json','book/publication/sources/editorial_content.json'),('sources/preflight_report.json','book/publication/sources/preflight_report.json'),('USING_THIS_MATTER_KDP_hardcover_cover.pdf','book/publication/USING_THIS_MATTER_KDP_hardcover_cover.pdf'),('USING_THIS_MATTER_KDP_hardcover_cover.pdf','book/jacket/USING_THIS_MATTER_KDP_hardcover_cover.pdf'),('USING_THIS_MATTER_front_cover.pdf','book/publication/USING_THIS_MATTER_front_cover.pdf'),('USING_THIS_MATTER_front_cover.jpg','book/publication/USING_THIS_MATTER_front_cover.jpg')]:
    if (OUT/local).exists():add(OUT/local,remote)
for p in sorted((WORK/'repo').rglob('*')):
    if p.is_file():add(p,p.relative_to(WORK/'repo').as_posix())
(WORK/'upload_manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf8')
with zipfile.ZipFile(OUT.with_suffix('.zip'),'w',zipfile.ZIP_DEFLATED) as z:
    for p in OUT.rglob('*'):
        if p.is_file():z.write(p,Path(OUT.name)/p.relative_to(OUT))
print(json.dumps({'package':str(OUT),'files':len(manifest),'zip_bytes':OUT.with_suffix('.zip').stat().st_size}))
