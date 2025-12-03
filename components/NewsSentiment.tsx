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
    <div className="rounded-md border border-gray-700 p-4 bg-[#0f0f0f]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-100">News Sentiment</h3>
        <span className="text-sm text-gray-400">{sym || "Market"}</span>
      </div>

      {/* Gauge bar */}
      <div className="w-full h-3 bg-[#1a1a1a] rounded-full overflow-hidden">
        <div
          className="h-3 transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-sm">
        <span className="text-gray-300">{label}</span>
        <span className="text-gray-500">Score: {pct}/100</span>
      </div>
      <p className="mt-3 text-xs text-gray-500">
        Based on a quick lexical scan of recent headlines and summaries. This is an experimental, heuristic indicator — not financial advice.
      </p>
    </div>
  );
}
