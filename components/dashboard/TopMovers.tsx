"use client";

import React from "react";

interface MoverRow {
  name: string;
  changePct: number; // e.g., 3.45 means +3.45%
  sector: string;
}

const gainers: MoverRow[] = [
  { name: "ENPH", changePct: 6.3, sector: "Energy" },
  { name: "SMCI", changePct: 5.1, sector: "Tech" },
  { name: "AMD", changePct: 4.2, sector: "Tech" },
];

const losers: MoverRow[] = [
  { name: "AAPL", changePct: -3.2, sector: "Tech" },
  { name: "NVDA", changePct: -2.8, sector: "Tech" },
  { name: "TSLA", changePct: -2.5, sector: "Auto" },
];

function Table({ title, data }: { title: string; data: MoverRow[] }) {
  return (
    <div className="rounded-lg border border-gray-600 bg-gray-800 p-4">
      <h4 className="text-gray-100 text-sm font-semibold mb-3">{title}</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="text-gray-400 text-xs border-b border-gray-700">
              <th className="py-2 pr-4">Stock</th>
              <th className="py-2 pr-4">Change</th>
              <th className="py-2">Sector</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={`${title}-${row.name}`} className="text-sm text-gray-200 border-b border-gray-700/50">
                <td className="py-2 pr-4 font-medium">{row.name}</td>
                <td className={`py-2 pr-4 font-mono ${row.changePct >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {row.changePct >= 0 ? "+" : ""}
                  {row.changePct.toFixed(2)}%
                </td>
                <td className="py-2">{row.sector}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function TopMovers() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Table title="Top Gainers" data={gainers} />
      <Table title="Top Losers" data={losers} />
    </div>
  );
}
