// News API Service for Gamma Terminal
// Aggregates financial news from multiple sources

export interface NewsArticle {
  id: string;
  headline: string;
  summary?: string;
  source: string;
  url?: string;
  publishedAt: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  isBreaking?: boolean;
  category?: 'markets' | 'economy' | 'earnings' | 'crypto' | 'forex' | 'commodities';
}

// Mock news data with realistic financial headlines
const MOCK_NEWS_POOL: Omit<NewsArticle, 'id' | 'publishedAt'>[] = [
  // Breaking News - High Impact
  { headline: 'BREAKING: Federal Reserve Announces Emergency Rate Cut of 50 Basis Points', source: 'Reuters', sentiment: 'neutral', isBreaking: true, category: 'economy' },
  { headline: 'BREAKING: Major Bank Reports Unexpected Q4 Loss, Stock Plunges 15%', source: 'CNBC', sentiment: 'negative', isBreaking: true, category: 'earnings' },
  { headline: 'BREAKING: Oil Prices Spike 8% on Middle East Supply Disruption Fears', source: 'Bloomberg', sentiment: 'negative', isBreaking: true, category: 'commodities' },
  { headline: 'BREAKING: Tech Giant Announces $50B Share Buyback Program', source: 'MarketWatch', sentiment: 'positive', isBreaking: true, category: 'markets' },
  { headline: 'BREAKING: Bitcoin Surges Past $70K as ETF Inflows Hit Record High', source: 'CoinDesk', sentiment: 'positive', isBreaking: true, category: 'crypto' },
  
  // Markets
  { headline: 'S&P 500 Reaches New All-Time High on Strong Economic Data', source: 'CNN Business', sentiment: 'positive', category: 'markets' },
  { headline: 'Dow Jones Falls 300 Points as Bond Yields Rise Sharply', source: 'Financial Times', sentiment: 'negative', category: 'markets' },
  { headline: 'Small-Cap Stocks Outperform as Russell 2000 Gains 2.3%', source: 'Barron\'s', sentiment: 'positive', category: 'markets' },
  { headline: 'VIX Volatility Index Spikes to 3-Month High Amid Market Uncertainty', source: 'Reuters', sentiment: 'negative', category: 'markets' },
  { headline: 'Trading Volume Hits Record as Retail Investors Return to Markets', source: 'CNBC', sentiment: 'neutral', category: 'markets' },
  
  // Economy
  { headline: 'US GDP Growth Exceeds Expectations at 3.2% in Latest Quarter', source: 'Wall Street Journal', sentiment: 'positive', category: 'economy' },
  { headline: 'Inflation Data Shows Consumer Prices Rising Faster Than Expected', source: 'Bloomberg', sentiment: 'negative', category: 'economy' },
  { headline: 'Jobless Claims Drop to Lowest Level in Six Months', source: 'Reuters', sentiment: 'positive', category: 'economy' },
  { headline: 'Consumer Confidence Index Falls for Third Consecutive Month', source: 'CNN Business', sentiment: 'negative', category: 'economy' },
  { headline: 'Manufacturing PMI Expands for First Time in Eight Months', source: 'MarketWatch', sentiment: 'positive', category: 'economy' },
  
  // Earnings
  { headline: 'Apple Beats Earnings Estimates, iPhone Sales Surge in China', source: 'CNBC', sentiment: 'positive', category: 'earnings' },
  { headline: 'Tesla Misses Revenue Target, Musk Warns of Production Challenges', source: 'Reuters', sentiment: 'negative', category: 'earnings' },
  { headline: 'NVIDIA Reports Record Quarterly Revenue on AI Chip Demand', source: 'Bloomberg', sentiment: 'positive', category: 'earnings' },
  { headline: 'Amazon Web Services Growth Slows, Shares Drop in After-Hours Trading', source: 'Wall Street Journal', sentiment: 'negative', category: 'earnings' },
  { headline: 'Microsoft Cloud Revenue Jumps 25%, Beating Analyst Forecasts', source: 'Financial Times', sentiment: 'positive', category: 'earnings' },
  
  // Crypto
  { headline: 'Ethereum Upgrade Successfully Implemented, Gas Fees Drop 40%', source: 'CoinDesk', sentiment: 'positive', category: 'crypto' },
  { headline: 'SEC Approves New Cryptocurrency ETF Applications', source: 'Bloomberg', sentiment: 'positive', category: 'crypto' },
  { headline: 'Major Exchange Reports $100M in Suspicious Transactions', source: 'Reuters', sentiment: 'negative', category: 'crypto' },
  { headline: 'Crypto Mining Stocks Rally as Bitcoin Hash Rate Hits New Peak', source: 'CoinDesk', sentiment: 'positive', category: 'crypto' },
  { headline: 'Stablecoin Market Cap Reaches $200 Billion Milestone', source: 'The Block', sentiment: 'neutral', category: 'crypto' },
  
  // Forex
  { headline: 'Dollar Strengthens Against Euro on Fed Hawkish Comments', source: 'Financial Times', sentiment: 'neutral', category: 'forex' },
  { headline: 'Japanese Yen Weakens to 16-Month Low Against Dollar', source: 'Reuters', sentiment: 'negative', category: 'forex' },
  { headline: 'British Pound Rallies on Better-Than-Expected UK Economic Data', source: 'Bloomberg', sentiment: 'positive', category: 'forex' },
  { headline: 'Emerging Market Currencies Under Pressure as Dollar Surges', source: 'Wall Street Journal', sentiment: 'negative', category: 'forex' },
  
  // Commodities
  { headline: 'Gold Prices Retreat from Record Highs on Profit Taking', source: 'MarketWatch', sentiment: 'neutral', category: 'commodities' },
  { headline: 'Natural Gas Futures Jump 12% on Cold Weather Forecast', source: 'Bloomberg', sentiment: 'positive', category: 'commodities' },
  { headline: 'Copper Demand Surges on Infrastructure Spending Plans', source: 'Reuters', sentiment: 'positive', category: 'commodities' },
  { headline: 'Agricultural Commodities Mixed as Weather Patterns Shift', source: 'CNBC', sentiment: 'neutral', category: 'commodities' },
];

// Simulate fetching news from API
export async function fetchNews(limit: number = 20): Promise<NewsArticle[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
  
  // Shuffle and pick random articles
  const shuffled = [...MOCK_NEWS_POOL].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, limit);
  
  return selected.map((article, idx) => ({
    ...article,
    id: `news-${Date.now()}-${idx}`,
    publishedAt: Date.now() - Math.random() * 3600000, // Within last hour
  }));
}

// Simulate streaming new breaking news
export function subscribeToBreakingNews(callback: (article: NewsArticle) => void): () => void {
  let isActive = true;
  
  const checkForBreaking = () => {
    if (!isActive) return;
    
    // 30% chance of getting breaking news every interval
    if (Math.random() < 0.3) {
      const breakingNews = MOCK_NEWS_POOL.filter(n => n.isBreaking);
      const article = breakingNews[Math.floor(Math.random() * breakingNews.length)];
      
      if (article) {
        callback({
          ...article,
          id: `breaking-${Date.now()}`,
          publishedAt: Date.now(),
        });
      }
    }
    
    // Schedule next check (15-45 seconds)
    const nextCheck = 15000 + Math.random() * 30000;
    setTimeout(checkForBreaking, nextCheck);
  };
  
  // Start checking
  setTimeout(checkForBreaking, 10000);
  
  // Return unsubscribe function
  return () => {
    isActive = false;
  };
}

// Get news by category
export async function fetchNewsByCategory(category: NewsArticle['category'], limit: number = 10): Promise<NewsArticle[]> {
  const allNews = await fetchNews(50);
  const filtered = category ? allNews.filter(n => n.category === category) : allNews;
  return filtered.slice(0, limit);
}

// Search news by keyword
export async function searchNews(keyword: string, limit: number = 10): Promise<NewsArticle[]> {
  const allNews = await fetchNews(50);
  const lowerKeyword = keyword.toLowerCase();
  const filtered = allNews.filter(n => 
    n.headline.toLowerCase().includes(lowerKeyword) ||
    n.source.toLowerCase().includes(lowerKeyword)
  );
  return filtered.slice(0, limit);
}
