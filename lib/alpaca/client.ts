const ALPACA_API_KEY = process.env.ALPACA_API_KEY;
const ALPACA_SECRET_KEY = process.env.ALPACA_SECRET_KEY;
const IS_PAPER = process.env.ALPACA_PAPER === 'true';

const BASE_URL = IS_PAPER
    ? 'https://paper-api.alpaca.markets'
    : 'https://api.alpaca.markets';

const HEADERS = {
    'APCA-API-KEY-ID': ALPACA_API_KEY || '',
    'APCA-API-SECRET-KEY': ALPACA_SECRET_KEY || '',
    'Content-Type': 'application/json',
};

export interface AlpacaAccount {
    id: string;
    buying_power: string;
    cash: string;
    portfolio_value: string;
    equity: string;
    currency: string;
    status: string;
}

export interface AlpacaPosition {
    symbol: string;
    qty: string;
    avg_entry_price: string;
    current_price: string;
    market_value: string;
    unrealized_pl: string;
    unrealized_plpc: string;
}

export interface AlpacaOrder {
    id: string;
    symbol: string;
    qty: string;
    side: 'buy' | 'sell';
    type: 'market' | 'limit';
    time_in_force: 'day' | 'gtc';
    status: string;
}

export const alpacaClient = {
    async getAccount(): Promise<AlpacaAccount> {
        if (!ALPACA_API_KEY || !ALPACA_SECRET_KEY) {
            throw new Error("Alpaca API keys are missing");
        }
        const res = await fetch(`${BASE_URL}/v2/account`, { headers: HEADERS });
        if (!res.ok) {
            const err = await res.text();
            throw new Error(`Alpaca API Error: ${err}`);
        }
        return res.json();
    },

    async getPositions(): Promise<AlpacaPosition[]> {
        if (!ALPACA_API_KEY || !ALPACA_SECRET_KEY) {
            return [];
        }
        const res = await fetch(`${BASE_URL}/v2/positions`, { headers: HEADERS });
        if (!res.ok) {
            console.error("Failed to fetch positions", await res.text());
            return [];
        }
        return res.json();
    },

    async placeOrder(symbol: string, qty: number, side: 'buy' | 'sell', type: 'market' | 'limit' = 'market'): Promise<AlpacaOrder> {
        if (!ALPACA_API_KEY || !ALPACA_SECRET_KEY) {
            throw new Error("Alpaca API keys are missing");
        }

        const body = {
            symbol: symbol.toUpperCase(),
            qty: qty.toString(),
            side,
            type,
            time_in_force: 'day'
        };

        const res = await fetch(`${BASE_URL}/v2/orders`, {
            method: 'POST',
            headers: HEADERS,
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || "Failed to place order");
        }
        return res.json();
    }
};
