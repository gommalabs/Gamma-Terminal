import { useEffect, useState } from "react";

interface TickerItem {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export function MarketTicker() {
  const [tickers, setTickers] = useState<TickerItem[]>([
    { symbol: "SPX", price: 5234.18, change: 12.45, changePercent: 0.24 },
    { symbol: "NDX", price: 18456.32, change: -23.67, changePercent: -0.13 },
    { symbol: "DJI", price: 39567.89, change: 45.23, changePercent: 0.11 },
    { symbol: "VIX", price: 13.45, change: -0.32, changePercent: -2.32 },
    { symbol: "BTC", price: 67234.50, change: 1234.50, changePercent: 1.87 },
    { symbol: "ETH", price: 3456.78, change: -45.67, changePercent: -1.30 },
    { symbol: "EUR/USD", price: 1.0845, change: 0.0012, changePercent: 0.11 },
    { symbol: "GBP/USD", price: 1.2678, change: -0.0023, changePercent: -0.18 },
    { symbol: "USD/JPY", price: 151.23, change: 0.45, changePercent: 0.30 },
    { symbol: "GOLD", price: 2178.45, change: 12.30, changePercent: 0.57 },
    { symbol: "OIL", price: 78.90, change: -1.23, changePercent: -1.54 },
    { symbol: "TNX", price: 4.234, change: 0.012, changePercent: 0.28 },
  ]);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTickers((prev) =>
        prev.map((ticker) => {
          const volatility = ticker.symbol === "VIX" ? 0.02 : 0.001;
          const change = (Math.random() - 0.5) * volatility * ticker.price;
          const newPrice = ticker.price + change;
          const newChange = ticker.change + change;
          const newChangePercent = (newChange / (ticker.price - ticker.change)) * 100;
          
          return {
            ...ticker,
            price: Number(newPrice.toFixed(2)),
            change: Number(newChange.toFixed(2)),
            changePercent: Number(newChangePercent.toFixed(2)),
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="market-ticker">
      {tickers.map((ticker) => (
        <div key={ticker.symbol} className="ticker-item">
          <span className="ticker-symbol">{ticker.symbol}</span>
          <span className="ticker-price num">{ticker.price.toLocaleString()}</span>
          <span
            className={`ticker-change num ${
              ticker.change >= 0 ? "positive" : "negative"
            }`}
          >
            {ticker.change >= 0 ? "+" : ""}
            {ticker.change.toFixed(2)} ({ticker.changePercent >= 0 ? "+" : ""}
            {ticker.changePercent.toFixed(2)}%)
          </span>
        </div>
      ))}
    </div>
  );
}
