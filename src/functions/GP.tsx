import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchHistorical } from "@/lib/api";
import { fmtPrice, fmtDate } from "@/lib/format";
import { cn } from "@/lib/cn";

const INTERVALS = [
  { label: "1D", value: "1d" },
  { label: "5D", value: "5d" },
  { label: "1M", value: "1mo" },
  { label: "3M", value: "3mo" },
  { label: "6M", value: "6mo" },
  { label: "1Y", value: "1y" },
  { label: "5Y", value: "5y" },
];

export function GP({ symbol }: { symbol: string }) {
  const [interval, setInterval] = useState("1mo");
  
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["chart", symbol, interval],
    queryFn: () => fetchHistorical(symbol, { interval }),
  });

  const sorted = [...data].sort((a, b) => (a.date < b.date ? -1 : 1));
  
  // Calculate chart dimensions
  const prices = sorted.map(d => d.close);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;
  
  // Generate SVG path
  const width = 800;
  const height = 300;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  const points = sorted.map((d, i) => {
    const x = padding + (i / (sorted.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((d.close - minPrice) / priceRange) * chartHeight;
    return `${x},${y}`;
  }).join(" ");
  
  // Volume bars
  const volumes = sorted.map(d => d.volume);
  const maxVolume = Math.max(...volumes);
  
  const isUp = sorted.length > 1 && sorted[sorted.length - 1].close >= sorted[0].close;

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-term-amber text-xs uppercase tracking-widest animate-pulse">Loading chart data...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-term-red text-xs">{(error as Error).message}</div>
      </div>
    );
  }
  
  if (sorted.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-term-textDim text-xs uppercase tracking-widest">No data available</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-term-black">
      {/* Header */}
      <div className="flex items-center justify-between h-7 px-3 border-b border-term-border-strong bg-term-panel">
        <div className="flex items-center gap-3">
          <span className="text-term-amber font-bold text-[10px] uppercase tracking-wider">{symbol} CHART</span>
          <span className="text-term-textDim text-[9px] num">${sorted[sorted.length - 1].close.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-1">
          {INTERVALS.map((int) => (
            <button
              key={int.value}
              onClick={() => setInterval(int.value)}
              className={cn(
                "px-2 py-0.5 text-[9px] uppercase tracking-wider border transition-colors",
                interval === int.value
                  ? "border-term-amber text-term-amber bg-term-amber/10"
                  : "border-transparent text-term-textDim hover:text-term-text hover:border-term-border"
              )}
            >
              {int.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 relative overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
            const y = padding + chartHeight * pct;
            const price = maxPrice - priceRange * pct;
            return (
              <g key={pct}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="#1a1a1a"
                  strokeWidth="1"
                />
                <text
                  x={padding - 5}
                  y={y + 3}
                  textAnchor="end"
                  fill="#666"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  ${price.toFixed(2)}
                </text>
              </g>
            );
          })}
          
          {/* Price line */}
          <polyline
            points={points}
            fill="none"
            stroke={isUp ? "#00ff41" : "#ff073a"}
            strokeWidth="2"
          />
          
          {/* Fill area under line */}
          <polygon
            points={`${padding},${padding + chartHeight} ${points} ${width - padding},${padding + chartHeight}`}
            fill={isUp ? "rgba(0, 255, 65, 0.1)" : "rgba(255, 7, 58, 0.1)"}
          />
          
          {/* Volume bars at bottom */}
          {sorted.map((d, i) => {
            const x = padding + (i / (sorted.length - 1)) * chartWidth;
            const barHeight = (d.volume / maxVolume) * 40;
            const isCandleUp = i > 0 && d.close >= sorted[i - 1].close;
            return (
              <rect
                key={d.date}
                x={x - 1}
                y={height - padding - barHeight}
                width="2"
                height={barHeight}
                fill={isCandleUp ? "rgba(0, 255, 65, 0.3)" : "rgba(255, 7, 58, 0.3)"}
              />
            );
          })}
          
          {/* Date labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
            const idx = Math.floor(pct * (sorted.length - 1));
            const x = padding + pct * chartWidth;
            return (
              <text
                key={pct}
                x={x}
                y={height - 10}
                textAnchor="middle"
                fill="#666"
                fontSize="9"
                fontFamily="monospace"
              >
                {fmtDate(sorted[idx]?.date)}
              </text>
            );
          })}
        </svg>
        
        {/* Current price indicator */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
          <div className={`px-2 py-1 text-[9px] font-bold num ${isUp ? 'bg-term-green text-term-black' : 'bg-term-red text-term-black'}`}>
            ${sorted[sorted.length - 1].close.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Stats footer */}
      <div className="h-6 px-3 border-t border-term-border-strong bg-term-panel flex items-center justify-between text-[9px] uppercase tracking-wider">
        <div className="flex items-center gap-4 text-term-textDim">
          <span>H: <span className="text-term-green num">${maxPrice.toFixed(2)}</span></span>
          <span>L: <span className="text-term-red num">${minPrice.toFixed(2)}</span></span>
          <span>VOL: <span className="num">{(sorted.reduce((sum, d) => sum + d.volume, 0) / 1e6).toFixed(1)}M</span></span>
        </div>
        <div className="text-term-textDim">
          {sorted.length} DATA POINTS · {INTERVALS.find(i => i.value === interval)?.label}
        </div>
      </div>
    </div>
  );
}
