import { useState } from "react";
import { cn } from "@/lib/cn";

interface PeerCompany {
  symbol: string;
  name: string;
  marketCap: number;
  peRatio: number;
  forwardPE: number;
  pegRatio: number | null;
  evEbitda: number;
  priceToBook: number;
  priceToSales: number;
  dividendYield: number;
  sector: string;
}

const MOCK_PEERS: Record<string, PeerCompany[]> = {
  AAPL: [
    { symbol: "AAPL", name: "Apple Inc.", marketCap: 2850000000000, peRatio: 29.1, forwardPE: 26.3, pegRatio: 2.45, evEbitda: 22.1, priceToBook: 45.2, priceToSales: 7.5, dividendYield: 0.0053, sector: "Technology" },
    { symbol: "MSFT", name: "Microsoft Corp.", marketCap: 3090000000000, peRatio: 35.8, forwardPE: 31.8, pegRatio: 2.15, evEbitda: 24.5, priceToBook: 12.8, priceToSales: 12.3, dividendYield: 0.0072, sector: "Technology" },
    { symbol: "GOOGL", name: "Alphabet Inc.", marketCap: 1950000000000, peRatio: 26.3, forwardPE: 21.5, pegRatio: 1.85, evEbitda: 15.2, priceToBook: 6.5, priceToSales: 5.8, dividendYield: 0.0, sector: "Technology" },
    { symbol: "META", name: "Meta Platforms", marketCap: 1240000000000, peRatio: 28.5, forwardPE: 24.2, pegRatio: 1.65, evEbitda: 16.8, priceToBook: 7.2, priceToSales: 8.9, dividendYield: 0.0, sector: "Technology" },
    { symbol: "AMZN", name: "Amazon.com Inc.", marketCap: 1850000000000, peRatio: 52.3, forwardPE: 38.5, pegRatio: 2.85, evEbitda: 28.5, priceToBook: 8.5, priceToSales: 3.2, dividendYield: 0.0, sector: "Consumer Cyclical" },
  ],
  TSLA: [
    { symbol: "TSLA", name: "Tesla Inc.", marketCap: 782500000000, peRatio: 65.2, forwardPE: 55.2, pegRatio: 3.25, evEbitda: 38.9, priceToBook: 12.5, priceToSales: 8.2, dividendYield: 0.0, sector: "Auto Manufacturers" },
    { symbol: "F", name: "Ford Motor Co.", marketCap: 48500000000, peRatio: 12.5, forwardPE: 8.5, pegRatio: 0.85, evEbitda: 8.5, priceToBook: 1.2, priceToSales: 0.3, dividendYield: 0.048, sector: "Auto Manufacturers" },
    { symbol: "GM", name: "General Motors", marketCap: 52300000000, peRatio: 5.8, forwardPE: 5.2, pegRatio: 0.45, evEbitda: 4.2, priceToBook: 0.9, priceToSales: 0.3, dividendYield: 0.012, sector: "Auto Manufacturers" },
    { symbol: "RIVN", name: "Rivian Automotive", marketCap: 12500000000, peRatio: -8.5, forwardPE: -12.5, pegRatio: null, evEbitda: -15.2, priceToBook: 2.8, priceToSales: 3.5, dividendYield: 0.0, sector: "Auto Manufacturers" },
    { symbol: "LCID", name: "Lucid Group", marketCap: 8200000000, peRatio: -5.2, forwardPE: -8.5, pegRatio: null, evEbitda: -12.5, priceToBook: 1.5, priceToSales: 18.5, dividendYield: 0.0, sector: "Auto Manufacturers" },
  ],
};

const DEFAULT_PEERS: PeerCompany[] = [
  { symbol: "COMP", name: "Target Company", marketCap: 100000000000, peRatio: 25.0, forwardPE: 22.0, pegRatio: 2.0, evEbitda: 18.0, priceToBook: 5.0, priceToSales: 3.0, dividendYield: 0.015, sector: "Technology" },
  { symbol: "PEER1", name: "Peer Company 1", marketCap: 95000000000, peRatio: 23.5, forwardPE: 20.5, pegRatio: 1.85, evEbitda: 16.5, priceToBook: 4.5, priceToSales: 2.8, dividendYield: 0.018, sector: "Technology" },
  { symbol: "PEER2", name: "Peer Company 2", marketCap: 110000000000, peRatio: 27.8, forwardPE: 24.2, pegRatio: 2.25, evEbitda: 20.2, priceToBook: 5.8, priceToSales: 3.5, dividendYield: 0.012, sector: "Technology" },
  { symbol: "PEER3", name: "Peer Company 3", marketCap: 85000000000, peRatio: 22.0, forwardPE: 19.5, pegRatio: 1.75, evEbitda: 15.8, priceToBook: 4.2, priceToSales: 2.5, dividendYield: 0.020, sector: "Technology" },
];

const METRICS = [
  { key: "marketCap", label: "Market Cap", format: (v: number) => `$${(v / 1e9).toFixed(1)}B`, higher: true },
  { key: "peRatio", label: "P/E Ratio", format: (v: number) => v < 0 ? "N/A" : v.toFixed(1), higher: false },
  { key: "forwardPE", label: "Forward P/E", format: (v: number) => v < 0 ? "N/A" : v.toFixed(1), higher: false },
  { key: "pegRatio", label: "PEG Ratio", format: (v: number | null) => v === null ? "N/A" : v.toFixed(2), higher: false },
  { key: "evEbitda", label: "EV/EBITDA", format: (v: number) => v < 0 ? "N/A" : v.toFixed(1), higher: false },
  { key: "priceToBook", label: "Price/Book", format: (v: number) => v.toFixed(1), higher: false },
  { key: "priceToSales", label: "Price/Sales", format: (v: number) => v.toFixed(1), higher: false },
  { key: "dividendYield", label: "Div Yield %", format: (v: number) => `${(v * 100).toFixed(2)}%`, higher: true },
];

export function RV({ symbol }: { symbol: string }) {
  const [selectedMetric, setSelectedMetric] = useState("peRatio");
  
  const peers = MOCK_PEERS[symbol.toUpperCase()] || DEFAULT_PEERS;
  const targetCompany = peers[0];
  
  // Calculate percentile ranking for selected metric
  const getPercentile = (company: PeerCompany, metric: string) => {
    const values = peers.map(p => p[metric as keyof PeerCompany]).filter(v => typeof v === 'number' && v > 0) as number[];
    if (values.length === 0) return 50;
    const value = company[metric as keyof PeerCompany] as number;
    if (value <= 0) return 0;
    const rank = values.filter(v => v <= value).length;
    return Math.round((rank / values.length) * 100);
  };

  const selectedMetricData = METRICS.find(m => m.key === selectedMetric);

  return (
    <div className="h-full flex flex-col bg-term-black">
      {/* Header */}
      <div className="flex items-center justify-between h-7 px-3 border-b border-term-border-strong bg-term-panel">
        <div className="flex items-center gap-3">
          <span className="text-term-amber font-bold text-[10px] uppercase tracking-wider">
            RELATIVE VALUATION
          </span>
          <span className="text-term-textDim text-[9px]">{symbol.toUpperCase()} vs PEERS</span>
        </div>
        <div className="flex items-center gap-2 text-[9px]">
          <span className="text-term-textDim">METRIC:</span>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="bg-term-panel2 border border-term-border text-term-amber px-2 py-0.5 text-[9px] focus:border-term-amber focus:outline-none"
          >
            {METRICS.map(m => (
              <option key={m.key} value={m.key}>{m.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto p-3">
        {/* Comparison Table */}
        <table className="w-full text-[11px] grid-data mb-4">
          <thead>
            <tr className="bg-term-panel2">
              <th className="text-left pl-3">Company</th>
              <th className="text-right">Sector</th>
              {METRICS.map(m => (
                <th 
                  key={m.key}
                  className={cn(
                    "text-right cursor-pointer hover:text-term-amber transition-colors",
                    selectedMetric === m.key && "text-term-amber font-bold"
                  )}
                  onClick={() => setSelectedMetric(m.key)}
                >
                  {m.label}
                </th>
              ))}
              <th className="text-right">Rank</th>
            </tr>
          </thead>
          <tbody>
            {peers.map((company, idx) => {
              const isTarget = idx === 0;
              const percentile = getPercentile(company, selectedMetric);
              
              return (
                <tr 
                  key={company.symbol}
                  className={cn(
                    "hover:bg-term-panel transition-colors",
                    isTarget && "bg-term-amber/5"
                  )}
                >
                  <td className="pl-3">
                    <div className="flex items-center gap-2">
                      {isTarget && <span className="w-1.5 h-1.5 bg-term-amber rounded-full animate-pulse" />}
                      <div>
                        <div className={cn("font-bold", isTarget ? "text-term-amber" : "text-term-text")}>
                          {company.symbol}
                        </div>
                        <div className="text-[9px] text-term-textDim">{company.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-right text-term-textDim">{company.sector}</td>
                  {METRICS.map(m => {
                    const value = company[m.key as keyof PeerCompany];
                    const formatted = typeof value === 'number' ? m.format(value) : 'N/A';
                    const targetValue = targetCompany[m.key as keyof PeerCompany];
                    const isBest = !isTarget && typeof value === 'number' && value > 0 && typeof targetValue === 'number' &&
                      (m.higher ? value > targetValue : value < targetValue);
                    
                    return (
                      <td 
                        key={m.key} 
                        className={cn(
                          "text-right num",
                          isTarget && "font-bold text-term-amber",
                          isBest && "text-term-green"
                        )}
                      >
                        {formatted}
                      </td>
                    );
                  })}
                  <td className="text-right">
                    {isTarget ? (
                      <div className="flex items-center justify-end gap-1">
                        <div className="w-8 h-1.5 bg-term-panel2 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full",
                              percentile >= 70 ? "bg-term-red" :
                              percentile <= 30 ? "bg-term-green" :
                              "bg-term-amber"
                            )}
                            style={{ width: `${percentile}%` }}
                          />
                        </div>
                        <span className={cn(
                          "num font-bold",
                          percentile >= 70 ? "text-term-red" :
                          percentile <= 30 ? "text-term-green" :
                          "text-term-amber"
                        )}>
                          {percentile}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-term-textDim">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Valuation Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bb-panel p-3">
            <div className="bb-label mb-2">VALUATION SUMMARY</div>
            <div className="space-y-1 text-[10px]">
              <div className="flex justify-between">
                <span className="text-term-textDim">{selectedMetricData?.label}</span>
                <span className="num text-term-amber font-bold">
                  {selectedMetricData?.format(targetCompany[selectedMetric as keyof PeerCompany] as number)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-term-textDim">Peer Median</span>
                <span className="num text-term-text">
                  {(() => {
                    const values = peers.slice(1).map(p => p[selectedMetric as keyof PeerCompany]).filter(v => typeof v === 'number' && v > 0) as number[];
                    return values.length > 0 ? selectedMetricData?.format(values[Math.floor(values.length / 2)]) : 'N/A';
                  })()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-term-textDim">Percentile Rank</span>
                <span className={cn(
                  "num font-bold",
                  getPercentile(targetCompany, selectedMetric) >= 70 ? "text-term-red" :
                  getPercentile(targetCompany, selectedMetric) <= 30 ? "text-term-green" :
                  "text-term-amber"
                )}>
                  {getPercentile(targetCompany, selectedMetric)}%
                </span>
              </div>
            </div>
          </div>

          <div className="bb-panel p-3">
            <div className="bb-label mb-2">ASSESSMENT</div>
            <div className="text-[10px] space-y-1">
              {(() => {
                const percentile = getPercentile(targetCompany, selectedMetric);
                const metric = METRICS.find(m => m.key === selectedMetric);
                const isExpensive = metric?.higher ? percentile >= 70 : percentile <= 30;
                
                return (
                  <>
                    <div className={cn("font-bold text-sm", isExpensive ? "text-term-red" : "text-term-green")}>
                      {isExpensive ? "EXPENSIVE" : "ATTRACTIVE"}
                    </div>
                    <div className="text-term-textDim">
                      {isExpensive 
                        ? `Trading at premium vs peers on ${metric?.label}`
                        : `Trading at discount vs peers on ${metric?.label}`}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          <div className="bb-panel p-3">
            <div className="bb-label mb-2">PEER COUNT</div>
            <div className="text-[10px] space-y-1">
              <div className="flex justify-between">
                <span className="text-term-textDim">Total Peers</span>
                <span className="num text-term-text">{peers.length - 1}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-term-textDim">Sector</span>
                <span className="num text-term-text">{targetCompany.sector}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-term-textDim">Data Source</span>
                <span className="num text-term-textDim">YFINANCE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="h-6 px-3 border-t border-term-border-strong bg-term-panel flex items-center justify-between text-[9px] uppercase tracking-wider">
        <div className="text-term-textDim">
          CLICK COLUMN HEADERS TO SORT · GREEN = CHEAP · RED = EXPENSIVE
        </div>
        <div className="text-term-textDim num">
          {peers.length} COMPANIES ANALYZED
        </div>
      </div>
    </div>
  );
}
