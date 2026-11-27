#!/usr/bin/env node
/*
  Copy the recorded timeline (book/assets/posts/memo-014.json, written by
  make_memo_014.py) into the audio post in book/evidence.js, so the site's
  transcript highlights each phrase exactly when it is spoken.

      node book/campaign/audio/apply_memo_014.js
*/
const fs = require("fs");
const path = require("path");
const BOOK = path.resolve(__dirname, "..", "..");
const tl = JSON.parse(fs.readFileSync(path.join(BOOK, "assets/posts/memo-014.json"), "utf8"));

// The recording's structure, in order (mirrors SCRIPT in make_memo_014.py).
const SHAPE = [
  {cue: "[continuous hum, low, steady]"},
  {n: 6},
  {cue: "[hum]"},
  {n: 3},
  {cue: "[a car passes. the hum does not change.]"},
  {n: 3, exhaleAfter: 0},          // "[exhales]" sits between the 1st and 2nd phrase of this line
];
const r2 = x => Math.round(x * 100) / 100;
let li = 0, pi = 0;
const memo = SHAPE.map(s => {
  const [a, b] = tl.lines[li++];
  if (s.cue) return {cue: s.cue, a, b};
  const parts = [];
  for (let k = 0; k < s.n; k++) {
    const ph = tl.phrases[pi++];
    parts.push({t: ph.text, a: ph.start, b: ph.end});
    if (s.exhaleAfter === k) parts.push({t: "[exhales]", cue: true, a: r2(ph.end + 0.05), b: r2(tl.phrases[pi].start - 0.1)});
  }
  return {a, b, parts};
});
const body = memo.map(L => L.cue || L.parts.map(q => q.t).join(" ")).join("\n");

const file = path.join(BOOK, "evidence.js");
const src = fs.readFileSync(file, "utf8");
const w = {}; new Function("window", src)(w);
const post = w.RECOVERED_POSTS.find(p => p.id === "vm-hum");
Object.assign(post, {audio: "assets/posts/memo-014.m4a", total: tl.total, tl: tl.lines, memo, body});
const head = src.slice(0, src.indexOf("window.RECOVERED_POSTS"));
const tail = src.match(/\/\* Quote cards[\s\S]*$/)[0];
fs.writeFileSync(file, head + "window.RECOVERED_POSTS = " + JSON.stringify(w.RECOVERED_POSTS, null, 2) + ";\n\n" + tail);
console.log(`vm-hum updated: ${tl.total}s, ${tl.phrases.length} phrases`);
console.log(body);
