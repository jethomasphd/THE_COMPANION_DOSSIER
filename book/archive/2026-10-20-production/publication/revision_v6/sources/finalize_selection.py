from pathlib import Path
import json, shutil, hashlib
ROOT=Path(__file__).resolve().parents[2]
WORK=ROOT/'work/v6';OUT=ROOT/'outputs/USING_THIS_MATTER_Cover_and_Statement_v6'
REPO=WORK/'repo';PUB=REPO/'book/publication'

def replace_once(s,a,b):
    assert a in s,a[:80]
    return s.replace(a,b)

package=WORK/'package_revision.py'
s=package.read_text(encoding='utf8')
if 'The author has not selected a new cover' in s:
    s=replace_once(s,'Cover studies and The Hand and the Glass','Selected cover and The Hand and the Glass')
    s=replace_once(s,'Cover studies and author’s statement','Selected cover and author’s statement')
    s=replace_once(s,'Three treatments of the document-built woman, with a continuous cover background and a clear title area.','Option A · Archive Sculpture. Selected by the author for the 304-page premium-color hardcover.')
    s=replace_once(s,'<section class="covers" id="covers">','<section aria-label="Selected hardcover wrap"><a href="USING_THIS_MATTER_KDP_hardcover_cover.pdf"><img src="previews/selected_wrap.png" alt="Selected option A, full hardcover wrap" style="display:block;width:100%;height:auto"></a><div class="actions"><a href="USING_THIS_MATTER_KDP_hardcover_cover.pdf">KDP hardcover cover</a><a href="USING_THIS_MATTER_front_cover.pdf">Front cover</a><a href="USING_THIS_MATTER_KDP_interior_304pp.pdf">304-page interior</a></div></section><h2 style="margin-top:45px">The cover studies</h2><section class="covers" id="covers">')
    s=replace_once(s,'These are new options A–C for this round. The earlier selected B is the source of this exploration. All three retain MA, PhD. These front-cover concepts are for selection; they are not full KDP cover wraps. The interior remains documentary, with its evidence plates and estate map preserved.','Option A is selected and appears in the complete wrap above. B and C remain as workshop references. The three-page cover study PDF is not an upload file. The interior retains its documentary evidence plates and estate map.')
    s=replace_once(s,'USING THIS MATTER — COVER STUDIES AND AUTHOR STATEMENT','USING THIS MATTER — SELECTED COVER A AND AUTHOR STATEMENT')
    s=replace_once(s,'The author has not selected a new cover from this round.','The author selected A, Archive Sculpture, on 20 October 2026.\nUSING_THIS_MATTER_KDP_hardcover_cover.pdf is the selected full wrap.\nUSING_THIS_MATTER_front_cover.pdf is the separate front cover.')
    s=replace_once(s,'Alpha is retained in the workshop PDF; the selected final wrap will\nbe flattened and checked for print. Do not upload the workshop PDF to KDP.','Alpha is retained in the workshop PDF. The selected print wrap uses native\npixels flattened onto its continuous charcoal background, with embedded fonts.\nDo not upload the workshop PDF to KDP.')
    s=replace_once(s,'Provider names are used without unverified model version numbers.','Provider names are used without unverified model version numbers.\nThe statement explains the website and GitHub repository in plain language\nand records the Claude Code session, handwritten notes, and outline files.\nThe conservative page estimate uses the pre-book repository snapshot: 94,744\nwords of readable web/text material, about 316 pages at 300 words per page.\nPDFs, code/data, assets, and private notes are excluded. See the source report.')
    s=replace_once(s,"('sources/preflight_report.json','book/publication/sources/preflight_report.json')", "('sources/preflight_report.json','book/publication/sources/preflight_report.json'),('USING_THIS_MATTER_KDP_hardcover_cover.pdf','book/publication/USING_THIS_MATTER_KDP_hardcover_cover.pdf'),('USING_THIS_MATTER_KDP_hardcover_cover.pdf','book/jacket/USING_THIS_MATTER_KDP_hardcover_cover.pdf'),('USING_THIS_MATTER_front_cover.pdf','book/publication/USING_THIS_MATTER_front_cover.pdf'),('USING_THIS_MATTER_front_cover.jpg','book/publication/USING_THIS_MATTER_front_cover.jpg')")
    package.write_text(s,encoding='utf8')

p=REPO/'book/README.md';s=p.read_text(encoding='utf8')
s=s.replace('**Cover selection is in progress.** Three new treatments remove the rectangular image edge and retain the document-built woman and the author’s degrees.','**Selected cover: A · Archive Sculpture.** The full hardcover wrap uses a woman visibly constructed from documents, a continuous charcoal background, and the author’s degrees.')
s=s.replace('| Cover options A–C |','| Selected hardcover cover | [KDP wrap](publication/USING_THIS_MATTER_KDP_hardcover_cover.pdf) |\n| Cover studies A–C |')
s=s.replace('The cover-renditions PDF is a review document, not a KDP wrap. The previous full wrap remains in the publication and jacket folders as a prior version until a new option is selected. Do not treat it as the newly selected cover.','The publication and jacket cover PDFs are identical copies of the selected A wrap. The cover-renditions PDF retains the three workshop studies for reference; it is not a KDP upload file.')
s=s.replace('The interior’s file-level preflight passed. KDP Print Previewer and a physical proof remain publication checks after final cover selection.','The interior and selected cover passed file-level preflight. KDP Print Previewer and a physical proof remain publication checks.')
s=s.replace('The latest cover workshop, statement, source notes, and build records are in','The selected cover, updated statement, source notes, and build records are in')
s=s.replace('The statement centers the intellectual sovereignty','The statement explains the website and GitHub repository for general readers and records the Claude Code session, handwritten notes, and rough outline. Its conservative estimate of more than three hundred pages comes from about 95,000 words of pre-book repository text.\n\nThe statement centers the intellectual sovereignty')
p.write_text(s,encoding='utf8')
(REPO/'book/jacket/README.md').write_text('''# Selected hardcover cover

**A · Archive Sculpture**, selected by the author on 20 October 2026.

[The full hardcover wrap](USING_THIS_MATTER_KDP_hardcover_cover.pdf) is identical to the current publication copy. The document-built woman is set on a continuous charcoal background, with the complete head below the title and MA, PhD in the author line.

The wrap is 14.477 × 10.417 inches for the 304-page, 6 × 9-inch KDP premium-color hardcover on white paper. The 0.902-inch spine and case allowances use the previously verified KDP calculator dimensions. Native image resolution is 301 ppi; print transparency is flattened and fonts are embedded.

[Publication notes](../publication/READ_ME_KDP.txt) contain the upload setup. [The gallery](../publication/revision_v6/REVIEW.html) shows the selected wrap, retained workshop studies, and The Hand and the Glass. [Jacket copy](../publication/jacket_and_retailer_copy.txt) contains the description.

The three-page workshop PDF and older jacket PNG files are historical review materials, not KDP upload masters. KDP Print Previewer and a physical proof remain pending.
''',encoding='utf8')
(PUB/'READ_ME_KDP.txt').write_text('''USING THIS MATTER
Jacob E. Thomas, MA, PhD

CURRENT PRINT FILES — 20 October 2026
Interior: USING_THIS_MATTER_KDP_interior_304pp.pdf
Cover: USING_THIS_MATTER_KDP_hardcover_cover.pdf
304 pages / 6 x 9 inches / no interior bleed
Hardcover / premium color / white paper / matte finish recommended

SELECTED COVER: A — ARCHIVE SCULPTURE
Full wrap: 14.477 x 10.417 inches. Spine: 0.902 inch.
The publication and jacket wrap PDFs are identical.
Leave the existing-barcode option unchecked; KDP supplies the ISBN barcode
in the reserved white panel. No ISBN or price has been invented.
The front-cover PDF/JPG is for presentation, not the full-wrap upload.
revision_v6/COVER_RENDITIONS.pdf contains workshop studies; do not upload it.

The Hand and the Glass, on pages v-vi, explains the public website and GitHub
repository, records the Claude Code session with the repository, handwritten
notes and rough outline, and centers the author's human intellectual origins
and directed dialogic use of AI. The conservative page estimate uses the
pre-book snapshot, with its method recorded in sources/corpus_page_estimate.json.
The documentary evidence plates, estate map, narrative and Hale revision
are preserved. The publication and closing pages print both reader URLs.

The interior and selected cover passed local file preflight. KDP Print
Previewer and a physical proof remain pending; no KDP upload was performed.

Open revision_v6/REVIEW.html locally for the selected wrap and author statement.
''',encoding='utf8')
(PUB/'REVIEW.html').write_text('<!doctype html><html lang="en"><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=revision_v6/REVIEW.html"><title>Selected cover and author statement</title><p><a href="revision_v6/REVIEW.html">Open the selected cover and The Hand and the Glass</a></p></html>\n',encoding='utf8')
shutil.copy2(WORK/'corpus_page_estimate.json',OUT/'sources/corpus_page_estimate.json')
for name in ['print_specifications.json','revision_verification.json','corpus_page_estimate.json']:
    shutil.copy2(OUT/'sources'/name,PUB/'sources'/name)
shutil.copy2(OUT/'sources/preflight_v6.py',PUB/'sources/preflight_final.py')
shutil.copy2(__file__,OUT/'sources/finalize_selection.py')
print('Selection notes, gallery source, and repository aliases updated.')
