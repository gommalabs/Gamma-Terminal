import { useMemo } from "react";
import { useQuery, useQueries } from "@tanstack/react-query";
import { fetchQuote } from "@/lib/api";
import { fmtPct } from "@/lib/format";
import { useWorkspace } from "@/store/workspaceStore";
import { cn } from "@/lib/cn";

// Sector constituents (mock data for demo)
const SECTOR_CONSTITUENTS: Record<string, string[]> = {
  Technology: ["AAPL", "MSFT", "NVDA", "AVGO", "ORCL", "CRM", "ADBE", "AMD", "INTC", "CSCO", "QCOM", "TXN", "AMAT", "MU", "ADI"],
  Healthcare: ["UNH", "JNJ", "LLY", "ABBV", "MRK", "TMO", "ABT", "DHR", "BMY", "AMGN", "GILD", "VRTX", "REGN", "BIIB", "ZTS"],
  Finance: ["BRK.B", "JPM", "V", "MA", "BAC", "WFC", "GS", "MS", "BLK", "SPGI", "AXP", "C", "SCHW", "CB", "PNC"],
  "Consumer Cyclical": ["AMZN", "TSLA", "HD", "MCD", "NKE", "LOW", "SBUX", "TJX", "BKNG", "CMG", "MAR", "ROST", "YUM", "EBAY", "ETSY"],
  Energy: ["XOM", "CVX", "COP", "EOG", "SLB", "PXD", "MPC", "PSX", "VLO", "OXY", "HAL", "KMI", "WMB", "BKR", "DVN"],
  Industrials: ["CAT", "BA", "HON", "UNP", "RTX", "GE", "MMM", "DE", "LMT", "GD", "EMR", "ITW", "CSX", "NSC", "FDX"],
  Communication: ["META", "GOOGL", "NFLX", "DIS", "CMCSA", "VZ", "T", "TMUS", "CHTR", "EA", "ATVI", "TTWO", "PARA", "WBD", "FOXA"],
  "Consumer Defensive": ["WMT", "PG", "COST", "PEP", "KO", "PM", "MO", "MDLZ", "CL", "KMB", "GIS", "K", "HSY", "SYY", "TSN"],
  Utilities: ["NEE", "DUK", "SO", "D", "AEP", "EXC", "SRE", "PEG", "XEL", "ED", "ES", "FE", "ETR", "WEC", "PPL"],
  Materials: ["LIN", "APD", "SHW", "ECL", "DD", "NEM", "FCX", "NUE", "VMC", "MLM", "ALB", "CE", "FMC", "IFF", "PPG"],
  "Real Estate": ["PLD", "AMT", "EQIX", "PSA", "WELL", "DLR", "O", "SBAC", "AVB", "EQR", "INVH", "VTR", "ARE", "MAA", "ESS"],
};

interface StockPerformance {
  symbol: string;
  change: number;
  price: number;
}

export function SECTOR_HEATMAP({ symbol }: { symbol: string }) {
  const openTab = useWorkspace((s) => s.openTab);

  // Fetch profile to determine sector
  const profileQ = useQuery({
    queryKey: ["profile", symbol],
    queryFn: () => import("@/lib/api").then(m => m.fetchProfile(symbol)),
  });

  const sector = profileQ.data?.sector || "Technology";
  const constituents = SECTOR_CONSTITUENTS[sector] || [];

  // Fetch all constituent quotes
  const quoteQueries = useQueries({
    queries: constituents.map(sym => ({
      queryKey: ["quote-heatmap", sym],
      queryFn: () => fetchQuote(sym),
      refetchInterval: 10000,
    })),
  });

  const stocks: StockPerformance[] = useMemo(() => {
    return quoteQueries
      .map((q: any, i: number) => {
        const data = q.data;
        if (!data) return null;
        const change = data.prev_close ? ((data.last_price - data.prev_close) / data.prev_close) * 100 : 0;
        return {
          symbol: constituents[i],
          change,
          price: data.last_price,
        };
      })
      .filter((s: any): s is StockPerformance => s !== null)
      .sort((a: StockPerformance, b: StockPerformance) => b.change - a.change);
  }, [quoteQueries, constituents]);

  // Calculate sector average
  const sectorAvg = useMemo(() => {
    if (stocks.length === 0) return 0;
    return stocks.reduce((sum, s) => sum + s.change, 0) / stocks.length;
  }, [stocks]);

  // Color scale based on performance
  const getHeatColor = (change: number) => {
    const intensity = Math.min(Math.abs(change) / 5, 1); // Cap at 5% for full intensity
    
    if (change >= 0) {
      // Green gradient: light to dark
      const green = Math.floor(100 + intensity * 155);
      return `rgba(0, ${green}, 0, ${0.3 + intensity * 0.7})`;
    } else {
      // Red gradient: light to dark
      const red = Math.floor(100 + intensity * 155);
      return `rgba(${red}, 0, 0, ${0.3 + intensity * 0.7})`;
    }
  };

  const loading = profileQ.isLoading || quoteQueries.some((q: any) => q.isLoading);
  if (loading) {
    return (
      <div className="p-8 text-term-muted uppercase text-[11px] tracking-widest">
        Loading sector heatmap for {symbol}...
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-term-border pb-3">
        <div>
          <div className="text-[20px] text-term-amber font-bold tracking-widest">
            {sector.toUpperCase()} SECTOR HEATMAP
          </div>
          <div className="sub-header mt-1">
            {stocks.length} constituents · Avg:{" "}
            <span className={cn("num", sectorAvg >= 0 ? "up" : "down")}>
              {fmtPct(sectorAvg)}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="sub-header">LEADERS</div>
          <div className="text-[11px] num up">
            {stocks.slice(0, 3).map(s => s.symbol).join(", ")}
          </div>
          <div className="sub-header mt-1">LAGGARDS</div>
          <div className="text-[11px] num down">
            {stocks.slice(-3).reverse().map(s => s.symbol).join(", ")}
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="flex-1 grid gap-1" style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
        gridAutoRows: "minmax(80px, auto)",
      }}>
        {stocks.map((stock) => (
          <button
            key={stock.symbol}
            onClick={() => openTab("SCORECARD", stock.symbol)}
            className="relative p-2 border border-term-border hover:border-term-amber transition-colors flex flex-col justify-between group"
            style={{ backgroundColor: getHeatColor(stock.change) }}
          >
            <div className="text-[10px] font-bold text-term-heading group-hover:text-term-amber">
              {stock.symbol}
            </div>
            <div className={cn(
              "text-[16px] num font-bold",
              stock.change >= 0 ? "up" : "down"
            )}>
              {stock.change >= 0 ? "+" : ""}{fmtPct(stock.change)}
            </div>
            <div className="text-[9px] num text-term-textDim">
              ${stock.price.toFixed(2)}
            </div>
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between border-t border-term-border pt-2 text-[10px]">
        <div className="flex items-center gap-4">
          <span className="sub-header">PERFORMANCE:</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-red-900 border border-term-border" />
            <span>&lt;-5%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-red-500 border border-term-border" />
            <span>-2%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-green-500 border border-term-border" />
            <span>+2%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-green-900 border border-term-border" />
            <span>&gt;+5%</span>
          </div>
        </div>
        <div className="sub-header">CLICK ANY STOCK FOR DETAILS</div>
      </div>
    </div>
  );
}
