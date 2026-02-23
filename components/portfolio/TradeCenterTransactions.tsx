"use client";

import React, { useEffect, useState } from "react";
import "./trade-center.css";

interface Transaction {
    _id: string;
    type: "buy" | "sell";
    symbol: string;
    quantity: number;
    price: number;
    createdAt: string;
}

export function TradeCenterTransactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTx() {
            try {
                // Fetch recent 8 transactions
                const res = await fetch('/api/portfolio/transactions?limit=8');
                if (res.ok) {
                    const data = await res.json();
                    setTransactions(data.transactions || []);
                }
            } catch (error) {
                console.error("Failed to fetch transactions:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchTx();
    }, []);

    // Format helpers
    const fmtStr = (n: number) => `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const fmtDate = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="table-card">
            <div style={{ padding: "16px 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div className="card-title" style={{ margin: 0 }}>
                    <div className="card-title-dot" /> Recent Transactions
                </div>
                <div style={{ fontSize: 10, color: "var(--muted)" }}>
                    {transactions.length} {transactions.length === 1 ? "transaction" : "transactions"}
                </div>
            </div>

            <div className="table-head tx-head">
                <div>Type</div>
                <div>Symbol</div>
                <div>Shares</div>
                <div>Price</div>
                <div>Total</div>
                <div>Date</div>
            </div>

            <div>
                {loading ? (
                    <div className="empty-state">Loading transactions...</div>
                ) : transactions.length === 0 ? (
                    <div className="empty-state">
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                        </svg>
                        No transactions yet
                    </div>
                ) : (
                    transactions.map((t) => (
                        <div key={t._id} className="table-row tx-row">
                            <div>
                                <span className={`tx-pill ${t.type}`}>
                                    {t.type === "buy" ? "▲ BUY" : "▼ SELL"}
                                </span>
                            </div>
                            <div style={{ fontFamily: "var(--font-head)", fontWeight: 700 }}>
                                {t.symbol}
                            </div>
                            <div style={{ fontFamily: "var(--font-mono)" }}>
                                {t.quantity}
                            </div>
                            <div style={{ fontFamily: "var(--font-mono)" }}>
                                {fmtStr(t.price)}
                            </div>
                            <div style={{ fontFamily: "var(--font-mono)", color: t.type === 'buy' ? 'var(--red)' : 'var(--green)' }}>
                                {t.type === 'buy' ? '-' : '+'}{fmtStr(t.quantity * t.price)}
                            </div>
                            <div style={{ color: "var(--muted)", fontSize: 10 }}>
                                {fmtDate(t.createdAt)}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
