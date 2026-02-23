"use client";

import React, { useState, useEffect } from "react";
import { executePaperTrade } from "@/lib/actions/trading.actions";
import { getQuote } from "@/lib/actions/finnhub.actions";
import "@/app/(root)/portfolio/trade-center.css";

// Assuming we trigger a refetch or state update elsewhere
interface TradeCardProps {
    availableCash: number;
    onTradeSuccess?: () => void;
}

export function TradeCenterExecute({ availableCash, onTradeSuccess }: TradeCardProps) {
    const [type, setType] = useState<"buy" | "sell">("buy");
    const [symbol, setSymbol] = useState("AAPL");
    const [price, setPrice] = useState<number | null>(null);
    const [quantity, setQuantity] = useState<number | string>(0);
    const [loadingPrice, setLoadingPrice] = useState(false);
    const [executing, setExecuting] = useState(false);

    // Toast state matching mockup
    const [toastState, setToastState] = useState<{ show: boolean, msg: string, kind: 'success' | 'error' | 'sell' } | null>(null);

    const showToast = (kind: 'success' | 'error' | 'sell', msg: string) => {
        setToastState({ show: true, msg, kind });
        setTimeout(() => setToastState(s => s ? { ...s, show: false } : null), 3500);
    };

    const fetchPrice = async (sym: string) => {
        if (!sym) return;
        setLoadingPrice(true);
        try {
            const p = await getQuote(sym.toUpperCase());
            setPrice(p);
        } catch (e) {
            console.error(e);
            setPrice(null);
        } finally {
            setLoadingPrice(false);
        }
    };

    // Initial price fetch
    useEffect(() => {
        fetchPrice("AAPL");
    }, []);

    const qtyNum = typeof quantity === 'string' ? parseFloat(quantity) || 0 : quantity;
    const totalCost = qtyNum * (price || 0);

    const handleExecute = async () => {
        if (!symbol || !price) {
            showToast('error', 'Invalid symbol or missing price');
            return;
        }
        if (qtyNum <= 0) {
            showToast('error', 'Quantity must be > 0');
            return;
        }

        setExecuting(true);
        try {
            const res = await executePaperTrade({
                symbol: symbol.toUpperCase(),
                quantity: qtyNum,
                price: price,
                type
            });

            if (res.success) {
                showToast(type === 'buy' ? 'success' : 'sell', `${type === 'buy' ? 'Bought' : 'Sold'} ${qtyNum} shares of ${symbol.toUpperCase()}`);
                if (onTradeSuccess) onTradeSuccess();
                // Reset form slightly
                setQuantity(0);
            } else {
                showToast('error', res.error || "Trade failed");
            }
        } catch (error) {
            console.error(error);
            showToast('error', 'An unexpected error occurred');
        } finally {
            setExecuting(false);
        }
    };

    return (
        <>
            <div className="card-panel">
                <div className="card-title">
                    <div className="card-title-dot" /> Execute Trade
                </div>

                {/* BUY/SELL TOGGLE */}
                <div className="type-toggle">
                    <div className={`type-btn buy ${type === 'buy' ? 'active' : ''}`} onClick={() => setType('buy')}>
                        ▲ Buy
                    </div>
                    <div className={`type-btn sell ${type === 'sell' ? 'active' : ''}`} onClick={() => setType('sell')}>
                        ▼ Sell
                    </div>
                </div>

                {/* SYMBOL */}
                <div className="form-group">
                    <label className="form-label">Stock Symbol</label>
                    <div className="symbol-wrap">
                        <input
                            className="form-input text-uppercase"
                            value={symbol}
                            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                            placeholder="e.g. AAPL"
                            style={{ textTransform: 'uppercase' }}
                        />
                        <button className="symbol-lookup-btn" onClick={() => fetchPrice(symbol)}>
                            {loadingPrice ? '...' : 'LOOKUP'}
                        </button>
                    </div>
                </div>

                {/* LIVE PRICE PREVIEW */}
                <div className="price-preview" style={{ opacity: price === null ? 0.4 : 1 }}>
                    <div>
                        <div className="price-preview-label">Current Price</div>
                        <div className="price-preview-val">
                            {price !== null ? `$${price.toFixed(2)}` : '---'}
                        </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <div className="price-preview-label text-white">{symbol.toUpperCase() || '---'}</div>
                    </div>
                </div>

                {/* QUANTITY + PRICE */}
                <div className="form-group">
                    <div className="form-row">
                        <div>
                            <label className="form-label">Quantity</label>
                            <input
                                className="form-input"
                                type="number"
                                min="0"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="form-label">Price / Share</label>
                            <input
                                className="form-input"
                                type="number"
                                disabled
                                value={price || 0}
                            />
                        </div>
                    </div>
                </div>

                {/* ORDER SUMMARY */}
                <div className="order-summary">
                    <div className="order-row">
                        <span className="order-key">Shares</span>
                        <span className="order-val">{qtyNum}</span>
                    </div>
                    <div className="order-row">
                        <span className="order-key">Price per share</span>
                        <span className="order-val">${(price || 0).toFixed(2)}</span>
                    </div>
                    <div className="order-row border-t border-white/5 mt-1 pt-2">
                        <span className="order-key">Total Cost</span>
                        <span className="order-val total">${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                </div>

                <button
                    className={`exec-btn ${type}`}
                    onClick={handleExecute}
                    disabled={executing || (type === 'buy' && totalCost > availableCash)}
                >
                    {executing ? 'Processing...' : (type === 'buy' ? 'Buy Stock' : 'Sell Stock')}
                </button>
            </div>

            {/* In-App Custom Toast from Mockup */}
            {toastState && (
                <div className={`toast tc-toast ${toastState.show ? 'show' : ''}`} style={{ zIndex: 9999 }}>
                    <div
                        className="toast-icon"
                        style={{
                            background: toastState.kind === 'success' ? 'rgba(0,229,160,.2)' : toastState.kind === 'sell' ? 'rgba(100,150,255,.2)' : 'rgba(255,69,96,.2)',
                            color: toastState.kind === 'success' ? 'var(--green)' : toastState.kind === 'sell' ? '#7eb3ff' : 'var(--red)'
                        }}
                    >
                        {toastState.kind === 'success' ? '✓' : toastState.kind === 'sell' ? '▼' : '✕'}
                    </div>
                    <div>{toastState.msg}</div>
                </div>
            )}
        </>
    );
}
