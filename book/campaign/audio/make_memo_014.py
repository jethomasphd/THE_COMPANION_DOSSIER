#!/usr/bin/env python3
"""
Voice memo 014 — "recorded this from the road at 2am."

Builds the audio post that appears in the website feed and the campaign:
a neighbor stands on the county road at 2 a.m., holds her phone up toward the
Thorne house, and talks quietly while the garage hums.

    pip install piper-tts numpy faster-whisper     # faster-whisper only for --verify
    python book/campaign/audio/make_memo_014.py --verify

Speech: Piper neural TTS (open source, runs locally), voice en_US-libritts_r-medium,
one speaker out of 904 LibriTTS-R audiobook readers (dataset CC BY 4.0,
openslr.org/141). Each phrase is synthesized separately with its own pacing, then
made hushed (breath blended into the voice, softer high end, a small tremor) and
placed into a scene: a phone held close to the mouth outdoors, the garage hum
behind it, night air and crickets, a passing car, wind on the mic, footsteps on
caliche and a screen door. The phone's automatic gain control is emulated so the
hum rises in the pauses, the way real voice memos do.

Outputs (book/assets/posts/):
    memo-014.m4a    the recording (AAC, mono)
    memo-014.json   timeline: transcript lines and phrases with start/end seconds
--verify transcribes the finished mix with Whisper and prints the word error rate
per spoken line, so intelligibility is measured rather than assumed.
"""
from __future__ import annotations

import argparse, json, re, subprocess, sys, urllib.request, wave
from pathlib import Path

import numpy as np

BOOK = Path(__file__).resolve().parents[2]
OUT = BOOK / "assets" / "posts"
SR = 44100
HF = "https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/libritts_r/medium/"
MODEL = "en_US-libritts_r-medium"

# ── the script ────────────────────────────────────────────────────────────────
# Transcript lines exactly as shown on the site. Spoken lines are split into
# phrases; "say" is what the engine reads (spelling tuned for pronunciation).
# pause = silence after the phrase. turn = how far she has turned toward the house
# (0 = into the phone, 1 = away from it). effort scales loudness of the phrase.
SCRIPT = [
    {"line": "[continuous hum, low, steady]", "cue": 2.9},
    {"line": "…okay. you hear that? that’s his garage. the guy who built the AI. it’s two in the morning and it’s the exact same note it was at noon.",
     "phrases": [
         {"text": "…okay.", "say": "okay.", "pause": 0.95, "len": 1.25, "effort": 0.8},
         {"text": "you hear that?", "say": "you hear that?", "pause": 1.45, "len": 1.15, "effort": 0.9},
         {"text": "that’s his garage.", "say": "that's his garage.", "pause": 0.42, "len": 1.12},
         {"text": "the guy who built the AI.", "say": "the guy who built the A.I.", "pause": 0.95, "len": 1.15},
         {"text": "it’s two in the morning", "say": "it's two in the morning,", "pause": 0.22, "len": 1.14},
         {"text": "and it’s the exact same note it was at noon.", "say": "and it's the exact same note it was at noon.", "pause": 0.2, "len": 1.08},
     ]},
    {"line": "[hum]", "cue": 2.5},
    {"line": "every window’s blacked out, but there’s a line of orange around that one. like there’s a lamp on in there.",
     "phrases": [
         {"text": "every window’s blacked out,", "say": "every window's blacked out,", "pause": 0.3, "len": 1.12, "turn": 0.1},
         {"text": "but there’s a line of orange around that one.", "say": "but there's a line of orange around that one.", "pause": 0.75, "len": 1.12, "turn": 0.3},
         {"text": "like there’s a lamp on in there.", "say": "like there's a lamp on in there.", "pause": 0.2, "len": 1.18, "turn": 0.4, "effort": 0.9},
     ]},
    {"line": "[a car passes. the hum does not change.]", "cue": 4.8, "car": True},
    {"line": "nobody’s seen him since — [exhales] …okay. I’m going back inside.",
     "phrases": [
         {"text": "nobody’s seen him since —", "say": "nobody's seen him since,", "pause": 0.05, "len": 1.12, "cut": True},
         {"exhale": 1.05},
         {"text": "…okay.", "say": "okay.", "pause": 0.62, "len": 1.3, "effort": 0.75},
         {"text": "I’m going back inside.", "say": "I'm going back inside.", "pause": 0.75, "len": 1.15},
     ]},
]
TAIL = 4.4   # footsteps back to the house, the screen door


# ── small DSP kit (numpy only) ───────────────────────────────────────────────
rng = np.random.default_rng(14)
_ASR = {}
BREATH = [0.45]   # breath blended into the voice (0 = full voice, 1 = mostly whisper)

def fshape(sig, gain):
    X = np.fft.rfft(sig); f = np.fft.rfftfreq(len(sig), 1 / SR)
    return np.fft.irfft(X * gain(f), len(sig))

def bump(f, c, w):
    return np.exp(-0.5 * ((f - c) / w) ** 2)

def resample(x, sr_in, sr_out):
    n = int(round(len(x) * sr_out / sr_in))
    X = np.fft.rfft(x); Y = np.zeros(n // 2 + 1, complex); m = min(len(X), len(Y)); Y[:m] = X[:m]
    return np.fft.irfft(Y, n) * (n / len(x))

def env(n, a, r):
    e = np.ones(n); na, nr = max(1, int(a * SR)), max(1, int(r * SR))
    e[:na] = np.linspace(0, 1, na); e[-nr:] *= np.linspace(1, 0, nr); return e

def stft_whisper(x, n=1024, hop=256):
    """Same spectral envelope, random phase: removes pitch, keeps the words as breath."""
    win = np.hanning(n); out = np.zeros(len(x) + n); norm = np.zeros(len(x) + n)
    xp = np.concatenate([x, np.zeros(n)])
    for i in range(0, len(x), hop):
        fr = xp[i:i + n] * win
        mag = np.abs(np.fft.rfft(fr))
        ph = np.exp(1j * rng.uniform(0, 2 * np.pi, len(mag)))
        out[i:i + n] += np.fft.irfft(mag * ph, n) * win; norm[i:i + n] += win ** 2
    return (out / np.maximum(norm, 1e-6))[:len(x)]

def warp(x, depth=0.004, rate=4.5):
    """Small, irregular pitch/time wobble: an unsteady voice."""
    t = np.arange(len(x)) / SR
    wob = depth * (np.sin(2 * np.pi * rate * t + rng.uniform(0, 6)) * 0.6 + np.sin(2 * np.pi * rate * 0.37 * t + rng.uniform(0, 6)) * 0.4)
    idx = np.clip(np.cumsum(1 + wob) - 1, 0, len(x) - 1)
    return np.interp(idx, np.arange(len(x)), x)

def rms(a): return float(np.sqrt(np.mean(a ** 2)) + 1e-12)

def trim(x, thr=0.01):
    m = np.where(np.abs(x) > thr * np.abs(x).max())[0]
    return x[max(0, m[0] - int(.02 * SR)): m[-1] + int(.03 * SR)] if len(m) else x


# ── speech ───────────────────────────────────────────────────────────────────
def load_voice(models: Path):
    models.mkdir(parents=True, exist_ok=True)
    for ext in (".onnx", ".onnx.json"):
        p = models / (MODEL + ext)
        if not p.exists():
            print(f"downloading {p.name} …"); urllib.request.urlretrieve(HF + MODEL + ext, p)
    from piper import PiperVoice
    return PiperVoice.load(str(models / (MODEL + ".onnx")))

def speak(voice, ph, speaker, noise):
    from piper import SynthesisConfig
    cfg = SynthesisConfig(speaker_id=speaker, length_scale=ph.get("len", 1.12), noise_scale=noise, noise_w_scale=0.95)
    x = np.concatenate([c.audio_float_array for c in voice.synthesize(ph["say"], cfg)]).astype(float)
    x = trim(resample(x, voice.config.sample_rate, SR))
    if ph.get("cut"):                                      # stopped mid-thought: no settling tail
        x = x[: int(len(x) * 0.97)]; x[-int(.025 * SR):] *= np.linspace(1, 0, int(.025 * SR))
    x = warp(x)
    # hushed: breath blended into the voice, softer top end, a faint tremor
    breath = fshape(stft_whisper(x), lambda f: bump(f, 2600, 1900) + 0.4 * bump(f, 6000, 1500))
    voiced = fshape(x, lambda f: 1 / (1 + (f / 3800) ** 2) * (1 + 0.35 * bump(f, 220, 120)))
    y = voiced / rms(voiced) + ph.get("breath", BREATH[0]) * breath / rms(breath)
    t = np.arange(len(y)) / SR
    y *= 1 + 0.05 * np.sin(2 * np.pi * 6.1 * t + rng.uniform(0, 6))
    turn = ph.get("turn", 0.0)                             # turned away: duller and a little quieter
    if turn:
        y = fshape(y, lambda f: 1 / (1 + (f / (5200 - 2600 * turn)) ** 2))
    y = y / rms(y) * ph.get("effort", 1.0) * (1 - 0.32 * turn)
    return y * env(len(y), 0.006, 0.03)


PUNCH = [False]

def punch_in(voice, ph, speaker, noise, tries=10):
    """Re-record a phrase until all three recognizers hear exactly the scripted words."""
    from faster_whisper import WhisperModel
    ref = norm_words(ph["text"]); best = None
    bed = fshape(rng.standard_normal(int(4 * SR)), lambda f: 1 / np.maximum(f, 60) ** 0.5)
    for k in range(tries):
        y = speak(voice, ph, speaker, noise)
        test = y / rms(y) * 0.1 + np.resize(bed, len(y)) / rms(bed) * 0.1 * 10 ** (-15 / 20)   # heard over a hum-level bed
        x16 = resample(np.concatenate([np.zeros(int(.3 * SR)), test, np.zeros(int(.3 * SR))]), SR, 16000).astype(np.float32)
        errs = []
        for name in ("base.en", "small.en", "medium.en"):
            m = _ASR.get(name) or _ASR.setdefault(name, WhisperModel(name, device="cpu", compute_type="int8"))
            segs, _ = m.transcribe(x16, language="en", beam_size=5, vad_filter=False)
            errs.append(wer(ref, norm_words(" ".join(sg.text for sg in segs))))
        score = max(errs)
        if best is None or score < best[0]: best = (score, y, k + 1)
        if score == 0: break
    print(f"    {ph['text']:48s} take {best[2]:2d}  WER {best[0]:.2f}", flush=True)
    return best[1]


# ── the night ────────────────────────────────────────────────────────────────
def scene(total, car_span, voice_spans):
    N = int(total * SR); t = np.arange(N) / SR; L = {}
    amp = 1 + 0.05 * np.sin(2 * np.pi * 0.21 * t) + 0.02 * np.sin(2 * np.pi * 1.3 * t)
    hum = np.zeros(N)
    for f0, a in [(60, .35), (120, 1.0), (180, .62), (240, .34), (300, .16), (360, .08)]:
        hum += a * np.sin(2 * np.pi * f0 * t + rng.uniform(0, 6.28))
    hum += 0.25 * np.sin(2 * np.pi * 119.7 * t)
    L["hum"] = np.tanh(1.4 * hum * amp)
    air = fshape(rng.standard_normal(N), lambda f: 1 / np.maximum(f, 40) ** 0.5 / (1 + (f / 2200) ** 4))
    crk = np.zeros(N); tc = 0.3
    stop = car_span[0] + (car_span[1] - car_span[0]) * 0.35   # the crickets go quiet when the car comes; they don't come back
    while tc < stop:
        for k in range(3):
            n = int(0.018 * SR); s = np.sin(2 * np.pi * 4650 * np.arange(n) / SR) * np.hanning(n)
            i = int((tc + k * 0.032) * SR); crk[i:i + n] += s[: max(0, min(n, N - i))]
        tc += rng.uniform(0.28, 0.42)
    L["air"] = air / np.abs(air).max() * 0.6 + crk * 0.35
    # wind touching the mic, twice
    wind = np.zeros(N)
    for c in (voice_spans[2][0] + 0.6, voice_spans[-1][0] - 1.4):
        n = int(1.6 * SR); g = fshape(rng.standard_normal(n), lambda f: 1 / (1 + (f / 180) ** 3))
        e = np.hanning(n) ** 1.5 * (1 + 0.5 * np.sin(2 * np.pi * 2.3 * np.arange(n) / SR))
        i = int(c * SR); wind[i:i + n] += (g * e)[: max(0, min(n, N - i))]
    L["wind"] = wind
    # the car
    ca, cb = car_span; cn = int((cb - ca) * SR); ct = np.arange(cn) / SR; mid = (cb - ca) / 2
    prox = np.exp(-((ct - mid) / 1.05) ** 2)
    road = fshape(rng.standard_normal(cn), lambda f: 1 / np.maximum(f, 60) ** 0.7 / (1 + (f / 2800) ** 4)); road /= np.abs(road).max()
    eng_f = np.where(ct < mid, 96, 82)
    eng = np.sin(2 * np.pi * np.cumsum(eng_f) / SR) * 0.5 + 0.25 * np.sin(2 * np.pi * np.cumsum(eng_f * 2) / SR)
    car = np.zeros(N); i = int(ca * SR); car[i:i + cn] = ((road * 0.9 + eng * 0.4) * prox)[: N - i]
    L["car"] = car
    # handling: the phone shifts in her hand; footsteps; the screen door
    fx = np.zeros(N)
    def put(sig, at):
        i = int(at * SR); j = min(N, i + len(sig))
        if 0 <= i < N: fx[i:j] += sig[: j - i]
    for at in (0.35, voice_spans[0][0] - 0.25, voice_spans[2][0] - 0.5):
        n = int(0.12 * SR); put(fshape(rng.standard_normal(n), lambda f: bump(f, 900, 700)) * env(n, .004, .08) * 0.6, at)
    tstep = total - TAIL + 0.35
    for k in range(6):
        gn = int(0.11 * SR)
        grit = fshape(rng.standard_normal(gn), lambda f: bump(f, 1800, 1400))
        grains = (rng.random(gn) < 0.025) * rng.uniform(0.5, 1.0, gn)
        crunch = (grit * 0.5 + fshape(grains, lambda f: bump(f, 2600, 1800)) * 2.2) * env(gn, .004, .07)
        put(crunch * (1.0 - k * 0.11), tstep); tstep += rng.uniform(0.5, 0.6)
    n = int(0.05 * SR); put(fshape(rng.standard_normal(n), lambda f: bump(f, 2300, 600)) * env(n, .001, .04) * 1.4, tstep + 0.35)
    n = int(0.12 * SR); put(np.sin(2 * np.pi * 95 * np.arange(n) / SR) * env(n, .002, .1) * 1.2, tstep + 0.36)
    L["fx"] = fx
    return L


def breath_in(n_s=0.32):
    n = int(n_s * SR)
    return fshape(rng.standard_normal(n), lambda f: bump(f, 1500, 1000) + 0.3 * bump(f, 4200, 900)) * np.hanning(n) ** 1.3

def exhale(n_s):
    n = int(n_s * SR)
    return fshape(rng.standard_normal(n), lambda f: bump(f, 900, 650) + 0.35 * bump(f, 2600, 900)) * (np.hanning(n) ** 0.8) * np.linspace(1, 0.4, n)

def lip_click():
    n = int(0.006 * SR)
    return fshape(rng.standard_normal(n), lambda f: bump(f, 2600, 900)) * np.hanning(n)


# ── build ────────────────────────────────────────────────────────────────────
def build(voice, speaker, noise):
    clips, timeline, phrases, t = [], [], [], 0.0
    car_span = None
    for item in SCRIPT:
        if "cue" in item:
            if item.get("car"): car_span = (t, t + item["cue"])
            timeline.append([round(t, 2), round(t + item["cue"], 2)]); t += item["cue"]; continue
        start = t
        for ph in item["phrases"]:
            if "exhale" in ph:
                clips.append(("breath", exhale(ph["exhale"]) * 0.09, t)); t += ph["exhale"]; continue
            if rng.random() < 0.7: clips.append(("breath", breath_in() * 0.05, t - 0.36))
            if ph["text"].startswith(("…okay", "every")): clips.append(("breath", lip_click() * 0.12, t - 0.08))
            y = punch_in(voice, ph, speaker, noise) if PUNCH[0] else speak(voice, ph, speaker, noise)
            clips.append(("voice", y, t))
            phrases.append({"text": ph["text"], "start": round(t, 2), "end": round(t + len(y) / SR, 2)})
            t += len(y) / SR + ph["pause"]
        timeline.append([round(start, 2), round(t, 2)])
    total = t + TAIL
    N = int(total * SR)
    vs = [(p["start"], p["end"]) for p in phrases]
    L = scene(total, car_span, vs)
    voice_bus = np.zeros(N); breath_bus = np.zeros(N)
    for kind, sig, at in clips:
        i = max(0, int(at * SR)); j = min(N, i + len(sig)); bus = voice_bus if kind == "voice" else breath_bus
        bus[i:j] += sig[: j - i]
    # a faint slap off the brick house, mostly on the voice
    d = int(0.064 * SR); slap = np.zeros(N); slap[d:] = voice_bus[:-d]
    voice_bus = voice_bus + 0.09 * fshape(slap, lambda f: 1 / (1 + (f / 2500) ** 2))
    # levels (dBFS RMS while active): close voice on top, the house behind it
    def active(a):
        m = np.abs(a) > np.abs(a).max() * 0.02
        return np.sqrt(np.mean(a[m] ** 2)) if m.any() else 1e-12
    TARGET = {"hum": -31, "air": -45, "wind": -34, "car": -19, "fx": -27}
    mix = voice_bus / active(voice_bus) * 10 ** (-16 / 20) + breath_bus / max(active(breath_bus), 1e-9) * 10 ** (-33 / 20)
    for k, db in TARGET.items():
        ref = rms(L[k]) if k in ("hum", "air") else active(L[k])
        mix += L[k] / ref * 10 ** (db / 20)
    # phone chain: MEMS mic band and presence, automatic gain control, gentle limiting
    mix = fshape(mix, lambda f: np.clip((f - 80) / 70, 0, 1) * (1 + 0.25 * bump(f, 3500, 1200)) / (1 + (f / 10500) ** 4))
    envl = np.abs(mix); a_up, a_dn = np.exp(-1 / (0.01 * SR)), np.exp(-1 / (0.6 * SR))
    lvl = np.zeros(N); cur = 1e-4
    for i in range(0, N, 64):                     # block-wise envelope follower
        v = envl[i:i + 64].max(); cur = a_up * cur + (1 - a_up) * v if v > cur else a_dn * cur + (1 - a_dn) * v
        lvl[i:i + 64] = cur
    gain = np.clip((10 ** (-14 / 20) / np.maximum(lvl, 1e-4)) ** 0.45, 0.6, 3.2)
    mix = mix * gain
    mix = np.tanh(mix * 1.25) / 1.25
    fade = np.ones(N); fade[: int(.2 * SR)] = np.linspace(0, 1, int(.2 * SR)); fade[-int(.5 * SR):] = np.linspace(1, 0, int(.5 * SR))
    mix = mix * fade; mix = mix / np.abs(mix).max() * 0.86
    return mix, {"total": round(total, 2), "lines": timeline, "phrases": phrases}


def write(mix, tl, base: Path):
    wav = base.with_suffix(".wav")
    with wave.open(str(wav), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype("<i2").tobytes())
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-ac", "1", "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", str(base.with_suffix(".m4a"))], check=True)
    base.with_suffix(".json").write_text(json.dumps(tl, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    # what visitors hear is the AAC file, so verification listens to a decode of it
    heard = base.with_name(base.name + ".heard.wav")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(base.with_suffix(".m4a")), "-ac", "1", "-ar", str(SR), str(heard)], check=True)
    wav.unlink(missing_ok=True)
    return heard


def norm_words(s):
    s = re.sub(r"\s+", " ", s.lower()).replace("a.i.", "ai").replace("a. i.", "ai").replace(" a i ", " ai ").replace("’", "'")
    s = re.sub(r"\bok\b", "okay", s); s = re.sub(r"\b(\w+) is\b", r"\1s", s); s = s.replace("'", "")
    return re.sub(r"[^a-z ]", " ", s).split()

def wer(ref, hyp):
    d = np.zeros((len(ref) + 1, len(hyp) + 1), int); d[:, 0] = range(len(ref) + 1); d[0, :] = range(len(hyp) + 1)
    for i in range(1, len(ref) + 1):
        for j in range(1, len(hyp) + 1):
            d[i, j] = min(d[i - 1, j] + 1, d[i, j - 1] + 1, d[i - 1, j - 1] + (ref[i - 1] != hyp[j - 1]))
    return d[-1, -1] / max(1, len(ref))

def verify(wav: Path, tl, model="base.en"):
    """Transcribe each spoken line from its own slice of the finished mix (no 30 s window seams)."""
    from faster_whisper import WhisperModel
    m = _ASR.get(model) or _ASR.setdefault(model, WhisperModel(model, device="cpu", compute_type="int8"))
    with wave.open(str(wav)) as w:
        x = np.frombuffer(w.readframes(w.getnframes()), "<i2").astype(float) / 32768
    report, allr, allh = [], [], []
    for item, (a, b) in zip(SCRIPT, tl["lines"]):
        if "phrases" not in item: continue
        seg = x[max(0, int((a - 0.4) * SR)): int((b + 0.4) * SR)]
        segs, _ = m.transcribe(resample(seg, SR, 16000).astype(np.float32), language="en", beam_size=5, vad_filter=False)
        ref = norm_words(re.sub(r"\[[^\]]*\]", "", item["line"]))
        hyp = norm_words(" ".join(sg.text for sg in segs))
        report.append((round(wer(ref, hyp), 3), " ".join(hyp))); allr += ref; allh += hyp
    return wer(allr, allh), report


def make_ambient(out: Path, period=20.0, extra=1.0):
    """Seamless room tone for the site's Sound toggle: the garage hum and night air, periodic over `period` seconds.
    Rendered a little longer than one period; the player loops [0.5, 0.5 + period] so codec padding never shows."""
    N = int(period * SR); t = np.arange(N) / SR
    amp = 1 + 0.05 * np.sin(2 * np.pi * 0.2 * t) + 0.02 * np.sin(2 * np.pi * 1.3 * t)     # whole cycles per period
    hum = sum(a * np.sin(2 * np.pi * f0 * t + ph) for (f0, a), ph in zip([(60, .35), (120, 1.0), (180, .62), (240, .34), (300, .16), (360, .08)], rng.uniform(0, 6.28, 6)))
    hum = np.tanh(1.4 * (hum + 0.25 * np.sin(2 * np.pi * 119.7 * t)) * amp)
    air = fshape(rng.standard_normal(N), lambda f: 1 / np.maximum(f, 40) ** 0.5 / (1 + (f / 2200) ** 4))   # circular FFT: periodic
    x = hum / rms(hum) * 10 ** (-24 / 20) + air / rms(air) * 10 ** (-40 / 20)
    x = fshape(x, lambda f: np.clip((f - 70) / 60, 0, 1) / (1 + (f / 9000) ** 4))
    x = np.concatenate([x, x[: int(extra * SR)]])
    wav = out.with_suffix(".wav")
    with wave.open(str(wav), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x / np.abs(x).max() * 0.5 * 32767).astype("<i2").tobytes())
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-c:a", "aac", "-b:a", "64k", str(out)], check=True)
    wav.unlink(); print(f"ambient → {out}")


def make_reel(m4a: Path, tl, bg: Path, out: Path, wave_box=(130, 861, 820, 170), caps_y=1150, size=58, scale=None):
    """Vertical video: background frame + live waveform + phrase captions timed to the audio."""
    import tempfile, textwrap
    work = Path(tempfile.mkdtemp())
    bold = "/usr/share/fonts/opentype/inter/Inter-Bold.otf"
    ital = "/usr/share/fonts/opentype/inter/Inter-Italic.otf"
    events, P, k = [], tl["phrases"], 0
    for item, (a, b) in zip(SCRIPT, tl["lines"]):
        if "cue" in item:
            events.append((a + 0.2, b - 0.2, item["line"], ital, "0xE8953F", 44)); continue
        for ph in item["phrases"]:
            if "exhale" in ph:   # between the phrase just spoken and the next one
                events.append((P[k - 1]["end"] + 0.1, P[k]["start"] - 0.05, "[exhales]", ital, "0xE8953F", 44)); continue
            p = P[k]; k += 1
            events.append((p["start"], p["end"] + 0.35, p["text"], bold, "0xF4EFE6", size))
    x, y, w, h = wave_box
    g = [f"[1:a]aformat=channel_layouts=mono,showwaves=s={w}x{h}:mode=cline:rate=30:colors=0xE8953F:scale=sqrt:draw=full,format=rgba[wv]",
         f"[0:v]format=rgba[bg];[bg][wv]overlay={x}:{y}:shortest=1:format=rgb[v0]"]
    last = "v0"
    for k, (a, b, text, font, color, size) in enumerate(events):
        tf = work / f"c{k}.txt"; tf.write_text("\n".join(textwrap.wrap(text, 27 if size > 50 else 32)), encoding="utf-8")
        alpha = f"if(lt(t\\,{a:.2f}+0.12)\\,(t-{a:.2f})/0.12\\,if(gt(t\\,{b - 0.25:.2f})\\,max(0\\,({b:.2f}-t)/0.25)\\,1))"
        g.append(f"[{last}]drawtext=fontfile={font}:textfile={tf}:fontsize={size}:fontcolor={color}:line_spacing=16:"
                 f"text_align=C:x=(w-text_w)/2:y={caps_y}:alpha='{alpha}':enable='between(t,{a:.2f},{b:.2f})'[v{k + 1}]")
        last = f"v{k + 1}"
    if scale:
        g.append(f"[{last}]scale={scale[0]}:{scale[1]}:flags=lanczos[vs]"); last = "vs"
    script = work / "graph.txt"; script.write_text(";\n".join(g), encoding="utf-8")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-loop", "1", "-framerate", "30", "-i", str(bg), "-i", str(m4a),
                    "-filter_complex_script", str(script), "-map", f"[{last}]", "-map", "1:a",
                    "-c:v", "libx264", "-preset", "medium", "-crf", "21", "-pix_fmt", "yuv420p",
                    "-c:a", "aac", "-b:a", "128k", "-shortest", "-movflags", "+faststart", str(out)], check=True)
    print(f"reel → {out}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--models", default=str(Path.home() / ".cache" / "piper"))
    ap.add_argument("--speaker", type=int, default=298)
    ap.add_argument("--noise", type=float, default=0.72)
    ap.add_argument("--breath", type=float, default=0.35)
    ap.add_argument("--takes", type=int, default=1, help="record N takes, keep the clearest (needs faster-whisper)")
    ap.add_argument("--out", default=str(OUT / "memo-014"))
    ap.add_argument("--verify", action="store_true")
    ap.add_argument("--asr", default="base.en,small.en,medium.en")
    ap.add_argument("--punch", action="store_true", help="re-record each phrase until every recognizer hears it exactly")
    ap.add_argument("--reel", metavar="BG", help="only build the vertical video from an existing memo + a 1080x1920 background")
    ap.add_argument("--ambient", action="store_true", help="only build the site's looping room tone (assets/posts/ambient-hum.m4a)")
    ap.add_argument("--feed", metavar="BG", help="only build the in-feed video (recorder screen, 1080x1350 background → 720x900)")
    a = ap.parse_args()
    if a.ambient:
        make_ambient(OUT / "ambient-hum.m4a"); return
    if a.feed:
        base = Path(a.out); tl = json.loads(base.with_suffix(".json").read_text(encoding="utf-8"))
        out = OUT / "memo-014.mp4"
        make_reel(base.with_suffix(".m4a"), tl, Path(a.feed), out, wave_box=(130, 352, 820, 170), caps_y=650, size=66, scale=(720, 900))
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", "4.9", "-i", str(out), "-frames:v", "1", "-q:v", "3", str(OUT / "memo-014-poster.jpg")], check=True)
        return
    if a.reel:
        base = Path(a.out)
        make_reel(base.with_suffix(".m4a"), json.loads(base.with_suffix(".json").read_text(encoding="utf-8")), Path(a.reel),
                  BOOK / "campaign" / "cards" / "memo-014-reel.mp4"); return
    BREATH[0] = a.breath; PUNCH[0] = a.punch
    voice = load_voice(Path(a.models))
    models = a.asr.split(",")
    best = None
    for k in range(a.takes):
        mix, tl = build(voice, a.speaker, a.noise)
        if a.takes == 1 and not a.verify:
            best = (0, mix, tl, []); break
        tmp = Path(a.out + f"-take{k}")
        wav = write(mix, tl, tmp)
        scores = [verify(wav, tl, m) for m in models]
        worst = max(sc[0] for sc in scores)
        print(f"take {k + 1}: " + "  ".join(f"{m} WER {sc[0]:.3f}" for m, sc in zip(models, scores)))
        for f in tmp.parent.glob(tmp.name + "*"): f.unlink()
        if best is None or worst < best[0]: best = (worst, mix, tl, scores)
    worst, mix, tl, scores = best
    wav = write(mix, tl, Path(a.out))
    print(f"speaker {a.speaker} · {tl['total']}s · {len(tl['phrases'])} phrases → {Path(a.out).with_suffix('.m4a')}")
    for m, sc in zip(models, scores):
        print(f"  {m}: overall WER {sc[0]:.3f}")
        for w_, h in sc[1]: print(f"    {w_:.2f} | {h}")
    wav.unlink(missing_ok=True)


if __name__ == "__main__":
    main()
