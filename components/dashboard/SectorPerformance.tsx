"use client";

import React from "react";

const sectors = [
    { name: "Tech", pct: -1.2, color: "#60A5FA" },
    { name: "Finance", pct: 0.8, color: "#34D399" },
    { name: "Energy", pct: 1.6, color: "#F59E0B" },
    { name: "Health", pct       : 0.3, color: "#A78BFA" },
];

export default function SectorPerformance() {
    const maxAbs = Math.max(...sectors.map((s) => Math.abs(s.pct))) || 1;

    return (
        <div className="rounded-lg border border-gray-600 bg-gray-800 p-4">
            <h3 className="text-gray-100 text-lg font-semibold mb-4">
                Sector Performance
            </h3>
            <div className="space-y-3">
                {sectors.map((s) => {
                    const widthPct = Math.max(6, (Math.abs(s.pct) / maxAbs) * 100);
                    const isPos = s.pct >= 0;
                    return (
                        <div key={s.name} className="w-full">
                            <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-gray-300 font-medium">{s.name}</span>
                                <span className={isPos ? "text-green-400" : "text-red-400"}>
                    {isPos ? "+" : ""}
                                    {s.pct.toFixed(1)}%
                  </span>
                            </div>
                            <div className="h-2.5 w-full bg-gray-700/60 rounded">
                                <div
                                    className={`h-2.5 rounded ${
                                        isPos ? "bg-green-500" : "bg-red-500"
                                    }`}
                                    style={{ width: `${widthPct}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
