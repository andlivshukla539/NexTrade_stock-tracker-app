"use client";

import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { WebSocketContext, type WebSocketContextType, type TickerData } from './websocket-context';

export { WebSocketContext } from './websocket-context';

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
    // useRef for direct socket access — no setState means no re-render on subscribe/unsubscribe
    const socketRef = useRef<WebSocket | null>(null);
    const [latestPrices, setLatestPrices] = useState<Record<string, TickerData>>({});

    useEffect(() => {
        const API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
        if (!API_KEY) {
            console.warn("Finnhub API Key missing for WebSockets.");
            return;
        }

        const ws = new WebSocket(`wss://ws.finnhub.io?token=${API_KEY}`);
        socketRef.current = ws;

        ws.onopen = () => console.log('Finnhub WebSocket Connected');

        ws.onmessage = (event) => {
            const response = JSON.parse(event.data);
            if (response.type === 'trade' && response.data) {
                setLatestPrices(prev => {
                    const newPrices = { ...prev };
                    response.data.forEach((trade: { s: string, p: number, t: number }) => {
                        newPrices[trade.s] = { price: trade.p, symbol: trade.s, timestamp: trade.t };
                    });
                    return newPrices;
                });
            }
        };

        ws.onclose = () => console.log('Finnhub WebSocket Disconnected');
        ws.onerror = () => { };

        return () => {
            ws.close();
            socketRef.current = null;
        };
    }, []);

    // useCallback with [] — stable refs that never change identity.
    // Read socket via ref so no setSocket call is needed (avoids re-renders).
    const subscribe = useCallback((symbol: string) => {
        const ws = socketRef.current;
        if (ws?.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'subscribe', symbol }));
        }
    }, []);

    const unsubscribe = useCallback((symbol: string) => {
        const ws = socketRef.current;
        if (ws?.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'unsubscribe', symbol }));
        }
    }, []);

    return (
        <WebSocketContext.Provider value={{ subscribe, unsubscribe, latestPrices }}>
            {children}
        </WebSocketContext.Provider>
    );
}

export function useLiveTicker(symbol: string) {
    const context = useContext(WebSocketContext);

    useEffect(() => {
        if (!context) return;
        context.subscribe(symbol);
        return () => { context.unsubscribe(symbol); };
    }, [symbol, context]);

    if (!context) return null;
    return context.latestPrices[symbol]?.price || null;
}
