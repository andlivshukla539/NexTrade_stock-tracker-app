'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarItem = {
    href: string;
    label: string;
    icon: React.ReactNode;
    badge?: { text: string; type: "green" | "red" | "gold" };
};

const MARKETS: SidebarItem[] = [
    {
        href: "/",
        label: "Dashboard",
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
    },
    {
        href: "/watchlist",
        label: "Market Overview",
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
        badge: { text: "Live", type: "green" },
    },
    {
        href: "/stocks",
        label: "Heatmap",
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>,
    },
    {
        href: "/alerts",
        label: "Screener",
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
        badge: { text: "Pro", type: "gold" },
    },
];

const PORTFOLIO: SidebarItem[] = [
    {
        href: "/portfolio",
        label: "Holdings",
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>,
    },
    {
        href: "/trade",
        label: "Transactions",
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>,
    },
    {
        href: "/alerts",
        label: "Order History",
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
    },
];

const WATCHLISTS: SidebarItem[] = [
    {
        href: "/watchlist",
        label: "Tech Picks",
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
        badge: { text: "7", type: "gold" },
    },
    {
        href: "/watchlist",
        label: "Dividend Kings",
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
        badge: { text: "12", type: "green" },
    },
];

const BADGE_STYLES = {
    green: { background: "rgba(46,204,138,0.15)", color: "#2ECC8A" },
    red: { background: "rgba(240,82,79,0.15)", color: "#F0524F" },
    gold: { background: "rgba(232,197,71,0.12)", color: "#E8C547" },
};

function SidebarLink({ item, isActive }: { item: SidebarItem; isActive: boolean }) {
    return (
        <Link href={item.href} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "9px 16px",
            fontSize: 13, fontWeight: 500, textDecoration: "none",
            color: isActive ? "#F0EEE8" : "#9896A0",
            background: isActive ? "#131316" : "transparent",
            borderLeft: isActive ? "2px solid #E8C547" : "2px solid transparent",
            transition: "background 0.15s, color 0.15s",
        }}>
            <span style={{ opacity: isActive ? 1 : 0.6, flexShrink: 0 }}>{item.icon}</span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.badge && (
                <span style={{
                    ...BADGE_STYLES[item.badge.type],
                    fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                    padding: "1px 6px", borderRadius: 4,
                }}>
                    {item.badge.text}
                </span>
            )}
        </Link>
    );
}

export default function Sidebar() {
    const pathname = usePathname();
    const isActive = (href: string) => href === "/" ? pathname === "/" : !!pathname?.startsWith(href);

    return (
        <aside style={{
            display: "flex", flexDirection: "column",
            background: "#0D0D10",
            borderRight: "1px solid rgba(255,255,255,0.06)",
            padding: "16px 0",
            overflowY: "auto",
            width: 220,
            flexShrink: 0,
        }}>
            {/* Portfolio mini */}
            <div style={{
                margin: "0 12px 20px",
                padding: 14,
                background: "#131316",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 12,
            }}>
                <div style={{ fontSize: 10, color: "#5A5865", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Portfolio Value</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 600, color: "#F0EEE8" }}>$284,910</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#2ECC8A", marginTop: 2 }}>▲ +$3,284 (+1.17%) today</div>
                <div style={{ marginTop: 10, height: 2, background: "#222228", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: "68%", background: "linear-gradient(90deg,#E8C547,#F0CE55)", borderRadius: 2 }} />
                </div>
            </div>

            {/* Markets */}
            <div style={{ marginBottom: 24 }}>
                <div style={{ padding: "0 16px 8px", fontSize: "9.5px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#5A5865" }}>Markets</div>
                {MARKETS.map(item => <SidebarLink key={item.label} item={item} isActive={isActive(item.href) && item.href === "/"
                    ? pathname === "/"
                    : isActive(item.href) && item.label === "Dashboard" ? pathname === "/" : item.label !== "Dashboard" && isActive(item.href)} />)}
            </div>

            {/* Portfolio */}
            <div style={{ marginBottom: 24 }}>
                <div style={{ padding: "0 16px 8px", fontSize: "9.5px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#5A5865" }}>Portfolio</div>
                {PORTFOLIO.map(item => <SidebarLink key={item.label} item={item} isActive={false} />)}
            </div>

            {/* Watchlists */}
            <div style={{ marginBottom: 24 }}>
                <div style={{ padding: "0 16px 8px", fontSize: "9.5px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#5A5865" }}>Watchlists</div>
                {WATCHLISTS.map(item => <SidebarLink key={item.label} item={item} isActive={false} />)}
            </div>
        </aside>
    );
}
