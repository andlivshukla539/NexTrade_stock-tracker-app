"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface TradeDialogProps {
    symbol: string;
    currentPrice?: number;
    triggerLabel?: string;
    triggerStyle?: React.CSSProperties;
}

type OrderType = "market" | "limit";
type TradeType = "buy" | "sell";

function Spinner() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin 0.7s linear infinite" }}>
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    );
}

export default function TradeDialog({ symbol, currentPrice, triggerLabel = "Trade", triggerStyle }: TradeDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [priceLoading, setPriceLoading] = useState(false);
    const [livePrice, setLivePrice] = useState<number | null>(currentPrice ?? null);
    const [tradeType, setTradeType] = useState<TradeType>("buy");
    const [orderType, setOrderType] = useState<OrderType>("market");
    const [quantity, setQuantity] = useState(1);
    const [limitPrice, setLimitPrice] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Fetch live price whenever dialog opens
    const fetchLivePrice = useCallback(async () => {
        if (!symbol) return;
        setPriceLoading(true);
        try {
            const res = await fetch(`/api/quotes?symbols=${encodeURIComponent(symbol)}`);
            if (res.ok) {
                const data = await res.json();
                const p = data.quotes?.[symbol.toUpperCase()];
                if (p) setLivePrice(p);
            }
        } catch { /* silent — keep prev price */ }
        finally { setPriceLoading(false); }
    }, [symbol]);

    useEffect(() => {
        if (open) fetchLivePrice();
    }, [open, fetchLivePrice]);

    const execPrice = orderType === "market" ? livePrice : parseFloat(limitPrice) || null;
    const total = execPrice && quantity > 0 ? (execPrice * quantity).toFixed(2) : null;
    const isValid = quantity > 0 && execPrice !== null && execPrice > 0 && (orderType === "market" || (limitPrice !== "" && !isNaN(parseFloat(limitPrice))));

    async function handleTrade() {
        if (!isValid) { setError("Please fill in all fields."); return; }
        setError(null);
        setLoading(true);
        try {
            const res = await fetch("/api/trade", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    symbol: symbol.toUpperCase(),
                    quantity,
                    price: execPrice,
                    type: tradeType,
                    orderType,
                    timestamp: new Date().toISOString(),
                }),
            });
            const json = await res.json();
            if (!res.ok) { toast.error(json.error || "Trade failed"); return; }
            toast.success(`✅ ${tradeType === "buy" ? "Bought" : "Sold"} ${quantity}× ${symbol.toUpperCase()} @ $${execPrice?.toFixed(2)}`);
            setOpen(false);
            router.refresh();
        } catch {
            toast.error("Network error — please try again.");
        } finally {
            setLoading(false);
        }
    }

    const TAB_STYLE = (active: boolean, accent: string) => ({
        flex: 1, padding: "7px 0", borderRadius: 8, border: "none", cursor: "pointer",
        fontWeight: 600, fontSize: 13, transition: "all 0.15s",
        background: active ? accent : "#131316",
        color: active ? (accent === "#2ECC8A" ? "#0A0A0C" : "#fff") : "#5A5865",
    } as React.CSSProperties);

    return (
        <>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <button style={{
                        padding: "6px 18px", borderRadius: 8, fontWeight: 700, fontSize: 12,
                        background: "#E8C547", color: "#0A0A0C", border: "none", cursor: "pointer",
                        transition: "opacity 0.15s",
                        ...triggerStyle,
                    }}>
                        {triggerLabel}
                    </button>
                </DialogTrigger>

                <DialogContent style={{ background: "#0D0D10", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, maxWidth: 400, padding: 24, color: "#EAEAEA" }}>
                    <DialogHeader>
                        <DialogTitle style={{ fontFamily: "'DM Sans',system-ui,sans-serif", fontSize: 18, fontWeight: 700 }}>
                            Place Order · <span style={{ color: "#E8C547" }}>{symbol.toUpperCase()}</span>
                        </DialogTitle>
                    </DialogHeader>

                    {/* Live price */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "#131316", borderRadius: 10, marginBottom: 14 }}>
                        <span style={{ fontSize: 11, color: "#5A5865" }}>Live Price</span>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 20, fontWeight: 700, color: "#EAEAEA", marginLeft: "auto" }}>
                            {priceLoading ? <Spinner /> : livePrice ? `$${livePrice.toFixed(2)}` : "—"}
                        </span>
                        <button onClick={fetchLivePrice} style={{ background: "none", border: "none", color: "#5A5865", cursor: "pointer", fontSize: 10, padding: 0 }}>↻</button>
                    </div>

                    {/* Buy / Sell */}
                    <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                        <button onClick={() => setTradeType("buy")} style={TAB_STYLE(tradeType === "buy", "#2ECC8A")}>Buy</button>
                        <button onClick={() => setTradeType("sell")} style={TAB_STYLE(tradeType === "sell", "#F0524F")}>Sell</button>
                    </div>

                    {/* Order type */}
                    <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                        {(["market", "limit"] as OrderType[]).map(ot => (
                            <button key={ot} onClick={() => setOrderType(ot)} style={{
                                flex: 1, padding: "5px 0", borderRadius: 8, border: `1px solid ${orderType === ot ? "rgba(232,197,71,0.5)" : "rgba(255,255,255,0.08)"}`,
                                background: orderType === ot ? "rgba(232,197,71,0.08)" : "#131316",
                                color: orderType === ot ? "#E8C547" : "#5A5865", fontWeight: 600, fontSize: 12, cursor: "pointer", textTransform: "capitalize",
                            }}>
                                {ot} Order
                            </button>
                        ))}
                    </div>

                    {/* Quantity */}
                    <label style={{ display: "block", marginBottom: 14 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#5A5865", display: "block", marginBottom: 5 }}>Shares</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, background: "#131316", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, overflow: "hidden" }}>
                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                style={{ width: 36, height: 40, background: "none", border: "none", color: "#5A5865", fontSize: 18, cursor: "pointer", flexShrink: 0 }}>−</button>
                            <input
                                type="number" min={1} value={quantity}
                                onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                style={{ flex: 1, background: "none", border: "none", textAlign: "center", fontFamily: "'JetBrains Mono',monospace", fontSize: 16, fontWeight: 600, color: "#EAEAEA", outline: "none" }}
                            />
                            <button onClick={() => setQuantity(q => q + 1)}
                                style={{ width: 36, height: 40, background: "none", border: "none", color: "#5A5865", fontSize: 18, cursor: "pointer", flexShrink: 0 }}>+</button>
                        </div>
                    </label>

                    {/* Limit price (only for limit orders) */}
                    {orderType === "limit" && (
                        <label style={{ display: "block", marginBottom: 14 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#5A5865", display: "block", marginBottom: 5 }}>Limit Price ($)</span>
                            <input
                                type="number" step="0.01" min="0" placeholder={livePrice ? livePrice.toFixed(2) : "0.00"}
                                value={limitPrice}
                                onChange={e => setLimitPrice(e.target.value)}
                                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, background: "#131316", border: "1px solid rgba(255,255,255,0.1)", color: "#EAEAEA", fontFamily: "'JetBrains Mono',monospace", fontSize: 15, outline: "none", boxSizing: "border-box" }}
                            />
                        </label>
                    )}

                    {/* Total */}
                    {total && (
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#131316", borderRadius: 10, marginBottom: 14 }}>
                            <span style={{ fontSize: 12, color: "#5A5865" }}>Estimated Total</span>
                            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 16, fontWeight: 700, color: "#E8C547" }}>${total}</span>
                        </div>
                    )}

                    {error && <div style={{ fontSize: 11, color: "#F0524F", marginBottom: 10 }}>{error}</div>}

                    <button onClick={handleTrade} disabled={loading || !isValid} style={{
                        width: "100%", padding: "12px 0", borderRadius: 10, border: "none", cursor: isValid && !loading ? "pointer" : "not-allowed",
                        fontWeight: 700, fontSize: 14,
                        background: tradeType === "buy" ? "#2ECC8A" : "#F0524F",
                        color: tradeType === "buy" ? "#0A0A0C" : "#fff",
                        opacity: !isValid || loading ? 0.6 : 1,
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        transition: "opacity 0.15s",
                    }}>
                        {loading ? <><Spinner /> Processing…</> : `${tradeType === "buy" ? "Buy" : "Sell"} ${quantity} Share${quantity !== 1 ? "s" : ""}`}
                    </button>
                </DialogContent>
            </Dialog>
        </>
    );
}
