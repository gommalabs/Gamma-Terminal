import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Landing,
  ssr: false,
});

const FUNCTIONS = [
  { code: "CC", label: "Command Center", desc: "Real-time market overview & watchlists" },
  { code: "DES", label: "Security Description", desc: "Company snapshot, fundamentals" },
  { code: "HP", label: "Historical Pricing", desc: "Candlestick charts, multi-timeframe" },
  { code: "OMON", label: "Options Monitor", desc: "Full options chain, IV, Greeks" },
  { code: "MOV", label: "Market Movers", desc: "Gainers, losers, most active" },
  { code: "WEI", label: "World Equity Indices", desc: "Global index performance" },
  { code: "CURV", label: "Yield Curves", desc: "US Treasuries, sovereign rates" },
  { code: "FXC", label: "Currency Cross", desc: "FX pair pricing & history" },
  { code: "CRYPTO", label: "Cryptocurrency", desc: "Digital asset pricing" },
  { code: "FA", label: "Financial Analysis", desc: "Income statement, ratios" },
  { code: "EE", label: "Earnings Estimates", desc: "Analyst consensus & targets" },
  { code: "NI", label: "News", desc: "Real-time market news feed" },
];

function Landing() {
  return (
    <div className="min-h-screen bg-term-black text-term-text font-mono">
      {/* Top status bar */}
      <div className="h-5 border-b border-term-border-strong bg-term-panel flex items-center justify-between px-3 text-[9px] uppercase tracking-widest">
        <div className="flex items-center gap-3">
          <span className="text-term-amber font-bold">GAMMA TERMINAL</span>
          <span className="text-term-textDim">v4.1.0</span>
        </div>
        <div className="flex items-center gap-4 text-term-textDim">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-term-green animate-pulse" /> MARKETS OPEN
          </span>
          <span>NYC 09:34:21</span>
          <span>LON 14:34:21</span>
          <span>HKG 22:34:21</span>
        </div>
      </div>

      {/* Top nav */}
      <header className="border-b border-term-border-strong bg-term-panel">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-term-amber" />
            <span className="text-term-amber font-bold text-sm tracking-[0.2em]">GAMMA</span>
          </div>
          <nav className="flex items-center gap-1">
            <Link to="/login" className="bb-button">SIGN IN</Link>
            <Link to="/signup" className="bb-button" style={{ borderColor: "var(--color-term-amber)", color: "var(--color-term-amber)" }}>
              REQUEST ACCESS
            </Link>
          </nav>
        </div>
      </header>

      {/* Live ticker ribbon */}
      <div className="h-6 border-b border-term-border bg-term-black overflow-hidden flex items-center text-[10px] gap-6 px-3 whitespace-nowrap">
        {[
          ["SPX", "5,847.32", "+0.42%", "green"],
          ["NDX", "20,541.10", "+0.89%", "green"],
          ["DJI", "43,275.64", "-0.12%", "red"],
          ["VIX", "14.21", "-3.4%", "red"],
          ["UST10Y", "4.215", "+1.2bps", "green"],
          ["EURUSD", "1.0832", "-0.18%", "red"],
          ["BTC", "98,142", "+2.1%", "green"],
          ["GC", "2,718.40", "+0.5%", "green"],
          ["CL", "71.82", "-1.1%", "red"],
        ].map(([s, p, c, color]) => (
          <span key={s} className="flex items-center gap-1">
            <span className="text-term-amber font-bold">{s}</span>
            <span className="text-term-text">{p}</span>
            <span className={color === "green" ? "text-term-green" : "text-term-red"}>{c}</span>
          </span>
        ))}
      </div>

      {/* Hero */}
      <section className="border-b border-term-border-strong">
        <div className="max-w-[1400px] mx-auto px-6 py-20 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-7">
            <div className="text-[10px] text-term-amber tracking-[0.3em] uppercase mb-4">
              ▍ Institutional-grade infrastructure
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-term-heading leading-[1.05] tracking-tight">
              The terminal<br/>
              <span className="text-term-amber">elite traders</span><br/>
              run on.
            </h1>
            <p className="mt-6 text-term-textDim text-sm max-w-lg leading-relaxed">
              Real-time multi-asset data, options analytics, derivatives pricing, news, and execution
              — engineered for hedge funds, prop desks, and quantitative analysts who refuse to wait.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <Link to="/signup" className="bb-button" style={{ background: "var(--color-term-amber)", color: "#000", borderColor: "var(--color-term-amber)", padding: "6px 16px", fontSize: "10px" }}>
                ▶ LAUNCH TERMINAL
              </Link>
              <Link to="/login" className="bb-button" style={{ padding: "6px 16px", fontSize: "10px" }}>
                EXISTING USER LOGIN
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
              {[["340K+", "ACTIVE TERMINALS"], ["<8ms", "QUOTE LATENCY"], ["99.99%", "UPTIME SLA"]].map(([v, k]) => (
                <div key={k} className="border-l-2 border-term-amber pl-3">
                  <div className="text-term-heading text-xl font-bold">{v}</div>
                  <div className="text-[8px] text-term-textDim tracking-widest mt-1">{k}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Mock terminal preview */}
          <div className="col-span-12 md:col-span-5 bb-panel">
            <div className="bb-header flex items-center justify-between">
              <span>CC ▸ COMMAND CENTER</span>
              <span className="bb-status-live"><span className="bb-status-dot"/>LIVE</span>
            </div>
            <table className="bb-table">
              <thead><tr><th>SYM</th><th>LAST</th><th>CHG</th><th>%</th><th>VOL</th></tr></thead>
              <tbody>
                {[
                  ["AAPL", "182.52", "+2.34", "+1.30", "52.3M", "green"],
                  ["MSFT", "415.30", "+2.50", "+0.61", "23.5M", "green"],
                  ["NVDA", "875.30", "+15.6", "+1.81", "45.7M", "green"],
                  ["TSLA", "245.67", "-5.23", "-2.08", "98.8M", "red"],
                  ["GOOGL", "156.80", "+1.60", "+1.03", "28.9M", "green"],
                  ["META", "521.40", "-3.10", "-0.59", "18.4M", "red"],
                  ["AMZN", "184.72", "+0.94", "+0.51", "31.2M", "green"],
                ].map(([s, p, c, pct, v, color]) => (
                  <tr key={s}>
                    <td className="text-term-amber font-bold">{s}</td>
                    <td className="text-right">{p}</td>
                    <td className={`text-right ${color === "green" ? "text-term-green" : "text-term-red"}`}>{c}</td>
                    <td className={`text-right ${color === "green" ? "text-term-green" : "text-term-red"}`}>{pct}</td>
                    <td className="text-right text-term-textDim">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t border-term-border-strong p-2 flex items-center gap-2 text-[9px] text-term-textDim">
              <span className="bb-fkey">F1</span> HELP
              <span className="bb-fkey">F2</span> SCAN
              <span className="bb-fkey">F3</span> ORDER
              <span className="bb-fkey">F8</span> NEWS
            </div>
          </div>
        </div>
      </section>

      {/* Function catalog */}
      <section className="border-b border-term-border-strong">
        <div className="max-w-[1400px] mx-auto px-6 py-12">
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="text-[10px] text-term-amber tracking-[0.3em] uppercase mb-2">▍ Function Library</div>
              <h2 className="text-2xl font-bold text-term-heading">17 functions. One mnemonic each.</h2>
            </div>
            <div className="text-[9px] text-term-textDim uppercase tracking-widest">PRESS [ : ] FROM ANY SCREEN</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-term-border">
            {FUNCTIONS.map((f) => (
              <div key={f.code} className="bg-term-panel p-4 hover:bg-term-panel2 transition-none">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bb-fkey">{f.code}</span>
                  <span className="text-term-text text-xs uppercase tracking-wider font-bold">{f.label}</span>
                </div>
                <div className="text-term-textDim text-[10px] mt-1">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities grid */}
      <section className="border-b border-term-border-strong">
        <div className="max-w-[1400px] mx-auto px-6 py-12">
          <div className="text-[10px] text-term-amber tracking-[0.3em] uppercase mb-2">▍ Built for the desk</div>
          <h2 className="text-2xl font-bold text-term-heading mb-8">Mission-critical infrastructure.</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-term-border">
            {[
              ["MULTI-ASSET", "Equities, options, fixed income, FX, crypto, commodities — one keyboard."],
              ["KEYBOARD-FIRST", "Function-key driven workflows. Mouse optional. Trade at the speed of thought."],
              ["LOW LATENCY", "Sub-10ms quote streaming. Flicker-free updates. Built for 16-hour sessions."],
              ["EXECUTION", "Direct broker connectivity. Smart order routing. Multi-venue access."],
            ].map(([t, d]) => (
              <div key={t} className="bg-term-black p-6">
                <div className="text-term-amber text-[10px] tracking-[0.2em] font-bold mb-3">▶ {t}</div>
                <div className="text-term-text text-xs leading-relaxed">{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b border-term-border-strong">
        <div className="max-w-[1400px] mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-term-heading mb-3">Get terminal access.</h2>
          <p className="text-term-textDim text-sm mb-6">Email signup. Phone-verified login. Connect your broker. Start trading.</p>
          <Link to="/signup" className="bb-button inline-block" style={{ background: "var(--color-term-amber)", color: "#000", borderColor: "var(--color-term-amber)", padding: "8px 24px", fontSize: "11px" }}>
            ▶ REQUEST TERMINAL ACCESS
          </Link>
        </div>
      </section>

      <footer className="bg-term-panel">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between text-[9px] text-term-textDim uppercase tracking-widest">
          <div>© 2026 GAMMA LABS — INSTITUTIONAL FINANCIAL INFRASTRUCTURE</div>
          <div className="flex gap-4">
            <span>STATUS: OPERATIONAL</span>
            <span>SOC2 TYPE II</span>
            <span>FINRA REG NMS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
