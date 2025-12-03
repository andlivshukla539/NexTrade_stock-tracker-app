import { getNews } from "@/lib/actions/finnhub.actions";

export default async function StockNews({ symbol }: { symbol?: string }) {
  const sym = (symbol || "").toString().trim().toUpperCase();

  let articles: MarketNewsArticle[] = [];
  try {
    articles = await getNews(sym ? [sym] : undefined);
  } catch {
    // Fail softly – show empty state
    articles = [];
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="rounded-md border border-gray-700 p-4 bg-[#0f0f0f]">
        <h3 className="text-lg font-semibold text-gray-100 mb-2">
          {sym ? `Latest News for ${sym}` : "Latest Market News"}
        </h3>
        <p className="text-gray-400">No recent news available.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-gray-700 p-4 bg-[#0f0f0f]">
      <h3 className="text-lg font-semibold text-gray-100 mb-3">
        {sym ? `Latest News for ${sym}` : "Latest Market News"}
      </h3>
      <ul className="flex flex-col gap-3">
        {articles.slice(0, 5).map((art) => {
          const dt = art?.datetime ? new Date(art.datetime * 1000) : undefined;
          const when = dt ? dt.toLocaleString() : "";
          const src = art?.source || "";
          const url = art?.url || "#";
          const headline = art?.headline || "Untitled";
          const summary = art?.summary || "";
          return (
            <li key={art.id} className="group">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-gray-100 group-hover:text-yellow-500 transition-colors">
                      {headline}
                    </h4>
                    <span className="text-xs text-gray-500 whitespace-nowrap">{when}</span>
                  </div>
                  <div className="text-xs text-gray-500">{src}</div>
                  {summary && (
                    <p className="text-sm text-gray-300 line-clamp-2">{summary}</p>
                  )}
                </div>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
