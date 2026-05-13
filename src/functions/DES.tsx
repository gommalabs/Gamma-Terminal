import React, { useState, useEffect } from 'react';

interface SecurityDescriptionProps {
  security: string;
}

// Mock data for all major stocks
const SECURITY_DATA: Record<string, any> = {
  AAPL: {
    name: 'APPLE INC',
    exchange: 'NASDAQ',
    sector: 'Technology',
    industry: 'Consumer Electronics',
    marketCap: '2.85T',
    employees: '164,000',
    founded: '1976',
    ceo: 'Tim Cook',
    headquarters: 'Cupertino, CA',
    website: 'www.apple.com',
    description: 'Apple Inc designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.',
    price: 182.52,
    change: 2.34,
    changePercent: 1.30,
    open: 181.20,
    high: 183.45,
    low: 180.90,
    volume: '52.3M',
    avgVolume: '58.2M',
    peRatio: 29.1,
    eps: 6.27,
    dividend: 0.96,
    yield: 0.53,
    beta: 1.24,
    week52High: 199.62,
    week52Low: 164.08,
  },
  MSFT: {
    name: 'MICROSOFT CORP',
    exchange: 'NASDAQ',
    sector: 'Technology',
    industry: 'Software',
    marketCap: '3.09T',
    employees: '221,000',
    founded: '1975',
    ceo: 'Satya Nadella',
    headquarters: 'Redmond, WA',
    website: 'www.microsoft.com',
    description: 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.',
    price: 415.30,
    change: 2.50,
    changePercent: 0.61,
    open: 413.50,
    high: 416.20,
    low: 412.10,
    volume: '23.5M',
    avgVolume: '25.8M',
    peRatio: 35.8,
    eps: 11.60,
    dividend: 3.00,
    yield: 0.72,
    beta: 0.89,
    week52High: 468.35,
    week52Low: 362.90,
  },
  TSLA: {
    name: 'TESLA INC',
    exchange: 'NASDAQ',
    sector: 'Consumer Cyclical',
    industry: 'Auto Manufacturers',
    marketCap: '782.5B',
    employees: '127,855',
    founded: '2003',
    ceo: 'Elon Musk',
    headquarters: 'Austin, TX',
    website: 'www.tesla.com',
    description: 'Tesla Inc designs, develops, manufactures, and sells electric vehicles and energy generation and storage systems.',
    price: 245.67,
    change: -5.23,
    changePercent: -2.08,
    open: 249.30,
    high: 251.20,
    low: 244.50,
    volume: '98.8M',
    avgVolume: '105.3M',
    peRatio: 65.2,
    eps: 3.77,
    dividend: 0.00,
    yield: 0.00,
    beta: 2.03,
    week52High: 299.29,
    week52Low: 152.37,
  },
  NVDA: {
    name: 'NVIDIA CORP',
    exchange: 'NASDAQ',
    sector: 'Technology',
    industry: 'Semiconductors',
    marketCap: '2.16T',
    employees: '29,600',
    founded: '1993',
    ceo: 'Jensen Huang',
    headquarters: 'Santa Clara, CA',
    website: 'www.nvidia.com',
    description: 'NVIDIA Corporation provides graphics and compute and networking solutions in the United States, Taiwan, China, Hong Kong, and internationally.',
    price: 875.30,
    change: 15.80,
    changePercent: 1.84,
    open: 862.50,
    high: 878.90,
    low: 858.20,
    volume: '45.2M',
    avgVolume: '48.5M',
    peRatio: 72.5,
    eps: 12.07,
    dividend: 0.16,
    yield: 0.02,
    beta: 1.68,
    week52High: 974.00,
    week52Low: 394.50,
  },
  GOOGL: {
    name: 'ALPHABET INC',
    exchange: 'NASDAQ',
    sector: 'Communication Services',
    industry: 'Internet Content & Information',
    marketCap: '1.95T',
    employees: '182,502',
    founded: '1998',
    ceo: 'Sundar Pichai',
    headquarters: 'Mountain View, CA',
    website: 'www.abc.xyz',
    description: 'Alphabet Inc offers various products and platforms in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America.',
    price: 156.80,
    change: 1.20,
    changePercent: 0.77,
    open: 155.90,
    high: 157.50,
    low: 155.40,
    volume: '28.9M',
    avgVolume: '30.2M',
    peRatio: 26.3,
    eps: 5.96,
    dividend: 0.00,
    yield: 0.00,
    beta: 1.05,
    week52High: 175.45,
    week52Low: 121.46,
  },
};

// Default data for unknown symbols
const getDefaultData = (symbol: string) => ({
  name: `${symbol.toUpperCase()} INC`,
  exchange: 'NASDAQ',
  sector: 'Technology',
  industry: 'Software',
  marketCap: '100.0B',
  employees: '50,000',
  founded: '2000',
  ceo: 'John Smith',
  headquarters: 'San Francisco, CA',
  website: `www.${symbol.toLowerCase()}.com`,
  description: `${symbol.toUpperCase()} Inc is a technology company focused on innovation and growth.`,
  price: 100.00 + Math.random() * 50,
  change: (Math.random() - 0.5) * 5,
  changePercent: (Math.random() - 0.5) * 3,
  open: 100.00,
  high: 102.00,
  low: 99.00,
  volume: '10.0M',
  avgVolume: '12.5M',
  peRatio: 25.0,
  eps: 4.00,
  dividend: 0.00,
  yield: 0.00,
  beta: 1.20,
  week52High: 120.00,
  week52Low: 80.00,
});

const SecurityDescription: React.FC<SecurityDescriptionProps> = ({ security }) => {
  const [data, setData] = useState(
    SECURITY_DATA[security.toUpperCase()] || getDefaultData(security)
  );
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const isUp = data.change >= 0;

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev: any) => ({
        ...prev,
        price: prev.price + (Math.random() - 0.5) * 0.5,
        change: prev.change + (Math.random() - 0.5) * 0.3,
      }));
      setLastUpdate(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const week52RangePercent = ((data.price - data.week52Low) / (data.week52High - data.week52Low)) * 100;

  return (
    <div className="h-full flex flex-col bg-black overflow-auto bb-scroll">
      {/* Header with live price */}
      <div className="bb-header">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-amber-500 font-bold text-sm tracking-wider">{security.toUpperCase()} US EQUITY</div>
            <div className="text-orange-700 text-xs">{data.name}</div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-amber-400 num">${data.price.toFixed(2)}</div>
            <div className={`text-sm num flex items-center justify-end gap-2 ${isUp ? 'bb-positive' : 'bb-negative'}`}>
              <span className={`w-2 h-2 rounded-full ${isUp ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
              {isUp ? '+' : ''}{data.change.toFixed(2)} ({isUp ? '+' : ''}{data.changePercent.toFixed(2)}%)
            </div>
            <div className="text-orange-700 text-[10px] mt-1">
              Last update: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard label="OPEN" value={`$${data.open.toFixed(2)}`} />
          <StatCard label="HIGH" value={`$${data.high.toFixed(2)}`} positive />
          <StatCard label="LOW" value={`$${data.low.toFixed(2)}`} negative />
          <StatCard label="VOLUME" value={data.volume} />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-2 gap-4">
          {/* Company Info */}
          <div className="bb-panel">
            <div className="bb-header">
              <span className="text-amber-500 text-xs font-bold">COMPONENTS</span>
            </div>
            <div className="p-3 space-y-2 text-xs">
              <InfoRow label="Sector" value={data.sector} />
              <InfoRow label="Industry" value={data.industry} />
              <InfoRow label="Headquarters" value={data.headquarters} />
              <InfoRow label="CEO" value={data.ceo} />
              <InfoRow label="Employees" value={data.employees} />
              <InfoRow label="Founded" value={data.founded} />
              <InfoRow label="Website" value={data.website} />
            </div>
          </div>

          {/* Key Metrics */}
          <div className="bb-panel">
            <div className="bb-header">
              <span className="text-amber-500 text-xs font-bold">KEY RATIOS</span>
            </div>
            <div className="p-3 space-y-2 text-xs">
              <InfoRow label="Market Cap" value={data.marketCap} />
              <InfoRow label="P/E Ratio" value={data.peRatio.toFixed(2)} />
              <InfoRow label="EPS" value={`$${data.eps.toFixed(2)}`} />
              <InfoRow label="Dividend" value={`$${data.dividend.toFixed(2)}`} />
              <InfoRow label="Yield" value={`${data.yield.toFixed(2)}%`} />
              <InfoRow label="Beta" value={data.beta.toFixed(2)} />
              <InfoRow label="Avg Volume" value={data.avgVolume} />
            </div>
          </div>
        </div>

        {/* 52 Week Range with Visual Bar */}
        <div className="bb-panel p-4">
          <div className="bb-label mb-3">52 WEEK RANGE</div>
          <div className="flex items-center gap-4">
            <span className="bb-value num bb-negative">${data.week52Low.toFixed(2)}</span>
            <div className="flex-1 relative">
              <div className="h-2 bg-orange-950 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-800 to-amber-500 transition-all duration-500"
                  style={{ width: `${week52RangePercent}%` }}
                />
              </div>
              <div 
                className="absolute top-0 w-1 h-2 bg-white rounded-full transition-all duration-500"
                style={{ left: `${week52RangePercent}%` }}
              />
            </div>
            <span className="bb-value num bb-positive">${data.week52High.toFixed(2)}</span>
          </div>
          <div className="text-center text-xs text-orange-600 mt-2">
            Current: ${data.price.toFixed(2)} ({week52RangePercent.toFixed(1)}% of range)
          </div>
        </div>

        {/* Description */}
        <div className="bb-panel p-4">
          <div className="bb-label mb-2">BUSINESS SUMMARY</div>
          <div className="text-amber-400 text-xs leading-relaxed">{data.description}</div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string; positive?: boolean; negative?: boolean }> = ({ 
  label, 
  value, 
  positive, 
  negative 
}) => (
  <div className="bb-panel p-3">
    <div className="bb-label mb-1">{label}</div>
    <div className={`bb-value num ${positive ? 'bb-positive' : negative ? 'bb-negative' : ''}`}>{value}</div>
  </div>
);

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between py-1 border-b border-orange-900/30 last:border-0 hover:bg-orange-950/30 px-2 -mx-2 transition-colors">
    <span className="text-orange-600">{label}</span>
    <span className="text-amber-400 font-semibold">{value}</span>
  </div>
);

export default SecurityDescription;
