#!/usr/bin/env python3
"""
THE WATCHTOWER — YTD model (with the Q1 2026 reshuffle pivot)
============================================================
Pulls real adjusted (total-return) daily prices from Yahoo Finance for the
full year-to-date window and models six contenders:

    republic  — The Republic Portfolio, modeled buy-and-hold from its real
                holdings, EQUAL-WEIGHT within each bucket (per the Committee's
                handbill), and REBALANCED on the Q1 2026 reshuffle date.
    spy       — S&P 500 (SPY)
    dvrux/qgrpx/midusa/bniex — the four UBS funds

THE Q1 2026 WARTIME REVIEW (effective 2026-03-31) amended the doctrine:
    Engines  50% -> 45%
    Choke    35% (unchanged) but ADD XLE  (14 -> 15 names)
    Reserve  15% -> 20%
The portfolio is held under the original roster from the first trading day
through the pivot, then rebalanced into the amended roster and held to date.

Output: data/vigil_data.js  ->  window.VIGIL_DATA = {...}
"""
import json, time, datetime as dt, os
import requests

HDRS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                      "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"}

PIVOT = "2026-03-31"   # Q1 2026 Wartime Review — reshuffle effective date

ENGINES = ["CAT","DE","HON","LMT","GE","WMT","COST","HD","JNJ","PFE","ADM","BG","TSN","SCHW","BRK.B"]
CHOKE_0 = ["NEE","D","KMI","WMB","V","MA","JPM","MSFT","AMZN","GOOGL","UNP","NSC","MCK","UNH"]      # original 14
CHOKE_1 = CHOKE_0 + ["XLE"]                                                                          # + wartime energy sleeve
RESERVE = "BIL"

def equal(names, total):
    return {t: total/len(names) for t in names}

# Roster 1 — founding doctrine (Dec 2025): 50 / 35 / 15
ROSTER_1 = {**equal(ENGINES, 0.50), **equal(CHOKE_0, 0.35), RESERVE: 0.15}
# Roster 2 — Q1 2026 wartime amendment: 45 / 35 / 20  (+XLE)
ROSTER_2 = {**equal(ENGINES, 0.45), **equal(CHOKE_1, 0.35), RESERVE: 0.20}

FUNDS = {"spy":"SPY","dvrux":"DVRUX","qgrpx":"QGRPX","midusa":"0P00000AY4","bniex":"BNIEX"}
YAHOO = {"BRK.B": "BRK-B"}

for r in (ROSTER_1, ROSTER_2):
    assert abs(sum(r.values()) - 1.0) < 1e-9, sum(r.values())


def fetch(symbol, tries=4):
    for host in ("query1", "query2"):
        for k in range(tries):
            try:
                u = (f"https://{host}.finance.yahoo.com/v8/finance/chart/{symbol}"
                     f"?range=ytd&interval=1d")
                r = requests.get(u, headers=HDRS, timeout=25); r.raise_for_status()
                res = r.json()["chart"]["result"][0]
                ts = res["timestamp"]; ind = res["indicators"]
                adj = ind.get("adjclose", [{}])[0].get("adjclose")
                px = adj if adj else ind["quote"][0]["close"]
                out = {}
                for t, p in zip(ts, px):
                    if p is None: continue
                    out[dt.datetime.utcfromtimestamp(t).date().isoformat()] = float(p)
                if out: return out
            except Exception:
                time.sleep(0.4 * (k + 1))
    raise RuntimeError(f"failed to fetch {symbol}")


def main():
    constituents = set(ENGINES) | set(CHOKE_1) | {RESERVE}
    symbols = {YAHOO.get(t, t) for t in constituents} | set(FUNDS.values())
    raw = {}
    print(f"Fetching {len(symbols)} symbols from Yahoo Finance ...")
    for sym in sorted(symbols):
        raw[sym] = fetch(sym); print(f"  {sym:12} {len(raw[sym]):3} pts"); time.sleep(0.18)

    dates = sorted(raw["SPY"].keys())
    N = len(dates)
    # pivot index = first trading day on/after PIVOT
    pivot_idx = next((i for i, d in enumerate(dates) if d >= PIVOT), N - 1)

    def aligned(sym):
        series, last = [], None
        for d in dates:
            if d in raw[sym]: last = raw[sym][d]
            series.append(last if last is not None else next(iter(raw[sym].values())))
        return series
    al = {s: aligned(s) for s in raw}
    P = lambda t, i: al[YAHOO.get(t, t)][i]

    # ── Republic: two-regime buy-and-hold, rebalanced at pivot ──
    # period 1 equity (held from day 0 under roster 1)
    base1 = {t: P(t, 0) for t in ROSTER_1}
    E1 = [sum(w * P(t, i) / base1[t] for t, w in ROSTER_1.items()) for i in range(N)]
    V = E1[pivot_idx]                                   # value carried into the reshuffle
    # period 2 equity (rebalance into roster 2 at pivot, hold to end)
    base2 = {t: P(t, pivot_idx) for t in ROSTER_2}
    E2 = [V * sum(w * P(t, i) / base2[t] for t, w in ROSTER_2.items()) for i in range(N)]
    republic = [round((E1[i] - 1) * 100, 3) if i < pivot_idx else round((E2[i] - 1) * 100, 3)
                for i in range(N)]

    series = {"republic": republic}
    for key, sym in FUNDS.items():
        b = al[sym][0]
        series[key] = [round((al[sym][i] / b - 1) * 100, 3) for i in range(N)]

    labels = [dt.date.fromisoformat(d).strftime("%b %-d") for d in dates]
    final = {k: round(v[-1], 2) for k, v in series.items()}

    # ── stats (embedded so the page never goes stale on refresh) ──
    rank = sorted(final.items(), key=lambda kv: kv[1], reverse=True)
    led = sum(1 for i in range(N) if max(series, key=lambda k: series[k][i]) == "republic")
    pk = max(range(N), key=lambda i: republic[i])
    peak_v, mdd = -1e9, 0.0
    for v in republic:
        peak_v = max(peak_v, v); mdd = min(mdd, v - peak_v)
    last_lead = max((i for i in range(N) if max(series, key=lambda k: series[k][i]) == "republic"), default=0)
    stats = {
        "republic_led": led, "n_days": N,
        "republic_peak": round(max(republic), 2), "republic_peak_label": labels[pk],
        "republic_rank": [k for k, _ in rank].index("republic") + 1,
        "republic_at_pivot": round(republic[pivot_idx], 2),
        "republic_last_lead_label": labels[last_lead],
        "republic_max_pullback": round(mdd, 2),
        "vs_spy": round(final["republic"] - final["spy"], 2),
        "spread": round(rank[0][1] - rank[-1][1], 2),
    }

    data = {
        "asof": dates[-1], "generated": dt.datetime.utcnow().isoformat(timespec="seconds") + "Z",
        "base_date": dates[0], "n_points": N,
        "pivot_date": dates[pivot_idx], "pivot_index": pivot_idx, "pivot_label": labels[pivot_idx],
        "dates": dates, "labels": labels, "series": series, "final": final,
        "stats": stats,
        "names": {
            "republic": "The Republic Portfolio", "spy": "S&P 500 (SPY)",
            "dvrux": "UBS US Dividend Ruler", "qgrpx": "UBS US Quality Growth (QGARP)",
            "midusa": "UBS (Lux) Mid Caps USA", "bniex": "UBS International Sustainable Equity",
        },
    }
    os.makedirs("data", exist_ok=True)
    with open("data/vigil_data.js", "w") as f:
        f.write("/* Auto-generated by model_ytd.py — do not edit by hand. */\n")
        f.write("window.VIGIL_DATA = "); json.dump(data, f, separators=(",", ":")); f.write(";\n")
    with open("data/vigil_data.json", "w") as f:
        json.dump(data, f, indent=1)

    # ── summary for the upshot ──
    rank = sorted(final.items(), key=lambda kv: kv[1], reverse=True)
    print(f"\n=== YTD as of {data['asof']}  (pivot {data['pivot_date']}, idx {pivot_idx}) ===")
    for k, v in rank: print(f"  {data['names'][k]:42} {v:+.2f}%")
    led = sum(1 for i in range(N) if max(series, key=lambda k: series[k][i]) == "republic")
    pk = max(range(N), key=lambda i: republic[i])
    peak, mdd = -1e9, 0.0
    for v in republic:
        peak = max(peak, v); mdd = min(mdd, v - peak)
    print(f"\nRepublic led {led} of {N} days | peak {max(republic):+.2f}% on {labels[pk]} "
          f"| max pullback {mdd:.2f} | end {republic[-1]:+.2f}%")
    print(f"Republic rank: #{[k for k,_ in rank].index('republic')+1}  vs SPY {final['republic']-final['spy']:+.2f} pts")
    print(f"Spread top→bottom: {rank[0][1]-rank[-1][1]:.2f} pts")
    print(f"Republic at pivot ({data['pivot_label']}): {republic[pivot_idx]:+.2f}%")


if __name__ == "__main__":
    main()
