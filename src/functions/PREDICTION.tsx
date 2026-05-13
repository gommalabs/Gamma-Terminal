import { useState } from "react";
import { cn } from "@/lib/cn";

interface PredictionMarket {
  id: string;
  question: string;
  category: "politics" | "economics" | "crypto" | "tech" | "sports";
  yesPrice: number;
  noPrice: number;
  volume: number;
  endDate: string;
  trend: "up" | "down" | "flat";
}

const MOCK_PREDICTIONS: PredictionMarket[] = [
  {
    id: "fed-rate-2026",
    question: "Will Fed cut rates by March 2026?",
    category: "economics",
    yesPrice: 0.72,
    noPrice: 0.28,
    volume: 15234567,
    endDate: "2026-03-31",
    trend: "up",
  },
  {
    id: "btc-100k",
    question: "Will BTC hit $100K in 2026?",
    category: "crypto",
    yesPrice: 0.58,
    noPrice: 0.42,
    volume: 28945123,
    endDate: "2026-12-31",
    trend: "up",
  },
  {
    id: "us-election-2028",
    question: "Republican wins 2028 Presidential Election?",
    category: "politics",
    yesPrice: 0.51,
    noPrice: 0.49,
    volume: 45678901,
    endDate: "2028-11-07",
    trend: "flat",
  },
  {
    id: "nvda-1000",
    question: "Will NVDA reach $1000 by Q2 2026?",
    category: "tech",
    yesPrice: 0.43,
    noPrice: 0.57,
    volume: 12345678,
    endDate: "2026-06-30",
    trend: "down",
  },
  {
    id: "sp500-6000",
    question: "Will S&P 500 close above 6000 in 2026?",
    category: "economics",
    yesPrice: 0.65,
    noPrice: 0.35,
    volume: 19876543,
    endDate: "2026-12-31",
    trend: "up",
  },
  {
    id: "eth-etf",
    question: "ETH ETF approved by SEC in 2026?",
    category: "crypto",
    yesPrice: 0.82,
    noPrice: 0.18,
    volume: 8765432,
    endDate: "2026-09-30",
    trend: "up",
  },
  {
    id: "recession-2026",
    question: "US enters recession in 2026?",
    category: "economics",
    yesPrice: 0.35,
    noPrice: 0.65,
    volume: 23456789,
    endDate: "2026-12-31",
    trend: "down",
  },
  {
    id: "ai-regulation",
    question: "Major AI regulation passed in US by 2027?",
    category: "tech",
    yesPrice: 0.67,
    noPrice: 0.33,
    volume: 6543210,
    endDate: "2027-12-31",
    trend: "up",
  },
];

const CATEGORIES = [
  { id: "all", label: "ALL MARKETS" },
  { id: "economics", label: "ECONOMICS" },
  { id: "politics", label: "POLITICS" },
  { id: "crypto", label: "CRYPTO" },
  { id: "tech", label: "TECHNOLOGY" },
];

export function PREDICTION() {
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"volume" | "probability">("volume");
  const [selectedMarket, setSelectedMarket] = useState<PredictionMarket | null>(null);

  const filtered = category === "all" 
    ? MOCK_PREDICTIONS 
    : MOCK_PREDICTIONS.filter(p => p.category === category);

  const sorted = [...filtered].sort((a, b) => 
    sortBy === "volume" ? b.volume - a.volume : Math.abs(b.yesPrice - 0.5) - Math.abs(a.yesPrice - 0.5)
  );

  return (
    <div className="h-full flex flex-col bg-term-black">
      {/* Header */}
      <div className="flex items-center justify-between h-7 px-3 border-b border-term-border-strong bg-term-panel">
        <div className="flex items-center gap-3">
          <span className="text-term-amber font-bold text-[10px] uppercase tracking-wider">PREDICTION MARKETS</span>
          <span className="text-term-textDim text-[9px]">{sorted.length} MARKETS</span>
        </div>
        <div className="flex items-center gap-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={cn(
                "px-2 py-0.5 text-[9px] uppercase tracking-wider border transition-colors",
                category === cat.id
                  ? "border-term-amber text-term-amber bg-term-amber/10"
                  : "border-transparent text-term-textDim hover:text-term-text hover:border-term-border"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort controls */}
      <div className="flex items-center justify-between h-6 px-3 border-b border-term-border bg-term-panel2">
        <div className="flex items-center gap-2 text-[9px] uppercase tracking-wider">
          <span className="text-term-textDim">SORT BY:</span>
          <button
            onClick={() => setSortBy("volume")}
            className={cn(
              "px-2 py-0.5 border",
              sortBy === "volume"
                ? "border-term-amber text-term-amber"
                : "border-transparent text-term-textDim hover:text-term-text"
            )}
          >
            VOLUME
          </button>
          <button
            onClick={() => setSortBy("probability")}
            className={cn(
              "px-2 py-0.5 border",
              sortBy === "probability"
                ? "border-term-amber text-term-amber"
                : "border-transparent text-term-textDim hover:text-term-text"
            )}
          >
            PROBABILITY
          </button>
        </div>
        <span className="text-[9px] text-term-textDim num">
          TOTAL VOL: ${(sorted.reduce((sum, p) => sum + p.volume, 0) / 1e6).toFixed(1)}M
        </span>
      </div>

      {/* Markets list */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-[11px] grid-data">
          <thead>
            <tr className="bg-term-panel2">
              <th className="text-left pl-3">MARKET</th>
              <th className="text-right">YES</th>
              <th className="text-right">NO</th>
              <th className="text-right">SPREAD</th>
              <th className="text-right">VOLUME</th>
              <th className="text-right">ENDS</th>
              <th className="text-center">PROBABILITY</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((market) => {
              const spread = market.yesPrice + market.noPrice - 1;
              const probability = market.yesPrice * 100;
              
              return (
                <tr key={market.id} className="hover:bg-term-panel cursor-pointer transition-colors" onClick={() => setSelectedMarket(market)}>
                  <td className="pl-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        market.trend === "up" ? "bg-term-green" :
                        market.trend === "down" ? "bg-term-red" :
                        "bg-term-amber"
                      }`} />
                      <div>
                        <div className="text-term-text font-semibold">{market.question}</div>
                        <div className="text-[9px] text-term-textDim uppercase tracking-wider">{market.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-right num">
                    <span className="text-term-green font-bold">${market.yesPrice.toFixed(2)}</span>
                  </td>
                  <td className="text-right num">
                    <span className="text-term-red font-bold">${market.noPrice.toFixed(2)}</span>
                  </td>
                  <td className="text-right num text-term-textDim">
                    {(spread * 100).toFixed(1)}%
                  </td>
                  <td className="text-right num text-term-muted">
                    ${(market.volume / 1e6).toFixed(1)}M
                  </td>
                  <td className="text-right num text-term-textDim">
                    {new Date(market.endDate).toLocaleDateString()}
                  </td>
                  <td className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-1.5 bg-term-panel2 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full transition-all",
                            probability >= 60 ? "bg-term-green" :
                            probability <= 40 ? "bg-term-red" :
                            "bg-term-amber"
                          )}
                          style={{ width: `${probability}%` }}
                        />
                      </div>
                      <span className={cn(
                        "num font-bold text-[10px]",
                        probability >= 60 ? "text-term-green" :
                        probability <= 40 ? "text-term-red" :
                        "text-term-amber"
                      )}>
                        {probability.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="h-6 px-3 border-t border-term-border-strong bg-term-panel flex items-center justify-between text-[9px] uppercase tracking-wider">
        <div className="flex items-center gap-4 text-term-textDim">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-term-green rounded-full" /> YES PRICE
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-term-red rounded-full" /> NO PRICE
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-term-amber rounded-full" /> UNCERTAIN
          </span>
        </div>
        <div className="text-term-textDim">
          POLYMARKET · KALSHO · MANIFOLD · REAL-TIME ODDS
        </div>
      </div>

      {/* Detail Modal */}
      {selectedMarket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setSelectedMarket(null)}>
          <div className="bg-term-black border-2 border-term-amber max-w-2xl w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="h-8 px-4 border-b border-term-border-strong bg-term-panel flex items-center justify-between">
              <span className="text-term-amber font-bold text-[11px] uppercase tracking-wider">MARKET DETAILS</span>
              <button onClick={() => setSelectedMarket(null)} className="text-term-textDim hover:text-term-amber text-lg leading-none">×</button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* Question */}
              <div>
                <div className="text-[9px] text-term-textDim uppercase tracking-widest mb-1">QUESTION</div>
                <div className="text-term-heading text-lg font-bold">{selectedMarket.question}</div>
                <div className="text-[10px] text-term-amber uppercase tracking-wider mt-1">{selectedMarket.category}</div>
              </div>
              
              {/* Prices */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-term-green/30 bg-term-green/5 p-4">
                  <div className="text-[9px] text-term-green uppercase tracking-widest mb-2">YES PRICE</div>
                  <div className="text-3xl num font-bold text-term-green">${selectedMarket.yesPrice.toFixed(2)}</div>
                  <div className="text-[11px] text-term-textDim mt-1">Probability: {(selectedMarket.yesPrice * 100).toFixed(1)}%</div>
                </div>
                <div className="border border-term-red/30 bg-term-red/5 p-4">
                  <div className="text-[9px] text-term-red uppercase tracking-widest mb-2">NO PRICE</div>
                  <div className="text-3xl num font-bold text-term-red">${selectedMarket.noPrice.toFixed(2)}</div>
                  <div className="text-[11px] text-term-textDim mt-1">Probability: {(selectedMarket.noPrice * 100).toFixed(1)}%</div>
                </div>
              </div>
              
              {/* Market Stats */}
              <div className="grid grid-cols-3 gap-3 text-[11px]">
                <div className="border border-term-border p-3">
                  <div className="text-[8px] text-term-textDim uppercase tracking-widest mb-1">VOLUME</div>
                  <div className="num text-term-amber text-lg">${(selectedMarket.volume / 1e6).toFixed(2)}M</div>
                </div>
                <div className="border border-term-border p-3">
                  <div className="text-[8px] text-term-textDim uppercase tracking-widest mb-1">SPREAD</div>
                  <div className="num text-term-text text-lg">{((selectedMarket.yesPrice + selectedMarket.noPrice - 1) * 100).toFixed(2)}%</div>
                </div>
                <div className="border border-term-border p-3">
                  <div className="text-[8px] text-term-textDim uppercase tracking-widest mb-1">ENDS</div>
                  <div className="num text-term-text text-lg">{new Date(selectedMarket.endDate).toLocaleDateString()}</div>
                </div>
              </div>
              
              {/* Probability Bar */}
              <div>
                <div className="text-[9px] text-term-textDim uppercase tracking-widest mb-2">MARKET PROBABILITY</div>
                <div className="h-8 bg-term-panel2 rounded overflow-hidden relative">
                  <div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-term-red via-term-amber to-term-green transition-all"
                    style={{ width: `${selectedMarket.yesPrice * 100}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-term-heading font-bold text-sm">
                    {(selectedMarket.yesPrice * 100).toFixed(1)}% YES
                  </div>
                </div>
              </div>
              
              {/* External Links */}
              <div className="pt-4 border-t border-term-border">
                <div className="text-[9px] text-term-textDim uppercase tracking-widest mb-2">TRADE ON</div>
                <div className="flex gap-2">
                  <a
                    href={`https://polymarket.com/event/${selectedMarket.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-term-amber/10 border border-term-amber text-term-amber hover:bg-term-amber/20 text-[10px] uppercase tracking-wider"
                  >
                    POLYMARKET →
                  </a>
                  <a
                    href={`https://manifold.markets/${selectedMarket.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-term-panel border border-term-border text-term-text hover:border-term-amber text-[10px] uppercase tracking-wider"
                  >
                    MANIFOLD →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
