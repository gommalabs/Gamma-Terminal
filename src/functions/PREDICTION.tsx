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
                <tr key={market.id} className="hover:bg-term-panel cursor-pointer transition-colors">
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
    </div>
  );
}
