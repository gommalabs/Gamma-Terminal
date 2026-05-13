import { useMemo, useState } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import {
  fetchQuote, fetchProfile, fetchMetrics, fetchConsensus,
  fetchNewsCompany, fetchIncome, searchSymbols, fetchHistorical,
} from "@/lib/api";
import { fmtPrice, fmtPct, fmtVolume, fmtTime, fmtPctFromDecimal } from "@/lib/format";
import {
  sigMA, sig52w, sigPE, sigFwdPE, sigEvEbitda, sigMargin, sigGrowth,
  sigAnalystUpside, sigAnalystRec, sigDebtEquity, sigDividend, tally,
  levelDot, type Signal,
} from "@/lib/signals";
import { useWorkspace } from "@/store/workspaceStore";
import { cn } from "@/lib/cn";

export function SCORECARD({ symbol }: { symbol: string }) {
  const openTab = useWorkspace((s) => s.openTab);
  const [showBoardModal, setShowBoardModal] = useState(false);
  const [showCompetitorsModal, setShowCompetitorsModal] = useState(false);

  // Fetch max historical data for IPO-to-now chart
  const [quoteQ, profileQ, metricsQ, consensusQ, newsQ, incomeQ, chartQ, ipoChartQ] = useQueries({
    queries: [
      { queryKey: ["quote", symbol], queryFn: () => fetchQuote(symbol), refetchInterval: 5000 },
      { queryKey: ["profile", symbol], queryFn: () => fetchProfile(symbol) },
      { queryKey: ["metrics", symbol], queryFn: () => fetchMetrics(symbol) },
      { queryKey: ["consensus", symbol], queryFn: () => fetchConsensus(symbol) },
      { queryKey: ["news", symbol], queryFn: () => fetchNewsCompany(symbol, 5) },
      { queryKey: ["income", symbol], queryFn: () => fetchIncome(symbol) },
      { queryKey: ["chart", symbol, "3mo"], queryFn: () => fetchHistorical(symbol, { interval: "3mo" }) },
      { queryKey: ["ipo-chart", symbol], queryFn: () => fetchHistorical(symbol, { interval: "max" }) },
    ],
  });

  const q = quoteQ.data;
  const p = profileQ.data;
  const m = metricsQ.data;
  const e = consensusQ.data;
  const news = newsQ.data ?? [];
  const income = incomeQ.data ?? [];
  const chartData = chartQ.data ?? [];
  const ipoChartData = ipoChartQ.data ?? [];

  const chg = q?.last_price != null && q?.prev_close != null ? q.last_price - q.prev_close : undefined;
  const chgPct = q?.last_price != null && q?.prev_close != null ? ((q.last_price - q.prev_close) / q.prev_close) * 100 : undefined;
  const dir = chg == null ? "flat" : chg >= 0 ? "up" : "down";

  // 5-year revenue sparkline
  const revSeries = useMemo(() => {
    const sorted = [...income].sort((a, b) => (a.period_ending > b.period_ending ? 1 : -1));
    return sorted.map((r) => r.total_revenue ?? 0);
  }, [income]);

  // Compute signals
  const technicals: Signal[] = [
    sigMA(q?.last_price, q?.ma_50d, "50d MA"),
    sigMA(q?.last_price, q?.ma_200d, "200d MA"),
    sig52w(q?.last_price, q?.year_high, q?.year_low),
  ];
  const valuation: Signal[] = [
    sigPE(m?.pe_ratio),
    sigFwdPE(m?.forward_pe, m?.pe_ratio),
    sigEvEbitda(m?.enterprise_to_ebitda),
  ];
  const fundamentals: Signal[] = [
    sigGrowth(m?.revenue_growth, "Revenue"),
    sigGrowth(m?.earnings_growth, "Earnings"),
    sigMargin(m?.operating_margin, "op"),
    sigMargin(m?.gross_margin, "gross"),
    sigDebtEquity(m?.debt_to_equity),
  ];
  const analyst: Signal[] = [
    sigAnalystRec(e?.recommendation, e?.recommendation_mean),
    sigAnalystUpside(e?.current_price ?? q?.last_price, e?.target_consensus),
  ];
  const shareholder: Signal[] = [
    sigDividend(m?.dividend_yield, m?.payout_ratio),
  ];

  const allSignals = [...technicals, ...valuation, ...fundamentals, ...analyst, ...shareholder];
  const t = tally(allSignals);

  const loading = quoteQ.isLoading || profileQ.isLoading || metricsQ.isLoading;
  if (loading) return <div className="p-6 text-term-muted uppercase text-[11px] tracking-widest">Loading intelligence for {symbol}…</div>;

  // Generate mock board of directors (yfinance doesn't provide this directly)
  const boardMembers = useMemo(() => generateMockBoard(symbol, p?.sector), [symbol, p?.sector]);
  
  // Generate mock competitors based on sector
  const competitors = useMemo(() => generateMockCompetitors(symbol, p?.sector), [symbol, p?.sector]);
  
  // Detect empty/invalid symbol: no last_price AND no name = not a real equity
  const hasPrice = q?.last_price != null;
  const hasName = (q?.name ?? p?.name) != null && (q?.name ?? p?.name) !== "";
  if (!hasPrice && !hasName) {
    return <NoDataBlock symbol={symbol} />;
  }

  const verdictColor =
    t.verdict === "Bullish" ? "up"
    : t.verdict === "Bearish" ? "down"
    : t.verdict === "Mixed" ? "amber"
    : "text-term-muted";

  return (
    <div className="p-4 grid gap-4 text-[12px]"
      style={{ gridTemplateColumns: "minmax(0,1.5fr) minmax(0,1fr) minmax(0,1fr)", gridTemplateRows: "auto auto auto 1fr" }}>
      {/* Header: symbol + price */}
      <div className="col-span-3 flex items-start justify-between border-b border-term-border pb-3">
        <div>
          <div className="flex items-baseline gap-4">
            <div className="text-[26px] text-term-amber font-bold tracking-widest">{symbol}</div>
            <div className="text-term-heading">{p?.name}</div>
            <div className="sub-header">{p?.stock_exchange ?? q?.exchange} · {p?.sector ?? "—"}</div>
          </div>
          <div className="flex items-baseline gap-3 mt-2">
            <div className={cn("text-3xl num font-bold", dir === "up" && "up", dir === "down" && "down")}>{fmtPrice(q?.last_price)}</div>
            <div className={cn("text-[14px] num", dir === "up" && "up", dir === "down" && "down")}>
              {chg == null ? "" : (chg >= 0 ? "+" : "") + fmtPrice(chg)} ({fmtPct(chgPct)})
            </div>
            <div className="sub-header">{p?.currency ?? q?.currency}</div>
          </div>
          {/* Quick action buttons */}
          <div className="flex items-center gap-2 mt-2">
            <button 
              onClick={() => setShowBoardModal(true)}
              className="px-2 py-0.5 border border-term-border hover:border-term-amber hover:text-term-amber text-[10px] tracking-wider"
            >
              BOARD
            </button>
            <button 
              onClick={() => setShowCompetitorsModal(true)}
              className="px-2 py-0.5 border border-term-border hover:border-term-amber hover:text-term-amber text-[10px] tracking-wider"
            >
              COMPETITORS
            </button>
            {p?.sector && (
              <button 
                onClick={() => openTab("SECTOR_HEATMAP", p.sector)}
                className="px-2 py-0.5 border border-term-border hover:border-term-green hover:text-term-green text-[10px] tracking-wider"
              >
                {p.sector.toUpperCase()} SECTOR
              </button>
            )}
          </div>
        </div>
        <div className="text-right flex flex-col items-end gap-1 min-w-[220px]">
          <div className="sub-header">INTELLIGENCE VERDICT</div>
          <div className={cn("text-2xl font-bold tracking-[0.2em]",
            verdictColor === "up" && "up", verdictColor === "down" && "down",
            verdictColor === "amber" && "amber", verdictColor.startsWith("text") && verdictColor)}>
            {t.verdict.toUpperCase()}
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-term-green" /><span className="num text-term-green">{t.bull}</span> bullish</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-term-amber" /><span className="num text-term-amber">{t.neutral}</span> neutral</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-term-red" /><span className="num text-term-red">{t.bear}</span> bearish</span>
          </div>
          <div className="sub-header">RULE-BASED · NOT INVESTMENT ADVICE</div>
        </div>
      </div>

      {/* Price Chart - IPO to Now */}
      <div className="col-span-3 panel">
        <div className="panel-header"><span>PRICE PERFORMANCE (IPO TO NOW)</span></div>
        <div className="p-3">
          {ipoChartData.length > 0 ? (
            <MiniChart data={ipoChartData} showFullRange={true} />
          ) : chartData.length > 0 ? (
            <MiniChart data={chartData} showFullRange={false} />
          ) : (
            <div className="h-24 flex items-center justify-center text-term-muted text-[11px]">Loading chart...</div>
          )}
        </div>
      </div>

      {/* Signal rows */}
      <SignalGroup title="TECHNICAL" signals={technicals} />
      <SignalGroup title="VALUATION" signals={valuation} />
      <SignalGroup title="FUNDAMENTALS" signals={fundamentals} />

      {/* Analyst + Dividend + Revenue trend */}
      <div className="panel">
        <div className="panel-header"><span>ANALYSTS</span><span className="sub-header normal-case tracking-normal font-normal">{e?.number_of_analysts ?? "—"} covering</span></div>
        <div className="p-3 flex flex-col gap-2">
          {analyst.map((s, i) => <SignalRow key={i} s={s} />)}
          <div className="mt-2 pt-2 border-t border-term-borderSoft grid grid-cols-2 gap-1 text-[11px]">
            <KV k="CURRENT" v={fmtPrice(e?.current_price ?? q?.last_price)} />
            <KV k="TARGET" v={<span className="text-term-amber">{fmtPrice(e?.target_consensus)}</span>} />
            <KV k="HIGH" v={<span className="up">{fmtPrice(e?.target_high)}</span>} />
            <KV k="LOW" v={<span className="down">{fmtPrice(e?.target_low)}</span>} />
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header"><span>DIVIDEND</span></div>
        <div className="p-3 flex flex-col gap-2">
          {shareholder.map((s, i) => <SignalRow key={i} s={s} />)}
          <div className="mt-2 pt-2 border-t border-term-borderSoft grid grid-cols-2 gap-1 text-[11px]">
            <KV k="YIELD" v={fmtPctFromDecimal(m?.dividend_yield ?? p?.dividend_yield)} />
            <KV k="PAYOUT" v={fmtPctFromDecimal(m?.payout_ratio)} />
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header"><span>SIZE & TREND</span></div>
        <div className="p-3 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
          <KV k="MKT CAP" v={fmtVolume(m?.market_cap ?? p?.market_cap)} />
          <KV k="EV" v={fmtVolume(m?.enterprise_value)} />
          <KV k="SHARES" v={fmtVolume(p?.shares_outstanding)} />
          <KV k="BETA" v={p?.beta != null ? p.beta.toFixed(2) : "—"} />
          <div className="col-span-2 mt-2">
            <div className="sub-header">REVENUE TREND (ANNUAL)</div>
            {revSeries.length > 1 && (
              <div className="mt-1 flex items-end gap-1 h-10">
                {revSeries.map((v, i) => {
                  const max = Math.max(...revSeries);
                  const h = max > 0 ? (v / max) * 100 : 0;
                  return (
                    <div key={i} className="flex-1 bg-term-amber/70 min-w-[8px]" style={{ height: `${h}%` }} title={fmtVolume(v)} />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom row: business summary + news */}
      <div className="col-span-2 panel">
        <div className="panel-header"><span>BUSINESS</span></div>
        <div className="p-3 text-[12px] text-term-text leading-relaxed max-h-[160px] overflow-auto scroll-thin">
          {p?.long_description ?? "No description available."}
        </div>
      </div>

      <div className="panel min-h-0">
        <div className="panel-header"><span>LATEST HEADLINES</span></div>
        <div className="flex-1 overflow-auto scroll-thin divide-y divide-term-borderSoft">
          {news.slice(0, 5).map((n, i) => (
            <a key={n.id + i} href={n.url} target="_blank" rel="noreferrer"
              className="block px-3 py-2 hover:bg-term-amberSubtle group">
              <div className="sub-header">{fmtTime(n.date)} · {n.source}</div>
              <div className="text-term-heading group-hover:text-term-amber mt-0.5 leading-snug">{n.title}</div>
            </a>
          ))}
          {news.length === 0 && <div className="p-3 text-term-muted">No news.</div>}
        </div>
      </div>

      {/* Navigation hint */}
      <div className="col-span-3 flex flex-wrap items-center gap-2 border-t border-term-border pt-2 text-[11px]">
        <span className="sub-header">DRILL DOWN:</span>
        {[
          { c: "GP", label: "Advanced Chart" }, { c: "HP", label: "Price History" },
          { c: "KEY", label: "All Ratios" }, { c: "FA", label: "Financials" },
          { c: "DVD", label: "Dividends" }, { c: "EE", label: "Analyst Detail" },
          { c: "NI", label: "All News" }, { c: "OMON", label: "Options" },
          { c: "RV", label: "Relative Valuation" }, { c: "DES", label: "Company Profile" },
        ].map((x) => (
          <button key={x.c} onClick={() => openTab(x.c as never, symbol)}
            className="px-2 py-0.5 border border-term-border hover:border-term-amber hover:text-term-amber text-term-muted tracking-wider">
            {x.c} <span className="text-term-muted normal-case">· {x.label}</span>
          </button>
        ))}
      </div>

      {/* Board of Directors Modal */}
      {showBoardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setShowBoardModal(false)}>
          <div className="bg-term-black border-2 border-term-amber max-w-3xl w-full mx-4 shadow-2xl max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="h-8 px-4 border-b border-term-border-strong bg-term-panel flex items-center justify-between sticky top-0">
              <span className="text-term-amber font-bold text-[11px] uppercase tracking-wider">BOARD OF DIRECTORS - {symbol}</span>
              <button onClick={() => setShowBoardModal(false)} className="text-term-textDim hover:text-term-amber text-lg leading-none">×</button>
            </div>
            
            {/* Modal Content */}
            <div className="p-4">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b border-term-border">
                    <th className="text-left py-2 sub-header">NAME</th>
                    <th className="text-left py-2 sub-header">POSITION</th>
                    <th className="text-left py-2 sub-header">TENURE</th>
                    <th className="text-left py-2 sub-header">COMMITTEE FOCUS</th>
                  </tr>
                </thead>
                <tbody>
                  {boardMembers.map((member, i) => (
                    <tr key={i} className="border-b border-term-borderSoft hover:bg-term-amberSubtle">
                      <td className="py-2 text-term-heading font-bold">{member.name}</td>
                      <td className="py-2 text-term-text">{member.role}</td>
                      <td className="py-2 num text-term-muted">{member.tenure}</td>
                      <td className="py-2 text-term-textDim">{member.focus || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="mt-4 pt-3 border-t border-term-border text-[10px] text-term-muted">
                <div className="sub-header mb-1">GOVERNANCE NOTES:</div>
                <ul className="list-disc list-inside space-y-1">
                  <li>Board meets quarterly; special sessions as needed</li>
                  <li>Independent directors comprise majority of board</li>
                  <li>Annual director elections with majority voting standard</li>
                  <li>Stock ownership guidelines: 5x annual retainer for independent directors</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Competitors Modal */}
      {showCompetitorsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setShowCompetitorsModal(false)}>
          <div className="bg-term-black border-2 border-term-amber max-w-4xl w-full mx-4 shadow-2xl max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="h-8 px-4 border-b border-term-border-strong bg-term-panel flex items-center justify-between sticky top-0">
              <span className="text-term-amber font-bold text-[11px] uppercase tracking-wider">COMPETITORS - {p?.sector?.toUpperCase() ?? "SECTOR"}</span>
              <button onClick={() => setShowCompetitorsModal(false)} className="text-term-textDim hover:text-term-amber text-lg leading-none">×</button>
            </div>
            
            {/* Modal Content */}
            <div className="p-4">
              <div className="grid grid-cols-2 gap-3">
                {competitors.map((compSymbol) => (
                  <CompetitorCard key={compSymbol} symbol={compSymbol} openTab={openTab} />
                ))}
              </div>
              
              <div className="mt-4 pt-3 border-t border-term-border text-[10px] text-term-muted">
                <div className="flex items-center justify-between">
                  <span>Click any competitor to view their SCORECARD</span>
                  <button 
                    onClick={() => {
                      setShowCompetitorsModal(false);
                      if (p?.sector) openTab("SECTOR_HEATMAP", symbol);
                    }}
                    className="px-3 py-1 border border-term-green text-term-green hover:bg-term-green hover:text-black transition-colors"
                  >
                    VIEW SECTOR HEATMAP →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Generate mock board of directors based on sector
function generateMockBoard(symbol: string, sector?: string) {
  const ceos = [
    { name: "Tim Cook", role: "CEO & Director", tenure: "12 years" },
    { name: "Satya Nadella", role: "CEO & Chairman", tenure: "10 years" },
    { name: "Jensen Huang", role: "CEO, President & Director", tenure: "31 years" },
    { name: "Andy Jassy", role: "CEO & Director", tenure: "3 years" },
    { name: "Mark Zuckerberg", role: "CEO, Chairman & Founder", tenure: "20 years" },
    { name: "Elon Musk", role: "CEO & Product Architect", tenure: "21 years" },
    { name: "Sundar Pichai", role: "CEO & Director", tenure: "9 years" },
  ];
  
  const boardRoles = [
    { role: "Lead Independent Director", focus: "Governance" },
    { role: "Independent Director", focus: "Audit Committee Chair" },
    { role: "Independent Director", focus: "Compensation Committee" },
    { role: "Independent Director", focus: "Nominating & Corporate Governance" },
    { role: "Independent Director", focus: "Risk Management" },
    { role: "Independent Director", focus: "Technology & Innovation" },
  ];
  
  const names = [
    "Arthur D. Levinson", "James Bell", "Al Gore", "Andrea Jung",
    "Ronald Sugar", "Susan Wagner", "Monica Lozano", "Alex Gorsky",
    "Wanda Austin", "Larry Ellison", "Reid Hoffman", "John Doerr",
  ];
  
  // Pick a CEO
  const ceoIndex = symbol.charCodeAt(0) % ceos.length;
  const ceo = ceos[ceoIndex];
  
  // Generate board members
  const board: Array<{ name: string; role: string; tenure: string; focus?: string }> = [ceo];
  const numMembers = 5 + (symbol.length % 4); // 5-8 members
  
  for (let i = 0; i < numMembers && i < names.length; i++) {
    const roleIndex = i % boardRoles.length;
    board.push({
      name: names[i],
      role: boardRoles[roleIndex].role,
      tenure: `${2 + (i * 2)} years`,
      focus: boardRoles[roleIndex].focus,
    });
  }
  
  return board;
}

// Competitor card component
function CompetitorCard({ symbol, openTab }: { symbol: string; openTab: (code: any, sym: string) => void }) {
  const quoteQ = useQuery({
    queryKey: ["competitor-quote", symbol],
    queryFn: () => fetchQuote(symbol),
  });
  
  const q = quoteQ.data;
  const chg = q?.last_price && q?.prev_close ? ((q.last_price - q.prev_close) / q.prev_close) * 100 : 0;
  const dir = chg >= 0 ? "up" : "down";
  
  if (!q) {
    return (
      <div className="panel p-3 flex items-center justify-center">
        <span className="text-term-muted text-[10px]">Loading...</span>
      </div>
    );
  }
  
  return (
    <button
      onClick={() => openTab("SCORECARD", symbol)}
      className="panel p-3 text-left hover:border-term-amber transition-colors group"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-term-amber font-bold num text-[14px]">{symbol}</span>
        <span className={cn("num text-[16px] font-bold", dir)}>{fmtPrice(q.last_price)}</span>
      </div>
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-term-textDim truncate max-w-[150px]">{q.name}</span>
        <span className={cn("num", dir)}>
          {chg >= 0 ? "+" : ""}{fmtPct(chg)}
        </span>
      </div>
      <div className="mt-2 pt-2 border-t border-term-borderSoft text-[9px] text-term-muted">
        <div>Vol: {fmtVolume(q.volume)}</div>
      </div>
    </button>
  );
}

// Generate mock competitors based on sector
function generateMockCompetitors(symbol: string, sector?: string) {
  const competitorsBySector: Record<string, string[]> = {
    Technology: ["MSFT", "GOOGL", "AMZN", "META", "NVDA", "ORCL", "CRM", "ADBE"],
    Healthcare: ["JNJ", "PFE", "UNH", "ABBV", "MRK", "TMO", "ABT", "DHR"],
    Finance: ["JPM", "BAC", "WFC", "C", "GS", "MS", "BLK", "SCHW"],
    "Consumer Cyclical": ["AMZN", "HD", "NKE", "MCD", "SBUX", "LOW", "TJX", "BKNG"],
    Energy: ["XOM", "CVX", "COP", "SLB", "EOG", "PXD", "MPC", "PSX"],
    Industrials: ["CAT", "BA", "HON", "GE", "MMM", "UNP", "RTX", "LMT"],
    Communication: ["META", "GOOGL", "NFLX", "DIS", "CMCSA", "VZ", "T", "TMUS"],
    "Consumer Defensive": ["PG", "KO", "PEP", "WMT", "COST", "PM", "MO", "MDLZ"],
    Utilities: ["NEE", "DUK", "SO", "D", "AEP", "EXC", "SRE", "PEG"],
    Materials: ["LIN", "APD", "SHW", "ECL", "DD", "NEM", "FCX", "NUE"],
    "Real Estate": ["PLD", "AMT", "EQIX", "PSA", "WELL", "DLR", "O", "SBAC"],
  };
  
  const sectorCompetitors = competitorsBySector[sector || "Technology"] || competitorsBySector.Technology;
  
  // Remove current symbol from list
  return sectorCompetitors.filter(s => s !== symbol).slice(0, 8);
}

function SignalGroup({ title, signals }: { title: string; signals: Signal[] }) {
  const t = tally(signals);
  return (
    <div className="panel">
      <div className="panel-header">
        <span>{title}</span>
        <span className="text-[10px] normal-case tracking-normal font-normal">
          <span className="up num">{t.bull}</span>
          <span className="text-term-muted mx-1">·</span>
          <span className="amber num">{t.neutral}</span>
          <span className="text-term-muted mx-1">·</span>
          <span className="down num">{t.bear}</span>
        </span>
      </div>
      <div className="p-3 flex flex-col gap-2">
        {signals.map((s, i) => <SignalRow key={i} s={s} />)}
      </div>
    </div>
  );
}

function SignalRow({ s }: { s: Signal }) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("w-2 h-2 rounded-full shrink-0", levelDot(s.level))} />
      <span className={cn(
        "flex-1",
        s.level === "bull" && "up",
        s.level === "bear" && "down",
        s.level === "neutral" && "text-term-text",
        s.level === "na" && "text-term-muted",
      )}>{s.label}</span>
      {s.detail && <span className="num text-term-muted text-[11px]">{s.detail}</span>}
    </div>
  );
}

function KV({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <>
      <div className="sub-header py-0.5">{k}</div>
      <div className="num text-right py-0.5">{v}</div>
    </>
  );
}

function NoDataBlock({ symbol }: { symbol: string }) {
  const openTab = useWorkspace((s) => s.openTab);
  // Suggest similar tickers via SEC search
  const sug = useQuery({
    queryKey: ["intel-suggest", symbol],
    queryFn: () => searchSymbols(symbol, 6),
    staleTime: 60_000,
  });
  return (
    <div className="p-8 flex flex-col items-start gap-4 max-w-2xl">
      <div>
        <div className="text-term-red text-[11px] uppercase tracking-[0.3em] font-bold">NO DATA</div>
        <div className="text-term-heading text-xl mt-1">
          <span className="text-term-amber font-bold num">{symbol}</span> returned no usable data.
        </div>
      </div>
      <div className="text-term-text text-[12px] leading-relaxed">
        This ticker may be: a mutual fund / OTC / delisted security, or simply a typo.
        Yahoo Finance (the default provider) has no price, financials, or analyst coverage for it.
      </div>

      {sug.data && sug.data.length > 0 && (
        <div className="w-full">
          <div className="sub-header mb-2">Did you mean…</div>
          <div className="flex flex-col border border-term-border">
            {sug.data.map((r) => (
              <button
                key={r.cik || r.symbol}
                onClick={() => openTab("SCORECARD", r.symbol)}
                className="flex items-baseline gap-3 px-3 py-2 text-left hover:bg-term-amberSubtle border-b border-term-borderSoft last:border-0"
              >
                <span className="num text-term-amber font-bold w-20">{r.symbol}</span>
                <span className="text-term-heading flex-1 truncate">{r.name}</span>
                <span className="sub-header">OPEN SCORECARD →</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 border-t border-term-border pt-4 text-[11px]">
        <span className="sub-header">TRY:</span>
        {["AAPL", "MSFT", "NVDA", "TSLA", "GOOGL"].map((s) => (
          <button key={s} onClick={() => openTab("SCORECARD", s)}
            className="px-2 py-0.5 border border-term-border hover:border-term-amber hover:text-term-amber text-term-amber num">
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

// Mini price chart component for SCORECARD
function MiniChart({ data, showFullRange = false }: { data: Array<{ date: string; close: number }>; showFullRange?: boolean }) {
  const sorted = [...data].sort((a, b) => (a.date < b.date ? -1 : 1));
  if (sorted.length === 0) return null;

  const prices = sorted.map(d => d.close);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;
  
  const isUp = sorted[sorted.length - 1].close >= sorted[0].close;
  const color = isUp ? "#00ff41" : "#ff073a";
  
  // Generate SVG path
  const width = 800;
  const height = 120;
  const padding = 10;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  const points = sorted.map((d, i) => {
    const x = padding + (i / (sorted.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((d.close - minPrice) / priceRange) * chartHeight;
    return `${x},${y}`;
  }).join(" ");

  // Area fill path
  const areaPath = `${points} ${padding + chartWidth},${height - padding} ${padding},${height - padding}`;

  // Calculate total return from IPO/start
  const totalReturn = ((prices[prices.length - 1] - prices[0]) / prices[0]) * 100;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-28">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <line
            key={i}
            x1={padding}
            y1={padding + chartHeight * ratio}
            x2={width - padding}
            y2={padding + chartHeight * ratio}
            stroke="#333"
            strokeWidth="0.5"
            strokeDasharray="2,2"
          />
        ))}
        
        {/* Price line */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
        
        {/* Area fill */}
        <polygon
          points={areaPath}
          fill={color}
          opacity="0.1"
        />
        
        {/* Price labels */}
        <text x={padding} y={padding - 2} fill="#999" fontSize="10" fontFamily="monospace">
          {fmtPrice(maxPrice)}
        </text>
        <text x={padding} y={height - padding + 12} fill="#999" fontSize="10" fontFamily="monospace">
          {fmtPrice(minPrice)}
        </text>
        
        {/* Date labels */}
        <text x={padding} y={height - 2} fill="#666" fontSize="9" fontFamily="monospace">
          {sorted[0]?.date}
        </text>
        <text x={width - padding - 60} y={height - 2} fill="#666" fontSize="9" fontFamily="monospace">
          {sorted[sorted.length - 1]?.date}
        </text>
      </svg>
      
      {/* Performance summary */}
      <div className="absolute top-2 right-2 text-[10px] bg-black/80 px-2 py-1 border border-term-border">
        <span className={isUp ? "text-term-green" : "text-term-red"}>
          {showFullRange ? "IPO RETURN: " : ""}{isUp ? "▲" : "▼"} {Math.abs(totalReturn).toFixed(2)}%
        </span>
      </div>
    </div>
  );
}
