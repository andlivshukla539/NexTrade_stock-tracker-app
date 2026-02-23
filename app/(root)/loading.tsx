// Global skeleton loading UI — shown instantly while the page server-fetches data
// This makes navigation feel instant because Next.js shows this immediately
// while streaming the actual page content in the background.

function Skeleton({ w = "100%", h = 20, radius = 8 }: { w?: string | number; h?: number; radius?: number }) {
    return (
        <div style={{
            width: w, height: h, borderRadius: radius,
            background: "linear-gradient(90deg, #131316 25%, #1A1A1E 50%, #131316 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.6s ease-in-out infinite",
            flexShrink: 0,
        }} />
    );
}

function CardSkeleton() {
    return (
        <div style={{ background: "#0F0F12", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px 18px" }}>
            <Skeleton w={80} h={10} />
            <div style={{ marginTop: 10 }}><Skeleton w={120} h={28} /></div>
            <div style={{ marginTop: 8 }}><Skeleton w={100} h={12} /></div>
        </div>
    );
}

function ChartSkeleton() {
    return (
        <div style={{ background: "#0F0F12", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 8 }}>
                <Skeleton w={120} h={12} />
                <Skeleton w={60} h={12} />
                <div style={{ marginLeft: "auto" }}><Skeleton w={120} h={20} /></div>
            </div>
            <div style={{ padding: 16 }}>
                <Skeleton w={100} h={32} />
                <div style={{ marginTop: 8 }}><Skeleton w={140} h={12} /></div>
            </div>
            <Skeleton w="100%" h={200} radius={0} />
        </div>
    );
}

function ListSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div style={{ background: "#0F0F12", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <Skeleton w={100} h={12} />
            </div>
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <Skeleton w={28} h={28} radius={6} />
                    <div style={{ flex: 1 }}>
                        <Skeleton w="60%" h={11} />
                        <div style={{ marginTop: 4 }}><Skeleton w="40%" h={9} /></div>
                    </div>
                    <Skeleton w={50} h={11} />
                </div>
            ))}
        </div>
    );
}

export default function Loading() {
    return (
        <>
            {/* Row 1: index cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                <CardSkeleton /><CardSkeleton /><CardSkeleton />
            </div>

            {/* Row 2: chart + movers */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 12 }}>
                <ChartSkeleton />
                <ListSkeleton rows={6} />
            </div>

            {/* Row 3: heatmap + sectors */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 240px", gap: 12 }}>
                <div style={{ background: "#0F0F12", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 10 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 3 }}>
                        {Array.from({ length: 12 }).map((_, i) => (
                            <Skeleton key={i} w="100%" h={56} radius={7} />
                        ))}
                    </div>
                </div>
                <ListSkeleton rows={6} />
            </div>

            {/* Row 4: news */}
            <div style={{ background: "#0F0F12", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <Skeleton w={120} h={12} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)" }}>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} style={{ padding: "12px 14px", borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.04)" : "none", borderRight: i % 3 < 2 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                            <Skeleton w="90%" h={12} />
                            <div style={{ marginTop: 6 }}><Skeleton w="70%" h={10} /></div>
                            <div style={{ marginTop: 6 }}><Skeleton w={60} h={9} /></div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
