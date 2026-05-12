import React, { useState, useEffect } from 'react';

interface SecurityDescriptionProps {
  security: string;
}

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
    price: 178.45,
    change: 2.34,
    changePercent: 1.33,
    open: 176.50,
    high: 179.20,
    low: 176.10,
    volume: '52.4M',
    avgVolume: '58.2M',
    peRatio: 28.5,
    eps: 6.26,
    dividend: 0.96,
    yield: 0.54,
    beta: 1.24,
    week52High: 199.62,
    week52Low: 164.08,
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
    price: 245.89,
    change: -3.45,
    changePercent: -1.38,
    open: 248.50,
    high: 250.20,
    low: 244.10,
    volume: '98.7M',
    avgVolume: '105.3M',
    peRatio: 65.2,
    eps: 3.77,
    dividend: 0.00,
    yield: 0.00,
    beta: 2.03,
    week52High: 299.29,
    week52Low: 152.37,
  },
};

const SecurityDescription: React.FC<SecurityDescriptionProps> = ({ security }) => {
  const [data, setData] = useState(SECURITY_DATA[security.toUpperCase()] || SECURITY_DATA['AAPL']);
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
