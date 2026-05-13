import { useState } from "react";
import { cn } from "@/lib/cn";

interface EconomicEvent {
  id: string;
  date: string;
  time: string;
  country: string;
  event: string;
  actual?: string;
  forecast: string;
  previous: string;
  impact: "high" | "medium" | "low";
  category: "inflation" | "employment" | "gdp" | "rates" | "consumer" | "manufacturing";
}

const MOCK_EVENTS: EconomicEvent[] = [
  // Today's events
  {
    id: "cpi-jan-2026",
    date: new Date().toISOString().slice(0, 10),
    time: "08:30",
    country: "US",
    event: "Consumer Price Index (MoM)",
    actual: "0.3%",
    forecast: "0.2%",
    previous: "0.2%",
    impact: "high",
    category: "inflation",
  },
  {
    id: "unemployment-jan",
    date: new Date().toISOString().slice(0, 10),
    time: "08:30",
    country: "US",
    event: "Unemployment Rate",
    forecast: "3.7%",
    previous: "3.7%",
    impact: "high",
    category: "employment",
  },
  {
    id: "retail-sales-jan",
    date: new Date().toISOString().slice(0, 10),
    time: "08:30",
    country: "US",
    event: "Retail Sales (MoM)",
    forecast: "0.4%",
    previous: "0.6%",
    impact: "medium",
    category: "consumer",
  },
  {
    id: "ecb-rate-decision",
    date: new Date().toISOString().slice(0, 10),
    time: "13:45",
    country: "EU",
    event: "ECB Interest Rate Decision",
    forecast: "4.50%",
    previous: "4.50%",
    impact: "high",
    category: "rates",
  },
  // Tomorrow's events
  {
    id: "ppi-tomorrow",
    date: new Date(Date.now() + 864e5).toISOString().slice(0, 10),
    time: "08:30",
    country: "US",
    event: "Producer Price Index (YoY)",
    forecast: "1.8%",
    previous: "2.0%",
    impact: "medium",
    category: "inflation",
  },
  {
    id: "housing-starts",
    date: new Date(Date.now() + 864e5).toISOString().slice(0, 10),
    time: "08:30",
    country: "US",
    event: "Housing Starts",
    forecast: "1.45M",
    previous: "1.42M",
    impact: "low",
    category: "consumer",
  },
  {
    id: "boe-decision",
    date: new Date(Date.now() + 864e5).toISOString().slice(0, 10),
    time: "12:00",
    country: "UK",
    event: "Bank of England Rate Decision",
    forecast: "5.25%",
    previous: "5.25%",
    impact: "high",
    category: "rates",
  },
  // Future events
  {
    id: "gdp-q4",
    date: new Date(Date.now() + 1728e5).toISOString().slice(0, 10),
    time: "08:30",
    country: "US",
    event: "GDP Growth Rate (QoQ)",
    forecast: "2.8%",
    previous: "2.5%",
    impact: "high",
    category: "gdp",
  },
  {
    id: "ism-manufacturing",
    date: new Date(Date.now() + 1728e5).toISOString().slice(0, 10),
    time: "10:00",
    country: "US",
    event: "ISM Manufacturing PMI",
    forecast: "49.5",
    previous: "48.4",
    impact: "medium",
    category: "manufacturing",
  },
  {
    id: "nonfarm-payrolls",
    date: new Date(Date.now() + 2592e5).toISOString().slice(0, 10),
    time: "08:30",
    country: "US",
    event: "Non-Farm Payrolls",
    forecast: "185K",
    previous: "216K",
    impact: "high",
    category: "employment",
  },
  {
    id: "fomc-minutes",
    date: new Date(Date.now() + 3456e5).toISOString().slice(0, 10),
    time: "14:00",
    country: "US",
    event: "FOMC Meeting Minutes",
    forecast: "",
    previous: "",
    impact: "high",
    category: "rates",
  },
];

const CATEGORIES = [
  { id: "all", label: "ALL EVENTS" },
  { id: "high", label: "HIGH IMPACT" },
  { id: "inflation", label: "INFLATION" },
  { id: "employment", label: "EMPLOYMENT" },
  { id: "gdp", label: "GDP" },
  { id: "rates", label: "RATES" },
];

export function ECO() {
  const [filter, setFilter] = useState("all");
  
  const filtered = filter === "all" 
    ? MOCK_EVENTS 
    : filter === "high"
    ? MOCK_EVENTS.filter(e => e.impact === "high")
    : MOCK_EVENTS.filter(e => e.category === filter);

  // Group by date
  const grouped = filtered.reduce((acc, event) => {
    if (!acc[event.date]) acc[event.date] = [];
    acc[event.date].push(event);
    return acc;
  }, {} as Record<string, EconomicEvent[]>);

  const sortedDates = Object.keys(grouped).sort();

  return (
    <div className="h-full flex flex-col bg-term-black">
      {/* Header */}
      <div className="flex items-center justify-between h-7 px-3 border-b border-term-border-strong bg-term-panel">
        <div className="flex items-center gap-3">
          <span className="text-term-amber font-bold text-[10px] uppercase tracking-wider">
            ECONOMIC CALENDAR
          </span>
          <span className="text-term-textDim text-[9px]">{filtered.length} EVENTS</span>
        </div>
        <div className="flex items-center gap-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={cn(
                "px-2 py-0.5 text-[9px] uppercase tracking-wider border transition-colors",
                filter === cat.id
                  ? "border-term-amber text-term-amber bg-term-amber/10"
                  : "border-transparent text-term-textDim hover:text-term-text hover:border-term-border"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events list */}
      <div className="flex-1 overflow-auto">
        {sortedDates.map((date) => {
          const dateObj = new Date(date);
          const isToday = date === new Date().toISOString().slice(0, 10);
          const isTomorrow = date === new Date(Date.now() + 864e5).toISOString().slice(0, 10);
          
          return (
            <div key={date}>
              {/* Date header */}
              <div className="sticky top-0 z-10 px-3 py-1 bg-term-panel2 border-b border-term-border-strong">
                <span className="text-term-amber text-[10px] font-bold uppercase tracking-wider">
                  {isToday ? "TODAY · " : isTomorrow ? "TOMORROW · " : ""}
                  {dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase()}
                </span>
              </div>

              {/* Events table */}
              <table className="w-full text-[11px] grid-data">
                <thead>
                  <tr className="bg-term-panel">
                    <th className="text-left pl-3 w-20">TIME</th>
                    <th className="text-left w-16">CTRY</th>
                    <th className="text-left">EVENT</th>
                    <th className="text-right w-20">ACTUAL</th>
                    <th className="text-right w-20">FORECAST</th>
                    <th className="text-right w-20">PREVIOUS</th>
                    <th className="text-center w-24">IMPACT</th>
                  </tr>
                </thead>
                <tbody>
                  {grouped[date].map((event) => (
                    <tr key={event.id} className="hover:bg-term-panel transition-colors">
                      <td className="pl-3 num text-term-textDim">{event.time}</td>
                      <td className="text-term-amber font-bold">{event.country}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          {event.impact === "high" && (
                            <span className="w-1.5 h-1.5 bg-term-red rounded-full animate-pulse" />
                          )}
                          <span className="text-term-text">{event.event}</span>
                        </div>
                      </td>
                      <td className="text-right num">
                        {event.actual ? (
                          <span className={cn(
                            "font-bold",
                            event.actual > event.forecast ? "text-term-green" :
                            event.actual < event.forecast ? "text-term-red" :
                            "text-term-text"
                          )}>
                            {event.actual}
                          </span>
                        ) : (
                          <span className="text-term-textDim">—</span>
                        )}
                      </td>
                      <td className="text-right num text-term-amber">{event.forecast || "—"}</td>
                      <td className="text-right num text-term-textDim">{event.previous || "—"}</td>
                      <td className="text-center">
                        <span className={cn(
                          "px-2 py-0.5 text-[9px] uppercase tracking-wider border",
                          event.impact === "high" ? "border-term-red text-term-red bg-term-red/10" :
                          event.impact === "medium" ? "border-term-amber text-term-amber bg-term-amber/10" :
                          "border-term-textDim text-term-textDim bg-term-panel2"
                        )}>
                          {event.impact}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="h-6 px-3 border-t border-term-border-strong bg-term-panel flex items-center justify-between text-[9px] uppercase tracking-wider">
        <div className="flex items-center gap-4 text-term-textDim">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-term-red rounded-full animate-pulse" /> HIGH IMPACT
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-term-amber rounded-full" /> MEDIUM
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-term-textDim rounded-full" /> LOW
          </span>
        </div>
        <div className="text-term-textDim">
          ACTUAL VS FORECAST · GREEN = BEAT · RED = MISS
        </div>
      </div>
    </div>
  );
}
