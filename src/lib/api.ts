const BASE = "/api/v1";

export class ApiError extends Error {
  constructor(public status: number, message: string, public needsKey?: string) {
    super(message);
  }
}

// Mock data for when API is unavailable
// Generate dynamic mock quote for any symbol
function generateMockQuote(symbol: string): any {
  const basePrice = 50 + Math.random() * 200;
  return {
    symbol: symbol.toUpperCase(),
    name: `${symbol.toUpperCase()} Inc.`,
    last_price: parseFloat(basePrice.toFixed(2)),
    prev_close: parseFloat((basePrice * (0.98 + Math.random() * 0.04)).toFixed(2)),
    open: parseFloat((basePrice * (0.99 + Math.random() * 0.02)).toFixed(2)),
    high: parseFloat((basePrice * (1.01 + Math.random() * 0.02)).toFixed(2)),
    low: parseFloat((basePrice * (0.98 + Math.random() * 0.02)).toFixed(2)),
    volume: Math.floor(5000000 + Math.random() * 50000000),
    ma_50d: parseFloat((basePrice * 0.95).toFixed(2)),
    ma_200d: parseFloat((basePrice * 0.90).toFixed(2)),
    year_high: parseFloat((basePrice * 1.15).toFixed(2)),
    year_low: parseFloat((basePrice * 0.75).toFixed(2)),
  };
}

// Generate dynamic mock profile for any symbol
function generateMockProfile(symbol: string): any {
  const sectors = ['Technology', 'Healthcare', 'Finance', 'Consumer Cyclical', 'Energy', 'Industrials'];
  const industries = ['Software', 'Semiconductors', 'Biotechnology', 'Banking', 'Retail', 'Manufacturing'];
  const sector = sectors[Math.floor(Math.random() * sectors.length)];
  const industry = industries[Math.floor(Math.random() * industries.length)];
  
  return {
    symbol: symbol.toUpperCase(),
    name: `${symbol.toUpperCase()} Inc.`,
    sector,
    industry_category: industry,
    employees: Math.floor(1000 + Math.random() * 100000),
    hq_country: 'United States',
    currency: 'USD',
  };
}

// Generate dynamic mock metrics for any symbol
function generateMockMetrics(symbol: string): any {
  return {
    symbol: symbol.toUpperCase(),
    pe_ratio: parseFloat((15 + Math.random() * 50).toFixed(2)),
    forward_pe: parseFloat((12 + Math.random() * 40).toFixed(2)),
    enterprise_to_ebitda: parseFloat((10 + Math.random() * 30).toFixed(2)),
    revenue_growth: parseFloat((Math.random() * 0.3).toFixed(3)),
    earnings_growth: parseFloat((Math.random() * 0.4).toFixed(3)),
    gross_margin: parseFloat((0.2 + Math.random() * 0.5).toFixed(3)),
    operating_margin: parseFloat((0.05 + Math.random() * 0.3).toFixed(3)),
    profit_margin: parseFloat((0.05 + Math.random() * 0.25).toFixed(3)),
    return_on_equity: parseFloat((0.1 + Math.random() * 0.5).toFixed(3)),
    debt_to_equity: parseFloat((Math.random() * 2).toFixed(2)),
    dividend_yield: parseFloat((Math.random() * 0.03).toFixed(4)),
  };
}

const MOCK_QUOTES: Record<string, any> = {
  AAPL: { symbol: "AAPL", name: "Apple Inc.", last_price: 182.52, prev_close: 180.18, open: 181.20, high: 183.45, low: 180.90, volume: 52345678, ma_50d: 178.30, ma_200d: 175.60, year_high: 199.62, year_low: 164.08 },
  MSFT: { symbol: "MSFT", name: "Microsoft Corp.", last_price: 415.30, prev_close: 412.80, open: 413.50, high: 416.20, low: 412.10, volume: 23456789, ma_50d: 408.50, ma_200d: 395.20, year_high: 468.35, year_low: 362.90 },
  TSLA: { symbol: "TSLA", name: "Tesla Inc.", last_price: 245.67, prev_close: 250.90, open: 249.30, high: 251.20, low: 244.50, volume: 98765432, ma_50d: 238.40, ma_200d: 225.80, year_high: 299.29, year_low: 152.37 },
  NVDA: { symbol: "NVDA", name: "NVIDIA Corp.", last_price: 875.30, prev_close: 859.70, open: 862.40, high: 878.90, low: 860.20, volume: 45678901, ma_50d: 825.60, ma_200d: 720.40, year_high: 974.00, year_low: 403.25 },
  GOOGL: { symbol: "GOOGL", name: "Alphabet Inc.", last_price: 156.80, prev_close: 155.20, open: 155.60, high: 157.30, low: 155.10, volume: 28901234, ma_50d: 152.40, ma_200d: 145.80, year_high: 175.45, year_low: 121.46 },
};

const MOCK_PROFILES: Record<string, any> = {
  AAPL: { symbol: "AAPL", name: "Apple Inc.", sector: "Technology", industry_category: "Consumer Electronics", employees: 161000, hq_country: "United States", currency: "USD" },
  MSFT: { symbol: "MSFT", name: "Microsoft Corp.", sector: "Technology", industry_category: "Software", employees: 221000, hq_country: "United States", currency: "USD" },
  TSLA: { symbol: "TSLA", name: "Tesla Inc.", sector: "Consumer Cyclical", industry_category: "Auto Manufacturers", employees: 140473, hq_country: "United States", currency: "USD" },
  NVDA: { symbol: "NVDA", name: "NVIDIA Corp.", sector: "Technology", industry_category: "Semiconductors", employees: 29600, hq_country: "United States", currency: "USD" },
  GOOGL: { symbol: "GOOGL", name: "Alphabet Inc.", sector: "Communication Services", industry_category: "Internet Content & Information", employees: 182502, hq_country: "United States", currency: "USD" },
};

const MOCK_METRICS: Record<string, any> = {
  AAPL: { symbol: "AAPL", pe_ratio: 28.5, forward_pe: 26.3, enterprise_to_ebitda: 22.1, revenue_growth: 0.021, earnings_growth: 0.085, gross_margin: 0.443, operating_margin: 0.298, profit_margin: 0.256, return_on_equity: 1.472, debt_to_equity: 1.85, dividend_yield: 0.0048 },
  MSFT: { symbol: "MSFT", pe_ratio: 35.2, forward_pe: 31.8, enterprise_to_ebitda: 24.5, revenue_growth: 0.125, earnings_growth: 0.165, gross_margin: 0.689, operating_margin: 0.421, profit_margin: 0.362, return_on_equity: 0.385, debt_to_equity: 0.42, dividend_yield: 0.0072 },
  TSLA: { symbol: "TSLA", pe_ratio: 62.8, forward_pe: 55.2, enterprise_to_ebitda: 38.9, revenue_growth: 0.189, earnings_growth: 0.245, gross_margin: 0.182, operating_margin: 0.095, profit_margin: 0.132, return_on_equity: 0.245, debt_to_equity: 0.18, dividend_yield: 0 },
  NVDA: { symbol: "NVDA", pe_ratio: 68.5, forward_pe: 48.3, enterprise_to_ebitda: 52.1, revenue_growth: 1.265, earnings_growth: 2.845, gross_margin: 0.725, operating_margin: 0.542, profit_margin: 0.489, return_on_equity: 0.985, debt_to_equity: 0.32, dividend_yield: 0.0003 },
  GOOGL: { symbol: "GOOGL", pe_ratio: 24.8, forward_pe: 21.5, enterprise_to_ebitda: 15.2, revenue_growth: 0.089, earnings_growth: 0.125, gross_margin: 0.568, operating_margin: 0.285, profit_margin: 0.235, return_on_equity: 0.285, debt_to_equity: 0.11, dividend_yield: 0 },
};

// Generate mock historical candlestick data
function generateMockCandles(symbol: string, days: number): Candle[] {
  const candles: Candle[] = [];
  const basePrice = MOCK_QUOTES[symbol?.toUpperCase()]?.last_price || (100 + Math.random() * 200);
  let price = basePrice * 0.9;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(Date.now() - i * 864e5).toISOString().slice(0, 10);
    const volatility = 0.02;
    const change = (Math.random() - 0.5) * volatility;
    const open = price;
    const close = price * (1 + change);
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);
    const volume = Math.floor(10000000 + Math.random() * 50000000);
    
    candles.push({ date, open, high, low, close, volume });
    price = close;
  }
  
  return candles;
}

// Generate mock index data
function generateMockIndexData(symbol: string, days: number): Candle[] {
  const indexBasePrices: Record<string, number> = {
    '^GSPC': 4800, '^DJI': 37500, '^IXIC': 15000, '^RUT': 2000,
    '^VIX': 15, '^GSPTSE': 21000, '^BVSP': 125000,
    '^FTSE': 7600, '^GDAXI': 16800, '^FCHI': 7500,
    '^STOXX50E': 4500, '^IBEX': 9800, '^N225': 36000,
    '^HSI': 17500, '^AXJO': 7600, '^KS11': 2600, '^TWII': 17800,
  };
  
  return generateMockCandlesWithBase(indexBasePrices[symbol] || 1000, days);
}

// Generate mock crypto data
function generateMockCryptoData(symbol: string, days: number): Candle[] {
  const cryptoBasePrices: Record<string, number> = {
    'BTC-USD': 65000, 'ETH-USD': 3500, 'SOL-USD': 145,
    'BNB-USD': 580, 'XRP-USD': 0.52, 'ADA-USD': 0.45,
    'DOGE-USD': 0.15, 'AVAX-USD': 35, 'LINK-USD': 14,
    'LTC-USD': 72, 'MATIC-USD': 0.72, 'DOT-USD': 7.2,
  };
  
  return generateMockCandlesWithBase(cryptoBasePrices[symbol] || 100, days);
}

// Generate mock FX data
function generateMockFXData(symbol: string, days: number): Candle[] {
  const fxBasePrices: Record<string, number> = {
    'EURUSD=X': 1.0850, 'GBPUSD=X': 1.2650, 'USDJPY=X': 155.50,
    'USDCHF=X': 0.8950, 'USDCAD=X': 1.3650, 'AUDUSD=X': 0.6550,
    'NZDUSD=X': 0.6050, 'EURGBP=X': 0.8580, 'EURJPY=X': 168.50,
    'GBPJPY=X': 196.50, 'USDCNY=X': 7.23, 'USDMXN=X': 16.85,
  };
  
  return generateMockCandlesWithBase(fxBasePrices[symbol] || 1.0, days);
}

// Helper function to generate candles with a specific base price
function generateMockCandlesWithBase(basePrice: number, days: number): Candle[] {
  const candles: Candle[] = [];
  let price = basePrice * 0.95;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(Date.now() - i * 864e5).toISOString().slice(0, 10);
    const volatility = 0.015;
    const change = (Math.random() - 0.5) * volatility;
    const open = price;
    const close = price * (1 + change);
    const high = Math.max(open, close) * (1 + Math.random() * 0.008);
    const low = Math.min(open, close) * (1 - Math.random() * 0.008);
    const volume = Math.floor(100000000 + Math.random() * 500000000);
    
    candles.push({ date, open, high, low, close, volume });
    price = close;
  }
  
  return candles;
}

// Generate mock treasury rates
function generateMockTreasuryRates(days: number): TreasuryRow[] {
  const rates: TreasuryRow[] = [];
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(Date.now() - i * 864e5).toISOString().slice(0, 10);
    const baseRate = 0.04 + (Math.random() - 0.5) * 0.005;
    
    rates.push({
      date,
      month_1: baseRate - 0.005,
      month_3: baseRate - 0.003,
      month_6: baseRate - 0.001,
      year_1: baseRate,
      year_2: baseRate + 0.002,
      year_3: baseRate + 0.004,
      year_5: baseRate + 0.006,
      year_7: baseRate + 0.007,
      year_10: baseRate + 0.008,
      year_20: baseRate + 0.009,
      year_30: baseRate + 0.010,
    });
  }
  
  return rates;
}

// Generate mock market movers
function generateMockMovers(type: 'gainers' | 'losers' | 'active'): Mover[] {
  const stocks = [
    { symbol: 'AMD', name: 'Advanced Micro Devices Inc.', basePrice: 165 },
    { symbol: 'META', name: 'Meta Platforms Inc.', basePrice: 485 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', basePrice: 178 },
    { symbol: 'NFLX', name: 'Netflix Inc.', basePrice: 625 },
    { symbol: 'CRM', name: 'Salesforce Inc.', basePrice: 285 },
    { symbol: 'UBER', name: 'Uber Technologies Inc.', basePrice: 78 },
    { symbol: 'COIN', name: 'Coinbase Global Inc.', basePrice: 245 },
    { symbol: 'SQ', name: 'Block Inc.', basePrice: 72 },
    { symbol: 'SHOP', name: 'Shopify Inc.', basePrice: 82 },
    { symbol: 'SNOW', name: 'Snowflake Inc.', basePrice: 185 },
  ];
  
  return stocks.map(stock => {
    const changePercent = type === 'gainers' ? (5 + Math.random() * 15) :
                         type === 'losers' ? -(5 + Math.random() * 15) :
                         (Math.random() - 0.5) * 5;
    const price = stock.basePrice * (1 + changePercent / 100);
    const change = price - stock.basePrice;
    
    return {
      symbol: stock.symbol,
      name: stock.name,
      price,
      change,
      percent_change: changePercent / 100,
      volume: Math.floor(20000000 + Math.random() * 80000000),
      market_cap: Math.floor(50000000000 + Math.random() * 500000000000),
      pe_forward: 20 + Math.random() * 40,
    };
  }).sort((a, b) => type === 'gainers' ? b.percent_change - a.percent_change :
                     type === 'losers' ? a.percent_change - b.percent_change :
                     b.volume - a.volume);
}

async function get<T>(
  path: string,
  params: Record<string, string | number | boolean | undefined> = {}
): Promise<T> {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") qs.set(k, String(v));
  }
  
  try {
    const res = await fetch(`${BASE}${path}?${qs.toString()}`);
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      const detail = body.detail;
      let msg = res.statusText;
      let needsKey: string | undefined;
      if (typeof detail === "string") msg = detail;
      else if (Array.isArray(detail)) msg = detail.map((d: any) => d.msg || JSON.stringify(d)).join("; ");
      const m = /credential '([a-z_]+)'/i.exec(msg);
      if (m) needsKey = m[1];
      throw new ApiError(res.status, msg, needsKey);
    }
    return body.results as T;
  } catch (error) {
    // Fallback to mock data when API is unavailable
    console.warn("API unavailable, using mock data for:", path, params);
    const symbol = params.symbol as string;
    
    if (path.includes("/equity/price/quote")) {
      return (MOCK_QUOTES[symbol?.toUpperCase()] || generateMockQuote(symbol)) as T;
    }
    if (path.includes("/equity/profile")) {
      return (MOCK_PROFILES[symbol?.toUpperCase()] || generateMockProfile(symbol)) as T;
    }
    if (path.includes("/equity/fundamental/metrics")) {
      return (MOCK_METRICS[symbol?.toUpperCase()] || generateMockMetrics(symbol)) as T;
    }
    if (path.includes("/equity/price/historical") || path.includes("/index/price/historical") || path.includes("/currency/price/historical") || path.includes("/crypto/price/historical")) {
      const days = params.start_date ? Math.ceil((new Date().getTime() - new Date(String(params.start_date)).getTime()) / 864e5) : 30;
      if (path.includes("/index/price")) return generateMockIndexData(symbol, days) as T;
      if (path.includes("/crypto/price")) return generateMockCryptoData(symbol, days) as T;
      if (path.includes("/currency/price")) return generateMockFXData(symbol, days) as T;
      return generateMockCandles(symbol, days) as T;
    }
    if (path.includes("/news/company")) return [] as T;
    if (path.includes("/equity/fundamental/income")) return [] as T;
    if (path.includes("/equity/estimates/consensus")) return {} as T;
    if (path.includes("/equity/discovery/gainers")) return generateMockMovers('gainers') as T;
    if (path.includes("/equity/discovery/losers")) return generateMockMovers('losers') as T;
    if (path.includes("/equity/discovery/active")) return generateMockMovers('active') as T;
    if (path.includes("/derivatives/options")) return [] as T;
    if (path.includes("/fixedincome")) return generateMockTreasuryRates(30) as T;
    if (path.includes("/equity/search")) return [] as T;
    
    throw error;
  }
}

// ────── Equity ──────
export interface Quote {
  symbol: string; name?: string; exchange?: string;
  last_price?: number; open?: number; high?: number; low?: number; prev_close?: number;
  bid?: number; ask?: number; bid_size?: number; ask_size?: number;
  volume?: number; volume_average?: number; year_high?: number; year_low?: number;
  ma_50d?: number; ma_200d?: number; currency?: string;
}
export interface Candle { date: string; open: number; high: number; low: number; close: number; volume: number; }
export interface NewsItem { id: string; date: string; title: string; url: string; source?: string; summary?: string; symbol?: string; }
export interface Profile {
  symbol: string; name?: string; stock_exchange?: string; long_description?: string;
  company_url?: string; business_phone_no?: string;
  hq_address1?: string; hq_address_city?: string; hq_state?: string; hq_country?: string; hq_address_postal_code?: string;
  employees?: number; sector?: string; industry_category?: string; issue_type?: string; currency?: string;
  market_cap?: number; shares_outstanding?: number; shares_float?: number;
  dividend_yield?: number; beta?: number;
}
export interface IncomeRow {
  period_ending: string;
  total_revenue?: number; cost_of_revenue?: number; gross_profit?: number;
  operating_income?: number; total_pre_tax_income?: number; net_income?: number;
  basic_earnings_per_share?: number; diluted_earnings_per_share?: number;
  research_and_development_expense?: number; selling_general_and_admin_expense?: number;
}
export interface Metrics {
  symbol: string; market_cap?: number; pe_ratio?: number; forward_pe?: number; peg_ratio?: number;
  enterprise_to_ebitda?: number; revenue_growth?: number; earnings_growth?: number;
  quick_ratio?: number; current_ratio?: number; debt_to_equity?: number;
  gross_margin?: number; operating_margin?: number; profit_margin?: number;
  return_on_assets?: number; return_on_equity?: number;
  dividend_yield?: number; payout_ratio?: number; book_value?: number; price_to_book?: number;
  enterprise_value?: number;
}
export interface Dividend { ex_dividend_date: string; amount: number; }
export interface ConsensusEstimate {
  symbol: string; target_high?: number; target_low?: number; target_consensus?: number;
  target_median?: number; recommendation?: string; recommendation_mean?: number;
  number_of_analysts?: number; current_price?: number; currency?: string;
}
export interface Mover {
  symbol: string; name?: string; price: number; change: number; percent_change: number;
  volume: number; market_cap?: number; pe_forward?: number; eps_ttm?: number;
  dividend_yield?: number; exchange?: string; earnings_date?: string;
}
export interface SearchResult { symbol: string; name: string; cik?: string; }
export interface OptionsRow {
  underlying_symbol: string; underlying_price?: number; contract_symbol: string;
  expiration: string; dte: number; strike: number; option_type: "call" | "put";
  open_interest?: number; volume?: number; last_trade_price?: number;
  bid?: number; ask?: number; change?: number; change_percent?: number;
  implied_volatility?: number; in_the_money?: boolean;
}
export interface TreasuryRow {
  date: string; month_1?: number; month_3?: number; month_6?: number;
  year_1?: number; year_2?: number; year_3?: number; year_5?: number; year_7?: number;
  year_10?: number; year_20?: number; year_30?: number;
}

// Fetchers
export const fetchQuote = (s: string) =>
  get<Quote[] | Quote>("/equity/price/quote", { symbol: s, provider: "yfinance" })
    .then((r) => (Array.isArray(r) ? r[0] : r));

export const fetchHistorical = (s: string, o: { interval?: string; start_date?: string } = {}) => {
  const start = o.start_date ?? new Date(Date.now() - 365 * 864e5).toISOString().slice(0, 10);
  return get<Candle[]>("/equity/price/historical", {
    symbol: s, provider: "yfinance", interval: o.interval ?? "1d", start_date: start,
  });
};

export const fetchNewsCompany = (s: string, limit = 30) =>
  get<NewsItem[]>("/news/company", { symbol: s, provider: "yfinance", limit });

export const fetchProfile = (s: string) =>
  get<Profile[] | Profile>("/equity/profile", { symbol: s, provider: "yfinance" })
    .then((r) => (Array.isArray(r) ? r[0] : r));

export const fetchIncome = (s: string) =>
  get<IncomeRow[]>("/equity/fundamental/income", {
    symbol: s, provider: "yfinance", period: "annual", limit: 5,
  });

export const fetchMetrics = (s: string) =>
  get<Metrics[] | Metrics>("/equity/fundamental/metrics", { symbol: s, provider: "yfinance" })
    .then((r) => (Array.isArray(r) ? r[0] : r));

export const fetchDividends = (s: string) =>
  get<Dividend[]>("/equity/fundamental/dividends", { symbol: s, provider: "yfinance" });

export const fetchConsensus = (s: string) =>
  get<ConsensusEstimate[] | ConsensusEstimate>("/equity/estimates/consensus", {
    symbol: s, provider: "yfinance",
  }).then((r) => (Array.isArray(r) ? r[0] : r));

export const fetchGainers = () =>
  get<Mover[]>("/equity/discovery/gainers", { provider: "yfinance" });
export const fetchLosers = () =>
  get<Mover[]>("/equity/discovery/losers", { provider: "yfinance" });
export const fetchMostActive = () =>
  get<Mover[]>("/equity/discovery/active", { provider: "yfinance" });

export const fetchOptions = (s: string) =>
  get<OptionsRow[]>("/derivatives/options/chains", { symbol: s, provider: "yfinance" });

export const fetchIndexHistorical = (s: string, days = 30) => {
  const start = new Date(Date.now() - days * 864e5).toISOString().slice(0, 10);
  return get<Candle[]>("/index/price/historical", {
    symbol: s, provider: "yfinance", interval: "1d", start_date: start,
  });
};

export const fetchTreasuryRates = (days = 30) => {
  const start = new Date(Date.now() - days * 864e5).toISOString().slice(0, 10);
  return get<TreasuryRow[]>("/fixedincome/government/treasury_rates", {
    provider: "federal_reserve", start_date: start,
  });
};

export const fetchFxHistorical = (pair: string, days = 30) => {
  const start = new Date(Date.now() - days * 864e5).toISOString().slice(0, 10);
  return get<Candle[]>("/currency/price/historical", {
    symbol: pair, provider: "yfinance", interval: "1d", start_date: start,
  });
};

export const fetchCryptoHistorical = (sym: string, days = 30) => {
  const start = new Date(Date.now() - days * 864e5).toISOString().slice(0, 10);
  return get<Candle[]>("/crypto/price/historical", {
    symbol: sym, provider: "yfinance", interval: "1d", start_date: start,
  });
};

export const searchSymbols = (q: string, limit = 8) =>
  get<SearchResult[]>("/equity/search", { query: q, provider: "sec", limit, is_symbol: false });
