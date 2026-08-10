# ◊ The Republic Portfolio — 10-Year Backtest ◊

A buy-and-hold backtest of **The Republic Portfolio** against the **S&P 500 (SPY)**,
total return, **December 2015 → December 2025**. This is the *prequel* to the live
vigil: the backtest ends the trading day before the Watchtower's live tracking
begins (2026-01-02), so the two never overlap.

Open **`index.html`** in any browser for the interactive chart (hover any date,
mute any line). Everything is self-contained — no build step, no dependencies.

---

## The result (Table 1 — Ten-Year Summary, Buy & Hold)

| Metric | Republic Portfolio | S&P 500 (SPY) |
|---|---|---|
| Total Return | **+311.97%** | +294.66% |
| CAGR | **15.25%** | 14.75% |
| Annualized Volatility | **14.31%** | 18.01% |
| Max Drawdown | **−28.53%** | −33.72% |
| Beta vs SPY | 0.73 | 1.00 |
| $10,000 became | **$41,197** | $39,466 |

Also computed (see `republic_vs_spy_stats_10y.csv`): correlation 0.92, tracking
error 7.37%, active CAGR +0.43%, information ratio 0.06, Sharpe 1.07 (0% RF) /
0.90 (BIL RF).

**The doctrine beat the index by ~17 points over the decade while carrying
materially less risk** — a shallower worst drop, lower volatility, and a beta of
0.73. It earned that edge in the falls, not the melt-ups: in 2022 the Republic
returned **+1.70%** while the S&P fell **−18.18%**; in the 2023 AI run it lagged
(**+10.98%** vs **+26.18%**). Same market, steadier road.

Top return contributors (drifting buy-and-hold weights): CAT 10.8%, DE 8.7%,
MSFT 6.9%, COST 6.6%, WMT 6.3%. By bucket: Engines ~52.5%, Chokepoints ~46.6%,
Reserve ~0.9%.

---

## The rules (what makes it trustworthy)

1. **No clever rebalancing.** Buy-and-hold the founding weights; they drift as winners grow.
2. **Dividends & splits included** — auto-adjusted (total-return) prices throughout.
3. **Benchmark:** the S&P 500, via SPY.
4. **Reserve proxy:** BIL (short-dated Treasury bills), 15%.
5. **Window:** December 2015 – December 2025, 2,514 trading days.
6. **GE complication:** handled via a spin-off value approximation —
   `GE_total ≈ GE + (1/3)·GEHC + (1/4)·GEV`, applied only after each spin-off begins trading
   (GE HealthCare, Jan 2023; GE Vernova, Apr 2024). Plain `GE` alone is misleading — it
   crashed ~73% by 2018 and does not reflect the shares distributed to holders.

The portfolio weights are bespoke within each bucket (not naive equal-weight); see
`WEIGHTS` in `backtest.py` for the exact figures. They sum to 50% Engines / 35%
Chokepoints / 15% Reserve.

---

## Files

| File | What it is |
|---|---|
| `index.html` | Self-contained interactive visualization (chart + Table 1 + per-year ranking + rules). |
| `backtest.py` | The backtest script — exact weights, GE spin-off math, and metrics. Regenerates every CSV below. |
| `republic_vs_spy_equity_10y.csv` | Daily $1-growth equity curves, Republic vs SPY. |
| `republic_vs_spy_stats_10y.csv` | All headline statistics. |
| `republic_vs_spy_yearly_returns_10y.csv` | Calendar-year returns, Republic vs SPY. |
| `republic_ticker_contributions_10y.csv` | Each holding's share of total return. |
| `republic_bucket_contributions_10y.csv` | Each bucket's share of total return. |

The four UBS funds also appear on the chart for context (Dividend Ruler and Quality
Growth from 2020, Mid-Caps USA from 2022, International Sustainable across the full
window). They are independent, plotted from each fund's own inception, and are not
part of the Republic-vs-SPY backtest.

---

## Running it

```bash
pip install yfinance pandas numpy matplotlib
python3 backtest.py
```

By default `END` is pinned to `2025-12-31` (the non-overlapping window). Set
`END = pd.Timestamp.today().normalize()` at the top of the script for a live
rolling 10-year window. The script prints the headline stats and rewrites all five
CSVs; it also saves a PNG if matplotlib is installed.

**Reconciliation note.** An earlier published run of this script reported slightly
higher totals (Republic +322.56% / CAGR 15.54%; S&P +303.99% / 15.02%). That run
used the script's original rolling `END = today`, whose window extended a few weeks
past December 2025 — over a decade the same portfolio simply ends on a different
day. The **volatility and max-drawdown match exactly** either way (−28.53% /
−33.72%). Nothing in this folder is calibrated or hand-entered: the numbers are the
computed output of `backtest.py`, and the chart lines are the equity curves it
produces.

---

## Caveat

This applies a portfolio doctrine *backward* in time. The roster was chosen with
knowledge of how these names performed, so an in-sample edge is expected, not
proof of skill. The only true out-of-sample test is forward and live — which is
exactly what the Watchtower tracks, week by week, from 2026 onward. **Not investment
advice.**

◊ ◈ ◊
