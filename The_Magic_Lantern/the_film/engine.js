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
const LAYERS = ['voLayer','pathLayer','incantLayer','portraitLayer','councilLayer','captionLayer','chartLayer','subsLayer','terminalLayer','cardLayer','pullLayer','endLayer'];
function show(id){ const e=$(id); if(e) e.classList.add('vis'); }
function hide(id){ const e=$(id); if(e) e.classList.remove('vis'); }
function hideAll(){ LAYERS.forEach(hide); }
function scene(r,n){ const l=$('sceneLabel'); l.textContent=r+' · '+n; l.classList.add('show'); }

/* ── cancellable timing ── */
let token = null;
function newToken(){ if(token) cancelTok(token); token={cancelled:false,timers:[],rej:[]}; return token; }
function wait(ms){ const tk=token; return new Promise((res,rej)=>{ const id=setTimeout(()=>{ tk.cancelled?rej('x'):res(); },ms); tk.timers.push(id); tk.rej.push(rej); }); }
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
function subSpk(spk,html){ const s=$('subs'); s.className=''; s.innerHTML='<span class="speaker">'+spk+'</span><span class="glass">'+html+'</span>'; void s.offsetWidth; s.classList.add('show'); }
function clearSub(){ $('subs').classList.remove('show'); }

/* ════ THE APPARATUS — terminal / repo / model processing ════ */
function termReset(){ $('termBody').innerHTML=''; }
function termPush(html,cls){ const d=document.createElement('div'); d.className='tline'+(cls?' '+cls:''); d.innerHTML=html||''; $('termBody').appendChild(d); return d; }
async function termType(d,text,per){ d.textContent=''; for(let i=0;i<text.length;i++){ d.textContent=text.slice(0,i+1); if(text[i]!==' ') tick(); await wait(per); } }
async function termSys(text,pre){ if(pre) await wait(pre); const d=termPush('','sys'); await termType(d,'> '+text,13); await wait(200); }
async function termTree(files){ termPush('&nbsp;&nbsp;repository/','dim'); for(let i=0;i<files.length;i++){ const last=i===files.length-1; termPush('&nbsp;&nbsp;'+(last?'└─ ':'├─ ')+files[i],'dim'); await wait(240);} await wait(280); }
async function termPrompt(text,per){ const d=termPush('','prompt'); await termType(d,'◊ '+text,per); await wait(320); }
async function termWarn(text){ const d=termPush('','warn'); await termType(d,'⚠ '+text,16); await wait(420); }
async function termProcess(ms){
  const caret='<span class="tcaret">▮</span>';
  const d=termPush('> summoning '+caret,'proc');
  const toks=['attending…','the voice','the worldview','the contradictions','the century behind the eyes','the threshold thins','a presence forms'];
  const each=Math.max(360,(ms-700)/toks.length);
  let acc='> summoning ';
  for(const t of toks){ acc+='<span class="tok">'+t+'</span> '; d.innerHTML=acc+caret; glass(680); await wait(each); }
  d.innerHTML=acc+'<span class="ok">▮ threshold open</span>';
  await wait(520);
}
/* full summoning: shows the machinery, then resolves the portrait (or council) */
async function summon(o){
  termReset(); show('terminalLayer'); await wait(560);
  await termSys('COMPANION PROTOCOL  v2.0',0);
  await termSys('reading repository…',180);
  const faces=(o.treeFiles||[o.file]).map(f=>'The_Pantheon/'+f);
  await termTree(['enrichment_grimoire.json','initiation_rite.md'].concat(faces));
  await termSys('bind enrichment_grimoire.json   ✓',150);
  await termSys('bind initiation_rite.md         ✓',150);
  await wait(240);
  await termPrompt(o.promptText || ('using this matter, summon '+o.name), o.slow?54:32);
  threshold();
  await termProcess(o.slow?5200:3800);
  if(o.warn) await termWarn(o.warn);
  if(o.noface){ await termSys('vessel: voice only — no portrait on file',150); await wait(1000); hide('terminalLayer'); await wait(800); return; }
  if(o.council){ await termSys('bound → '+o.council.length+' presences at the threshold',150); await wait(900); hide('terminalLayer'); await wait(750); councilBuild(o.council); show('councilLayer'); await wait(1500); return; }
  await termSys('vessel bound → The_Pantheon/'+o.file,150);
  await wait(820); hide('terminalLayer'); await wait(720);
  await portrait({action:'load', src:o.src});
}

/* ════ COUNCIL — minds in tension ════ */
function councilBuild(list){ const row=$('councilRow'); row.innerHTML=''; list.forEach(p=>{ const d=document.createElement('div'); d.className='bust'; d.dataset.name=p.name; d.innerHTML='<div class="bustframe"><img src="'+p.src+'" alt=""></div><div class="bustname">'+p.name+'</div>'; row.appendChild(d); }); }
async function councilSpeak(name,html,ms){
  document.querySelectorAll('#councilRow .bust').forEach(b=>{ const on=b.dataset.name===name; b.classList.toggle('active',on); b.classList.toggle('dim',!on); });
  show('subsLayer'); subSpk(name+' — through glass', html); glass(Math.min((ms||5000)*0.8,3200));
  await wait(ms||5000);
}

/* ── the Watchtower line (real Q1 data) ── */
const REP=[2.95,4.18,4.31,5.43,7.21,7.88,7.82,8.50,5.74,3.82,2.90,3.40];
const SPY=[1.40,1.24,1.10,1.45,1.70,-0.14,0.63,2.08,-1.58,-3.18,-4.03,-6.98];
function buildPaths(){
  const W=100,H=50,p=4,ymin=-8,ymax=9;
  const X=i=>p+i/(REP.length-1)*(W-2*p);
  const Y=v=>(H-p)-(v-ymin)/(ymax-ymin)*(H-2*p);
  $('zero').setAttribute('y1',Y(0)); $('zero').setAttribute('y2',Y(0));
  const d=a=>a.map((v,i)=>(i?'L':'M')+X(i).toFixed(2)+' '+Y(v).toFixed(2)).join(' ');
  $('gold').setAttribute('d',d(REP)); $('blue').setAttribute('d',d(SPY));
}
function drawChart(ms){
  buildPaths();
  ['gold','blue'].forEach(id=>{ const pth=$(id); const L=pth.getTotalLength();
    pth.style.transition='none'; pth.style.strokeDasharray=L; pth.style.strokeDashoffset=L; void pth.getBoundingClientRect();
    pth.style.transition='stroke-dashoffset '+(ms||16000)+'ms linear'; requestAnimationFrame(()=>{ pth.style.strokeDashoffset=0; }); });
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
  ['labG','labB','spread'].forEach(i=>{ const e=$(i); if(e) e.classList.remove('show'); });
  $('endSigil').classList.remove('show');
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
    case 'csay': await councilSpeak(s.name,s.html,s.ms); break;
    case 'councilHide': hide('councilLayer'); await wait(s.ms||1200); break;

    case 'lines': {
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
    case 'vo':
      show('voLayer'); $('vo').style.opacity='1'; $('vo').innerHTML=s.html; if(s.g!==false) glass(s.ms||5000);
      await wait(s.ms||5000); if(!s.keep){ hide('voLayer'); await wait(1000); } break;

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
      await wait(s.ms||5200); break;
    case 'captionSwap': {
      const sw=$('caption').querySelector('.swap');
      if(sw){ sw.style.opacity='0'; await wait(1000); sw.innerHTML=s.html; sw.style.opacity='1'; glass(2800); }
      await wait(s.ms||6500); if(s.hideAfter){ hide('captionLayer'); await wait(1000); } break;
    }

    case 'sub':
      show('subsLayer'); s.speaker ? subSpk(s.speaker,s.html) : sub(s.html,s.cls);
      glass(Math.min((s.ms||5000)*0.8,3200)); if(s.chime) chime();
      await wait(s.ms||5000); break;
    case 'clearSub': clearSub(); await wait(s.ms||1100); break;

    case 'chart': show('chartLayer'); drawChart(s.ms||16000); break;
    case 'chartPeak': ['labG','labB','spread'].forEach(i=>$(i).classList.add('show')); chime(); await wait(s.ms||400); break;

    case 'card':
      show('cardLayer'); $('card').className = s.big?'big':''; $('card').innerHTML=s.html;
      if(s.silence) gain(0.45,1.3); if(s.knell) knell();
      await wait(s.ms||10000); hide('cardLayer'); if(s.restore) gain(0.9,1.5); await wait(1100); break;

    case 'fileback': await fileback(s); break;
    case 'hidePortrait': hide('portraitLayer'); hide('chartLayer'); hide('councilLayer'); await wait(s.ms||1300); break;

    case 'end':
      show('endLayer'); $('question').innerHTML=s.a; glass(3500); await wait(s.ms1||3900);
      $('question').innerHTML=s.b; glass(3500); if(s.knell) knell(); await wait(s.ms2||4400);
      $('endSigil').classList.add('show'); gain(0.0001,7); await wait(2400); break;
  }
}
async function runReel(score){ for(const s of score){ await exec(s); } }
