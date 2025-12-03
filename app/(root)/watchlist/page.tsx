import Link from "next/link";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { getWatchlistItemsByEmail } from "@/lib/actions/watchlist.actions";
import AlertsList from "@/components/AlertsList";

export default async function WatchlistPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email as string | undefined;
  const items = email ? await getWatchlistItemsByEmail(email) : [];

  const hasItems = items && items.length > 0;

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-100">Your Watchlist</h1>
        <Link href="/" className="text-sm text-gray-400 hover:text-yellow-500 transition-colors">Back to Dashboard</Link>
      </div>

      {!hasItems ? (
        <div className="watchlist-empty-container">
          <div className="watchlist-empty">
            <div className="watchlist-star">★</div>
            <h2 className="watchlist-title">No stocks in your watchlist yet</h2>
            <p className="text-gray-400">Use the Add to Watchlist button on any stock page to start tracking it here.</p>
          </div>
        </div>
      ) : (
        <ul className="watchlist-container">
          {items.map((it) => (
            <li key={it.symbol} className="watchlist flex items-center justify-between border-b border-gray-700 py-3">
              <div>
                <div className="text-gray-100 font-medium">{it.symbol}</div>
                <div className="text-gray-400 text-sm">{it.company}</div>
              </div>
              <Link href={`/stocks/${encodeURIComponent(it.symbol)}`} className="px-3 py-2 rounded-md bg-yellow-500 text-yellow-900 font-medium hover:opacity-90 transition">View</Link>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-12">
        <AlertsList />
      </div>
    </div>
  );
}
