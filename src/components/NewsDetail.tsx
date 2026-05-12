import { ArrowLeft, ExternalLink, Clock, Tag } from 'lucide-react';
import type { NewsArticle } from '@/lib/newsApi';

interface NewsDetailProps {
  article: NewsArticle;
  onBack: () => void;
}

export default function NewsDetail({ article, onBack }: NewsDetailProps) {
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

  const formatFullDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Generate mock full article content based on the headline
  const generateFullContent = (article: NewsArticle): string => {
    const templates = {
      positive: [
        `\n\nMarket analysts are viewing this development as a strong positive signal for the sector. The news comes amid a broader rally in related stocks, with investors showing increased confidence in the underlying fundamentals.\n\nTrading volume has surged following the announcement, with institutional buyers appearing to accumulate positions. Technical indicators suggest further upside potential in the near term.\n\n"The market reaction has been overwhelmingly positive," noted one senior strategist. "We're seeing broad-based buying across all timeframes."\n\nLooking ahead, analysts will be watching key resistance levels and whether the momentum can be sustained through the current trading session.`,
      ],
      negative: [
        `\n\nThe announcement has triggered a wave of selling pressure, with the stock declining sharply in early trading. Market participants are reassessing their positions as new information emerges.\n\nVolume spikes indicate significant institutional outflow, with several major funds reportedly reducing their exposure. Risk management systems at many firms have flagged the situation for closer monitoring.\n\n"This is a concerning development that could have wider implications," warned a portfolio manager. "We're advising caution until we see more clarity."\n\nTechnical support levels are being tested, and traders are watching for any signs of stabilization before considering new positions.`,
      ],
      neutral: [
        `\n\nMarket reaction has been mixed as participants digest the implications of this development. While some see opportunity, others are taking a wait-and-see approach.\n\nTrading activity has increased moderately, with both buyers and sellers active in the market. The consensus among analysts is that more information is needed before making definitive calls.\n\n"The situation remains fluid," commented a market observer. "We're watching several key indicators that could provide direction in the coming sessions."\n\nInvestors are advised to monitor developments closely and maintain appropriate risk management protocols.`,
      ]
    };

    const categoryContexts: Record<string, string> = {
      markets: '\n\nThis development is being closely watched by equity traders across major exchanges. Index futures have shown movement in response to the news.',
      economy: '\n\nEconomists are incorporating this data into their forecasts for upcoming GDP and employment reports. The Federal Reserve may take note in future policy decisions.',
      earnings: '\n\nThe earnings report provides important insight into the company\'s operational performance and future guidance. Analysts will be updating their price targets accordingly.',
      crypto: '\n\nThe cryptocurrency market has shown significant volatility in recent sessions, with this news adding to the ongoing narrative around digital asset adoption.',
      forex: '\n\nCurrency traders are adjusting their positions based on this development. Major pairs involving the affected currencies have seen increased volatility.',
      commodities: '\n\nCommodity markets are reacting to supply and demand dynamics highlighted by this news. Futures contracts have shown notable price movements.'
    };

    const sentimentText = templates[article.sentiment][0];
    const categoryText = article.category ? (categoryContexts[article.category] || '') : '';
    
    return `${article.headline}\n\n${article.source} — ${formatFullDate(article.publishedAt)}\n${sentimentText}${categoryText}\n\n— Reporting from Gamma Terminal News Desk`;
  };

  return (
    <div className="h-full flex flex-col overflow-auto">
      {/* Header */}
      <div className="px-8 py-6 border-b border-orange-900/50 bg-gradient-to-r from-orange-950/30 to-black sticky top-0 z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-orange-600 hover:text-amber-400 transition-colors mb-4 text-sm"
        >
          <ArrowLeft size={16} />
          Back to News
        </button>
        
        {article.isBreaking && (
          <div className="mb-4">
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider bg-red-950/50 px-3 py-1 rounded border border-red-800/50">
              Breaking News
            </span>
          </div>
        )}
        
        <h1 className="text-2xl font-bold text-amber-400 leading-tight mb-4">
          {article.headline}
        </h1>
        
        <div className="flex items-center gap-6 text-sm">
          <span className={`font-medium ${getSourceColor(article.source)}`}>
            {article.source}
          </span>
          <span className="flex items-center gap-2 text-orange-700">
            <Clock size={14} />
            {formatFullDate(article.publishedAt)}
          </span>
          {article.category && (
            <span className="flex items-center gap-2 text-orange-700">
              <Tag size={14} />
              <span className="uppercase tracking-wider text-xs">{article.category}</span>
            </span>
          )}
        </div>
      </div>

      {/* Article Content */}
      <div className="flex-1 p-8 max-w-4xl">
        <div className="prose prose-invert max-w-none">
          <div className="text-amber-100/90 leading-relaxed whitespace-pre-line text-base">
            {generateFullContent(article)}
          </div>
        </div>

        {/* Sentiment Indicator */}
        <div className="mt-8 pt-6 border-t border-orange-900/50">
          <div className="flex items-center gap-4">
            <span className="text-xs text-orange-700 uppercase tracking-wider">Sentiment:</span>
            <span className={`px-3 py-1 rounded text-xs font-medium uppercase tracking-wider ${
              article.sentiment === 'positive' 
                ? 'bg-green-950/50 text-green-400 border border-green-800/50'
                : article.sentiment === 'negative'
                ? 'bg-red-950/50 text-red-400 border border-red-800/50'
                : 'bg-orange-950/50 text-orange-400 border border-orange-800/50'
            }`}>
              {article.sentiment}
            </span>
          </div>
        </div>

        {/* Related Actions */}
        <div className="mt-6 flex items-center gap-4">
          {article.url && (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-orange-950 border border-orange-800 text-amber-400 hover:bg-orange-900 hover:border-amber-500 transition-colors text-sm"
            >
              <ExternalLink size={14} />
              Read Original Source
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
