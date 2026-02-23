'use client';

import { usePathname } from "next/navigation";
import Link from "next/link";

const NAV = [
    { href: "/", label: "Dashboard", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg> },
    { href: "/watchlist", label: "Watchlist", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg> },
    { href: "/stocks", label: "Markets", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg> },
    { href: "/trade", label: "Trade", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg> },
    { href: "/portfolio", label: "History", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> },
    { href: "/alerts", label: "News Feed", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" /></svg> },
];

const TOOLS = [
    { href: "/screener", label: "Screener", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg> },
    { href: "/calendar", label: "Calendar", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg> },
    { href: "/alerts", label: "Alerts", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg> },
    { href: "/", label: "Settings", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg> },
];

const S = {
    sidebar: {
        width: 200, flexShrink: 0 as const,
        background: "#0B0B0E",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex" as const, flexDirection: "column" as const,
        overflowY: "auto" as const,
    },
    section: { marginBottom: 8 },
    sectionLabel: { padding: "14px 14px 6px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#3D3B45" },
};

interface PortfolioSummary {
    totalInvested: number;
    holdingCount: number;
    watchlistCount: number;
}

function NavItem({ href, label, icon, badge, active }: { href: string; label: string; icon: React.ReactNode; badge: string | null; active: boolean }) {
    return (
        <Link href={href} style={{
            display: "flex", alignItems: "center", gap: 9,
            padding: "8px 14px", textDecoration: "none",
            fontSize: 13, fontWeight: 500,
            color: active ? "#EAEAEA" : "#6B6878",
            background: active ? "rgba(46,204,138,0.08)" : "transparent",
            borderLeft: `2px solid ${active ? "#2ECC8A" : "transparent"}`,
            transition: "all 0.12s",
        }}>
            <span style={{ opacity: active ? 1 : 0.7 }}>{icon}</span>
            <span style={{ flex: 1 }}>{label}</span>
            {badge && (
                <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 4, background: "rgba(232,197,71,0.15)", color: "#E8C547", fontFamily: "monospace" }}>
                    {badge}
                </span>
            )}
        </Link>
    );
}

export default function LeftSidebar({ portfolio }: { portfolio?: PortfolioSummary }) {
    const pathname = usePathname();

    // Format real portfolio total — cost basis (invested amount)
    const totalDisplay = portfolio && portfolio.totalInvested > 0
        ? `$${portfolio.totalInvested.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
        : portfolio && portfolio.holdingCount === 0
            ? "$0"
            : "—";

    // Show watchlist count as badge if > 0
    const watchlistBadge = portfolio && portfolio.watchlistCount > 0
        ? String(portfolio.watchlistCount)
        : null;

    return (
        <aside style={S.sidebar} id="sidebar-nav">
            {/* Markets Open badge */}
            <div style={{ padding: "12px 14px 8px" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 6, background: "rgba(46,204,138,0.1)", border: "1px solid rgba(46,204,138,0.2)" }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#2ECC8A", display: "inline-block", animation: "pulse 1.5s ease-in-out infinite" }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#2ECC8A", letterSpacing: "0.06em" }}>MARKETS OPEN</span>
                </div>
            </div>

            {/* Navigate */}
            <div style={S.section}>
                <div style={S.sectionLabel}>Navigate</div>
                {NAV.map(n => {
                    const isActive = n.href === "/" ? pathname === "/" : !!pathname?.startsWith(n.href);
                    // Attach real watchlist count badge to the Watchlist nav item
                    const badge = n.href === "/watchlist" ? watchlistBadge : null;
                    return <NavItem key={n.label} {...n} badge={badge} active={isActive} />;
                })}
            </div>

            {/* Portfolio — real values (cost basis from DB) */}
            <div style={{ ...S.section, padding: "10px 14px 4px" }}>
                <div style={{ ...S.sectionLabel, padding: "0 0 10px" }}>Portfolio</div>
                <div style={{ fontSize: 10, color: "#3D3B45", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Invested Cost Basis</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 22, fontWeight: 700, color: "#EAEAEA", lineHeight: 1.1 }}>
                    {totalDisplay}
                </div>
                {portfolio && portfolio.holdingCount > 0 && (
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#5A5865", marginTop: 4 }}>
                        {portfolio.holdingCount} position{portfolio.holdingCount !== 1 ? "s" : ""}
                    </div>
                )}
                {portfolio && portfolio.holdingCount === 0 && (
                    <div style={{ fontSize: 11, color: "#5A5865", marginTop: 4 }}>No holdings yet</div>
                )}
            </div>

            <div style={{ flex: 1 }} />

            {/* Tools */}
            <div style={{ ...S.section, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 8, marginBottom: 0 }}>
                <div style={S.sectionLabel}>Tools</div>
                {TOOLS.map(t => <NavItem key={t.label} {...t} badge={null} active={false} />)}
            </div>
        </aside>
    );
}
