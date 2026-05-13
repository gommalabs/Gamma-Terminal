import { useEffect, useState } from "react";
import { useWorkspace } from "@/store/workspaceStore";

export function StatusBar() {
  const [now, setNow] = useState(() => new Date());
  const [apiOk, setApiOk] = useState<boolean | null>(null);
  const tabs = useWorkspace((s) => s.tabs);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let alive = true;
    const ping = async () => {
      try {
        const r = await fetch("/api/v1/equity/price/quote?symbol=SPY&provider=yfinance");
        if (alive) setApiOk(r.ok);
      } catch { if (alive) setApiOk(false); }
    };
    ping();
    const t = setInterval(ping, 15000);
    return () => { alive = false; clearInterval(t); };
  }, []);

  return (
    <div className="h-5 px-2 flex items-center justify-between border-t border-term-border-strong bg-term-black text-[7px] uppercase tracking-wider text-term-textDim">
      <div className="flex items-center gap-3">
        {/* Connection status */}
        <span className="flex items-center gap-1">
          <span className={
            apiOk == null ? "w-1 h-1 bg-term-muted"
            : apiOk ? "w-1 h-1 bg-term-green animate-pulse"
            : "w-1 h-1 bg-term-red animate-pulse"
          } />
          <span>{apiOk == null ? "INIT" : apiOk ? "LIVE" : "OFFLN"}</span>
        </span>
        
        {/* Tabs count */}
        <span>TABS:<span className="text-term-text ml-0.5 num">{tabs.length}</span></span>
      </div>
      
      <div className="flex items-center gap-3 num">
        <span>{now.toLocaleDateString(undefined, { month: "short", day: "2-digit" }).toUpperCase()}</span>
        <span className="text-term-amber font-bold">{now.toLocaleTimeString()}</span>
      </div>
    </div>
  );
}
