export type FunctionCode =
  // System & Navigation
  | "CC" | "HELP" | "SETTINGS" | "PREDICTION"
  // Security Analysis
  | "SCORECARD" | "DES" | "GP" | "QR" | "HP" | "FA" | "KEY" | "DVD" | "EE" | "NI"
  | "RV" | "SPLC" | "EQS" | "BETA" | "OWN" | "ESG" | "EVTS" | "MA" | "IPO"
  // Markets & Indices
  | "WEI" | "MOV" | "CRYPTO" | "FXC" | "CURV" | "SECTOR_HEATMAP"
  | "TOP" | "MOST" | "IMAP" | "WBI" | "BTMM"
  // Fixed Income
  | "YAS" | "YC" | "SWPM" | "OAS" | "DUR"
  // Derivatives & Options
  | "OMON" | "OVME" | "IVOL" | "VOLS" | "VAR"
  // Portfolio & Risk
  | "PORT" | "RSK" | "ATTR" | "MARS"
  // Economics & Macro
  | "ECO" | "ECFC" | "GDP" | "CPI" | "WIRP";

export interface FunctionDef {
  code: FunctionCode;
  name: string;
  needsSymbol: boolean;
  group: "Security" | "Markets" | "Fixed Income" | "Derivatives" | "Portfolio" | "Economics" | "System";
  summary: string;
}

export const FUNCTIONS: FunctionDef[] = [
  // ─── SYSTEM & NAVIGATION ───
  { code: "CC",   name: "Command Center",        needsSymbol: false, group: "System", summary: "Morning briefing · markets, curve, FX, movers, news" },
  { code: "HELP", name: "Function Directory",    needsSymbol: false, group: "System", summary: "List of all terminal functions" },
  { code: "SETTINGS", name: "Settings",          needsSymbol: false, group: "System", summary: "Configure brokers, APIs, and preferences" },
  { code: "PREDICTION", name: "Prediction Markets", needsSymbol: false, group: "System", summary: "Political, economic, crypto prediction markets with live odds" },

  // ─── SECURITY ANALYSIS ───
  { code: "SCORECARD", name: "Stock Scorecard",  needsSymbol: true,  group: "Security", summary: "Full analysis — signals across technical, value, fundamentals, analysts" },
  { code: "DES",  name: "Security Description", needsSymbol: true,  group: "Security", summary: "Company profile, sector, HQ, employees" },
  { code: "GP",   name: "Graph / Chart",         needsSymbol: true,  group: "Security", summary: "Historical candlestick chart + volume" },
  { code: "QR",   name: "Quote Recap",           needsSymbol: true,  group: "Security", summary: "Live quote: last, bid/ask, volume, day range" },
  { code: "HP",   name: "Historical Prices",     needsSymbol: true,  group: "Security", summary: "OHLCV table" },
  { code: "FA",   name: "Financial Analysis",    needsSymbol: true,  group: "Security", summary: "Income statement — last 5 fiscal years" },
  { code: "KEY",  name: "Key Ratios & Metrics",  needsSymbol: true,  group: "Security", summary: "PE, EV/EBITDA, margins, ROE, etc." },
  { code: "DVD",  name: "Dividend History",      needsSymbol: true,  group: "Security", summary: "All historical dividends" },
  { code: "EE",   name: "Analyst Estimates",     needsSymbol: true,  group: "Security", summary: "Target prices, recommendation, analyst count" },
  { code: "NI",   name: "News — Company",        needsSymbol: true,  group: "Security", summary: "Latest headlines for the symbol" },
  { code: "RV",   name: "Relative Valuation",    needsSymbol: true,  group: "Security", summary: "Compare valuation multiples vs peers" },
  { code: "SPLC", name: "Supply Chain",          needsSymbol: true,  group: "Security", summary: "Customer/supplier relationships and exposure" },
  { code: "EQS",  name: "Equity Screener",       needsSymbol: false, group: "Security", summary: "Screen stocks by fundamental/technical criteria" },
  { code: "BETA", name: "Beta Analysis",         needsSymbol: true,  group: "Security", summary: "Regression analysis vs benchmark" },
  { code: "OWN",  name: "Ownership",             needsSymbol: true,  group: "Security", summary: "Institutional ownership breakdown" },
  { code: "ESG",  name: "ESG Analytics",         needsSymbol: true,  group: "Security", summary: "Environmental, social, governance scores" },
  { code: "EVTS", name: "Corporate Events",      needsSymbol: true,  group: "Security", summary: "Earnings dates, conferences, shareholder meetings" },
  { code: "MA",   name: "M&A Analysis",          needsSymbol: true,  group: "Security", summary: "Merger arbitrage, deal terms, regulatory status" },
  { code: "IPO",  name: "IPO Monitor",           needsSymbol: false, group: "Security", summary: "Upcoming and recent IPOs" },

  // ─── MARKETS & INDICES ───
  { code: "WEI",  name: "World Equity Indices",  needsSymbol: false, group: "Markets", summary: "Major global indices — level & daily change" },
  { code: "MOV",  name: "Market Movers",         needsSymbol: false, group: "Markets", summary: "US gainers, losers, most active" },
  { code: "CRYPTO", name: "Crypto Monitor",      needsSymbol: false, group: "Markets", summary: "Top crypto prices + sparkline" },
  { code: "FXC",  name: "FX Cross Rates",        needsSymbol: false, group: "Markets", summary: "Major FX pairs matrix" },
  { code: "SECTOR_HEATMAP", name: "Sector Heatmap", needsSymbol: true, group: "Markets", summary: "Interactive sector performance heatmap" },
  { code: "TOP",  name: "Global Market Overview",needsSymbol: false, group: "Markets", summary: "Real-time global market dashboard" },
  { code: "MOST", name: "Most Active",           needsSymbol: false, group: "Markets", summary: "Highest volume securities today" },
  { code: "IMAP", name: "Interactive Map",       needsSymbol: false, group: "Markets", summary: "Geographic market performance heatmap" },
  { code: "WBI",  name: "World Bond Indices",    needsSymbol: false, group: "Markets", summary: "Global bond index performance" },
  { code: "BTMM", name: "Money Markets",         needsSymbol: false, group: "Markets", summary: "Short-term rates, LIBOR, SOFR" },

  // ─── FIXED INCOME ───
  { code: "CURV", name: "US Yield Curve",        needsSymbol: false, group: "Fixed Income", summary: "Treasury par yield curve" },
  { code: "YAS",  name: "Yield & Spread",        needsSymbol: true,  group: "Fixed Income", summary: "Bond yield, spread, duration analytics" },
  { code: "YC",   name: "Yield Curves",          needsSymbol: false, group: "Fixed Income", summary: "Multi-currency yield curves" },
  { code: "SWPM", name: "Swap Manager",          needsSymbol: false, group: "Fixed Income", summary: "Interest rate swap pricing & analytics" },
  { code: "OAS",  name: "Option-Adjusted Spread", needsSymbol: true,  group: "Fixed Income", summary: "OAS analysis for callable bonds" },
  { code: "DUR",  name: "Duration Analytics",    needsSymbol: true,  group: "Fixed Income", summary: "Modified duration, convexity, DV01" },

  // ─── DERIVATIVES & OPTIONS ───
  { code: "OMON", name: "Options Monitor",       needsSymbol: true,  group: "Derivatives", summary: "Options chain with bid/ask, IV, OI, volume" },
  { code: "OVME", name: "Option Valuation",      needsSymbol: true,  group: "Derivatives", summary: "Black-Scholes option pricing model" },
  { code: "IVOL", name: "Implied Volatility",    needsSymbol: true,  group: "Derivatives", summary: "IV term structure and skew" },
  { code: "VOLS", name: "Volatility Surfaces",   needsSymbol: true,  group: "Derivatives", summary: "3D volatility surface visualization" },
  { code: "VAR",  name: "Value-at-Risk",         needsSymbol: false, group: "Derivatives", summary: "Portfolio VaR calculations" },

  // ─── PORTFOLIO & RISK ───
  { code: "PORT", name: "Portfolio Analytics",   needsSymbol: false, group: "Portfolio", summary: "Holdings, performance, attribution" },
  { code: "RSK",  name: "Risk Analytics",        needsSymbol: false, group: "Portfolio", summary: "Portfolio risk metrics & stress tests" },
  { code: "ATTR", name: "Attribution Analysis",  needsSymbol: false, group: "Portfolio", summary: "Performance attribution by factor/sector" },
  { code: "MARS", name: "Risk Engine",           needsSymbol: false, group: "Portfolio", summary: "Bloomberg MARS risk system" },

  // ─── ECONOMICS & MACRO ───
  { code: "ECO",  name: "Economic Calendar",     needsSymbol: false, group: "Economics", summary: "Upcoming economic data releases" },
  { code: "ECFC", name: "Economic Forecasts",    needsSymbol: false, group: "Economics", summary: "Consensus forecasts for key indicators" },
  { code: "GDP",  name: "GDP Analysis",          needsSymbol: false, group: "Economics", summary: "GDP growth, components, forecasts" },
  { code: "CPI",  name: "Inflation Data",        needsSymbol: false, group: "Economics", summary: "CPI, PCE, core inflation trends" },
  { code: "WIRP", name: "Rate Probabilities",    needsSymbol: false, group: "Economics", summary: "Fed funds futures implied probabilities" },
];

export const FN_BY_CODE: Record<string, FunctionDef> = Object.fromEntries(FUNCTIONS.map((f) => [f.code, f]));

export interface ParsedCommand {
  symbol?: string;
  code: FunctionCode;
}

/** Parse a free-form command like "AAPL DES", "DES", "AAPL", "TOP". */
export function parseCommand(raw: string, activeSymbol: string | null): ParsedCommand | null {
  const parts = raw.trim().toUpperCase().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return null;

  const isFn = (s: string): s is FunctionCode => s in FN_BY_CODE;

  if (parts.length === 1) {
    const p = parts[0];
    if (isFn(p)) {
      const fn = FN_BY_CODE[p];
      if (fn.needsSymbol) {
        if (!activeSymbol) return null;
        return { symbol: activeSymbol, code: p };
      }
      return { code: p };
    }
    // just a symbol — default to SCORECARD (the main stock view)
    return { symbol: p, code: "SCORECARD" };
  }

  // Two or more tokens: SYMBOL FUNC
  const [sym, fn] = parts;
  if (isFn(fn)) return { symbol: sym, code: fn };
  // FUNC SYMBOL (also allowed)
  if (isFn(sym)) {
    const f = FN_BY_CODE[sym];
    return f.needsSymbol ? { symbol: fn, code: sym } : { code: sym };
  }
  return null;
}
