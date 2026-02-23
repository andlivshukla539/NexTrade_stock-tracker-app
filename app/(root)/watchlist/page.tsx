import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { getWatchlistItemsByEmail } from "@/lib/actions/watchlist.actions";
import { getAlertsByEmail } from "@/lib/actions/alert.actions";
import WatchlistDashboard from "@/components/dashboard/WatchlistDashboard";

export default async function WatchlistPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email ?? "";

  // Fetch the user's real watchlist items and alerts from MongoDB
  const [items, userAlerts] = await Promise.all([
    getWatchlistItemsByEmail(email),
    getAlertsByEmail(email)
  ]);

  // Map DB items to the shape WatchlistDashboard expects, now including listName
  const symbols = items.map(i => ({
    symbol: i.symbol,
    company: i.company,
    listName: i.listName,
  }));


  return <WatchlistDashboard realSymbols={symbols} initialAlerts={userAlerts as { id: string, symbol: string, condition: string, targetPrice: number, status: "active" | "triggered" }[]} />;
}
