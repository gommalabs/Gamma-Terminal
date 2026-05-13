import { useState } from "react";
import { cn } from "@/lib/cn";

interface PortfolioHolding {
  symbol: string;
  name: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  marketValue: number;
  weight: number;
  dayChange: number;
  totalReturn: number;
  sector: string;
}

const MOCK_PORTFOLIO: PortfolioHolding[] = [
  { symbol: "AAPL", name: "Apple Inc.", shares: 150, avgCost: 165.00, currentPrice: 182.52, marketValue: 27378, weight: 18.5, dayChange: 1.30, totalReturn: 10.62, sector: "Technology" },
  { symbol: "MSFT", name: "Microsoft Corp.", shares: 80, avgCost: 380.00, currentPrice: 415.30, marketValue: 33224, weight: 22.4, dayChange: 0.61, totalReturn: 9.29, sector: "Technology" },
  { symbol: "GOOGL", name: "Alphabet Inc.", shares: 200, avgCost: 142.00, currentPrice: 156.80, marketValue: 31360, weight: 21.2, dayChange: 0.77, totalReturn: 10.42, sector: "Communication Services" },
  { symbol: "NVDA", name: "NVIDIA Corp.", shares: 40, avgCost: 720.00, currentPrice: 875.30, marketValue: 35012, weight: 23.6, dayChange: 1.84, totalReturn: 21.57, sector: "Technology" },
  { symbol: "TSLA", name: "Tesla Inc.", shares: 60, avgCost: 260.00, currentPrice: 245.67, marketValue: 14740, weight: 9.9, dayChange: -2.08, totalReturn: -5.51, sector: "Consumer Cyclical" },
  { symbol: "AMZN", name: "Amazon.com Inc.", shares: 30, avgCost: 165.00, currentPrice: 178.50, marketValue: 5355, weight: 3.6, dayChange: 0.85, totalReturn: 8.18, sector: "Consumer Cyclical" },
];

const SECTOR_ALLOCATION = [
  { sector: "Technology", allocation: 64.5, target: 60.0 },
  { sector: "Communication Services", allocation: 21.2, target: 20.0 },
  { sector: "Consumer Cyclical", allocation: 13.5, target: 15.0 },
  { sector: "Healthcare", allocation: 0.0, target: 5.0 },
];

export function PORT() {
  const [view, setView] = useState<"holdings" | "allocation" | "performance">("holdings");
  
  const totalValue = MOCK_PORTFOLIO.reduce((sum, h) => sum + h.marketValue, 0);
  const totalCost = MOCK_PORTFOLIO.reduce((sum, h) => sum + (h.shares * h.avgCost), 0);
  const totalDayChange = MOCK_PORTFOLIO.reduce((sum, h) => sum + (h.marketValue * h.dayChange / 100), 0);
  const totalReturn = ((totalValue - totalCost) / totalCost) * 100;

  return (
    <div className="h-full flex flex-col bg-term-black">
      {/* Header */}
      <div className="flex items-center justify-between h-7 px-3 border-b border-term-border-strong bg-term-panel">
        <div className="flex items-center gap-3">
          <span className="text-term-amber font-bold text-[10px] uppercase tracking-wider">
            PORTFOLIO ANALYTICS
          </span>
          <span className="text-term-textDim text-[9px] num">${(totalValue / 1000).toFixed(1)}K TOTAL VALUE</span>
        </div>
        <div className="flex items-center gap-1">
          {[
            { id: "holdings", label: "HOLDINGS" },
            { id: "allocation", label: "ALLOCATION" },
            { id: "performance", label: "PERFORMANCE" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id as any)}
              className={cn(
                "px-2 py-0.5 text-[9px] uppercase tracking-wider border transition-colors",
                view === tab.id
                  ? "border-term-amber text-term-amber bg-term-amber/10"
                  : "border-transparent text-term-textDim hover:text-term-text hover:border-term-border"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Portfolio Summary Bar */}
      <div className="grid grid-cols-4 divide-x divide-term-border border-b border-term-border-strong bg-term-panel2">
        <div className="p-2">
          <div className="text-[9px] text-term-textDim uppercase tracking-wider mb-1">TOTAL VALUE</div>
          <div className="text-sm font-bold text-term-amber num">${totalValue.toLocaleString()}</div>
        </div>
        <div className="p-2">
          <div className="text-[9px] text-term-textDim uppercase tracking-wider mb-1">DAY P&L</div>
          <div className={cn("text-sm font-bold num", totalDayChange >= 0 ? "text-term-green" : "text-term-red")}>
            {totalDayChange >= 0 ? "+" : ""}${Math.abs(totalDayChange).toFixed(2)}
          </div>
        </div>
        <div className="p-2">
          <div className="text-[9px] text-term-textDim uppercase tracking-wider mb-1">TOTAL RETURN</div>
          <div className={cn("text-sm font-bold num", totalReturn >= 0 ? "text-term-green" : "text-term-red")}>
            {totalReturn >= 0 ? "+" : ""}{totalReturn.toFixed(2)}%
          </div>
        </div>
        <div className="p-2">
          <div className="text-[9px] text-term-textDim uppercase tracking-wider mb-1">POSITIONS</div>
          <div className="text-sm font-bold text-term-text num">{MOCK_PORTFOLIO.length}</div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto p-3">
        {view === "holdings" && (
          <table className="w-full text-[11px] grid-data">
            <thead>
              <tr className="bg-term-panel2">
                <th className="text-left pl-3">SYMBOL</th>
                <th className="text-left">NAME</th>
                <th className="text-right">SHARES</th>
                <th className="text-right">AVG COST</th>
                <th className="text-right">PRICE</th>
                <th className="text-right">MARKET VALUE</th>
                <th className="text-right">WEIGHT</th>
                <th className="text-right">DAY %</th>
                <th className="text-right">RETURN %</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_PORTFOLIO.map((holding) => {
                const costBasis = holding.shares * holding.avgCost;
                const unrealizedPL = holding.marketValue - costBasis;
                
                return (
                  <tr key={holding.symbol} className="hover:bg-term-panel transition-colors cursor-pointer">
                    <td className="pl-3">
                      <span className="text-term-amber font-bold">{holding.symbol}</span>
                    </td>
                    <td className="text-term-textDim truncate max-w-[200px]">{holding.name}</td>
                    <td className="text-right num">{holding.shares}</td>
                    <td className="text-right num text-term-textDim">${holding.avgCost.toFixed(2)}</td>
                    <td className="text-right num font-bold">${holding.currentPrice.toFixed(2)}</td>
                    <td className="text-right num text-term-heading">${holding.marketValue.toLocaleString()}</td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-12 h-1.5 bg-term-panel2 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-term-amber"
                            style={{ width: `${holding.weight}%` }}
                          />
                        </div>
                        <span className="num text-[10px]">{holding.weight.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className={cn("text-right num font-bold", holding.dayChange >= 0 ? "text-term-green" : "text-term-red")}>
                      {holding.dayChange >= 0 ? "+" : ""}{holding.dayChange.toFixed(2)}%
                    </td>
                    <td className={cn("text-right num font-bold", unrealizedPL >= 0 ? "text-term-green" : "text-term-red")}>
                      {unrealizedPL >= 0 ? "+" : ""}{holding.totalReturn.toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {view === "allocation" && (
          <div className="space-y-4">
            {/* Sector Allocation */}
            <div className="bb-panel p-3">
              <div className="bb-label mb-3">SECTOR ALLOCATION</div>
              <div className="space-y-2">
                {SECTOR_ALLOCATION.map((sector) => {
                  const isOverweight = sector.allocation > sector.target;
                  const isUnderweight = sector.allocation < sector.target;
                  
                  return (
                    <div key={sector.sector}>
                      <div className="flex items-center justify-between mb-1 text-[10px]">
                        <span className="text-term-text">{sector.sector}</span>
                        <div className="flex items-center gap-3">
                          <span className="num text-term-amber">{sector.allocation.toFixed(1)}%</span>
                          <span className="text-term-textDim">vs</span>
                          <span className="num text-term-textDim">{sector.target.toFixed(1)}%</span>
                          {isOverweight && <span className="text-term-green text-[9px]">OVER</span>}
                          {isUnderweight && <span className="text-term-red text-[9px]">UNDER</span>}
                        </div>
                      </div>
                      <div className="h-2 bg-term-panel2 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full transition-all",
                            isOverweight ? "bg-term-green" :
                            isUnderweight ? "bg-term-red" :
                            "bg-term-amber"
                          )}
                          style={{ width: `${sector.allocation}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Holdings */}
            <div className="bb-panel p-3">
              <div className="bb-label mb-3">TOP HOLDINGS BY WEIGHT</div>
              <div className="space-y-2">
                {[...MOCK_PORTFOLIO].sort((a, b) => b.weight - a.weight).slice(0, 5).map((holding, idx) => (
                  <div key={holding.symbol} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-term-textDim num w-4">{idx + 1}.</span>
                      <span className="text-term-amber font-bold">{holding.symbol}</span>
                      <span className="text-term-textDim text-[10px]">{holding.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="num text-term-heading">${holding.marketValue.toLocaleString()}</span>
                      <span className="num text-term-amber">{holding.weight.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === "performance" && (
          <div className="space-y-4">
            {/* Performance Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bb-panel p-3">
                <div className="bb-label mb-3">RETURNS</div>
                <div className="space-y-2 text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-term-textDim">Today</span>
                    <span className={cn("num font-bold", totalDayChange >= 0 ? "text-term-green" : "text-term-red")}>
                      {totalDayChange >= 0 ? "+" : ""}${totalDayChange.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-term-textDim">Total Return</span>
                    <span className={cn("num font-bold", totalReturn >= 0 ? "text-term-green" : "text-term-red")}>
                      {totalReturn >= 0 ? "+" : ""}{totalReturn.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-term-textDim">Unrealized P&L</span>
                    <span className={cn("num font-bold", (totalValue - totalCost) >= 0 ? "text-term-green" : "text-term-red")}>
                      {(totalValue - totalCost) >= 0 ? "+" : ""}${(totalValue - totalCost).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bb-panel p-3">
                <div className="bb-label mb-3">RISK METRICS</div>
                <div className="space-y-2 text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-term-textDim">Portfolio Beta</span>
                    <span className="num text-term-amber">1.15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-term-textDim">Sharpe Ratio</span>
                    <span className="num text-term-amber">1.85</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-term-textDim">Volatility (30D)</span>
                    <span className="num text-term-amber">18.5%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Best/Worst Performers */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bb-panel p-3">
                <div className="bb-label mb-3 text-term-green">BEST PERFORMERS</div>
                <div className="space-y-2">
                  {[...MOCK_PORTFOLIO].sort((a, b) => b.totalReturn - a.totalReturn).slice(0, 3).map(h => (
                    <div key={h.symbol} className="flex items-center justify-between text-[10px]">
                      <span className="text-term-amber font-bold">{h.symbol}</span>
                      <span className="text-term-green num">+{h.totalReturn.toFixed(2)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bb-panel p-3">
                <div className="bb-label mb-3 text-term-red">WORST PERFORMERS</div>
                <div className="space-y-2">
                  {[...MOCK_PORTFOLIO].sort((a, b) => a.totalReturn - b.totalReturn).slice(0, 3).map(h => (
                    <div key={h.symbol} className="flex items-center justify-between text-[10px]">
                      <span className="text-term-amber font-bold">{h.symbol}</span>
                      <span className="text-term-red num">{h.totalReturn.toFixed(2)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="h-6 px-3 border-t border-term-border-strong bg-term-panel flex items-center justify-between text-[9px] uppercase tracking-wider">
        <div className="text-term-textDim">
          CLICK ROWS TO VIEW DETAILS · DATA REFRESHES EVERY 60S
        </div>
        <div className="text-term-textDim num">
          LAST UPDATE: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
