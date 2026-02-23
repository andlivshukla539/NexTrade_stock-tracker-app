'use client';

export default function StatCards() {
    const cards = [
        {
            accent: "#E8C547",
            label: "Portfolio Value",
            icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
            value: "$284,910",
            sub: "▲ +$3,284  (+1.17%)",
            subColor: "#2ECC8A",
            glow: "#E8C547",
        },
        {
            accent: "#2ECC8A",
            label: "Day's Gain",
            icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>,
            value: "+$1,847",
            valueColor: "#2ECC8A",
            sub: "Best: NVDA +2.31%",
            subColor: "#2ECC8A",
            glow: "#2ECC8A",
        },
        {
            accent: "#4E9EFF",
            label: "Open Positions",
            icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>,
            value: "14",
            valueColor: "#4E9EFF",
            sub: "Across 6 sectors",
            subColor: "#5A5865",
            glow: "#4E9EFF",
        },
        {
            accent: "#F0524F",
            label: "Alerts Active",
            icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
            value: "3",
            valueColor: "#F0524F",
            sub: "Price target breached",
            subColor: "#F0524F",
            glow: "#F0524F",
        },
    ];

    return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
            {cards.map((c, i) => (
                <div key={i} style={{
                    background: "#0D0D10",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 16,
                    padding: 18,
                    position: "relative",
                    overflow: "hidden",
                    transition: "border-color 0.2s, transform 0.2s",
                    animationDelay: `${i * 0.05 + 0.05}s`,
                }}>
                    {/* top accent line */}
                    <div style={{
                        position: "absolute", top: 0, left: 0, right: 0, height: 2,
                        background: `linear-gradient(90deg,transparent,${c.accent},transparent)`,
                    }} />
                    {/* label */}
                    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#5A5865", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ color: c.accent }}>{c.icon}</span>
                        {c.label}
                    </div>
                    {/* value */}
                    <div style={{ fontFamily: "'JetBrains Mono','Courier New',monospace", fontSize: 22, fontWeight: 600, color: c.valueColor || "#F0EEE8", marginBottom: 6 }}>
                        {c.value}
                    </div>
                    {/* sub */}
                    <div style={{ fontSize: 11, color: c.subColor }}>{c.sub}</div>
                    {/* glow */}
                    <div style={{
                        position: "absolute", bottom: -20, right: -20,
                        width: 80, height: 80, borderRadius: "50%",
                        background: c.glow, opacity: 0.08, filter: "blur(20px)",
                    }} />
                </div>
            ))}
        </div>
    );
}
