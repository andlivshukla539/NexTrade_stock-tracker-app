'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import UserDropdown from "@/components/UserDropdown";
import SearchCommand from "@/components/SearchCommand";

const NAV_LINKS = [
    { href: "/", label: "Dashboard" },
    { href: "/search", label: "Search" },
    { href: "/watchlist", label: "Watchlist" },
    { href: "/trade", label: "Trade" },
    { href: "/portfolio", label: "Analytics" },
];

export default function DashboardNav({
    user,
    initialStocks,
}: {
    user: User;
    initialStocks: StockWithWatchlistStatus[];
}) {
    const pathname = usePathname();

    return (
        <nav
            style={{
                display: "flex",
                alignItems: "center",
                height: 52,
                padding: "0 20px",
                background: "rgba(6,6,8,0.92)",
                backdropFilter: "blur(16px)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                position: "sticky",
                top: 0,
                zIndex: 100,
                flexShrink: 0,
                gap: 0,
            }}
        >
            {/* Brand */}
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 32, textDecoration: "none" }}>
                <div style={{
                    width: 28, height: 28,
                    background: "rgba(232,197,71,0.12)",
                    border: "1px solid rgba(232,197,71,0.2)",
                    borderRadius: 8,
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M11 23L17 11L23 23" stroke="#E8C547" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M13.5 19H20.5" stroke="#E8C547" strokeWidth="2.2" strokeLinecap="round" />
                    </svg>
                </div>
                <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 700, color: "#F0EEE8" }}>
                    Nex<span style={{ color: "#E8C547" }}>Trade</span>
                </span>
            </Link>

            {/* Nav links */}
            <div style={{ display: "flex", flex: 1, gap: 0 }}>
                {NAV_LINKS.map(({ href, label }) => {
                    const active = href === "/" ? pathname === "/" : pathname?.startsWith(href);
                    if (label === "Search") {
                        return (
                            <div key="search" style={{
                                padding: "0 16px", height: 52,
                                display: "flex", alignItems: "center",
                                fontSize: 13, fontWeight: 500, color: "#9896A0",
                                cursor: "pointer",
                            }}>
                                <SearchCommand renderAs="text" label="Search" initialStocks={initialStocks} />
                            </div>
                        );
                    }
                    return (
                        <Link key={href} href={href} style={{
                            padding: "0 16px", height: 52, display: "flex", alignItems: "center",
                            fontSize: 13, fontWeight: 500, textDecoration: "none",
                            color: active ? "#F0EEE8" : "#9896A0",
                            borderBottom: active ? "2px solid #E8C547" : "2px solid transparent",
                            transition: "color 0.15s, border-color 0.15s",
                            whiteSpace: "nowrap",
                        }}>
                            {label}
                        </Link>
                    );
                })}
            </div>

            {/* Right side */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: "auto" }}>
                <UserDropdown user={user} initialStocks={initialStocks} />
            </div>
        </nav>
    );
}
