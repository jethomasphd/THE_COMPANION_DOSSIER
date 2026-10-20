"""Finalize the approved 304-page layout with a surgical Hale transition edit.

Preserves page geometry, original embedded type, and every other page stream.
Requires pypdf. Run: python finalize.py approved.pdf final.pdf
"""
from pathlib import Path
import base64
import hashlib
import json
import re
import sys
import zlib
from functools import lru_cache

from pypdf import PdfReader, PdfWriter
from pypdf.generic import ArrayObject, ByteStringObject, ContentStream, DecodedStreamObject, FloatObject, NameObject

OLD_OPEN = "Hale did not die in October."
NEW_OPEN = "Hale returned to the hospital in October with pneumonia."
OLD_PREFIX = "October made the attempt. Pneumonia, the punctual kind,"
NEW_PREFIX = "It was the punctual kind,"

def compact(s):
    return re.sub(r"\s+", "", s)

def optimize(writer):
    # Lossless: remove ASCII85 transport expansion, compress page streams,
    # and deduplicate objects. Decoded image bytes remain identical.
    for obj in writer._objects:
        if hasattr(obj, "_data"):
            filters = obj.get('/Filter')
            if isinstance(filters, list) and filters and str(filters[0]) == '/ASCII85Decode':
                obj._data = base64.a85decode(obj._data, adobe=True)
                remaining = filters[1:]
                obj[NameObject('/Filter')] = remaining[0] if len(remaining) == 1 else ArrayObject(remaining)
    for page in writer.pages:
        page.compress_content_streams(level=9)
    writer.compress_identical_objects(remove_duplicates=True, remove_unreferenced=True)

def change_hale(page, reader):
    original_text = page.extract_text()
    assert OLD_OPEN in original_text
    # Use the already embedded font and its actual widths, including ligatures.
    font = page['/Resources']['/Font']['/F3'].get_object()
    cmap = font['/ToUnicode'].get_data().decode('ascii')
    cmap = cmap.split('beginbfchar', 1)[1].split('endbfchar', 1)[0]
    codes = {bytes.fromhex(v).decode('utf-16-be'): int(k, 16)
             for k, v in re.findall(r'<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>', cmap)}
    widths = font['/Widths']
    first = int(font['/FirstChar'])
    def encode(s):
        answer=[]
        while s:
            token = next((g for g in ['fi', 'fl'] if s.startswith(g) and g in codes), s[0])
            answer.append(codes[token]);s=s[len(token):]
        return bytes(answer)
    def measure(s):
        return sum(float(widths[b-first]) for b in encode(s))*11/1000
    # Recover the full paragraph independently of incidental PDF line spacing.
    start=original_text.index(OLD_PREFIX.split(',')[0])
    stop=original_text.index('The granddaughter sent word',start)
    old_para=re.sub(r'\s+',' ',original_text[start:stop]).strip()
    assert old_para.startswith(OLD_PREFIX)
    new_para=old_para.replace(OLD_PREFIX,NEW_PREFIX,1)
    lines=[];words=new_para.split();line=''
    for word in words:
        candidate=(line+' '+word).strip()
        width=303.1 if not lines else 320.4
        if line and measure(candidate)>width:
            lines.append(line);line=word
        else:line=candidate
    if line:lines.append(line)
    assert len(lines)==10, f'Expected ten lines, found {len(lines)}: {lines}'
    # Balance the existing ten lines rather than stretching a short penultimate
    # line or leaving a one-word final line.
    words=new_para.split()
    @lru_cache(None)
    def balanced(start,line_index):
        width=303.1 if line_index==0 else 320.4
        if line_index==9:
            last=' '.join(words[start:])
            return (0,[last]) if len(words)-start>=4 and measure(last)<=width else (float('inf'),[])
        best=(float('inf'),[])
        for end in range(start+2,len(words)):
            line=' '.join(words[start:end]);natural=measure(line)
            if natural>width:break
            remainder,tail=balanced(end,line_index+1)
            score=((width-natural)/(end-start-1))**2+remainder
            if score<best[0]:best=(score,[line]+tail)
        return best
    score,lines=balanced(0,0)
    assert len(lines)==10 and score<float('inf')
    assert measure(NEW_OPEN)<320.4
    replacements={round(388.212,3):(NEW_OPEN,False,320.4)}
    for i,line in enumerate(lines):
        replacements[round(372.612-i*15.6,3)]=(line,i<len(lines)-1,303.1 if i==0 else 320.4)
    stream=ContentStream(page.get_contents(),reader)
    new_operations=[];baseline=None;seen=set()
    for args,op in stream.operations:
        if op==b'BT':baseline=None
        if op==b'Td':baseline=round(float(args[1]),3)
        if op in [b'TJ',b'Tj'] and baseline in replacements:
            if baseline not in seen:
                text,justify,width=replacements[baseline]
                if justify:
                    gap=(width-measure(text))/text.count(' ')*1000/11
                    parts=[]
                    for i,word in enumerate(text.split(' ')):
                        if i:parts.extend([ByteStringObject(encode(' ')),FloatObject(-gap)])
                        parts.append(ByteStringObject(encode(word)))
                    new_operations.append(([ArrayObject(parts)],b'TJ'))
                else:new_operations.append(([ByteStringObject(encode(text))],b'Tj'))
                seen.add(baseline)
            continue
        new_operations.append((args,op))
    assert len(seen)==11
    stream.operations=new_operations
    output_stream=DecodedStreamObject()
    output_stream.set_data(stream.get_data())
    page[NameObject('/Contents')]=output_stream
    expected=compact(original_text).replace(compact(OLD_OPEN),compact(NEW_OPEN),1).replace(compact(OLD_PREFIX),compact(NEW_PREFIX),1)
    assert compact(page.extract_text())==expected
    return {'opening_before':OLD_OPEN,'opening_after':NEW_OPEN,'paragraph_before':old_para,'paragraph_after':new_para,'lines':lines}

def finalize(source,target):
    source,target=Path(source),Path(target)
    reader=PdfReader(source)
    matches=[i for i,p in enumerate(reader.pages) if OLD_OPEN in p.extract_text()]
    assert matches==[271],matches
    edit=change_hale(reader.pages[271],reader)
    writer=PdfWriter()
    for p in reader.pages:writer.add_page(p)
    writer.add_metadata({'/Title':'Using This Matter','/Author':'Jacob E. Thomas, MA, PhD',
                         '/Subject':'A Novel of the Companion Estate',
                         '/Keywords':'Final hardcover interior; premium color; 6 x 9 inches; 304 pages'})
    writer.set_page_label(0,15,style='/r');writer.set_page_label(16,303,style='/D',start=1)
    optimize(writer)
    target.parent.mkdir(parents=True,exist_ok=True)
    with target.open('wb') as f:writer.write(f)
    final=PdfReader(target);baseline=PdfReader(source)
    assert len(final.pages)==304
    equal=0
    for i,(a,b) in enumerate(zip(baseline.pages,final.pages)):
        assert tuple(float(v) for v in b.mediabox)==(0,0,432,648)
        if i!=271:
            assert a.get_contents().get_data()==b.get_contents().get_data(),i+1
            equal+=1
    assert compact(NEW_OPEN) in compact(final.pages[271].extract_text())
    edit.update({'pdf_page':272,'printed_page':256,'page_count':304,'other_pages_with_identical_decoded_content_streams':equal,
                 'source_sha256':hashlib.sha256(source.read_bytes()).hexdigest(),
                 'final_sha256':hashlib.sha256(target.read_bytes()).hexdigest(),
                 'final_bytes':target.stat().st_size})
    return edit

if __name__=='__main__':
    assert len(sys.argv)==3,'Usage: python finalize.py approved.pdf final.pdf'
    result=finalize(sys.argv[1],sys.argv[2])
    Path(sys.argv[2]).with_suffix('.edit.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf8')
    print(json.dumps(result,ensure_ascii=False,indent=2))
