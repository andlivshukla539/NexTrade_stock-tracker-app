"use client";

import React from "react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

interface Holding {
    symbol: string;
    quantity: number;
    avgPrice: number;
    currentPrice: number;
}

interface PortfolioChartProps {
    holdings: Holding[];
}

export function PortfolioChart({ holdings }: PortfolioChartProps) {
    // Calculate allocation data
    const allocationData = holdings.map((h) => ({
        name: h.symbol,
        value: h.quantity * h.currentPrice,
    }));

    // Mock performance data (since we don't have historical data in this demo)
    // In a real app, this would come from an API
    const performanceData = [
        { name: "Jan", value: 4000 },
        { name: "Feb", value: 3000 },
        { name: "Mar", value: 2000 },
        { name: "Apr", value: 2780 },
        { name: "May", value: 1890 },
        { name: "Jun", value: 2390 },
        { name: "Jul", value: 3490 },
    ];

    // If we had real data, we would calculate total value over time
    // For now, let's just show the Allocation Chart as it's real based on current holdings

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Asset Allocation */}
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-100 mb-4">Asset Allocation</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={allocationData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {allocationData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                                itemStyle={{ color: '#f3f4f6' }}
                                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Value']}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Portfolio Performance (Mock) */}
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-100 mb-4">Performance History (Simulated)</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={performanceData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#E8BA40" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#E8BA40" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                                itemStyle={{ color: '#E8BA40' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#E8BA40"
                                fillOpacity={1}
                                fill="url(#colorValue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default PortfolioChart;
