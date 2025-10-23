"use client";

import React from "react";

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

function labelForScore(score: number) {
  if (score >= 66) return "Greedy";
  if (score <= 33) return "Fearful";
  return "Neutral";
}

export default function SentimentRadar() {
  const score = 48; // mock 0-100
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const pct = clamp(score) / 100;
  const dash = circumference * pct;

  return (
    <div className="rounded-lg border border-gray-600 bg-gray-800 p-4">
      <h3 className="text-gray-100 text-lg font-semibold mb-4">Sentiment Radar</h3>
      <div className="flex items-center gap-6">
        <svg width="140" height="140" viewBox="0 0 140 140" className="shrink-0">
          <circle
            cx="70"
            cy="70"
            r={radius}
            className="stroke-gray-700"
            strokeWidth="10"
            fill="none"
          />
          <circle
            cx="70"
            cy="70"
            r={radius}
            strokeLinecap="round"
            className="stroke-yellow-500"
            strokeWidth="10"
            fill="none"
            strokeDasharray={`${dash} ${circumference}`}
            transform="rotate(-90 70 70)"
          />
          <text x="70" y="65" textAnchor="middle" className="fill-gray-200 text-[14px] font-semibold">
            {score}/100
          </text>
          <text x="70" y="85" textAnchor="middle" className="fill-gray-400 text-[12px]">
            {labelForScore(score)}
          </text>
        </svg>
        <div className="flex-1">
          <div className="text-sm text-gray-400 mb-2">Market Sentiment</div>
          <div className="text-gray-100 text-base font-medium">
            Market Sentiment: {labelForScore(score)} ({score}/100)
          </div>
          <ul className="mt-3 space-y-1 text-sm text-gray-400 list-disc pl-5">
            <li>Fed minutes indicate cautious tone; yields ease.</li>
            <li>AI-chip names consolidate after strong quarter.</li>
            <li>Energy outperforms on crude strength.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
