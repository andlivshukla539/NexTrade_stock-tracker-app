"use client";

import React, { useEffect, useState } from "react";
import Joyride, { Step } from "react-joyride";

const steps: Step[] = [
    {
        target: "body",
        placement: "center",
        content: "Welcome to NexTrade! Let's take a quick tour of your new premium trading dashboard.",
        title: "Welcome aboard 👋",
    },
    {
        target: "#cmd-palette-btn",
        content: "Hit Cmd+K (or Ctrl+K) anywhere to instantly search for stocks and navigate the platform.",
        title: "Lightning Fast Search",
        placement: "bottom",
    },
    {
        target: "#sidebar-nav",
        content: "Access your paper portfolio, advanced watchlists, and the new AI-powered News Feed here.",
        title: "Navigation Center",
        placement: "right",
    },
    {
        target: "#main-chart-panel",
        content: "Professional-grade candlestick charts powered by Lightweight Charts, fully real-time during market hours.",
        title: "Real-time Markets",
        placement: "top",
    },
    {
        target: "#right-sidebar-panel",
        content: "Your Quick Trade panel. Execute paper trades instantly without leaving the dashboard.",
        title: "Paper Trading",
        placement: "left",
    }
];

export default function Tour() {
    const [mounted, setMounted] = useState(false);
    const [run, setRun] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Give the UI a moment to render fully before starting tour
        const timer = setTimeout(() => {
            const hasSeen = localStorage.getItem("nextrade_tour_seen");
            if (!hasSeen) setRun(true);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const handleJoyrideCallback = (data: { status: string }) => {
        const finishedStatuses = ["finished", "skipped"];
        if (finishedStatuses.includes(data.status)) {
            setRun(false);
            localStorage.setItem("nextrade_tour_seen", "true");
        }
    };

    // Only render on the client — Joyride injects its own className/styles
    // that the server cannot predict, causing a hydration mismatch.
    if (!mounted) return null;

    return (
        <Joyride
            steps={steps}
            run={run}
            continuous
            showProgress
            showSkipButton
            callback={handleJoyrideCallback}
            styles={{
                options: {
                    primaryColor: "var(--nt-gold)",
                    textColor: "#EAEAEA",
                    backgroundColor: "#131316",
                    arrowColor: "#131316",
                    overlayColor: "rgba(0, 0, 0, 0.75)",
                    zIndex: 10000,
                },
                tooltipContainer: { textAlign: "left" },
                buttonNext: {
                    background: "var(--nt-gold)",
                    color: "#080810",
                    fontWeight: 700,
                    borderRadius: 8,
                    fontFamily: "var(--font-syne)"
                },
                buttonBack: { color: "var(--nt-txt3)", fontFamily: "var(--font-syne)" },
                buttonSkip: { color: "var(--nt-txt3)", fontFamily: "var(--font-syne)" }
            }}
        />
    );
}
