import { useState, useEffect } from 'react';
import { Newspaper, Filter, Clock, AlertCircle, ArrowUpRight } from 'lucide-react';
import { fetchNews, type NewsArticle } from '@/lib/newsApi';
import NewsDetail from './NewsDetail';

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  const categories = [
    { id: 'all', label: 'All News' },
    { id: 'markets', label: 'Markets' },
    { id: 'economy', label: 'Economy' },
    { id: 'earnings', label: 'Earnings' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'forex', label: 'Forex' },
    { id: 'commodities', label: 'Commodities' },
  ];

  useEffect(() => {
    loadNews();
    
    // Auto-refresh every 2 minutes
    const interval = setInterval(loadNews, 120000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredArticles(articles);
    } else {
      setFilteredArticles(articles.filter(a => a.category === selectedCategory));
    }
  }, [selectedCategory, articles]);

  const loadNews = async () => {
    setIsLoading(true);
    try {
      const news = await fetchNews(50);
      setArticles(news);
      setLastUpdate(Date.now());
    } catch (error) {
      console.error('Failed to load news:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const minutes = Math.floor((Date.now() - timestamp) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getSourceColor = (source: string): string => {
    const lower = source.toLowerCase();
    if (lower.includes('bloomberg')) return 'text-purple-400';
    if (lower.includes('reuters')) return 'text-blue-400';
    if (lower.includes('cnbc')) return 'text-cyan-400';
    if (lower.includes('cnn')) return 'text-red-400';
    if (lower.includes('wsj') || lower.includes('wall street')) return 'text-yellow-400';
    if (lower.includes('ft') || lower.includes('financial')) return 'text-pink-400';
    if (lower.includes('coindesk') || lower.includes('coin')) return 'text-green-400';
    if (lower.includes('marketwatch')) return 'text-indigo-400';
    return 'text-orange-400';
  };

  // Show article detail view
  if (selectedArticle) {
    return (
      <NewsDetail
        article={selectedArticle}
        onBack={() => setSelectedArticle(null)}
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-8 py-6 border-b border-orange-900/50 bg-gradient-to-r from-orange-950/30 to-black">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-950/50 rounded-lg border border-orange-900/50">
              <Newspaper size={24} className="text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-amber-400 tracking-wider">NEWS WIRE</h1>
              <p className="text-sm text-orange-700">Real-time financial news from multiple sources</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-xs text-orange-700">
              Last update: {formatTimeAgo(lastUpdate)}
            </span>
            <button
              onClick={loadNews}
              disabled={isLoading}
              className="px-4 py-2 bg-orange-950 border border-orange-800 text-amber-400 hover:bg-orange-900 hover:border-amber-500 transition-colors text-sm uppercase tracking-wider disabled:opacity-50"
            >
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter size={14} className="text-orange-700 flex-shrink-0" />
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-1.5 rounded text-xs uppercase tracking-wider whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-orange-950 border border-amber-500 text-amber-400'
                  : 'bg-black/50 border border-orange-900/50 text-orange-600 hover:border-amber-500/50 hover:text-amber-400'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Breaking News Banner */}
      {articles.some(a => a.isBreaking) && (
        <div className="px-8 py-3 bg-red-950/30 border-b border-red-900/50">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={14} className="text-red-400" />
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Breaking News</span>
          </div>
          <div className="space-y-2">
            {articles.filter(a => a.isBreaking).slice(0, 2).map(article => (
              <div
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <ArrowUpRight size={12} className="text-red-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex-1">
                    <div className="text-sm text-amber-100 group-hover:text-amber-300 transition-colors">
                      {article.headline}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-orange-700">
                      <span className={getSourceColor(article.source)}>{article.source}</span>
                      <span>•</span>
                      <span>{formatTimeAgo(article.publishedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* News List */}
      <div className="flex-1 overflow-auto p-8">
        {isLoading && articles.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <div className="text-orange-700">Loading news...</div>
            </div>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-orange-700">
              <Newspaper size={48} className="mx-auto mb-4 opacity-20" />
              <div>No news articles found</div>
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="mt-4 text-amber-400 hover:text-amber-300 text-sm"
                >
                  View all news
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-5xl">
            {filteredArticles.map(article => {
              const sentimentBorder = article.sentiment === 'positive' ? 'border-l-green-500/50' : 
                                     article.sentiment === 'negative' ? 'border-l-red-500/50' : 'border-l-orange-700/50';
              
              return (
                <div
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className={`group p-6 bg-black/50 border border-orange-900/50 border-l-2 ${sentimentBorder} rounded-lg hover:border-amber-500/50 hover:bg-orange-950/20 transition-all cursor-pointer`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      {article.isBreaking && (
                        <div className="mb-3">
                          <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider bg-red-950/50 px-2 py-0.5 rounded border border-red-800/50">
                            Breaking
                          </span>
                        </div>
                      )}
                      
                      <h3 className="text-base text-amber-400 font-medium leading-snug mb-3 group-hover:text-amber-300 transition-colors">
                        {article.headline}
                      </h3>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-medium ${getSourceColor(article.source)}`}>
                            {article.source}
                          </span>
                          <span className="text-xs text-orange-700">•</span>
                          <span className="flex items-center gap-1 text-xs text-orange-700">
                            <Clock size={12} />
                            {formatTimeAgo(article.publishedAt)}
                          </span>
                        </div>
                        
                        {article.category && (
                          <span className="text-[10px] uppercase tracking-wider text-orange-800 bg-orange-950/30 px-2 py-0.5 rounded">
                            {article.category}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <ArrowUpRight 
                      size={16} 
                      className="text-orange-700 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="px-8 py-3 border-t border-orange-900/50 bg-black/50 flex items-center justify-between text-xs text-orange-700">
        <span>{filteredArticles.length} articles</span>
        <span>Auto-refresh: 2 min</span>
      </div>
    </div>
  );
}
