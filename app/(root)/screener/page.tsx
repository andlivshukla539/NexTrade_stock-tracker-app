"use client";

import React, { useState } from "react";

const DEMO_STOCKS = [
    { sym: "AAPL", name: "Apple Inc", sector: "Technology", price: 213.07, pe: 28.5, cap: 3.3, div: 0.5, vol: 45 },
    { sym: "MSFT", name: "Microsoft Corp", sector: "Technology", price: 415.32, pe: 35.2, cap: 3.1, div: 0.7, vol: 22 },
    { sym: "NVDA", name: "Nvidia Corp", sector: "Technology", price: 875.40, pe: 65.4, cap: 2.2, div: 0.02, vol: 60 },
    { sym: "JNJ", name: "Johnson & Johnson", sector: "Healthcare", price: 158.20, pe: 14.8, cap: 0.38, div: 3.1, vol: 8 },
    { sym: "PG", name: "Procter & Gamble", sector: "Consumer", price: 168.40, pe: 24.1, cap: 0.39, div: 2.4, vol: 6 },
    { sym: "XOM", name: "Exxon Mobil", sector: "Energy", price: 110.50, pe: 11.2, cap: 0.44, div: 3.5, vol: 15 },
    { sym: "JPM", name: "JPMorgan Chase", sector: "Financial", price: 195.30, pe: 11.5, cap: 0.55, div: 2.2, vol: 9 },
    { sym: "TSLA", name: "Tesla Inc", sector: "Consumer", price: 248.50, pe: 45.1, cap: 0.79, div: 0, vol: 110 },
];

export default function ScreenerPage() {
    const [sector, setSector] = useState("All");
    const [maxPE, setMaxPE] = useState<number | "">("");
    const [minDiv, setMinDiv] = useState<number | "">("");
    const [minCap, setMinCap] = useState<number | "">(""); // in Trillions

    const filtered = DEMO_STOCKS.filter(s => {
        if (sector !== "All" && s.sector !== sector) return false;
        if (maxPE !== "" && s.pe > Number(maxPE)) return false;
        if (minDiv !== "" && s.div < Number(minDiv)) return false;
        if (minCap !== "" && s.cap < Number(minCap)) return false;
        return true;
    });

    const inputStyle = {
        padding: "8px 12px", background: "var(--nt-surface2)", border: "1px solid var(--nt-border)",
        borderRadius: 8, fontSize: 13, color: "var(--nt-txt)", fontFamily: "var(--font-syne)",
        outline: "none", width: "100%", marginTop: 4
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: "24px 32px", fontFamily: "var(--font-syne)" }}>
            <div>
                <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: 32, fontWeight: 900, letterSpacing: "-0.02em", color: "var(--nt-txt)", margin: 0 }}>
                    Stock <em style={{ color: "var(--nt-gold)", fontStyle: "italic" }}>Screener</em>
                </h1>
                <p style={{ fontSize: 13, color: "var(--nt-txt3)", marginTop: 8 }}>Filter the market for opportunities based on technical and fundamental metrics.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 24 }}>
                {/* Filter Sidebar */}
                <div style={{ background: "var(--nt-surface)", border: "1px solid var(--nt-border)", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, paddingBottom: 12, borderBottom: "1px solid var(--nt-border)", color: "var(--nt-txt)" }}>Filters</h3>

                    <div>
                        <label style={{ fontSize: 11, fontWeight: 700, color: "var(--nt-txt3)", textTransform: "uppercase" }}>Sector</label>
                        <select value={sector} onChange={e => setSector(e.target.value)} style={inputStyle}>
                            <option value="All">All Sectors</option>
                            <option value="Technology">Technology</option>
                            <option value="Healthcare">Healthcare</option>
                            <option value="Consumer">Consumer Discretionary</option>
                            <option value="Energy">Energy</option>
                            <option value="Financial">Financials</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ fontSize: 11, fontWeight: 700, color: "var(--nt-txt3)", textTransform: "uppercase" }}>Max P/E Ratio</label>
                        <input type="number" placeholder="e.g. 20" value={maxPE} onChange={e => setMaxPE(e.target.value ? Number(e.target.value) : "")} style={inputStyle} />
                    </div>

                    <div>
                        <label style={{ fontSize: 11, fontWeight: 700, color: "var(--nt-txt3)", textTransform: "uppercase" }}>Min Dividend Yield (%)</label>
                        <input type="number" step="0.1" placeholder="e.g. 2.0" value={minDiv} onChange={e => setMinDiv(e.target.value ? Number(e.target.value) : "")} style={inputStyle} />
                    </div>

                    <div>
                        <label style={{ fontSize: 11, fontWeight: 700, color: "var(--nt-txt3)", textTransform: "uppercase" }}>Min Market Cap ($T)</label>
                        <input type="number" step="0.1" placeholder="e.g. 1.0" value={minCap} onChange={e => setMinCap(e.target.value ? Number(e.target.value) : "")} style={inputStyle} />
                    </div>

                    <button
                        onClick={() => { setSector("All"); setMaxPE(""); setMinDiv(""); setMinCap(""); }}
                        style={{ marginTop: "auto", padding: "10px", borderRadius: 8, border: "1px dashed var(--nt-border)", background: "transparent", color: "var(--nt-txt3)", cursor: "pointer", fontSize: 12, fontWeight: 600 }}
                    >
                        Reset Filters
                    </button>
                </div>

                {/* Results Table */}
                <div style={{ background: "var(--nt-surface)", border: "1px solid var(--nt-border)", borderRadius: 16, overflow: "hidden" }}>
                    <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--nt-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "var(--nt-txt)" }}>Screener Results</span>
                        <span style={{ fontSize: 12, color: "var(--nt-gold)", fontWeight: 700, background: "var(--nt-gold-dim)", padding: "4px 10px", borderRadius: 100 }}>{filtered.length} Matches</span>
                    </div>
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                            <thead>
                                <tr>
                                    {["Symbol", "Company", "Sector", "Price", "P/E", "Div Yield", "Mkt Cap"].map((h, i) => (
                                        <th key={h} style={{ padding: "12px 20px", fontSize: 10, fontWeight: 700, color: "var(--nt-txt3)", textTransform: "uppercase", letterSpacing: "0.1em", borderBottom: "1px solid var(--nt-border)", textAlign: i > 2 ? "right" : "left" }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} style={{ padding: 40, textAlign: "center", color: "var(--nt-txt3)", fontSize: 13 }}>No stocks match your filter criteria.</td>
                                    </tr>
                                ) : filtered.map((s, i) => (
                                    <tr key={s.sym} style={{ borderBottom: "1px solid var(--nt-border)", background: i % 2 === 0 ? "transparent" : "var(--nt-surface2)" }}>
                                        <td style={{ padding: "12px 20px", fontSize: 13, fontWeight: 700, color: "var(--nt-txt)" }}>{s.sym}</td>
                                        <td style={{ padding: "12px 20px", fontSize: 13, color: "var(--nt-txt2)" }}>{s.name}</td>
                                        <td style={{ padding: "12px 20px" }}>
                                            <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: "var(--nt-surface3)", color: "var(--nt-txt3)" }}>{s.sector}</span>
                                        </td>
                                        <td style={{ padding: "12px 20px", fontSize: 13, fontFamily: "var(--font-mono)", textAlign: "right" }}>${s.price.toFixed(2)}</td>
                                        <td style={{ padding: "12px 20px", fontSize: 13, fontFamily: "var(--font-mono)", textAlign: "right", color: s.pe > 30 ? "var(--nt-red)" : "var(--nt-green)" }}>{s.pe}</td>
                                        <td style={{ padding: "12px 20px", fontSize: 13, fontFamily: "var(--font-mono)", textAlign: "right" }}>{s.div}%</td>
                                        <td style={{ padding: "12px 20px", fontSize: 13, fontFamily: "var(--font-mono)", textAlign: "right" }}>${s.cap}T</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
