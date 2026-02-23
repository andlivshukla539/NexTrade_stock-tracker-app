"use client";

import { createContext } from "react";

export interface TickerData {
    price: number;
    symbol: string;
    timestamp: number;
}

export interface WebSocketContextType {
    subscribe: (symbol: string) => void;
    unsubscribe: (symbol: string) => void;
    latestPrices: Record<string, TickerData>;
}

export const WebSocketContext = createContext<WebSocketContextType | null>(null);
