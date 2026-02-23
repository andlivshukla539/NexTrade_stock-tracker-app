"use client";

import React, { useState } from "react";

const CALENDAR_DATA = [
    { date: "Oct 25, 2026", sym: "MSFT", name: "Microsoft", estimate: "$2.99", time: "After Close", trend: "up" },
    { date: "Oct 25, 2026", sym: "GOOG", name: "Alphabet Inc", estimate: "$1.45", time: "After Close", trend: "up" },
    { date: "Oct 26, 2026", sym: "META", name: "Meta Platforms", estimate: "$3.62", time: "After Close", trend: "up" },
    { date: "Oct 27, 2026", sym: "AMZN", name: "Amazon.com", estimate: "$0.58", time: "After Close", trend: "up" },
    { date: "Oct 27, 2026", sym: "INTC", name: "Intel Corp", estimate: "$0.22", time: "After Close", trend: "down" },
    { date: "Nov 02, 2026", sym: "AAPL", name: "Apple Inc", estimate: "$1.39", time: "After Close", trend: "neutral" },
    { date: "Nov 15, 2026", sym: "NVDA", name: "Nvidia Corp", estimate: "$4.12", time: "After Close", trend: "up" }
];

export default function EarningsCalendarPage() {
    const [filterSym, setFilterSym] = useState("");

    const filtered = CALENDAR_DATA.filter(item =>
        item.sym.toLowerCase().includes(filterSym.toLowerCase()) ||
        item.name.toLowerCase().includes(filterSym.toLowerCase())
    );

    // Group by date
    const grouped = filtered.reduce((acc, curr) => {
        if (!acc[curr.date]) acc[curr.date] = [];
        acc[curr.date].push(curr);
        return acc;
    }, {} as Record<string, typeof CALENDAR_DATA>);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: "24px 32px", fontFamily: "var(--font-syne)" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
                <div>
                    <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: 32, fontWeight: 900, letterSpacing: "-0.02em", color: "var(--nt-txt)", margin: 0 }}>
                        Earnings <em style={{ color: "var(--nt-gold)", fontStyle: "italic" }}>Calendar</em>
                    </h1>
                    <p style={{ fontSize: 13, color: "var(--nt-txt3)", margin: "8px 0 0 0" }}>Track upcoming corporate earnings reports and Wall Street estimates.</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "var(--nt-surface2)", border: "1px solid var(--nt-border)", borderRadius: 10 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--nt-txt3)" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                    <input
                        value={filterSym}
                        onChange={e => setFilterSym(e.target.value)}
                        placeholder="Search symbol..."
                        style={{ background: "none", border: "none", fontSize: 13, color: "var(--nt-txt)", outline: "none", width: 140, fontFamily: "var(--font-syne)" }}
                    />
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                {Object.keys(grouped).length === 0 ? (
                    <div style={{ padding: 60, textAlign: "center", color: "var(--nt-txt3)", background: "var(--nt-surface)", border: "1px solid var(--nt-border)", borderRadius: 16 }}>
                        No upcoming earnings found matching your search.
                    </div>
                ) : Object.entries(grouped).map(([date, items]) => (
                    <div key={date}>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--nt-txt)", borderBottom: "1px solid var(--nt-border)", paddingBottom: 10, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--nt-gold)", display: "inline-block" }} />
                            {date}
                        </h3>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                            {items.map(item => (
                                <div key={item.sym} style={{ background: "var(--nt-surface)", border: "1px solid var(--nt-border)", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 12, transition: "transform 0.2s, border-color 0.2s", cursor: "pointer" }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--nt-border2)"; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.borderColor = "var(--nt-border)"; }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                        <div>
                                            <div style={{ fontSize: 16, fontWeight: 800, color: "var(--nt-txt)" }}>{item.sym}</div>
                                            <div style={{ fontSize: 11, color: "var(--nt-txt3)" }}>{item.name}</div>
                                        </div>
                                        <div style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 100, background: "var(--nt-surface2)", color: "var(--nt-txt2)" }}>
                                            {item.time}
                                        </div>
                                    </div>
                                    <div style={{ background: "var(--nt-surface2)", borderRadius: 8, padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                            <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--nt-txt3)", fontWeight: 700 }}>Est. EPS</span>
                                            <span style={{ fontFamily: "var(--font-mono)", fontSize: 16, fontWeight: 700, color: "var(--nt-gold)" }}>{item.estimate}</span>
                                        </div>
                                        <div>
                                            {item.trend === "up" && <span style={{ color: "var(--nt-green)", fontSize: 16 }}>↗</span>}
                                            {item.trend === "down" && <span style={{ color: "var(--nt-red)", fontSize: 16 }}>↘</span>}
                                            {item.trend === "neutral" && <span style={{ color: "var(--nt-txt3)", fontSize: 16 }}>→</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
