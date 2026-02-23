import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import TopNav from "@/components/dashboard/TopNav";
import LeftSidebar from "@/components/dashboard/LeftSidebar";
import RightSidebar from "@/components/dashboard/RightSidebar";
import { searchStocks } from "@/lib/actions/finnhub.actions";
import { getPortfolioSummary } from "@/lib/actions/portfolio.actions";
import type { ReactNode } from "react";

import Tour from "@/components/onboarding/Tour";
import { WebSocketProvider } from "@/components/realtime/LiveTicker";

export default async function Layout({ children }: { children: ReactNode }) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) redirect("/sign-in");

    const user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
    };

    // Parallel fetch — search stocks + real portfolio summary
    const [initialStocks, portfolio] = await Promise.all([
        searchStocks(),
        getPortfolioSummary(),
    ]);

    return (
        <WebSocketProvider>
            <div style={{
                minHeight: "100vh", display: "flex", flexDirection: "column",
                background: "#060608", color: "#EAEAEA",
                fontFamily: "var(--font-syne, 'DM Sans', system-ui, sans-serif)",
                fontSize: 13,
            }}>
                <Tour />
                {/* Sticky top bar */}
                <TopNav user={user} initialStocks={initialStocks} />

                {/* Body: left sidebar | main scroll area | right sidebar */}
                <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
                    <LeftSidebar portfolio={portfolio} />
                    <main style={{
                        flex: 1, overflowY: "auto", padding: 14,
                        display: "flex", flexDirection: "column", gap: 12,
                        background: "#060608",
                    }}>
                        {children}
                    </main>
                    <RightSidebar />
                </div>
            </div>
        </WebSocketProvider>
    );
}
