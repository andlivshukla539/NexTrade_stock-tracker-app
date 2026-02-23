import type { Metadata } from "next";
import Link from "next/link";
import SignIn from "@/components/auth/sign-in"; // your card component

export const metadata: Metadata = {
    title: "NexTrade — Sign In",
    description: "Sign in to access your dashboard, portfolio, and real-time market intelligence.",
};

// ─── Static ticker data ────────────────────────────────────────────────────────
const TICKERS = [
    { sym: "NVDA", price: "875.40", chg: "+2.31%", up: true },
    { sym: "AAPL", price: "213.07", chg: "+0.94%", up: true },
    { sym: "TSLA", price: "248.50", chg: "−1.22%", up: false },
    { sym: "MSFT", price: "415.32", chg: "+0.69%", up: true },
    { sym: "SPY", price: "538.91", chg: "+0.41%", up: true },
    { sym: "AMD", price: "172.80", chg: "−0.58%", up: false },
    { sym: "GOOG", price: "177.23", chg: "+1.04%", up: true },
    { sym: "META", price: "519.60", chg: "+1.87%", up: true },
    { sym: "AMZN", price: "191.05", chg: "+0.33%", up: true },
    { sym: "BTC", price: "67,240", chg: "+3.11%", up: true },
];

const CHART_STATS = [
    { label: "Open", val: "855.20" },
    { label: "High", val: "881.90" },
    { label: "Low", val: "849.05" },
    { label: "Vol", val: "42.1M" },
];

export default function SignInPage() {
    return (
        /*
         * Full-viewport split layout.
         * Left panel is hidden on mobile, shown on lg+.
         * Right panel is full-width on mobile, half-width on lg+.
         */
        <div className="flex min-h-screen bg-[#080809] overflow-hidden">

            {/* ── Ambient background (both panels) ──────────────────────────── */}
            <div
                aria-hidden
                className="pointer-events-none fixed inset-0 z-0"
                style={{
                    background: [
                        "radial-gradient(ellipse 80% 60% at 20% -10%, rgba(232,197,71,0.07) 0%, transparent 60%)",
                        "radial-gradient(ellipse 60% 80% at 90% 110%, rgba(61,214,140,0.04) 0%, transparent 50%)",
                        "radial-gradient(ellipse 100% 50% at 50% 100%, rgba(100,80,200,0.04) 0%, transparent 60%)",
                    ].join(", "),
                }}
            />

            {/* ═══════════════════════════════════════════════════════════════
                LEFT PANEL
            ═══════════════════════════════════════════════════════════════ */}
            <aside className="hidden lg:flex flex-col flex-1 relative overflow-hidden border-r border-white/[0.05]">

                {/* Subtle panel background */}
                <div
                    aria-hidden
                    className="absolute inset-0 z-0"
                    style={{ background: "linear-gradient(135deg,#0A0A0D 0%,#0D0D11 40%,#111116 100%)" }}
                />

                {/* Fine grid overlay */}
                <div
                    aria-hidden
                    className="absolute inset-0 z-0 opacity-[0.018]"
                    style={{
                        backgroundImage: [
                            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)",
                            "linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
                        ].join(", "),
                        backgroundSize: "64px 64px",
                    }}
                />

                {/* ── Scrolling ticker ──────────────────────────────────────── */}
                <div className="relative z-10 flex items-center h-11 border-b border-white/[0.05] bg-black/40 backdrop-blur-sm overflow-hidden flex-shrink-0">
                    <div className="flex animate-[ticker_32s_linear_infinite] whitespace-nowrap">
                        {[...TICKERS, ...TICKERS].map((t, i) => (
                            <span
                                key={i}
                                className="inline-flex items-center gap-2 px-7 border-r border-white/[0.05] font-mono text-[11px] tracking-wide"
                            >
                                <span className="text-white/30">{t.sym}</span>
                                <span className="text-white/70">{t.price}</span>
                                <span className={t.up ? "text-emerald-400" : "text-red-400"}>{t.chg}</span>
                            </span>
                        ))}
                    </div>
                </div>

                {/* ── Main content area ─────────────────────────────────────── */}
                <div className="relative z-10 flex flex-col flex-1 p-10 xl:p-14">

                    {/* Brand */}
                    <Link href="/" className="flex items-center gap-2.5 w-fit group">
                        <div className="w-9 h-9 rounded-[10px] bg-[#E8C547]/10 flex items-center justify-center flex-shrink-0">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M11 23L17 11L23 23" stroke="#E8C547" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M13.5 19H20.5" stroke="#E8C547" strokeWidth="2.2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <span className="font-serif text-xl font-bold text-[#F0EEE8] group-hover:text-white transition-colors">
                            Nex<span className="text-[#E8C547]">Trade</span>
                        </span>
                    </Link>

                    {/* Live badge */}
                    <div className="mt-6 flex items-center gap-2 w-fit px-3 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)] animate-pulse" />
                        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-400">Markets Open</span>
                    </div>

                    {/* ── Floating chart card ───────────────────────────────── */}
                    <div className="flex-1 flex items-center justify-center relative">

                        {/* Main card */}
                        <div
                            className="
                                w-[320px] bg-[#0F0F12]/90 border border-white/[0.07]
                                rounded-2xl p-5 backdrop-blur-xl
                                shadow-[0_40px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.03)]
                                animate-[float_6s_ease-in-out_infinite]
                            "
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-[10px] bg-emerald-400/10 flex items-center justify-center">
                                        <span className="text-emerald-400 font-mono text-xs font-semibold">N</span>
                                    </div>
                                    <div>
                                        <div className="text-[#F0EEE8] font-semibold text-sm">NVDA</div>
                                        <div className="text-white/30 font-mono text-[10px]">NASDAQ</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[#F0EEE8] font-mono font-medium">$875.40</div>
                                    <div className="text-emerald-400 font-mono text-xs">▲ +2.31%</div>
                                </div>
                            </div>

                            {/* SVG chart */}
                            <svg viewBox="0 0 300 100" className="w-full h-24" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#3DD68C" stopOpacity="0.28" />
                                        <stop offset="100%" stopColor="#3DD68C" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path
                                    d="M0 80 C30 78 60 65 90 55 C120 45 140 70 170 42 C200 14 240 20 270 8 L300 4 L300 100 L0 100 Z"
                                    fill="url(#chartGrad)"
                                />
                                <path
                                    d="M0 80 C30 78 60 65 90 55 C120 45 140 70 170 42 C200 14 240 20 270 8 L300 4"
                                    fill="none" stroke="#3DD68C" strokeWidth="1.8" strokeLinejoin="round"
                                />
                                <circle cx="300" cy="4" r="3" fill="#3DD68C" opacity="0.9">
                                    <animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite" />
                                    <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2s" repeatCount="indefinite" />
                                </circle>
                            </svg>

                            {/* Stats row */}
                            <div className="flex justify-between mt-3">
                                {CHART_STATS.map(({ label, val }) => (
                                    <div key={label} className="text-center">
                                        <div className="text-[9px] text-white/25 uppercase tracking-wider">{label}</div>
                                        <div className="text-[12px] text-[#F0EEE8] font-mono mt-0.5">{val}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Mini card — top right */}
                        <div
                            className="
                                absolute top-[10%] right-[5%]
                                w-[185px] bg-[#0F0F12]/85 border border-white/[0.06]
                                rounded-xl p-3.5 backdrop-blur-lg
                                shadow-[0_20px_40px_rgba(0,0,0,0.4)]
                                animate-[float2_7s_ease-in-out_infinite]
                            "
                        >
                            {[
                                { sym: "AAPL", chg: "+0.94%", up: true },
                                { sym: "TSLA", chg: "−1.22%", up: false },
                            ].map((t) => (
                                <div key={t.sym} className="flex items-center gap-2 mb-2 last:mb-0">
                                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${t.up ? "bg-[#E8C547]" : "bg-red-400"}`} />
                                    <span className="font-mono text-[11px] text-white/30">{t.sym}</span>
                                    <span className={`ml-auto font-mono text-[11px] ${t.up ? "text-[#E8C547]" : "text-red-400"}`}>{t.chg}</span>
                                </div>
                            ))}
                        </div>

                        {/* Mini card — bottom left */}
                        <div
                            className="
                                absolute bottom-[12%] left-[5%]
                                w-[195px] bg-[#0F0F12]/85 border border-white/[0.06]
                                rounded-xl p-3.5 backdrop-blur-lg
                                shadow-[0_20px_40px_rgba(0,0,0,0.4)]
                                animate-[float3_8s_ease-in-out_infinite]
                            "
                        >
                            <div className="text-[9px] text-white/25 uppercase tracking-wider mb-1.5">Portfolio Today</div>
                            <div className="text-emerald-400 font-mono text-lg font-medium">+$1,847</div>
                            <div className="text-white/25 font-mono text-[10px] mt-0.5">+3.18% this session</div>
                        </div>
                    </div>

                    {/* ── Testimonial ───────────────────────────────────────── */}
                    <div className="border-t border-white/[0.05] pt-7">
                        <blockquote className="font-serif text-base italic leading-[1.65] text-white/60 mb-4">
                            <span className="text-[#E8C547] text-4xl leading-[0] align-[-0.4em] mr-1">&ldquo;</span>
                            NexTrade&rsquo;s alerts feel like having a pro trader on my side — I never miss a good entry anymore.
                        </blockquote>
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#E8C547]/40 flex-shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQN8aMqUKz70fxcg1_5qvIJq7sNE7FQpgcE1yrhyLYmSIBTIzTzLHT-YYQlhoAd3MBDF7WWKpMvS3fHLEEA5l1vIkdzNErqFFeEPK7yOifXHob15nThGLEeKfmOFRnFvzi5kn1ROT8wIIIUtv29zEFFNXAICLAXCL_I9D_7oo8MfnsUqFAQjPdb_tlE-2KsFcrXwP8qQihtf6ewEDIlI0ziUe6nMaCmi-8qcJ4Ihp1z0af1OonC7emrRJKCAPzg9oAEU8WaqvHhR-e"
                                    alt="Liam Parker"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <div className="text-[#F0EEE8] text-sm font-semibold">Liam Parker</div>
                                <div className="text-white/30 text-[11px]">Retail Investor · NY</div>
                            </div>
                            <div className="ml-auto text-[#E8C547] text-sm tracking-wider">★★★★★</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ═══════════════════════════════════════════════════════════════
                RIGHT PANEL — sign-in card
            ═══════════════════════════════════════════════════════════════ */}
            <section className="
                w-full lg:w-[480px] xl:w-[520px] flex-shrink-0
                flex flex-col items-center justify-center
                px-5 py-10 relative z-10
                bg-[#080809] lg:border-l-0
            ">
                {/* Mobile brand (hidden on desktop since left panel shows it) */}
                <Link href="/" className="flex items-center gap-2.5 mb-10 lg:hidden">
                    <div className="w-9 h-9 rounded-[10px] bg-[#E8C547]/10 flex items-center justify-center">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M11 23L17 11L23 23" stroke="#E8C547" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M13.5 19H20.5" stroke="#E8C547" strokeWidth="2.2" strokeLinecap="round" />
                        </svg>
                    </div>
                    <span className="font-serif text-xl font-bold text-[#F0EEE8]">
                        Nex<span className="text-[#E8C547]">Trade</span>
                    </span>
                </Link>

                {/* The actual sign-in card component */}
                <SignIn />
            </section>

            {/* ── Animation keyframes (injected globally via next/head or globals.css) ── */}
            <style>{`
                @keyframes ticker {
                    from { transform: translateX(0); }
                    to   { transform: translateX(-50%); }
                }
                @keyframes float {
                    0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
                    50%      { transform: translate(-50%, -50%) translateY(-12px); }
                }
                @keyframes float2 {
                    0%, 100% { transform: translateY(0); }
                    50%      { transform: translateY(-8px); }
                }
                @keyframes float3 {
                    0%, 100% { transform: translateY(0); }
                    50%      { transform: translateY(8px); }
                }
            `}</style>
        </div>
    );
}