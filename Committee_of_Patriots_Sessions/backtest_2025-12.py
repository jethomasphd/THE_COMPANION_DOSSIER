%matplotlib inline

"""
THE REPUBLIC PORTFOLIO vs S&P 500 (SPY) — 10-Year Buy-&-Hold Backtest
====================================================================

Goal
----
Reproduce a fully documented, buy-and-hold backtest of "The Republic Portfolio"
against the S&P 500 (via SPY), using split/dividend-adjusted prices.

What this script does
---------------------
1) Defines the Republic Portfolio weights exactly (equal-weight within sub-buckets).
2) Downloads daily price history from Yahoo Finance via yfinance.
3) Uses auto_adjust=True so "Close" behaves like a total-return price series.
4) Approximates GE shareholder total value by adding the value of spin-off shares:
     GE_total ≈ GE + (1/3)*GEHC + (1/4)*GEV
   (Only after those tickers begin trading.)
5) Runs a buy-and-hold backtest (no periodic rebalancing; weights drift).
6) Produces:
   - 2-line plot: Republic vs SPY equity curves ($1 growth)
   - headline stats (CAGR, vol, max drawdown, beta, tracking error)
   - corrected active CAGR and information ratio
   - calendar-year returns
   - ticker and bucket contribution shares
7) Exports CSV artifacts so results can be inspected or shared.

Dependencies
------------
pip install yfinance pandas numpy matplotlib

Notes / Caveats
---------------
- This is a "portfolio doctrine applied backward in time" (a kind of selection bias),
  but it is still useful to understand behavior under historical regimes.
- auto_adjust=True typically yields split/dividend-adjusted prices (total-return-ish).
- GE spin-off math is an approximation for shareholder value; adjust if you want exact
  distribution timing/ratios or tax effects.
"""

from __future__ import annotations

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import yfinance as yf


# =========================
# 0) USER SETTINGS
# =========================

YEARS = 10
BENCH = "SPY"
RESERVE = "BIL"
INCLUDE_GE_SPINOFFS = True

OUT_EQUITY = "republic_vs_spy_equity_10y.csv"
OUT_STATS = "republic_vs_spy_stats_10y.csv"
OUT_YEARLY = "republic_vs_spy_yearly_returns_10y.csv"
OUT_TICKER_CONTRIB = "republic_ticker_contributions_10y.csv"
OUT_BUCKET_CONTRIB = "republic_bucket_contributions_10y.csv"


# =========================
# 1) PORTFOLIO DEFINITION
# =========================

WEIGHTS = {
    "CAT": 0.04, "DE": 0.04, "HON": 0.04, "LMT": 0.04, "GE": 0.04,
    "WMT": 0.04, "COST": 0.04, "HD": 0.04,
    "JNJ": 0.03, "PFE": 0.03,
    "ADM": 0.07/3, "BG": 0.07/3, "TSN": 0.07/3,
    "SCHW": 0.025, "BRK.B": 0.025,
    "NEE": 0.03, "D": 0.03, "KMI": 0.03, "WMB": 0.03,
    "V": 0.08/3, "MA": 0.08/3, "JPM": 0.08/3,
    "MSFT": 0.07/3, "AMZN": 0.07/3, "GOOGL": 0.07/3,
    "UNP": 0.025, "NSC": 0.025,
    "MCK": 0.015, "UNH": 0.015,
    RESERVE: 0.15,
}

BUCKETS = {t: "Engines" for t in [
    "CAT","DE","HON","LMT","GE","WMT","COST","HD","JNJ","PFE","ADM","BG","TSN","SCHW","BRK.B"
]}
BUCKETS.update({t: "Chokepoints" for t in [
    "NEE","D","KMI","WMB","V","MA","JPM","MSFT","AMZN","GOOGL","UNP","NSC","MCK","UNH"
]})
BUCKETS[RESERVE] = "Reserve"

w_sum = sum(WEIGHTS.values())
if not np.isclose(w_sum, 1.0):
    raise ValueError(f"Portfolio weights must sum to 1.0 (got {w_sum}).")


# =========================
# 2) DOWNLOAD / PRICE DATA
# =========================

YAHOO_MAP = {"BRK.B": "BRK-B"}

def to_yahoo(ticker: str) -> str:
    return YAHOO_MAP.get(ticker, ticker)

def extract_close(df: pd.DataFrame) -> pd.DataFrame:
    if isinstance(df.columns, pd.MultiIndex):
        lvl0 = set(df.columns.get_level_values(0))
        lvl1 = set(df.columns.get_level_values(1))
        if "Close" in lvl0:
            return df["Close"]
        if "Adj Close" in lvl0:
            return df["Adj Close"]
        if "Close" in lvl1:
            return df.xs("Close", level=1, axis=1)
        if "Adj Close" in lvl1:
            return df.xs("Adj Close", level=1, axis=1)
        raise KeyError("Could not find Close/Adj Close in yfinance output.")
    else:
        if "Close" in df.columns:
            return df[["Close"]]
        if "Adj Close" in df.columns:
            return df[["Adj Close"]]
        raise KeyError("Could not find Close/Adj Close in yfinance output.")

END = pd.Timestamp.today().normalize()
START = END - pd.DateOffset(years=YEARS)

portfolio_tickers = list(WEIGHTS.keys())
need = [to_yahoo(t) for t in portfolio_tickers] + [BENCH]

SPIN_TICKERS = ["GEHC", "GEV"]
if INCLUDE_GE_SPINOFFS:
    need += SPIN_TICKERS

raw = yf.download(
    need,
    start=START.strftime("%Y-%m-%d"),
    end=(END + pd.Timedelta(days=1)).strftime("%Y-%m-%d"),
    auto_adjust=True,
    progress=False,
)

px = extract_close(raw).sort_index()
inv_map = {to_yahoo(k): k for k in portfolio_tickers}
px = px.rename(columns=inv_map)
px = px.ffill()


# =========================
# 3) GE SPIN-OFF HANDLING
# =========================

if INCLUDE_GE_SPINOFFS and "GE" in px.columns:
    ge_total = px["GE"].copy()
    if "GEHC" in px.columns and px["GEHC"].notna().any():
        gehc = px["GEHC"]
        gehc_live = gehc.where(gehc.index >= gehc.first_valid_index(), np.nan)
        ge_total = ge_total.add((1/3) * gehc_live.fillna(0.0), fill_value=0.0)
    if "GEV" in px.columns and px["GEV"].notna().any():
        gev = px["GEV"]
        gev_live = gev.where(gev.index >= gev.first_valid_index(), np.nan)
        ge_total = ge_total.add((1/4) * gev_live.fillna(0.0), fill_value=0.0)
    px["GE"] = ge_total

px = px.drop(columns=[c for c in SPIN_TICKERS if c in px.columns], errors="ignore")


# =========================
# 4) RETURNS & ALIGNMENT
# =========================

rets = px.pct_change().dropna(how="all")
if BENCH not in rets.columns:
    raise KeyError(f"Benchmark {BENCH} is missing from returns. Check download.")
rets = rets.loc[rets[BENCH].notna()]

print(f"Backtest window: {rets.index.min().date()} to {rets.index.max().date()} | trading days: {len(rets)}")

w = pd.Series(WEIGHTS)
common_cols = [c for c in w.index if c in rets.columns]
missing = sorted(set(w.index) - set(common_cols))

if missing:
    print("WARNING: these tickers were missing and will be dropped (weights renormalized):")
    print("  ", missing)

w = w.loc[common_cols]
w = w / w.sum()

port_ret = (rets[common_cols] * w).sum(axis=1)
bench_ret = rets[BENCH].reindex(port_ret.index)
rf_ret = rets[RESERVE].reindex(port_ret.index) if RESERVE in rets.columns else None


# =========================
# 5) CORE METRICS
# =========================

def equity_curve(r: pd.Series) -> pd.Series:
    return (1.0 + r).cumprod()

def cagr(r: pd.Series) -> float:
    return (1.0 + r).prod() ** (252 / len(r)) - 1.0

def ann_vol(r: pd.Series) -> float:
    return r.std() * np.sqrt(252)

def max_drawdown(eq: pd.Series) -> float:
    peak = eq.cummax()
    dd = eq / peak - 1.0
    return float(dd.min())

def max_drawdown_details(eq: pd.Series):
    peak = eq.cummax()
    dd = eq / peak - 1.0
    trough = dd.idxmin()
    mdd = float(dd.loc[trough])
    peak_date = eq.loc[:trough].idxmax()
    recovery = eq.loc[trough:][eq.loc[trough:] >= eq.loc[peak_date]]
    recovery_date = recovery.index[0] if len(recovery) else pd.NaT
    return mdd, peak_date, trough, recovery_date

def beta_alpha_ols(port_r: pd.Series, bench_r: pd.Series):
    x = bench_r.reindex(port_r.index).values
    y = port_r.values
    X = np.vstack([np.ones(len(x)), x]).T
    alpha_daily, beta = np.linalg.lstsq(X, y, rcond=None)[0]
    alpha_ann = (1.0 + alpha_daily) ** 252 - 1.0
    return float(beta), float(alpha_ann)

def tracking_error(port_r: pd.Series, bench_r: pd.Series) -> float:
    diff = port_r - bench_r.reindex(port_r.index)
    return float(diff.std() * np.sqrt(252))

def active_cagr(port_r: pd.Series, bench_r: pd.Series) -> float:
    b = bench_r.reindex(port_r.index)
    n = len(port_r)
    wealth_port = (1.0 + port_r).prod()
    wealth_bench = (1.0 + b).prod()
    active_total = wealth_port / wealth_bench - 1.0
    return float((1.0 + active_total) ** (252 / n) - 1.0)

def information_ratio(port_r: pd.Series, bench_r: pd.Series) -> float:
    te = tracking_error(port_r, bench_r)
    if te == 0:
        return np.nan
    return active_cagr(port_r, bench_r) / te

def sharpe_ratio(port_r: pd.Series, rf_r: pd.Series | None = None) -> float:
    if rf_r is None:
        ex = port_r
    else:
        ex = port_r - rf_r.reindex(port_r.index)
    vol = ann_vol(ex)
    if vol == 0:
        return np.nan
    return cagr(ex) / vol

eq_port = equity_curve(port_ret)
eq_bench = equity_curve(bench_ret)
beta, alpha_ann = beta_alpha_ols(port_ret, bench_ret)

stats = pd.Series({
    "Start": str(port_ret.index.min().date()),
    "End": str(port_ret.index.max().date()),
    "Trading Days": len(port_ret),
    "Total Return (Republic)": float(eq_port.iloc[-1] - 1.0),
    f"Total Return ({BENCH})": float(eq_bench.iloc[-1] - 1.0),
    "CAGR (Republic)": cagr(port_ret),
    f"CAGR ({BENCH})": cagr(bench_ret),
    "Ann Vol (Republic)": ann_vol(port_ret),
    f"Ann Vol ({BENCH})": ann_vol(bench_ret),
    "Max Drawdown (Republic)": max_drawdown(eq_port),
    f"Max Drawdown ({BENCH})": max_drawdown(eq_bench),
    "Beta vs SPY (Republic)": beta,
    "Alpha vs SPY (ann, approx)": alpha_ann,
    "Correlation vs SPY": float(port_ret.corr(bench_ret)),
    "Tracking Error (ann)": tracking_error(port_ret, bench_ret),
    "Active CAGR (Republic minus SPY)": active_cagr(port_ret, bench_ret),
    "Information Ratio": information_ratio(port_ret, bench_ret),
    "Sharpe (0% RF)": sharpe_ratio(port_ret, None),
    "Sharpe (BIL RF)": sharpe_ratio(port_ret, rf_ret) if rf_ret is not None else np.nan,
})

def pct(x) -> str:
    return f"{x:,.2%}"

print("\n=== Headline Stats ===")
print(f"Total Return (Republic): {pct(stats['Total Return (Republic)'])}")
print(f"Total Return ({BENCH}): {pct(stats[f'Total Return ({BENCH})'])}")
print(f"CAGR (Republic):        {pct(stats['CAGR (Republic)'])}")
print(f"CAGR ({BENCH}):         {pct(stats[f'CAGR ({BENCH})'])}")
print(f"Ann Vol (Republic):     {pct(stats['Ann Vol (Republic)'])}")
print(f"Ann Vol ({BENCH}):      {pct(stats[f'Ann Vol ({BENCH})'])}")
print(f"Max DD (Republic):      {pct(stats['Max Drawdown (Republic)'])}")
print(f"Max DD ({BENCH}):       {pct(stats[f'Max Drawdown ({BENCH})'])}")
print(f"Beta vs SPY:            {stats['Beta vs SPY (Republic)']:.3f}")
print(f"Alpha (ann, approx):    {pct(stats['Alpha vs SPY (ann, approx)'])}")
print(f"Correlation vs SPY:     {pct(stats['Correlation vs SPY'])}")
print(f"Tracking Error (ann):   {pct(stats['Tracking Error (ann)'])}")
print(f"Active CAGR:            {pct(stats['Active CAGR (Republic minus SPY)'])}")
print(f"Information Ratio:      {stats['Information Ratio']:.2f}")
print(f"Sharpe (0% RF):         {stats['Sharpe (0% RF)']:.2f}")
print(f"Sharpe (BIL RF):        {stats['Sharpe (BIL RF)']:.2f}")

mdd_p, p_peak, p_trough, p_rec = max_drawdown_details(eq_port)
mdd_b, b_peak, b_trough, b_rec = max_drawdown_details(eq_bench)

print("\n=== Max Drawdown Details ===")
print(f"Republic MDD: {pct(mdd_p)} | peak: {p_peak.date()} | trough: {p_trough.date()} | recovery: {p_rec.date() if pd.notna(p_rec) else 'Not recovered'}")
print(f"{BENCH} MDD:   {pct(mdd_b)} | peak: {b_peak.date()} | trough: {b_trough.date()} | recovery: {b_rec.date() if pd.notna(b_rec) else 'Not recovered'}")


# =========================
# 6) YEARLY RETURNS TABLE
# =========================

yearly = pd.DataFrame({"Republic": port_ret, BENCH: bench_ret}).resample("YE").apply(lambda x: (1+x).prod()-1)
yearly.index = yearly.index.year

print("\n=== Calendar Year Returns (Republic vs SPY) ===")
print((yearly * 100).round(2).astype(str) + "%")


# =========================
# 7) CONTRIBUTION ANALYSIS
# =========================

ret_mat = rets[common_cols].reindex(port_ret.index)
w_t = w.copy()
contrib_daily = pd.DataFrame(index=port_ret.index, columns=common_cols, dtype=float)

for dt in port_ret.index:
    r_row = ret_mat.loc[dt]
    contrib_daily.loc[dt] = (w_t * r_row).values
    w_t = w_t * (1.0 + r_row)
    w_t = w_t / w_t.sum()

contrib_total = contrib_daily.sum().sort_values(ascending=False)
contrib_share = contrib_total / contrib_total.sum()

print("\n=== Top 10 tickers by contribution share ===")
print((contrib_share.head(10) * 100).round(2).astype(str) + "%")

print("\n=== Bottom 10 tickers by contribution share ===")
print((contrib_share.tail(10) * 100).round(2).astype(str) + "%")

bucket_map = pd.Series({t: BUCKETS.get(t, "Other") for t in contrib_daily.columns})
bucket_contrib_total = contrib_daily.T.groupby(bucket_map).sum().T.sum()
bucket_contrib_share = bucket_contrib_total / bucket_contrib_total.sum()

print("\n=== Bucket contribution shares (normalized) ===")
print((bucket_contrib_share * 100).round(2).astype(str) + "%")


# =========================
# 8) PLOT
# =========================

plt.figure(figsize=(12, 6))
plt.plot(eq_port.index, eq_port.values, label="The Republic Portfolio")
plt.plot(eq_bench.index, eq_bench.values, label=f"S&P 500 ({BENCH})")
plt.title(f"The Republic Portfolio vs S&P 500 — Past {YEARS} Years ($1 Growth)")
plt.xlabel("Date")
plt.ylabel("Growth of $1")
plt.legend()
plt.tight_layout()
plt.show()


# =========================
# 9) EXPORT ARTIFACTS (CSV)
# =========================

equity_out = pd.DataFrame({"Republic": eq_port, BENCH: eq_bench.reindex(eq_port.index)})
equity_out.to_csv(OUT_EQUITY, index=True)
stats.to_frame("Value").to_csv(OUT_STATS, index=True)
yearly.to_csv(OUT_YEARLY, index=True)
contrib_share.to_frame("ContributionShare").to_csv(OUT_TICKER_CONTRIB, index=True)
bucket_contrib_share.to_frame("ContributionShare").to_csv(OUT_BUCKET_CONTRIB, index=True)

print("\nSaved files:")
print(f" - {OUT_EQUITY}")
print(f" - {OUT_STATS}")
print(f" - {OUT_YEARLY}")
print(f" - {OUT_TICKER_CONTRIB}")
print(f" - {OUT_BUCKET_CONTRIB}")