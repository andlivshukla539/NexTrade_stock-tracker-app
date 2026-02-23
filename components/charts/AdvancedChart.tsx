"use client";
import React, { useEffect, useRef } from "react";
import { createChart, ColorType, CandlestickSeries, AreaSeries } from "lightweight-charts";

export function AdvancedChart({
    data,
    type = 'candlestick' // 'candlestick' or 'area'
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[],
    type?: 'candlestick' | 'area'
}) {
    const chartContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: "transparent" },
                textColor: "#9896A0",
            },
            grid: {
                vertLines: { color: "rgba(255,255,255,0.03)" },
                horzLines: { color: "rgba(255,255,255,0.03)" },
            },
            width: chartContainerRef.current.clientWidth,
            height: 300,
            crosshair: {
                // Change crosshair to feel more premium
                mode: 0,
            },
            rightPriceScale: {
                borderColor: "transparent",
            },
            timeScale: {
                borderColor: "transparent",
                timeVisible: true,
                secondsVisible: false,
            },
        });

        if (type === 'candlestick') {
            const series = chart.addSeries(CandlestickSeries, {
                upColor: '#2ECC8A',
                downColor: '#F0524F',
                borderVisible: false,
                wickUpColor: '#2ECC8A',
                wickDownColor: '#F0524F',
            });
            series.setData(data);
        } else {
            const series = chart.addSeries(AreaSeries, {
                lineColor: '#2ECC8A',
                topColor: 'rgba(46, 204, 138, 0.4)',
                bottomColor: 'rgba(46, 204, 138, 0.0)',
                lineWidth: 2,
            });
            series.setData(data);
        }

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [data, type]);

    return (
        <div ref={chartContainerRef} style={{ width: "100%", height: "300px" }} />
    );
}
