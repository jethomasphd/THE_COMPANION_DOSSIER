#!/usr/bin/env python3
"""
THE WATCHTOWER — YTD model
==========================
Pulls real adjusted (total-return) daily prices from Yahoo Finance for the
full year-to-date window and models six contenders:

    republic  — The Republic Portfolio (built from its 29 constituents + BIL
                reserve, buy-and-hold, equal-weight within buckets)
    spy       — S&P 500 (SPY)
    dvrux     — UBS US Dividend Ruler
    qgrpx     — UBS US Quality Growth at a Reasonable Price (QGARP)
    midusa    — UBS (Lux) Equity Fund — Mid Caps USA (Yahoo: 0P00000AY4)
    bniex     — UBS International Sustainable Equity

Output: data/vigil_data.js   ->   window.VIGIL_DATA = {...}

Re-run any time to refresh. No API key required.
"""
import json, time, datetime as dt, sys, os

import requests

HDRS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                      "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"}

# ── Republic Portfolio doctrine (equal-weight within buckets; sums to 1.0) ──
WEIGHTS = {
    # Engines of the Republic — 50%
    "CAT": 0.04, "DE": 0.04, "HON": 0.04, "LMT": 0.04, "GE": 0.04,
    "WMT": 0.04, "COST": 0.04, "HD": 0.04,
    "JNJ": 0.03, "PFE": 0.03,
    "ADM": 0.07/3, "BG": 0.07/3, "TSN": 0.07/3,
    "SCHW": 0.025, "BRK.B": 0.025,
    # Critical Choke Points — 35%
    "NEE": 0.03, "D": 0.03, "KMI": 0.03, "WMB": 0.03,
    "V": 0.08/3, "MA": 0.08/3, "JPM": 0.08/3,
    "MSFT": 0.07/3, "AMZN": 0.07/3, "GOOGL": 0.07/3,
    "UNP": 0.025, "NSC": 0.025,
    "MCK": 0.015, "UNH": 0.015,
    # Reserve — 15%
    "BIL": 0.15,
}
FUNDS = {  # contender key -> Yahoo symbol
    "spy": "SPY", "dvrux": "DVRUX", "qgrpx": "QGRPX",
    "midusa": "0P00000AY4", "bniex": "BNIEX",
}
YAHOO = {"BRK.B": "BRK-B"}  # ticker -> yahoo symbol overrides


def fetch(symbol, tries=4):
    """Return {iso_date: adjclose} for the YTD window."""
    for host in ("query1", "query2"):
        for k in range(tries):
            try:
                u = (f"https://{host}.finance.yahoo.com/v8/finance/chart/{symbol}"
                     f"?range=ytd&interval=1d")
                r = requests.get(u, headers=HDRS, timeout=25)
                r.raise_for_status()
                res = r.json()["chart"]["result"][0]
                ts = res["timestamp"]
                ind = res["indicators"]
                adj = ind.get("adjclose", [{}])[0].get("adjclose")
                px = adj if adj else ind["quote"][0]["close"]
                out = {}
                for t, p in zip(ts, px):
                    if p is None:
                        continue
                    d = dt.datetime.utcfromtimestamp(t).date().isoformat()
                    out[d] = float(p)
                if out:
                    return out
            except Exception as e:
                time.sleep(0.4 * (k + 1))
    raise RuntimeError(f"failed to fetch {symbol}")


def main():
    syms = {t: YAHOO.get(t, t) for t in WEIGHTS}          # republic constituents
    syms.update({v: v for v in FUNDS.values()})            # funds
    raw = {}
    print("Fetching", len(set(syms.values())), "symbols from Yahoo Finance ...")
    for label, sym in sorted(set((s, s) for s in syms.values())):
        raw[sym] = fetch(sym)
        print(f"  {sym:12} {len(raw[sym]):3} pts")
        time.sleep(0.2)

    # master date axis = SPY's US trading days
    dates = sorted(raw["SPY"].keys())

    def aligned(sym):
        """forward-filled series on the master axis."""
        series, last = [], None
        for d in dates:
            if d in raw[sym]:
                last = raw[sym][d]
            series.append(last if last is not None else next(iter(raw[sym].values())))
        return series

    al = {sym: aligned(sym) for sym in raw}

    # ── Republic buy-and-hold equity curve (weights drift) ──
    base = {t: al[YAHOO.get(t, t)][0] for t in WEIGHTS}
    republic = []
    for i in range(len(dates)):
        eq = sum(w * al[YAHOO.get(t, t)][i] / base[t] for t, w in WEIGHTS.items())
        republic.append(round((eq - 1.0) * 100, 3))

    series = {"republic": republic}
    for key, sym in FUNDS.items():
        b = al[sym][0]
        series[key] = [round((al[sym][i] / b - 1.0) * 100, 3) for i in range(len(dates))]

    labels = [dt.date.fromisoformat(d).strftime("%b %-d") for d in dates]
    final = {k: round(v[-1], 2) for k, v in series.items()}

    data = {
        "asof": dates[-1],
        "generated": dt.datetime.utcnow().isoformat(timespec="seconds") + "Z",
        "base_date": dates[0],
        "n_points": len(dates),
        "dates": dates,
        "labels": labels,
        "series": series,
        "final": final,
        "names": {
            "republic": "The Republic Portfolio",
            "spy": "S&P 500 (SPY)",
            "dvrux": "UBS US Dividend Ruler",
            "qgrpx": "UBS US Quality Growth (QGARP)",
            "midusa": "UBS (Lux) Mid Caps USA",
            "bniex": "UBS International Sustainable Equity",
        },
    }

    os.makedirs("data", exist_ok=True)
    with open("data/vigil_data.js", "w") as f:
        f.write("/* Auto-generated by model_ytd.py — do not edit by hand. */\n")
        f.write("window.VIGIL_DATA = ")
        json.dump(data, f, separators=(",", ":"))
        f.write(";\n")
    with open("data/vigil_data.json", "w") as f:
        json.dump(data, f, indent=1)

    # ── summary for the upshot paragraph ──
    rank = sorted(final.items(), key=lambda kv: kv[1], reverse=True)
    print("\n=== YTD as of", data["asof"], "===")
    for k, v in rank:
        print(f"  {data['names'][k]:42} {v:+.2f}%")
    spread = rank[0][1] - rank[-1][1]
    print(f"\nLeader: {data['names'][rank[0][0]]} ({rank[0][1]:+.2f}%)")
    print(f"Spread top→bottom: {spread:.2f} pts")
    print(f"Republic vs SPY: {final['republic']-final['spy']:+.2f} pts")
    # republic max drawdown (intra-YTD)
    peak, mdd = -1e9, 0.0
    for v in republic:
        peak = max(peak, v)
        mdd = min(mdd, v - peak)
    print(f"Republic peak YTD: {max(republic):+.2f}%  | max pullback from peak: {mdd:.2f} pts")
    print("\nWrote data/vigil_data.js and data/vigil_data.json")


if __name__ == "__main__":
    main()
