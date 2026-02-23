import { getNews } from "@/lib/actions/finnhub.actions";

// Very small lexicon for demonstration; intentionally minimal to avoid heavy logic.
const POSITIVE_WORDS = new Set([
  "beat", "beats", "surge", "surges", "rise", "rises", "rising", "gain", "gains", "gained", "bull", "bullish", "up", "soar", "soars", "record", "strong", "optimistic", "upgrade", "upgrades", "outperform", "tops", "profit", "profits", "positive"
]);
const NEGATIVE_WORDS = new Set([
  "miss", "misses", "fall", "falls", "fell", "drop", "drops", "plunge", "plunges", "bear", "bearish", "down", "loss", "losses", "weak", "pessimistic", "downgrade", "downgrades", "underperform", "cuts", "cut", "warning", "warns", "negative"
]);

function scoreText(text: string): number {
  const tokens = text
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  let score = 0;
  for (const t of tokens) {
    if (POSITIVE_WORDS.has(t)) score += 1;
    if (NEGATIVE_WORDS.has(t)) score -= 1;
  }
  return score;
}

function normalizeScore(raw: number): number {
  // Clamp to [-10, 10] to avoid extreme values, then scale to [-1, 1]
  const clamped = Math.max(-10, Math.min(10, raw));
  return clamped / 10;
}

function labelFromScore(n: number): { label: string; color: string } {
  if (n > 0.15) return { label: "Bullish", color: "#10b981" }; // emerald-500
  if (n < -0.15) return { label: "Bearish", color: "#ef4444" }; // red-500
  return { label: "Neutral", color: "#f59e0b" }; // amber-500
}

export default async function NewsSentiment({ symbol }: { symbol?: string }) {
  const sym = (symbol || "").toString().trim().toUpperCase();

  let articles: MarketNewsArticle[] = [];
  try {
    articles = await getNews(sym ? [sym] : undefined);
  } catch {
    articles = [];
  }

  // Compute a tiny sentiment score using headlines and summaries
  const texts = (articles || []).map((a) => `${a.headline || ""}. ${a.summary || ""}`);
  const rawScore = texts.reduce((acc, t) => acc + scoreText(t), 0);
  const normalized = normalizeScore(rawScore);
  const pct = Math.round(((normalized + 1) / 2) * 100); // 0..100
  const { label, color } = labelFromScore(normalized);

  return (
    <div className="rounded-md border border-gray-700 p-6 bg-[#0f0f0f] h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-100">News Sentiment</h3>
        <span className="text-sm font-mono text-gray-400 bg-gray-800 px-2 py-1 rounded">{sym || "MARKET"}</span>
      </div>

      {/* Gauge bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Bearish</span>
          <span className="text-gray-400">Neutral</span>
          <span className="text-gray-400">Bullish</span>
        </div>
        <div className="w-full h-4 bg-[#1a1a1a] rounded-full overflow-hidden relative">
          <div
            className="h-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(0,0,0,0.5)]"
            style={{ width: `${pct}%`, backgroundColor: color }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-2xl font-bold" style={{ color }}>{label}</span>
          <span className="text-sm text-gray-500 font-mono">Score: {pct}/100</span>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Analyzed Stories</h4>
        <div className="space-y-4 overflow-y-auto max-h-[300px] pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {articles.slice(0, 5).map((art, idx) => {
            const dt = art.datetime ? new Date(art.datetime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";
            return (
              <a key={`${art.id}-${idx}`} href={art.url} target="_blank" rel="noopener noreferrer" className="block group p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/80 transition-all border border-transparent hover:border-gray-700">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <h5 className="text-sm font-medium text-gray-200 group-hover:text-yellow-400 leading-snug line-clamp-2">{art.headline}</h5>
                  <span className="text-xs text-gray-500 whitespace-nowrap">{dt}</span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-1">{art.summary}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] text-gray-400 bg-gray-800 px-1.5 py-0.5 rounded">{art.source}</span>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      <p className="mt-auto pt-4 border-t border-gray-800 text-[10px] text-gray-600 text-center">
        AI-generated sentiment analysis based on recent market news. Not financial advice.
      </p>
    </div>
  );
}
