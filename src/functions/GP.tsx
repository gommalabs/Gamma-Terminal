import { useState, useRef, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchHistorical } from "@/lib/api";
import { fmtPrice, fmtDate, fmtTime } from "@/lib/format";
import { cn } from "@/lib/cn";

interface Drawing {
  id: string;
  type: "line" | "ray" | "horizontal" | "vertical" | "fibonacci";
  points: Array<{ x: number; y: number }>;
  color: string;
  width: number;
}

const INTERVALS = [
  { label: "30s", value: "30s", seconds: 30 },
  { label: "1m", value: "1m", seconds: 60 },
  { label: "5m", value: "5m", seconds: 300 },
  { label: "15m", value: "15m", seconds: 900 },
  { label: "1H", value: "1h", seconds: 3600 },
  { label: "4H", value: "4h", seconds: 14400 },
  { label: "1D", value: "1d", seconds: 86400 },
  { label: "1W", value: "1wk", seconds: 604800 },
];

const CHART_TYPES = [
  { label: "CANDLE", value: "candle" },
  { label: "LINE", value: "line" },
  { label: "BAR", value: "bar" },
  { label: "AREA", value: "area" },
];

export function GP({ symbol }: { symbol: string }) {
  const [interval, setInterval] = useState("1d");
  const [chartType, setChartType] = useState("candle");
  const [showVolume, setShowVolume] = useState(true);
  const [showMA, setShowMA] = useState({ ma20: true, ma50: false, ma200: false });
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [drawingTool, setDrawingTool] = useState<"none" | "line" | "horizontal">("none");
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingStart, setDrawingStart] = useState<{ x: number; y: number } | null>(null);
  
  // Zoom and pan state
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 100 }); // percentage of data visible
  const [priceZoom, setPriceZoom] = useState(1); // 1 = auto, >1 = zoomed in
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["chart", symbol, interval],
    queryFn: () => fetchHistorical(symbol, { interval }),
  });

  const sorted = [...data].sort((a, b) => (a.date < b.date ? -1 : 1));
  
  // Calculate Moving Averages
  const maData = useMemo(() => {
    if (sorted.length === 0) return { ma20: [], ma50: [], ma200: [] };
    
    const calculateMA = (period: number) => {
      const ma: Array<{ x: number; y: number } | null> = [];
      for (let i = 0; i < sorted.length; i++) {
        if (i < period - 1) {
          ma.push(null);
        } else {
          const sum = sorted.slice(i - period + 1, i + 1).reduce((acc, d) => acc + d.close, 0);
          ma.push({ x: i, y: sum / period });
        }
      }
      return ma;
    };
    
    return {
      ma20: calculateMA(20),
      ma50: calculateMA(50),
      ma200: calculateMA(200),
    };
  }, [sorted]);
  
  // Get visible data based on zoom/pan
  const visibleData = useMemo(() => {
    if (sorted.length === 0) return [];
    const startIdx = Math.floor((visibleRange.start / 100) * sorted.length);
    const endIdx = Math.ceil((visibleRange.end / 100) * sorted.length);
    return sorted.slice(startIdx, endIdx);
  }, [sorted, visibleRange]);
  
  // Chart dimensions and scaling
  const width = 1600;
  const height = 900;
  const padding = { top: 20, right: 70, bottom: 40, left: 10 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const volumeHeight = showVolume ? 100 : 0;
  const mainChartHeight = chartHeight - volumeHeight;
  
  const prices = visibleData.map(d => d.close);
  const minPrice = Math.min(...prices) * (1 - 0.002 * priceZoom);
  const maxPrice = Math.max(...prices) * (1 + 0.002 * priceZoom);
  const priceRange = maxPrice - minPrice || 1;
  
  const volumes = visibleData.map(d => d.volume);
  const maxVolume = Math.max(...volumes) || 1;
  
  // Coordinate conversion functions
  const getX = (index: number) => padding.left + (index / Math.max(visibleData.length - 1, 1)) * chartWidth;
  const getY = (price: number) => padding.top + mainChartHeight - ((price - minPrice) / priceRange) * mainChartHeight;
  const getVolumeY = (vol: number) => height - padding.bottom - (vol / maxVolume) * volumeHeight;
  
  // Mouse wheel handler for zoom
  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    
    if (e.ctrlKey || e.metaKey) {
      // Price zoom
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setPriceZoom(prev => Math.max(0.5, Math.min(10, prev * delta)));
    } else {
      // Horizontal pan/zoom
      const rangeSize = visibleRange.end - visibleRange.start;
      const delta = e.deltaY > 0 ? 0.95 : 1.05;
      
      if (e.shiftKey) {
        // Zoom
        const newRange = rangeSize * delta;
        const center = (visibleRange.start + visibleRange.end) / 2;
        const newStart = Math.max(0, center - newRange / 2);
        const newEnd = Math.min(100, center + newRange / 2);
        setVisibleRange({ start: newStart, end: newEnd });
      } else {
        // Pan
        const panAmount = (e.deltaY / 1000) * 100;
        const newStart = Math.max(0, Math.min(100 - rangeSize, visibleRange.start + panAmount));
        setVisibleRange({ start: newStart, end: newStart + rangeSize });
      }
    }
  };
  
  // Mouse interaction handlers for drawing
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (drawingTool === "none" || !svgRef.current) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (width / rect.width);
    const y = (e.clientY - rect.top) * (height / rect.height);
    
    setIsDrawing(true);
    setDrawingStart({ x, y });
  };
  
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDrawing || !drawingStart || !svgRef.current) return;
  };
  
  const handleMouseUp = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDrawing || !drawingStart || !svgRef.current) {
      setIsDrawing(false);
      return;
    }
    
    const rect = svgRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (width / rect.width);
    const y = (e.clientY - rect.top) * (height / rect.height);
    
    const newDrawing: Drawing = {
      id: `drawing-${Date.now()}`,
      type: drawingTool as any,
      points: [drawingStart, { x, y }],
      color: "#ff9500",
      width: 2,
    };
    
    setDrawings([...drawings, newDrawing]);
    setIsDrawing(false);
    setDrawingStart(null);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-term-amber text-xs uppercase tracking-widest animate-pulse">Loading chart data...</div>
      </div>
    );
  }
  
  if (error || sorted.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-term-red text-xs">{error ? (error as Error).message : 'No data available'}</div>
      </div>
    );
  }

  const lastCandle = visibleData[visibleData.length - 1] || sorted[sorted.length - 1];
  const isUp = lastCandle.close >= (visibleData[0]?.close || sorted[0].close);

  return (
    <div ref={containerRef} className="h-full flex flex-col bg-term-black">
      {/* Header */}
      <div className="flex items-center justify-between h-8 px-3 border-b border-term-border-strong bg-term-panel">
        <div className="flex items-center gap-4">
          <span className="text-term-amber font-bold text-[10px] uppercase tracking-wider">{symbol} CHART</span>
          <span className="text-term-textDim text-[9px] num">${lastCandle.close.toFixed(2)}</span>
          <span className={cn("text-[9px] num", isUp ? "text-term-green" : "text-term-red")}>
            {isUp ? "▲" : "▼"} {Math.abs(((lastCandle.close - (visibleData[0]?.close || sorted[0].close)) / (visibleData[0]?.close || sorted[0].close)) * 100).toFixed(2)}%
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Chart Type Selector */}
          <div className="flex items-center gap-0.5 border-r border-term-border pr-2">
            {CHART_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => setChartType(type.value)}
                className={cn(
                  "px-1.5 py-0.5 text-[8px] uppercase tracking-wider border transition-colors",
                  chartType === type.value
                    ? "border-term-amber text-term-amber bg-term-amber/10"
                    : "border-transparent text-term-textDim hover:text-term-text"
                )}
              >
                {type.label}
              </button>
            ))}
          </div>
          
          {/* Interval Selector */}
          <div className="flex items-center gap-0.5">
            {INTERVALS.map((int) => (
              <button
                key={int.value}
                onClick={() => setInterval(int.value)}
                className={cn(
                  "px-1.5 py-0.5 text-[8px] uppercase tracking-wider border transition-colors",
                  interval === int.value
                    ? "border-term-amber text-term-amber bg-term-amber/10"
                    : "border-transparent text-term-textDim hover:text-term-text"
                )}
              >
                {int.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="h-6 px-3 border-b border-term-border bg-term-panel flex items-center justify-between text-[9px]">
        <div className="flex items-center gap-3">
          <span className="text-term-textDim uppercase tracking-wider">TOOLS:</span>
          <button
            onClick={() => setDrawingTool("none")}
            className={cn(
              "px-2 py-0.5 border",
              drawingTool === "none" ? "border-term-amber text-term-amber" : "border-term-border text-term-textDim"
            )}
          >
            NONE
          </button>
          <button
            onClick={() => setDrawingTool("line")}
            className={cn(
              "px-2 py-0.5 border",
              drawingTool === "line" ? "border-term-amber text-term-amber" : "border-term-border text-term-textDim"
            )}
          >
            LINE
          </button>
          <button
            onClick={() => setDrawingTool("horizontal")}
            className={cn(
              "px-2 py-0.5 border",
              drawingTool === "horizontal" ? "border-term-amber text-term-amber" : "border-term-border text-term-textDim"
            )}
          >
            HORIZONTAL
          </button>
          <button
            onClick={() => setDrawings([])}
            className="px-2 py-0.5 border border-term-border text-term-textDim hover:text-term-red"
          >
            CLEAR
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={showVolume}
              onChange={(e) => setShowVolume(e.target.checked)}
              className="w-3 h-3 accent-term-amber"
            />
            <span className="text-term-textDim">VOL</span>
          </label>
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={showMA.ma20}
              onChange={(e) => setShowMA({ ...showMA, ma20: e.target.checked })}
              className="w-3 h-3 accent-term-amber"
            />
            <span className="text-term-textDim">MA20</span>
          </label>
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={showMA.ma50}
              onChange={(e) => setShowMA({ ...showMA, ma50: e.target.checked })}
              className="w-3 h-3 accent-term-amber"
            />
            <span className="text-term-textDim">MA50</span>
          </label>
          <span className="text-term-textDim ml-2">Scroll: Pan | Shift+Scroll: Zoom | Ctrl+Scroll: Price Zoom</span>
        </div>
      </div>

      {/* Chart Area - Fullscreen */}
      <div className="flex-1 relative overflow-hidden">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
            const y = padding.top + mainChartHeight * pct;
            const price = maxPrice - priceRange * pct;
            return (
              <g key={pct}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#1a1a1a"
                  strokeWidth="1"
                />
                <text
                  x={width - padding.right + 5}
                  y={y + 3}
                  textAnchor="start"
                  fill="#666"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  ${price.toFixed(2)}
                </text>
              </g>
            );
          })}
          
          {/* Candlesticks or Line Chart */}
          {chartType === "candle" && visibleData.map((d, i) => {
            const x = getX(i);
            const yOpen = getY(d.open);
            const yClose = getY(d.close);
            const yHigh = getY(d.high);
            const yLow = getY(d.low);
            const candleUp = d.close >= d.open;
            const candleWidth = Math.max(2, chartWidth / visibleData.length * 0.6);
            
            return (
              <g key={d.date}>
                {/* Wick */}
                <line
                  x1={x}
                  y1={yHigh}
                  x2={x}
                  y2={yLow}
                  stroke={candleUp ? "#00ff41" : "#ff073a"}
                  strokeWidth="1"
                />
                {/* Body */}
                <rect
                  x={x - candleWidth / 2}
                  y={Math.min(yOpen, yClose)}
                  width={candleWidth}
                  height={Math.max(Math.abs(yClose - yOpen), 1)}
                  fill={candleUp ? "#00ff41" : "#ff073a"}
                  stroke={candleUp ? "#00ff41" : "#ff073a"}
                  strokeWidth="1"
                />
              </g>
            );
          })}
          
          {chartType === "line" && (
            <polyline
              points={visibleData.map((d, i) => `${getX(i)},${getY(d.close)}`).join(" ")}
              fill="none"
              stroke={isUp ? "#00ff41" : "#ff073a"}
              strokeWidth="2"
            />
          )}
          
          {/* Moving Averages */}
          {showMA.ma20 && (
            <polyline
              points={maData.ma20.filter((p, idx) => p !== null && idx >= visibleRange.start/100 * sorted.length && idx <= visibleRange.end/100 * sorted.length).map((p, idx) => `${getX(idx)},${getY(p!.y)}`).join(" ")}
              fill="none"
              stroke="#00bfff"
              strokeWidth="1.5"
              opacity="0.8"
            />
          )}
          {showMA.ma50 && (
            <polyline
              points={maData.ma50.filter((p, idx) => p !== null && idx >= visibleRange.start/100 * sorted.length && idx <= visibleRange.end/100 * sorted.length).map((p, idx) => `${getX(idx)},${getY(p!.y)}`).join(" ")}
              fill="none"
              stroke="#ff69b4"
              strokeWidth="1.5"
              opacity="0.8"
            />
          )}
          
          {/* Volume bars */}
          {showVolume && visibleData.map((d, i) => {
            const x = getX(i);
            const barHeight = (d.volume / maxVolume) * volumeHeight;
            const candleUp = d.close >= d.open;
            return (
              <rect
                key={d.date}
                x={x - 2}
                y={height - padding.bottom - barHeight}
                width="4"
                height={barHeight}
                fill={candleUp ? "rgba(0, 255, 65, 0.4)" : "rgba(255, 7, 58, 0.4)"}
              />
            );
          })}
          
          {/* Drawings */}
          {drawings.map((drawing) => (
            <line
              key={drawing.id}
              x1={drawing.points[0].x}
              y1={drawing.points[0].y}
              x2={drawing.points[1].x}
              y2={drawing.points[1].y}
              stroke={drawing.color}
              strokeWidth={drawing.width}
              strokeDasharray={drawing.type === "ray" ? "5,5" : undefined}
            />
          ))}
          
          {/* Current drawing preview */}
          {isDrawing && drawingStart && (
            <line
              x1={drawingStart.x}
              y1={drawingStart.y}
              x2={drawingStart.x + 50}
              y2={drawingStart.y + 50}
              stroke="#ff9500"
              strokeWidth="2"
              strokeDasharray="5,5"
              opacity="0.5"
            />
          )}
          
          {/* Date labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
            const idx = Math.floor(pct * (visibleData.length - 1));
            const x = getX(idx);
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
                {fmtDate(visibleData[idx]?.date)}
              </text>
            );
          })}
        </svg>
        
        {/* Current price indicator */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
          <div className={`px-2 py-1 text-[9px] font-bold num ${isUp ? 'bg-term-green text-term-black' : 'bg-term-red text-term-black'}`}>
            ${lastCandle.close.toFixed(2)}
          </div>
        </div>
        
        {/* Zoom level indicator */}
        <div className="absolute top-2 left-2 text-[9px] bg-black/80 px-2 py-1 border border-term-border text-term-textDim">
          Zoom: {(visibleRange.end - visibleRange.start).toFixed(0)}% | Price: {priceZoom.toFixed(1)}x
        </div>
      </div>

      {/* Stats footer */}
      <div className="h-7 px-3 border-t border-term-border-strong bg-term-panel flex items-center justify-between text-[9px] uppercase tracking-wider">
        <div className="flex items-center gap-4 text-term-textDim">
          <span>O: <span className="num text-term-text">${lastCandle.open.toFixed(2)}</span></span>
          <span>H: <span className="num text-term-green">${maxPrice.toFixed(2)}</span></span>
          <span>L: <span className="num text-term-red">${minPrice.toFixed(2)}</span></span>
          <span>C: <span className={cn("num", isUp ? "text-term-green" : "text-term-red")}>${lastCandle.close.toFixed(2)}</span></span>
          <span>VOL: <span className="num">{(visibleData.reduce((sum, d) => sum + d.volume, 0) / 1e6).toFixed(1)}M</span></span>
        </div>
        <div className="text-term-textDim">
          {visibleData.length}/{sorted.length} CANDLES · {INTERVALS.find(i => i.value === interval)?.label} · {chartType.toUpperCase()}
        </div>
      </div>
    </div>
  );
}
