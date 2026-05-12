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
    <div className="h-full flex flex-col relative">
      {/* Breaking News Notification - Bottom Right */}
      {breakingNewsAlert && (
        <div className="fixed bottom-20 right-6 z-50 max-w-md animate-slide-in">
          <div className="bg-red-950/95 border border-red-500 rounded-lg p-4 shadow-lg shadow-red-900/50 backdrop-blur-sm">
            <button
              onClick={() => setBreakingNewsAlert(null)}
              className="absolute top-2 right-2 p-1 hover:bg-red-900 rounded transition-colors"
            >
              <X size={14} className="text-red-400" />
            </button>
            <div className="flex items-start gap-3 pr-6">
              <AlertCircle size={18} className="text-red-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 cursor-pointer" onClick={() => setSelectedArticle(breakingNewsAlert)}>
                <div className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2">Breaking News</div>
                <div className="text-sm text-amber-100 leading-snug hover:text-amber-300 transition-colors">
                  {breakingNewsAlert.headline}
                </div>
                <div className="text-xs text-orange-700 mt-2">Click to read full report →</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connection Status Bar */}
      <div className="flex items-center justify-center gap-2 px-4 py-1.5 bg-gradient-to-r from-orange-950/30 via-black to-orange-950/30 border-b border-orange-900/30">
        {connectionStatus === 'connecting' ? (
          <>
            <Activity size={14} className="text-orange-500 animate-pulse" />
            <span className="text-xs text-orange-500 font-medium">Connecting...</span>
          </>
        ) : connectionStatus === 'connected' ? (
          <>
            <Zap size={14} className="text-green-500 animate-pulse" />
            <span className="text-xs text-green-500 font-medium">LIVE</span>
          </>
        ) : (
          <>
            <Activity size={14} className="text-red-500" />
            <span className="text-xs text-red-500 font-medium">OFFLINE</span>
          </>
        )}
      </div>

      {/* Hint bar */}
      <div className="px-6 py-3 bg-orange-950/20 border-b border-orange-900/30 flex items-center justify-center gap-4">
        <span className="text-xs text-orange-700 uppercase tracking-wider">Press <span className="text-amber-400 font-bold">:</span> to open command palette</span>
      </div>

      {/* Three Column Layout */}
      <div className="flex-1 grid grid-cols-3 gap-6 p-6 overflow-auto">
        
        {/* Column 1: Major Indices with Sparklines */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-950/50 rounded-lg border border-orange-900/50">
              <TrendingUp size={20} className="text-amber-400" />
            </div>
            <h2 className="text-base font-semibold text-amber-400">Major Indices</h2>
          </div>
          
          <div className="space-y-4">
            {indices.map((index, idx) => {
              const isUp = index.change >= 0;
              return (
                <div
                  key={idx}
                  className="group p-4 bg-black/50 border border-orange-900/50 rounded hover:border-amber-500/50 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-amber-400 text-sm">{index.symbol}</span>
                    <span className={`text-xs font-mono ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                      {isUp ? <ArrowUpRight size={12} className="inline mr-1" /> : <ArrowDownRight size={12} className="inline mr-1" />}
                      {Math.abs(index.changePercent).toFixed(2)}%
                    </span>
                  </div>
                  
                  {/* Sparkline Chart */}
                  <div className="h-12 mb-3">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={index.history}>
                        <defs>
                          <linearGradient id={`gradient-${idx}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={isUp ? '#10b981' : '#ef4444'} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={isUp ? '#10b981' : '#ef4444'} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke={isUp ? '#10b981' : '#ef4444'}
                          strokeWidth={1.5}
                          fill={`url(#gradient-${idx})`}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="flex items-end justify-between">
                    <span className="text-xl font-bold text-amber-400 transition-all duration-300">
                      {index.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className={`text-sm transition-all duration-300 ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                      {isUp ? '+' : ''}{index.change.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 2: Recent Views with Real-time Prices */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-950/50 rounded-lg border border-orange-900/50">
              <Clock size={20} className="text-amber-400" />
            </div>
            <h2 className="text-base font-semibold text-amber-400">Recent Views</h2>
          </div>
          
          <div className="space-y-2">
            {recentViews.map((view, index) => {
              const isUp = view.change >= 0;
              return (
                <div
                  key={`${view.symbol}-${index}`}
                  className="group flex items-center justify-between p-4 bg-black/50 border border-orange-900/50 rounded hover:border-amber-500/50 transition-all duration-300 cursor-pointer"
                >
                  <span className="font-mono font-semibold text-amber-400 text-sm">{view.symbol}</span>
                  <div className="text-right">
                    <div className={`text-sm font-bold transition-all duration-300 ${
                      isUp ? 'text-green-500' : view.change < 0 ? 'text-red-500' : 'text-amber-400'
                    }`}>
                      {view.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className={`text-xs transition-all duration-300 ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                      {isUp ? '+' : ''}{view.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 3: News Feed */}
        <div className="glass-card p-6 relative">
          {/* Breaking News Alert Banner */}
          {breakingNewsAlert && (
            <div className="absolute -top-2 left-4 right-4 z-10 bg-red-950/90 border border-red-500 rounded-lg p-3 shadow-lg shadow-red-900/50 animate-pulse">
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">Breaking News</div>
                  <div className="text-sm text-amber-100">{breakingNewsAlert.headline}</div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-950/50 rounded-lg border border-orange-900/50">
              <Newspaper size={20} className="text-amber-400" />
            </div>
            <h2 className="text-base font-semibold text-amber-400">Latest News</h2>
            <span className="ml-auto text-[10px] text-orange-700 uppercase tracking-wider">{newsItems.length} articles</span>
          </div>
          
          <div className="space-y-3">
            {newsItems.slice(0, 10).map(item => {
              const sourceColor = getSourceColor(item.source);
              const sentimentBorder = item.sentiment === 'positive' ? 'border-l-green-500/50' : 
                                     item.sentiment === 'negative' ? 'border-l-red-500/50' : 'border-l-orange-700/50';
              
              return (
                <div
                  key={item.id}
                  className={`group p-4 bg-black/50 border border-orange-900/50 border-l-2 ${sentimentBorder} rounded hover:border-amber-500/50 transition-all duration-300 cursor-pointer`}
                >
                  {item.isBreaking && (
                    <div className="mb-2">
                      <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider bg-red-950/50 px-2 py-0.5 rounded">
                        Breaking
                      </span>
                    </div>
                  )}
                  <h3 className="text-sm text-amber-400 font-medium leading-snug mb-3 group-hover:text-amber-300 transition-colors">
                    {item.headline}
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium ${sourceColor}`}>
                        {item.source}
                      </span>
                      <span className="text-xs text-orange-700">•</span>
                      <span className="text-xs text-orange-700">
                        {formatTimeAgo(item.publishedAt)}
                      </span>
                    </div>
                    {item.category && (
                      <span className="text-[10px] uppercase tracking-wider text-orange-800 bg-orange-950/30 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                    )}
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
