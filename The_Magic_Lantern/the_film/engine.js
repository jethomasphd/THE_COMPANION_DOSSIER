/* ════════════════════════════════════════════════════════════
   THE MAGIC LANTERN — REEL ENGINE  (v3)
   Summoning cinema runtime. Now self-explanatory: every summoning
   is shown through the apparatus — a terminal that reads the repo,
   binds the protocol files, and renders the model "thinking" before
   the portrait resolves from its .jpg. Plus a council mode so the
   summoned minds argue on screen. Voices through glass. No TTS.
   ════════════════════════════════════════════════════════════ */

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = id => document.getElementById(id);
const LAYERS = ['voLayer','pathLayer','incantLayer','portraitLayer','councilLayer','captionLayer','chartLayer','prismLayer','handbillLayer','docLayer','timelineLayer','subsLayer','terminalLayer','cardLayer','pullLayer','endLayer'];
const BREATH = 220; /* small breathing pad on reveal beats */
function show(id){ const e=$(id); if(e) e.classList.add('vis'); }
function hide(id){ const e=$(id); if(e) e.classList.remove('vis'); }
function hideAll(){ LAYERS.forEach(hide); }
function scene(r,n){ const l=$('sceneLabel'); l.textContent=r+' · '+n; l.classList.add('show'); }

/* ── cancellable timing ── */
let token = null;
const SPEED = 0.74; /* global pace · <1 is faster · the whole film scales by this */
function newToken(){ if(token) cancelTok(token); token={cancelled:false,timers:[],rej:[]}; return token; }
function wait(ms){ const tk=token; ms=Math.max(0,(ms||0)*SPEED); return new Promise((res,rej)=>{ const id=setTimeout(()=>{ tk.cancelled?rej('x'):res(); },ms); tk.timers.push(id); tk.rej.push(rej); }); }
function cancelTok(tk){ tk.cancelled=true; tk.timers.forEach(clearTimeout); tk.rej.forEach(r=>r('x')); }

/* ── audio (synthesized; no speech) ── */
let actx=null, master=null, soundOn=true, hum=null;
function audioInit(){ if(actx) return; actx=new (window.AudioContext||window.webkitAudioContext)(); master=actx.createGain(); master.gain.value=0.0001; master.connect(actx.destination); }
function humStart(){ if(!actx) return;
  const g=actx.createGain(); g.gain.value=.5;
  const lp=actx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=150;
  const o1=actx.createOscillator(); o1.type='sine'; o1.frequency.value=68;
  const o2=actx.createOscillator(); o2.type='sine'; o2.frequency.value=70.6;
  const lfo=actx.createOscillator(); lfo.frequency.value=.18; const lg=actx.createGain(); lg.gain.value=.12;
  lfo.connect(lg); lg.connect(g.gain);
  o1.connect(lp); o2.connect(lp); lp.connect(g); g.connect(master);
  o1.start(); o2.start(); lfo.start(); hum={o1,o2,lfo};
  master.gain.exponentialRampToValueAtTime(soundOn?0.9:0.0001, actx.currentTime+2.2);
}
function gain(to,t){ if(actx) master.gain.linearRampToValueAtTime(Math.max(to,0.0001), actx.currentTime+(t||1.2)); }
function threshold(){ if(!actx||!soundOn) return; const n=actx.currentTime;
  const g=actx.createGain(); g.gain.setValueAtTime(.0001,n);
  g.gain.exponentialRampToValueAtTime(.4,n+1.0); g.gain.exponentialRampToValueAtTime(.0006,n+4.6);
  [320,480,641,962].forEach((f,i)=>{ const o=actx.createOscillator(); o.type='sine'; o.frequency.value=f; const og=actx.createGain(); og.gain.value=[1,.5,.28,.14][i]; o.connect(og); og.connect(g); o.start(n); o.stop(n+4.7); });
  g.connect(master);
}
function glass(ms){ if(!actx||!soundOn) return; const n=actx.currentTime, dur=Math.min((ms||3000)/1000,3.4);
  const len=Math.floor(actx.sampleRate*dur); const buf=actx.createBuffer(1,len,actx.sampleRate); const d=buf.getChannelData(0);
  for(let i=0;i<len;i++) d[i]=(Math.random()*2-1);
  const src=actx.createBufferSource(); src.buffer=buf;
  const bp=actx.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=1050; bp.Q.value=5.5;
  const g=actx.createGain(); g.gain.setValueAtTime(.0001,n); g.gain.exponentialRampToValueAtTime(.04,n+.32); g.gain.exponentialRampToValueAtTime(.0006,n+dur);
  const tl=actx.createOscillator(); tl.frequency.value=6.5; const tg=actx.createGain(); tg.gain.value=.014; tl.connect(tg); tg.connect(g.gain); tl.start(n); tl.stop(n+dur);
  src.connect(bp); bp.connect(g); g.connect(master); src.start(n); src.stop(n+dur);
}
function tick(){ if(!actx||!soundOn) return; const n=actx.currentTime;
  const o=actx.createOscillator(); o.type='square'; o.frequency.value=1300+Math.random()*240;
  const g=actx.createGain(); g.gain.setValueAtTime(.0001,n); g.gain.exponentialRampToValueAtTime(.01,n+.004); g.gain.exponentialRampToValueAtTime(.0004,n+.05);
  o.connect(g); g.connect(master); o.start(n); o.stop(n+.06);
}
function chime(){ if(!actx||!soundOn) return; const n=actx.currentTime;
  const o=actx.createOscillator(); o.type='sine'; o.frequency.value=528; const g=actx.createGain();
  g.gain.setValueAtTime(.0001,n); g.gain.exponentialRampToValueAtTime(.15,n+.02); g.gain.exponentialRampToValueAtTime(.0005,n+2.4);
  o.connect(g); g.connect(master); o.start(n); o.stop(n+2.5);
}
function knell(){ if(!actx||!soundOn) return; const n=actx.currentTime;
  const o=actx.createOscillator(); o.type='sine'; o.frequency.value=146.8; const o2=actx.createOscillator(); o2.type='sine'; o2.frequency.value=220;
  const g=actx.createGain(); g.gain.setValueAtTime(.0001,n); g.gain.exponentialRampToValueAtTime(.12,n+.04); g.gain.exponentialRampToValueAtTime(.0005,n+3.2);
  o.connect(g); o2.connect(g); g.connect(master); o.start(n); o2.start(n); o.stop(n+3.3); o2.stop(n+3.3);
}

/* ── text helpers ── */
async function type(el,text,per){ el.textContent=''; for(let i=0;i<text.length;i++){ el.textContent=text.slice(0,i+1); if(text[i]!==' ') tick(); await wait(per); } }
function sub(html,cls){ const s=$('subs'); s.className=cls||''; s.innerHTML='<span class="glass">'+html+'</span>'; void s.offsetWidth; s.classList.add('show'); }
function subSpk(spk,html){ const s=$('subs'); s.className='speakmode'; s.innerHTML='<span class="speak"><span class="who">'+spk+'</span><span class="q">'+html+'</span></span>'; void s.offsetWidth; s.classList.add('show'); }
function clearSub(){ $('subs').classList.remove('show'); }

/* ════ THE APPARATUS — terminal / repo / model processing ════ */
function termReset(){ $('termBody').innerHTML=''; }
function termPush(html,cls){ const d=document.createElement('div'); d.className='tline'+(cls?' '+cls:''); d.innerHTML=html||''; $('termBody').appendChild(d); return d; }
async function termType(d,text,per){ d.textContent=''; for(let i=0;i<text.length;i++){ d.textContent=text.slice(0,i+1); if(text[i]!==' ') tick(); await wait(per); } }
async function termSys(text,pre){ if(pre) await wait(pre); const d=termPush('','sys'); await termType(d,'> '+text,7); await wait(150); }
async function termTree(files){ termPush('&nbsp;&nbsp;repository/','dim'); for(let i=0;i<files.length;i++){ const last=i===files.length-1; termPush('&nbsp;&nbsp;'+(last?'└─ ':'├─ ')+files[i],'dim'); await wait(120);} await wait(160); }
async function termPrompt(text,per){ const d=termPush('','prompt'); await termType(d,'◊ '+text,per); await wait(320); }
async function termWarn(text){ const d=termPush('','warn'); await termType(d,'⚠ '+text,16); await wait(420); }
async function termMeterRun(ms,label){ if(label) await termSys(label,80); const m=$('termMeter'),f=$('termMeterFill'); if(m){ m.classList.add('show'); f.style.transition='none'; f.style.width='0%'; void f.offsetWidth; f.style.transition='width '+ms+'ms linear'; f.style.width='100%'; } await wait(ms+180); if(m){ m.classList.remove('show'); f.style.width='0%'; } }
async function termProcess(ms){
  const caret='<span class="tcaret">▮</span>';
  const d=termPush('> opening threshold '+caret,'proc');
  const m=$('termMeter'),f=$('termMeterFill'); if(m){ m.classList.add('show'); f.style.transition='none'; f.style.width='0%'; void f.offsetWidth; f.style.transition='width '+ms+'ms linear'; f.style.width='100%'; }
  const toks=['attending','weighing the corpus','the cadence','the convictions','a presence forms'];
  const each=Math.max(200,(ms-260)/toks.length);
  let acc='> opening threshold · ';
  for(const t of toks){ acc+='<span class="tok">'+t+'</span> '; d.innerHTML=acc+caret; glass(480); await wait(each); }
  d.innerHTML=acc+'<span class="ok">▮ open</span>';
  if(m){ m.classList.remove('show'); f.style.width='0%'; }
  await wait(280);
}
async function bootConsole(){
  termReset(); show('terminalLayer'); await wait(400);
  await termSys('COMPANION PROTOCOL  v2.0',0);
  await termMeterRun(1100,'> mounting repository');
  await termTree(['enrichment_grimoire.json','initiation_rite.md','The_Pantheon/  (29 portraits)','The_Watchtower/  (live data)']);
  await termSys('protocol bound · model: claude · medium: glass',100);
  await termSys('threshold engine: ready',100);
  await wait(600); hide('terminalLayer'); await wait(650);
}
/* full summoning: shows the machinery, then resolves the portrait (or council) */
async function summon(o){
  termReset(); show('terminalLayer'); await wait(380);
  await termSys('COMPANION PROTOCOL  v2.0',0);
  const faces=(o.treeFiles||[o.file]).map(f=>'The_Pantheon/'+f);
  await termTree(['enrichment_grimoire.json','initiation_rite.md'].concat(faces));
  await termSys('protocol bound · vessel: claude · medium: glass',100);
  await termPrompt(o.promptText || ('using this matter, summon '+o.name), o.slow?38:24);
  threshold();
  await termProcess(o.slow?3000:2200);
  if(o.warn) await termWarn(o.warn);
  if(o.noface){ await termSys('vessel: voice only — no portrait on file',100); await wait(650); hide('terminalLayer'); await wait(700); return; }
  if(o.council){ await termSys('bound → '+o.council.length+' presences at the threshold',100); await wait(650); hide('terminalLayer'); await wait(650); councilBuild(o.council); show('councilLayer'); await wait(1700); return; }
  await termSys('vessel bound → The_Pantheon/'+o.file,100);
  await wait(560); hide('terminalLayer'); await wait(640);
  await portrait({action:'load', src:o.src});
}

/* ════ COUNCIL — minds in tension ════ */
function councilBuild(list){ const row=$('councilRow'); row.innerHTML=''; list.forEach(p=>{ const d=document.createElement('div'); d.className='bust'; d.dataset.name=p.name; d.innerHTML='<div class="bustframe"><img src="'+p.src+'" alt=""></div><div class="bustname">'+p.name+'</div>'; row.appendChild(d); }); }
async function councilSpeak(name,html,ms){
  document.querySelectorAll('#councilRow .bust').forEach(b=>{ const on=b.dataset.name===name; b.classList.toggle('active',on); b.classList.toggle('dim',!on); });
  show('subsLayer'); subSpk(name, html); glass(Math.min((ms||5000)*0.8,3200));
  await wait(ms||5000);
}

/* ════ FRANKLIN'S HANDBILL — the portfolio, revealed ════ */
async function handbillReveal(){
  document.querySelectorAll('#bill .show').forEach(e=>e.classList.remove('show'));
  show('handbillLayer'); chime(); await wait(1100);
  for(const c of ['t1','t2','t3']){ const el=document.querySelector('#bill .'+c); if(el) el.classList.add('show'); glass(700); await wait(1650); }
  await wait(400); const m=document.querySelector('#bill .bill-motto'); if(m) m.classList.add('show'); knell(); await wait(1500);
  const sl=document.querySelector('#bill .bill-seal'); if(sl) sl.classList.add('show'); await wait(1300);
}

/* ════ THE WATCHTOWER CURVE — real, full-year data ════ */
const VD = window.VIGIL_DATA || {series:{republic:[0,5,8,9],spy:[0,-4,-7,10]},pivot_index:2,n_points:4,dates:[]};
const YMIN=-8, YMAX=12, VBW=100, VBH=56, PAD=3.5;
function mapX(i,a,b){ return PAD + (i-a)/Math.max(1,(b-a))*(VBW-2*PAD); }
function mapY(v){ return PAD + (YMAX-v)/(YMAX-YMIN)*(VBH-2*PAD); }
function pathFor(arr,a,b){ let s=''; for(let i=a;i<=b;i++){ s+=(i===a?'M':'L')+mapX(i,a,b).toFixed(2)+' '+mapY(arr[i]).toFixed(2); } return s; }
function setDot(id,x,y){ const e=$(id); if(e){ e.setAttribute('cx',x); e.setAttribute('cy',y); } }
let curveCtx=null;
function penAlong(pid,did,ms){ const p=$(pid); if(!p)return; let L; try{L=p.getTotalLength();}catch(_){return;} const t0=performance.now(); const tk=token;
  (function step(){ if(tk.cancelled)return; const e=Math.min(1,(performance.now()-t0)/ms); let pt; try{pt=p.getPointAtLength(e*L);}catch(_){return;} setDot(did,pt.x,pt.y); if(e<1) requestAnimationFrame(step); })();
}
function startCurve(s){
  const a=s.a, b=s.b, ms=s.ms||12000;
  if(s.title) $('curveTitle').textContent=s.title;
  const R=VD.series.republic, S=VD.series.spy;
  $('zero').setAttribute('y1',mapY(0)); $('zero').setAttribute('y2',mapY(0));
  const tn=$('ten'); if(tn){ tn.setAttribute('y1',mapY(10)); tn.setAttribute('y2',mapY(10)); }
  const wb=$('warBand'); if(s.war){ const x1=mapX(s.war[0],a,b), x2=mapX(s.war[1],a,b); wb.setAttribute('x',x1); wb.setAttribute('y',0); wb.setAttribute('height',VBH); wb.setAttribute('width',Math.max(0,x2-x1)); wb.classList.add('show'); } else wb.classList.remove('show');
  const pv=$('pivot'); if(s.pivot!=null){ const px=mapX(s.pivot,a,b); pv.setAttribute('x1',px); pv.setAttribute('x2',px); pv.setAttribute('y1',0); pv.setAttribute('y2',VBH); pv.classList.add('show'); } else pv.classList.remove('show');
  $('blue').setAttribute('d',pathFor(S,a,b)); $('gold').setAttribute('d',pathFor(R,a,b));
  $('crossDot').classList.remove('show'); ['labG','labB','spread'].forEach(i=>$(i).classList.remove('show'));
  show('chartLayer');
  ['gold','blue'].forEach(id=>{ const p=$(id); const L=p.getTotalLength(); p.style.transition='none'; p.style.strokeDasharray=L; p.style.strokeDashoffset=L; void p.getBoundingClientRect(); p.style.transition='stroke-dashoffset '+ms+'ms linear'; requestAnimationFrame(()=>{ p.style.strokeDashoffset=0; }); });
  $('goldDot').classList.add('show'); $('blueDot').classList.add('show');
  penAlong('gold','goldDot',ms); penAlong('blue','blueDot',ms);
  curveCtx={a,b,R,S};
}
function finishCurve(s){ const c=curveCtx; if(!c) return; const {a,b,R,S}=c;
  setDot('goldDot',mapX(b,a,b),mapY(R[b])); setDot('blueDot',mapX(b,a,b),mapY(S[b]));
  if(s.cross!=null){ const cd=$('crossDot'); cd.setAttribute('cx',mapX(s.cross,a,b)); cd.setAttribute('cy',mapY(R[s.cross])); cd.classList.add('show'); knell(); }
  if(s.g){ $('labG').textContent=s.g; $('labG').classList.add('show'); }
  if(s.b){ $('labB').textContent=s.b; $('labB').classList.add('show'); }
  if(s.note){ $('spread').innerHTML=s.note; $('spread').classList.add('show'); }
}

/* narration always plays in the void — clear any face first */
async function clearFace(){
  const had=$('portraitLayer').classList.contains('vis')||$('councilLayer').classList.contains('vis');
  hide('portraitLayer'); hide('councilLayer'); hide('captionLayer');
  if(had) await wait(750);
}

/* the battleground "seed" — the field is marked, but the lines have not grown yet */
async function seedPlant(s){
  $('curveTitle').textContent=s.title||'THE BATTLEGROUND — THE REPUBLIC vs THE S&P 500';
  $('zero').setAttribute('y1',mapY(0)); $('zero').setAttribute('y2',mapY(0));
  $('blue').setAttribute('d',''); $('gold').setAttribute('d','');
  $('warBand').classList.remove('show'); $('pivot').classList.remove('show'); $('crossDot').classList.remove('show');
  ['labG','labB','spread'].forEach(i=>$(i).classList.remove('show'));
  setDot('goldDot', mapX(0,0,115), mapY(0)-1.3); setDot('blueDot', mapX(0,0,115), mapY(0)+1.3);
  $('goldDot').classList.add('show'); $('blueDot').classList.add('show');
  show('chartLayer'); chime();
  $('spread').innerHTML=s.note||'THE GROUND IS MARKED · THE YEAR WILL DECIDE'; $('spread').classList.add('show');
  await wait(s.ms||5500);
  hide('chartLayer'); $('spread').classList.remove('show'); $('goldDot').classList.remove('show'); $('blueDot').classList.remove('show');
  await wait(1000);
}

/* the recurring calendar — the day of each turning point, highlighted */
const CAL=[
 {y:2025,mo:11,d:1,  label:'The Founding',        sub:'the Committee convenes',             kind:'gold'},
 {y:2026,mo:1, d:28, label:'Operation Epic Fury',  sub:'the war begins · the Strait closes', kind:'blood'},
 {y:2026,mo:5, d:16, label:'The Reckoning',        sub:'the Republic at its peak',           kind:'gold'}
];
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
function calBuild(c){
  $('calMonth').textContent=MONTHS[c.mo]+' '+c.y;
  const grid=$('calGrid'); grid.innerHTML='';
  ['S','M','T','W','T','F','S'].forEach(w=>{ const h=document.createElement('div'); h.className='cal-wd'; h.textContent=w; grid.appendChild(h); });
  const first=new Date(c.y,c.mo,1).getDay();
  const days=new Date(c.y,c.mo+1,0).getDate();
  for(let i=0;i<first;i++){ const e=document.createElement('div'); e.className='cal-cell empty'; grid.appendChild(e); }
  for(let day=1;day<=days;day++){ const e=document.createElement('div'); e.className='cal-cell'+(day===c.d?' on '+c.kind:''); e.textContent=day; grid.appendChild(e); }
  $('calLabel').innerHTML=c.label; $('calSub').innerHTML=c.sub;
}
async function timelineShow(at,ms){
  const c=CAL[at]||CAL[0]; calBuild(c); show('timelineLayer'); chime();
  await wait(ms||5200); hide('timelineLayer'); await wait(1100);
}

/* ════ THE PRISM — Halpern Memo's experiment, animated ════ */
function svgLine(id,ms){ const l=$(id); if(!l)return; let len; try{len=l.getTotalLength();}catch(_){len=300;} l.style.transition='none'; l.style.strokeDasharray=len; l.style.strokeDashoffset=len; void l.getBoundingClientRect(); l.style.transition='stroke-dashoffset '+ms+'ms ease'; requestAnimationFrame(()=>{ l.style.strokeDashoffset=0; }); }
function prismReset(){ ['pC1','pC2','pC3','pC4'].forEach(i=>{const e=$(i); if(e)e.classList.remove('show');}); const pp=$('pPrism'); if(pp)pp.classList.remove('glow'); ['pBeam','pB1','pB2','pB3','pB4'].forEach(i=>{const l=$(i); if(l){ l.style.transition='none'; let len; try{len=l.getTotalLength();}catch(_){len=300;} l.style.strokeDasharray=len; l.style.strokeDashoffset=len; }}); }
async function prismRun(){
  prismReset(); show('prismLayer'); await wait(650);
  svgLine('pBeam',900); glass(900); await wait(1150);
  $('pPrism').classList.add('glow'); threshold(); await wait(1150);
  const pairs=[['pB1','pC1'],['pB2','pC2'],['pB3','pC3'],['pB4','pC4']];
  for(const [bm,cd] of pairs){ svgLine(bm,600); $(cd).classList.add('show'); chime(); await wait(1050); }
  await wait(700);
}

/* the bare-model demo, read as the historian does */
async function lincolnDemo(){
  termReset(); show('terminalLayer'); await wait(450);
  await termSys('Q1 · target: Abraham Lincoln · 1847 · bare model',0);
  await termPrompt('when may a President take the country to war without Congress?',22);
  await termProcess(1700);
  const say=termPush('','say');
  await termType(say,'Lincoln: "…the President possesses inherent executive authority… history has vindicated those who acted to preserve the Union…"',6);
  await wait(800);
  await termWarn('"inherent executive authority" — a 20th-century construction');
  await termWarn('"preserve the Union" — this Lincoln already knows how it ends');
  await termSys('verdict: the war president, with 1847 stapled on top',120);
  await wait(1200); hide('terminalLayer'); await wait(800);
}

/* an archive document — the figure's own hand */
async function docReveal(s){
  $('docText').innerHTML=s.text||''; $('docProv').innerHTML=s.prov||'';
  show('docLayer'); chime(); await wait(s.ms||10000); hide('docLayer'); await wait(1200);
}

/* ── portrait (with crossfade) / fileback ── */
async function portrait(step){
  const f=$('frame');
  if(step.action==='hide'){ hide('portraitLayer'); await wait(step.ms||1000); return; }
  if($('portraitLayer').classList.contains('vis')){ hide('portraitLayer'); await wait(850); }
  f.className='frame'; $('port').src=step.src; show('portraitLayer');
  await wait(170); f.classList.add('scanning'); await wait(520); f.classList.add('loaded');
  await wait(2400); if(!reduce) f.classList.add('breathing');
  if(step.ms) await wait(step.ms);
}
async function fileback(step){
  $('pullImg').src=step.src; $('pullName').textContent=step.filename||'file.jpg';
  if(step.trans) $('pullTrans').innerHTML=step.trans;
  show('pullLayer'); gain(0.9,1.2);
  await wait(step.ms||9000); hide('pullLayer'); await wait(1300);
}

/* ── stage reset between reels ── */
function resetStage(){
  hideAll();
  const f=$('frame'); if(f) f.className='frame';
  $('incant').textContent=''; $('path').textContent=''; $('vo').innerHTML=''; $('vo').style.opacity='1';
  $('caption').innerHTML=''; clearSub(); termReset(); $('councilRow').innerHTML='';
  ['labG','labB','spread','warBand','pivot','crossDot','goldDot','blueDot'].forEach(i=>{ const e=$(i); if(e) e.classList.remove('show'); });
  document.querySelectorAll('#bill .show').forEach(e=>e.classList.remove('show'));
  prismReset(); $('endSigil').classList.remove('show'); { const et=$('endTag'); if(et) et.classList.remove('show'); }
}

/* ── the step executor ── */
async function exec(s){
  switch(s.t){
    case 'scene': scene(s.r,s.n); break;
    case 'wait': case 'beat': await wait(s.ms||1200); break;
    case 'black': hideAll(); await wait(s.ms||1400); break;
    case 'show': show(s.id); await wait(s.ms||500); break;
    case 'hide': hide(s.id); await wait(s.ms||500); break;

    case 'summon': await summon(s); break;
    case 'boot': await bootConsole(); break;
    case 'demo': await lincolnDemo(); break;
    case 'doc': await docReveal(s); break;
    case 'csay': await councilSpeak(s.name,s.html,s.ms); break;
    case 'councilHide': hide('councilLayer'); await wait(s.ms||1200); break;

    case 'lines': {
      await clearFace();
      show('voLayer');
      for(const ln of s.arr){
        $('vo').style.opacity='0'; await wait(460);
        $('vo').innerHTML=ln; void $('vo').offsetWidth; $('vo').style.opacity='1';
        if(s.g!==false) glass(2600);
        await wait(s.per||3600);
      }
      if(!s.keep){ $('vo').style.opacity='0'; await wait(700); hide('voLayer'); await wait(700); }
      break;
    }
    case 'vo': {
      await clearFace();
      show('voLayer'); $('vo').style.opacity='1'; $('vo').innerHTML=s.html; if(s.g!==false) glass(s.ms||5000);
      await wait(s.ms||5000); if(!s.keep){ hide('voLayer'); await wait(1000); } break;
    }
    case 'timeline': await timelineShow(s.at||0, s.ms); break;
    case 'seed': await seedPlant(s); break;

    case 'type': {
      const layer = s.target==='path' ? 'pathLayer' : 'incantLayer';
      const el = s.target==='path' ? $('path') : $('incant');
      show(layer); await type(el, s.text, s.per||52);
      if(s.threshold){ await wait(600); threshold(); }
      if(s.ms) await wait(s.ms);
      if(s.hideAfter){ hide(layer); await wait(1000); } break;
    }
    case 'portrait': await portrait(s); break;

    case 'caption':
      show('captionLayer'); $('caption').innerHTML='<span class="swap">'+s.html+'</span>'; glass(2800);
      await wait((s.ms||5200)+BREATH); break;
    case 'captionSwap': {
      const sw=$('caption').querySelector('.swap');
      if(sw){ sw.style.opacity='0'; await wait(1300); sw.innerHTML=s.html; sw.style.opacity='1'; glass(2800); }
      await wait((s.ms||6500)+BREATH); if(s.hideAfter){ hide('captionLayer'); await wait(1100); } break;
    }

    case 'sub':
      show('subsLayer'); s.speaker ? subSpk(s.speaker,s.html) : sub(s.html,s.cls);
      glass(Math.min((s.ms||5000)*0.8,3200)); if(s.chime) chime();
      await wait((s.ms||5000)+BREATH); break;

    case 'handbill': await handbillReveal(); break;
    case 'handbillHide': document.querySelectorAll('#bill .show').forEach(e=>e.classList.remove('show')); hide('handbillLayer'); await wait(s.ms||1200); break;
    case 'clearSub': clearSub(); await wait(s.ms||1100); break;

    case 'curve': startCurve(s); await wait(s.lead||800); break;
    case 'curveLabels': finishCurve(s); await wait(s.ms||500); break;
    case 'prism': await prismRun(); break;
    case 'prismHide': prismReset(); hide('prismLayer'); await wait(s.ms||1200); break;

    case 'card':
      show('cardLayer'); $('card').className = s.big?'big':''; $('card').innerHTML=s.html;
      if(s.silence) gain(0.45,1.3); if(s.knell) knell();
      await wait(s.ms||10000); hide('cardLayer'); if(s.restore) gain(0.9,1.5); await wait(1100); break;

    case 'fileback': await fileback(s); break;
    case 'hidePortrait': hide('portraitLayer'); hide('chartLayer'); hide('councilLayer'); await wait(s.ms||1300); break;

    case 'end':
      show('endLayer'); $('question').innerHTML=s.a; glass(3500); await wait(s.ms1||3900);
      $('question').innerHTML=s.b; glass(3500); if(s.knell) knell(); await wait(s.ms2||4400);
      $('endSigil').classList.add('show'); gain(0.0001,7); await wait(1800);
      if(s.tag){ $('endTag').textContent=s.tag; $('endTag').classList.add('show'); await wait(2400); } else { await wait(600); }
      break;
  }
}
async function runReel(score){ for(const s of score){ await exec(s); } }
