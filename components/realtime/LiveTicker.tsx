"use client";

import React, { useCallback, useContext, useEffect, useRef, useSyncExternalStore } from 'react';
import { WebSocketContext, type TickerData, type Listener, type WebSocketStore } from './websocket-context';

export { WebSocketContext } from './websocket-context';

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
    const socketRef = useRef<WebSocket | null>(null);

    // Create a stable store instance that doesn't trigger React renders on every price tick
    const storeRef = useRef<WebSocketStore | null>(null);
    if (!storeRef.current) {
        let prices: Record<string, TickerData> = {};
        const listeners = new Set<Listener>();

        storeRef.current = {
            getPrices: () => prices,
            subscribeToPrices: (listener: Listener) => {
                listeners.add(listener);
                return () => listeners.delete(listener);
            },
            // Private method to trigger updates
            _updatePrices: (newPrices: Record<string, TickerData>) => {
                prices = { ...prices, ...newPrices };
                listeners.forEach(l => l(prices));
            }
        } as WebSocketStore & { _updatePrices: (p: Record<string, TickerData>) => void };
    }

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
                const updates: Record<string, TickerData> = {};
                response.data.forEach((trade: { s: string, p: number, t: number }) => {
                    updates[trade.s] = { price: trade.p, symbol: trade.s, timestamp: trade.t };
                });

                // Update store instead of React state
                const store = storeRef.current as WebSocketStore & { _updatePrices: (p: Record<string, TickerData>) => void };
                if (store) {
                    store._updatePrices(updates);
                }
            }
        };

        ws.onclose = () => console.log('Finnhub WebSocket Disconnected');
        ws.onerror = () => { };

        return () => {
            ws.close();
            socketRef.current = null;
        };
    }, []);

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

    const contextValue = React.useMemo(() => ({
        subscribe,
        unsubscribe,
        store: storeRef.current!
    }), [subscribe, unsubscribe]);

    return (
        <WebSocketContext.Provider value={contextValue}>
            {children}
        </WebSocketContext.Provider>
    );
}

export function useLiveTicker(symbol: string) {
    const context = useContext(WebSocketContext);

    const subscribe = context?.subscribe;
    const unsubscribe = context?.unsubscribe;
    const store = context?.store;

    useEffect(() => {
        if (!subscribe || !unsubscribe) return;
        subscribe(symbol);
        return () => { unsubscribe(symbol); };
    }, [symbol, subscribe, unsubscribe]);

    // Fast subscription to specific ticker updates without global re-renders
    const price = useSyncExternalStore(
        store?.subscribeToPrices || (() => () => { }),
        () => store?.getPrices()[symbol]?.price || null,
        () => null
    );

    return price;
}

