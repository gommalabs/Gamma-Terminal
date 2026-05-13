import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, Clock, Newspaper, Activity, Zap, ArrowUpRight, ArrowDownRight, AlertCircle, X } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { fetchNews, subscribeToBreakingNews, type NewsArticle } from '@/lib/newsApi';
import { playPingSound, playBreakingNewsSound, initAudio } from '@/lib/soundEffects';
import NewsDetail from './NewsDetail';

interface IndexData {
  symbol: string;
  value: number;
  change: number;
  changePercent: number;
  history: Array<{ time: string; value: number }>;
}

interface RecentView {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdate: number;
}

const HomePage: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  // Real-time indices data with history for charts
  const [indices, setIndices] = useState<IndexData[]>([
    { 
      symbol: 'S&P 500', 
      value: 5245.67, 
      change: 23.45, 
      changePercent: 0.45,
      history: Array.from({ length: 20 }, (_, i) => ({
        time: `${i}`,
        value: 5200 + Math.random() * 100
      }))
    },
    { 
      symbol: 'NASDAQ', 
      value: 16428.92, 
      change: -45.23, 
      changePercent: -0.27,
      history: Array.from({ length: 20 }, (_, i) => ({
        time: `${i}`,
        value: 16400 + Math.random() * 100
      }))
    },
    { 
      symbol: 'DOW JONES', 
      value: 39512.34, 
      change: 156.78, 
      changePercent: 0.40,
      history: Array.from({ length: 20 }, (_, i) => ({
        time: `${i}`,
        value: 39400 + Math.random() * 200
      }))
    },
    { 
      symbol: 'RUSSELL 2000', 
      value: 2078.45, 
      change: 12.34, 
      changePercent: 0.60,
      history: Array.from({ length: 20 }, (_, i) => ({
        time: `${i}`,
        value: 2060 + Math.random() * 30
      }))
    },
    { 
      symbol: 'VIX', 
      value: 13.45, 
      change: -0.67, 
      changePercent: -4.75,
      history: Array.from({ length: 20 }, (_, i) => ({
        time: `${i}`,
        value: 13 + Math.random() * 2
      }))
    },
  ]);

  const [recentViews, setRecentViews] = useState<RecentView[]>([
    { symbol: 'AAPL', price: 182.52, change: 2.34, changePercent: 1.30, lastUpdate: Date.now() },
    { symbol: 'TSLA', price: 245.67, change: -5.23, changePercent: -2.08, lastUpdate: Date.now() },
    { symbol: 'BTC/USD', price: 67234.50, change: 1234.50, changePercent: 1.87, lastUpdate: Date.now() },
    { symbol: 'SPX', price: 5245.67, change: 23.45, changePercent: 0.45, lastUpdate: Date.now() },
    { symbol: 'NVDA', price: 875.30, change: 15.60, changePercent: 1.81, lastUpdate: Date.now() },
  ]);

  const [newsItems, setNewsItems] = useState<NewsArticle[]>([]);
  const [breakingNewsAlert, setBreakingNewsAlert] = useState<NewsArticle | null>(null);
  const hasInitializedAudio = useRef(false);

  // Initialize audio on first user interaction
  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInitializedAudio.current) {
        initAudio();
        hasInitializedAudio.current = true;
      }
    };
    
    window.addEventListener('click', handleInteraction, { once: true });
    window.addEventListener('keydown', handleInteraction, { once: true });
    
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  // Fetch initial news on mount
  useEffect(() => {
    fetchNews(15).then(setNewsItems).catch(console.error);
  }, []);

  // Subscribe to breaking news
  useEffect(() => {
    const unsubscribe = subscribeToBreakingNews((article) => {
      setBreakingNewsAlert(article);
      
      // Play sound based on news type
      if (article.isBreaking) {
        playBreakingNewsSound();
      } else {
        playPingSound();
      }
      
      // Add to news feed
      setNewsItems(prev => [article, ...prev.slice(0, 19)]);
      
      // Clear alert after 5 seconds
      setTimeout(() => setBreakingNewsAlert(null), 5000);
    });
    
    return () => unsubscribe();
  }, []);

  // Simulate WebSocket connection
  useEffect(() => {
    const connectTimer = setTimeout(() => {
      setConnectionStatus('connected');
    }, 1500);

    return () => clearTimeout(connectTimer);
  }, []);

  // Real-time data streaming simulation
  useEffect(() => {
    if (connectionStatus !== 'connected') return;

    // Update indices every 2 seconds
    const indicesInterval = setInterval(() => {
      setIndices(prev => prev.map(index => {
        const volatility = index.symbol === 'VIX' ? 0.5 : 0.2;
        const change = (Math.random() - 0.5) * volatility;
        const newValue = Math.max(0, index.value + change);
        const newChange = index.change + change;
        const newChangePercent = (newChange / (newValue - newChange)) * 100;
        
        const newHistory = [...index.history.slice(1), {
          time: `${index.history.length}`,
          value: newValue
        }];

        return {
          ...index,
          value: newValue,
          change: newChange,
          changePercent: newChangePercent,
          history: newHistory
        };
      }));
    }, 2000);

    // Update recent views every 3 seconds
    const viewsInterval = setInterval(() => {
      setRecentViews(prev => prev.map(view => {
        const change = (Math.random() - 0.5) * 2;
        const newPrice = Math.max(0.01, view.price + change);
        const priceChange = newPrice - view.price;
        const changePercent = (priceChange / view.price) * 100;
        
        return {
          ...view,
          price: newPrice,
          change: priceChange,
          changePercent,
          lastUpdate: Date.now()
        };
      }));
    }, 3000);

    return () => {
      clearInterval(indicesInterval);
      clearInterval(viewsInterval);
    };
  }, [connectionStatus]);

  const formatTimeAgo = (timestamp: number) => {
    const minutes = Math.floor((Date.now() - timestamp) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  // Show article detail view if selected
  if (selectedArticle) {
    return (
      <div className="h-full flex flex-col">
        <NewsDetail
          article={selectedArticle}
          onBack={() => setSelectedArticle(null)}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-term-black overflow-hidden">
      {/* Connection Status Bar */}
      <div className="flex items-center justify-center gap-2 px-3 py-1 bg-term-panel border-b border-term-border-strong">
        {connectionStatus === 'connecting' ? (
          <>
            <Activity size={12} className="text-term-amber animate-pulse" />
            <span className="text-[9px] text-term-amber uppercase tracking-wider">Connecting...</span>
          </>
        ) : connectionStatus === 'connected' ? (
          <>
            <span className="w-1.5 h-1.5 bg-term-green animate-pulse" />
            <span className="text-[9px] text-term-green uppercase tracking-wider font-bold">LIVE</span>
          </>
        ) : (
          <>
            <Activity size={12} className="text-term-red" />
            <span className="text-[9px] text-term-red uppercase tracking-wider">OFFLINE</span>
          </>
        )}
      </div>

      {/* Three Column Layout */}
      <div className="flex-1 grid grid-cols-3 divide-x divide-term-border overflow-auto">
        
        {/* Column 1: Major Indices */}
        <div className="p-2">
          <div className="bb-header mb-2">MAJOR INDICES</div>
          
          <div className="space-y-1">
            {indices.map((index, idx) => {
              const isUp = index.change >= 0;
              return (
                <div
                  key={idx}
                  className="p-2 bg-term-panel border border-term-border hover:border-term-amber transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-term-amber text-[10px] uppercase tracking-wider">{index.symbol}</span>
                    <span className={`text-[9px] font-mono ${isUp ? 'text-term-green' : 'text-term-red'}`}>
                      {isUp ? '▲' : '▼'} {Math.abs(index.changePercent).toFixed(2)}%
                    </span>
                  </div>
                  
                  <div className="flex items-end justify-between">
                    <span className="text-sm font-bold text-term-text num">
                      {index.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className={`text-[9px] num ${isUp ? 'text-term-green' : 'text-term-red'}`}>
                      {isUp ? '+' : ''}{index.change.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 2: Recent Views */}
        <div className="p-2">
          <div className="bb-header mb-2">RECENT VIEWS</div>
          
          <div className="space-y-1">
            {recentViews.map((view, index) => {
              const isUp = view.change >= 0;
              return (
                <div
                  key={`${view.symbol}-${index}`}
                  className="flex items-center justify-between p-2 bg-term-panel border border-term-border hover:border-term-amber transition-colors cursor-pointer"
                >
                  <span className="font-mono font-bold text-term-amber text-[10px] uppercase">{view.symbol}</span>
                  <div className="text-right">
                    <div className={`text-sm font-bold num ${
                      isUp ? 'text-term-green' : view.change < 0 ? 'text-term-red' : 'text-term-text'
                    }`}>
                      {view.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className={`text-[9px] num ${isUp ? 'text-term-green' : 'text-term-red'}`}>
                      {isUp ? '+' : ''}{view.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 3: News Feed */}
        <div className="p-2">
          <div className="bb-header mb-2 flex items-center justify-between">
            <span>LATEST NEWS</span>
            <span className="text-[7px] text-term-textDim">{newsItems.length} ARTICLES</span>
          </div>
          
          <div className="space-y-1">
            {newsItems.slice(0, 10).map(item => {
              return (
                <div
                  key={item.id}
                  className="p-2 bg-term-panel border border-term-border border-l-2 border-l-term-amber hover:border-term-amber transition-colors cursor-pointer"
                >
                  {item.isBreaking && (
                    <div className="mb-1">
                      <span className="text-[7px] font-bold text-term-red uppercase tracking-wider bg-term-red/10 px-1 py-0.5">
                        BREAKING
                      </span>
                    </div>
                  )}
                  <h3 className="text-[10px] text-term-text leading-tight mb-2 group-hover:text-term-amber transition-colors">
                    {item.headline}
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] text-term-textDim uppercase">
                        {item.source}
                      </span>
                      <span className="text-[8px] text-term-muted">|</span>
                      <span className="text-[8px] text-term-textDim">
                        {formatTimeAgo(item.publishedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function for source colors
function getSourceColor(source: string): string {
  const lower = source.toLowerCase();
  if (lower.includes('bloomberg')) return 'text-purple-400';
  if (lower.includes('reuters')) return 'text-blue-400';
  if (lower.includes('cnbc')) return 'text-cyan-400';
  if (lower.includes('cnn')) return 'text-red-400';
  if (lower.includes('wsj') || lower.includes('wall street')) return 'text-yellow-400';
  if (lower.includes('ft') || lower.includes('financial')) return 'text-pink-400';
  if (lower.includes('coindesk') || lower.includes('coin')) return 'text-green-400';
  if (lower.includes('marketwatch')) return 'text-indigo-400';
  if (lower.includes('barron')) return 'text-teal-400';
  return 'text-orange-400';
}

export default HomePage;
