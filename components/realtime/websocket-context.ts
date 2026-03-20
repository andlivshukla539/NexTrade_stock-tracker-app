"use client";

import { createContext } from "react";

export interface TickerData {
    price: number;
    symbol: string;
    timestamp: number;
}

export type Listener = (prices: Record<string, TickerData>) => void;

export interface WebSocketStore {
    getPrices: () => Record<string, TickerData>;
    subscribeToPrices: (listener: Listener) => () => void;
}

export interface WebSocketContextType {
    subscribe: (symbol: string) => void;
    unsubscribe: (symbol: string) => void;
    store: WebSocketStore;
}

export const WebSocketContext = createContext<WebSocketContextType | null>(null);
