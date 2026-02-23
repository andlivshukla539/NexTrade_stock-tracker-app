'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import Image from 'next/image';
import SelectField from '@/components/forms/SelectField';
import { INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS } from '@/lib/constants';
import { CountrySelectField } from '@/components/forms/CountrySelectField';
import { signUpWithEmail } from '@/lib/actions/auth.actions';
import { getPlatformStats } from '@/lib/actions/user.actions';
import { toast } from 'sonner';

// ─── Types ────────────────────────────────────────────────────────────────────
const STEP_FIELDS: Record<number, (keyof SignUpFormData)[]> = {
    1: ['fullName', 'email', 'password'],
    2: ['country', 'investmentGoals'],
    3: ['riskTolerance', 'preferredIndustry'],
};

// ─── Password Strength ────────────────────────────────────────────────────────
function getStrength(p: string) {
    let s = 0;
    if (p.length >= 8) s++;
    if (p.length >= 12) s++;
    if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++;
    if (/\d/.test(p)) s++;
    if (/[^a-zA-Z\d]/.test(p)) s++;
    const levels = [
        { label: 'Weak', color: '#FF4D6D' },
        { label: 'Fair', color: '#FF8C42' },
        { label: 'Good', color: '#E8C547' },
        { label: 'Strong', color: '#00E5A0' },
        { label: 'Excellent', color: '#00E5A0' },
    ];
    return { ...levels[Math.max(0, Math.min(s - 1, 4))], score: s };
}

// ─── Inline styles ────────────────────────────────────────────────────────────
const C = {
    gold: '#E8C547', green: '#00E5A0', red: '#FF4D6D', blue: '#4D9EFF', purple: '#9B6EFF',
    bg: '#080810', s1: '#0d0d18',
    border: 'rgba(255,255,255,0.07)', border2: 'rgba(255,255,255,0.14)',
    txt: '#F2F0FF', txt2: 'rgba(242,240,255,0.58)', txt3: 'rgba(242,240,255,0.3)', txt4: 'rgba(242,240,255,0.12)',
    goldDim: 'rgba(232,197,71,0.1)', goldBorder: 'rgba(232,197,71,0.3)', goldGlow: 'rgba(232,197,71,0.25)',
    greenDim: 'rgba(0,229,160,0.1)', greenBorder: 'rgba(0,229,160,0.25)', greenGlow: 'rgba(0,229,160,0.22)',
    redDim: 'rgba(255,77,109,0.1)', redBorder: 'rgba(255,77,109,0.25)',
    blueDim: 'rgba(77,158,255,0.1)', purpleDim: 'rgba(155,110,255,0.1)',
    s2: 'rgba(255,255,255,0.032)', s3: 'rgba(255,255,255,0.055)', s4: 'rgba(255,255,255,0.08)',
};


// ─── Left Panel ───────────────────────────────────────────────────────────────
const FEATURES = [
    { icon: '⚡', title: 'Real-Time Data', desc: 'Sub-millisecond market data across 40,000+ instruments globally', bg: C.goldDim, col: C.gold },
    { icon: '🛡', title: 'Bank-Grade Security', desc: '256-bit encryption, 2FA, biometric auth and SOC2 certified', bg: C.greenDim, col: C.green },
    { icon: '🤖', title: 'AI Portfolio Engine', desc: 'Personalized insights powered by machine learning signals', bg: C.blueDim, col: C.blue },
    { icon: '📊', title: 'Advanced Analytics', desc: 'Pro-grade charts, screeners and risk analysis tools', bg: C.purpleDim, col: C.purple },
];

const TICKERS = [
    { sym: 'NVDA', price: '$875.40', chg: '+2.31%', up: true, col: '#22C55E' },
    { sym: 'AAPL', price: '$213.07', chg: '+0.94%', up: true, col: '#94A3B8' },
    { sym: 'TSLA', price: '$248.50', chg: '−1.22%', up: false, col: '#EF4444' },
    { sym: 'GOOG', price: '$177.23', chg: '+4.01%', up: true, col: '#F59E0B' },
    { sym: 'BTC', price: '$67,240', chg: '+3.11%', up: true, col: '#F7931A' },
];

function LeftPanel() {
    return (
        <aside style={{ padding: '40px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 24, alignSelf: 'stretch' }}>
            <div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.txt3, marginBottom: 12 }}>Why NexTrade</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {FEATURES.map(f => (
                        <div key={f.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 12, background: C.s2, border: `1px solid ${C.border}`, borderRadius: 13, transition: 'all 0.2s', cursor: 'default' }}
                            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = C.s3; el.style.borderColor = C.border2; el.style.transform = 'translateX(4px)'; }}
                            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = C.s2; el.style.borderColor = C.border; el.style.transform = ''; }}
                        >
                            <div style={{ width: 34, height: 34, borderRadius: 9, background: f.bg, color: f.col, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>{f.icon}</div>
                            <div>
                                <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 2, color: C.txt }}>{f.title}</div>
                                <div style={{ fontSize: 11, color: C.txt3, lineHeight: 1.45, fontWeight: 500 }}>{f.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mini Ticker */}
            <div style={{ padding: 13, background: C.s2, border: `1px solid ${C.border}`, borderRadius: 14, display: 'flex', flexDirection: 'column', gap: 7 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.txt4, marginBottom: 3 }}>Live Markets</div>
                {TICKERS.map(t => (
                    <div key={t.sym} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 22, height: 22, borderRadius: 6, background: t.col + '1a', color: t.col, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono',monospace", fontSize: 8, fontWeight: 700, flexShrink: 0 }}>{t.sym.slice(0, 2)}</div>
                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700, flex: 1, color: C.txt }}>{t.sym}</div>
                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 600, color: t.up ? C.green : C.red }}>{t.price}</div>
                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 5, background: t.up ? C.greenDim : C.redDim, color: t.up ? C.green : C.red }}>{t.chg}</div>
                    </div>
                ))}
            </div>
        </aside>
    );
}

const TESTIMONIALS = [
    { quote: 'NexTrade replaced my Bloomberg terminal. The AI insights are genuinely uncanny — it flagged NVDA two weeks before the run-up.', name: 'Marcus R.', role: 'Hedge Fund PM · London', av: 'MR', avBg: C.goldDim, avCol: C.gold },
    { quote: 'Clean, fast, and smarter than anything else I\'ve tried. Best onboarding I\'ve seen for a trading app, period.', name: 'Sarah K.', role: 'Retail investor · Austin, TX', av: 'SK', avBg: C.greenDim, avCol: C.green },
];

function RightPanel({ stats }: { stats: { activeTraders: number, avgReturn: string, instruments: string } }) {
    const STATS = [
        { label: 'Active Traders', val: stats.activeTraders ? `${stats.activeTraders.toLocaleString()}+` : 'Loading...', sub: 'Joined in the last 30 days', col: C.gold, accent: `linear-gradient(90deg,transparent,${C.gold},transparent)` },
        { label: 'Avg Portfolio Return', val: stats.avgReturn, sub: 'Year-to-date · 2026', col: C.green, accent: `linear-gradient(90deg,transparent,${C.green},transparent)` },
        { label: 'Instruments Tracked', val: stats.instruments, sub: 'Stocks · ETFs · Crypto · Forex', col: C.blue, accent: `linear-gradient(90deg,transparent,${C.blue},transparent)` },
    ];
    return (
        <aside style={{ padding: '40px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16, alignSelf: 'stretch' }}>
            {STATS.map(s => (
                <div key={s.label} style={{ background: C.s2, border: `1px solid ${C.border}`, borderRadius: 13, padding: 16, position: 'relative', overflow: 'hidden', transition: 'all 0.2s', cursor: 'default' }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = C.s3; el.style.borderColor = C.border2; el.style.transform = 'translateX(-4px)'; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = C.s2; el.style.borderColor = C.border; el.style.transform = ''; }}
                >
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1.5, background: s.accent, opacity: 0.6 }} />
                    <div style={{ position: 'absolute', bottom: -20, right: -20, width: 70, height: 70, borderRadius: '50%', background: s.col, opacity: 0.08, filter: 'blur(20px)' }} />
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.txt3, marginBottom: 5 }}>{s.label}</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 24, fontWeight: 700, color: s.col, marginBottom: 3 }}>{s.val}</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: C.txt3 }}>{s.sub}</div>
                </div>
            ))}
            {TESTIMONIALS.map(t => (
                <div key={t.name} style={{ background: C.s2, border: `1px solid ${C.border}`, borderRadius: 13, padding: 16, transition: 'all 0.2s', cursor: 'default' }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = C.s3; el.style.borderColor = C.border2; el.style.transform = 'translateX(-4px)'; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = C.s2; el.style.borderColor = C.border; el.style.transform = ''; }}
                >
                    <div style={{ fontSize: 12.5, color: C.txt2, lineHeight: 1.6, marginBottom: 12, fontStyle: 'italic' }}>
                        <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: C.gold, lineHeight: 1, display: 'block', marginBottom: 2 }}>&quot;</span>
                        {t.quote}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: t.avBg, color: t.avCol, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{t.av}</div>
                        <div>
                            <div style={{ fontSize: 11.5, fontWeight: 700, color: C.txt }}>{t.name}</div>
                            <div style={{ fontSize: 10, color: C.txt3 }}>{t.role}</div>
                        </div>
                    </div>
                </div>
            ))}
        </aside>
    );
}

// ─── Step Bar ─────────────────────────────────────────────────────────────────
const STEPS_META = [
    { label: 'Identity', icon: '⬡' },
    { label: 'Profile', icon: '◈' },
    { label: 'Strategy', icon: '⬢' },
];

function StepBar({ current }: { current: number }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', padding: '20px 32px', borderBottom: `1px solid ${C.border}` }}>
            {STEPS_META.map((s, i) => {
                const n = i + 1;
                const done = current > n;
                const active = current === n;
                return (
                    <React.Fragment key={n}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, position: 'relative', zIndex: 1 }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, transition: 'all 0.35s',
                                background: done ? C.greenDim : active ? C.goldDim : C.s2,
                                border: done ? `1px solid ${C.greenBorder}` : active ? `1.5px solid ${C.goldBorder}` : `1px solid ${C.border}`,
                                color: done ? C.green : active ? C.gold : C.txt4,
                                boxShadow: active ? `0 0 18px ${C.goldGlow}` : 'none',
                            }}>
                                {done ? '✓' : s.icon}
                            </div>
                            <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: done ? C.green : active ? C.gold : C.txt3, whiteSpace: 'nowrap' }}>{s.label}</span>
                        </div>
                        {i < STEPS_META.length - 1 && (
                            <div style={{ flex: 1, height: 2, background: C.s4, margin: '0 8px', marginBottom: 22, borderRadius: 2, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: done ? '100%' : '0%', background: `linear-gradient(90deg,${C.green},${C.gold})`, borderRadius: 2, transition: 'width 0.6s cubic-bezier(.32,.72,0,1)' }} />
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

// ─── Success Screen ───────────────────────────────────────────────────────────
function SuccessScreen() {
    return (
        <div style={{ padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', minHeight: 320, justifyContent: 'center' }}>
            <div style={{ width: 88, height: 88, borderRadius: 22, background: C.goldDim, border: `1px solid ${C.goldBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, marginBottom: 22, boxShadow: `0 0 40px rgba(232,197,71,0.15)`, position: 'relative' }}>
                📧
                <div style={{ position: 'absolute', inset: -6, borderRadius: 26, border: `1.5px solid ${C.gold}`, animation: 'successRing 1.4s ease-out infinite' }} />
            </div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 10, color: C.txt }}>
                Check your <em style={{ color: C.gold, fontStyle: 'italic' }}>Inbox!</em>
            </div>
            <div style={{ fontSize: 13, color: C.txt2, lineHeight: 1.65, marginBottom: 24, maxWidth: 280 }}>
                We&apos;ve sent a verification link to your email.<br />
                Click it to activate your NexTrade account.
            </div>
            <div style={{ padding: '12px 20px', background: C.s2, border: `1px solid ${C.border}`, borderRadius: 11, fontSize: 11.5, color: C.txt3, lineHeight: 1.6 }}>
                💡 Didn&apos;t receive it? Check your spam folder.
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const SignUp = () => {
    const [step, setStep] = useState(1);
    const [success, setSuccess] = useState(false);
    const [pwdVal, setPwdVal] = useState('');
    const [platformStats, setPlatformStats] = useState({ activeTraders: 0, avgReturn: '--', instruments: '--' });

    useEffect(() => {
        getPlatformStats().then(setPlatformStats).catch(console.error);
    }, []);

    const { register, handleSubmit, control, trigger, watch, formState: { errors, isSubmitting } } = useForm<SignUpFormData>({
        defaultValues: { fullName: '', email: '', password: '', country: 'US', investmentGoals: 'Growth', riskTolerance: 'Medium', preferredIndustry: 'Technology' },
        mode: 'onBlur',
    });

    const passwordValue = watch('password') ?? '';
    useEffect(() => { setPwdVal(passwordValue); }, [passwordValue]);

    const goNext = useCallback(async () => {
        const valid = await trigger(STEP_FIELDS[step]);
        if (valid && step < 3) setStep(s => s + 1);
    }, [step, trigger]);

    const goBack = useCallback(() => { if (step > 1) setStep(s => s - 1); }, [step]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Enter' && step < 3 && !e.shiftKey) { e.preventDefault(); goNext(); } };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [goNext, step]);

    const onSubmit = async (data: SignUpFormData) => {
        try {
            const result = await signUpWithEmail(data);
            if (result.success) {
                setSuccess(true);
                // No redirect — show the 'check your email' success screen in-place
            } else {
                toast.error(result.error || 'Sign up failed. Please try again.');
            }
        } catch (e) {
            toast.error(e instanceof Error ? e.message : 'An unexpected error occurred.');
        }
    };

    // Password strength UI
    const strength = getStrength(pwdVal);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700&family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
                @keyframes drift{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(30px,-40px) scale(1.08)}66%{transform:translate(-20px,25px) scale(.94)}}
                @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
                @keyframes pulse-ring{0%,100%{transform:scale(1);opacity:.3}50%{transform:scale(1.15);opacity:0}}
                @keyframes successRing{0%{transform:scale(1);opacity:.5}100%{transform:scale(1.4);opacity:0}}
                @keyframes progressFill{from{width:0%}to{width:100%}}
                @keyframes stepIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
                .nt-form-input{width:100%;padding:11px 15px;background:rgba(255,255,255,0.055);border:1px solid rgba(255,255,255,0.07);border-radius:11px;font-family:'Syne',sans-serif;font-size:13px;font-weight:500;color:#F2F0FF;outline:none;transition:all 0.18s;box-sizing:border-box}
                .nt-form-input:focus{border-color:rgba(232,197,71,0.3);background:rgba(232,197,71,0.1);box-shadow:0 0 0 3px rgba(232,197,71,0.08)}
                .nt-form-input::placeholder{color:rgba(242,240,255,0.12);font-weight:400}
                .nt-label{display:block;font-size:9.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(242,240,255,0.3);margin-bottom:7px}
                .nt-field{margin-bottom:18px}
                .nt-field-error{font-size:10.5px;color:#FF4D6D;font-weight:600;margin-top:5px}
                .nt-step-panel{animation:stepIn 0.4s cubic-bezier(.25,.46,.45,.94) both}
                .nt-feature-hover:hover{background:rgba(255,255,255,0.055)!important;border-color:rgba(255,255,255,0.14)!important;transform:translateX(4px)!important}
                
                /* Shadcn overrides to match nt-form-input exactly */
                .form-label { font-size: 9.5px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(242,240,255,0.3); margin-bottom: 7px; display: block; }
                .select-trigger { width: 100%; height: auto; padding: 11px 15px; background: rgba(255,255,255,0.055); border: 1px solid rgba(255,255,255,0.07); border-radius: 11px; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 500; color: #F2F0FF; outline: none; transition: all 0.18s; box-shadow: none; }
                .select-trigger:focus { border-color: rgba(232,197,71,0.3); background: rgba(232,197,71,0.1); box-shadow: 0 0 0 3px rgba(232,197,71,0.08); ring: 0; outline: none; }
                .select-trigger > span { opacity: 0.8; }
                
                /* override default auth shell to fill viewport */
                html,body{background:#080810!important;color:#F2F0FF!important;font-family:'Syne',sans-serif!important}
            `}</style>

            {/* Ambient orbs */}
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
                <div style={{ position: 'absolute', width: 500, height: 500, top: -150, left: -100, borderRadius: '50%', background: 'rgba(232,197,71,0.055)', filter: 'blur(80px)', animation: 'drift 18s ease-in-out infinite' }} />
                <div style={{ position: 'absolute', width: 380, height: 380, bottom: -80, right: -60, borderRadius: '50%', background: 'rgba(0,229,160,0.04)', filter: 'blur(80px)', animation: 'drift 22s ease-in-out infinite', animationDelay: '-6s' }} />
                <div style={{ position: 'absolute', width: 280, height: 280, top: '40%', left: '50%', borderRadius: '50%', background: 'rgba(77,158,255,0.03)', filter: 'blur(80px)', animation: 'drift 16s ease-in-out infinite', animationDelay: '-3s' }} />
            </div>
            {/* Grid overlay */}
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)', backgroundSize: '48px 48px', maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%,black 40%,transparent 100%)' }} />

            {/* Page wrapper */}
            <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 500px 1fr', gridTemplateRows: 'auto 1fr auto', background: C.bg, fontFamily: "'Syne',sans-serif", color: C.txt }}>

                {/* ── TOPBAR ── */}
                <header style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', padding: '0 32px', height: 52, background: 'rgba(8,8,16,0.8)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${C.border}` }}>
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', textDecoration: 'none' }}>
                        <Image src="/assets/icons/logo.svg" alt="NexTrade logo" width={140} height={32} style={{ height: '32px', width: 'auto' }} />
                    </Link>
                    <div style={{ marginLeft: 'auto', fontSize: 12.5, color: C.txt3 }}>
                        Already have an account?&nbsp;&nbsp;<Link href="/sign-in" style={{ color: C.gold, fontWeight: 700, textDecoration: 'none' }}>Sign in →</Link>
                    </div>
                </header>

                {/* ── LEFT PANEL ── */}
                <div style={{ gridColumn: 1, gridRow: 2 }}>
                    <LeftPanel />
                </div>

                {/* ── CENTER: SIGNUP CARD ── */}
                <div style={{ gridColumn: 2, gridRow: 2, padding: '28px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '100%', background: 'rgba(13,13,24,0.7)', backdropFilter: 'blur(24px)', border: `1px solid ${C.border}`, borderRadius: 22, overflow: 'hidden', position: 'relative' }}>
                        {/* Top accent line */}
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent 0%,${C.gold} 30%,${C.green} 70%,transparent 100%)`, opacity: 0.7 }} />

                        {/* Card Header */}
                        <div style={{ padding: '28px 32px 24px', borderBottom: `1px solid ${C.border}`, position: 'relative' }}>
                            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.txt3, marginBottom: 8 }}>New Account · Free Forever</div>
                            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 6, color: C.txt }}>
                                Start Your <em style={{ color: C.gold, fontStyle: 'italic' }}>Journey</em>
                            </div>
                            <div style={{ fontSize: 12.5, color: C.txt3, fontWeight: 500 }}>Create your account in 3 quick steps</div>
                            <div style={{ position: 'absolute', top: 28, right: 32, display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 11px', borderRadius: 100, background: C.goldDim, border: `1px solid ${C.goldBorder}`, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.gold }}>
                                <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.gold, animation: 'blink 1.8s ease-in-out infinite' }} />
                                No card required
                            </div>
                        </div>

                        {/* Step Bar */}
                        <StepBar current={step} />

                        {/* Form Body */}
                        {success ? <SuccessScreen /> : (
                            <>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div style={{ padding: '26px 32px 0', minHeight: 300 }}>
                                        <div className="nt-step-panel" key={step}>

                                            {/* STEP 1 */}
                                            {step === 1 && (
                                                <div>
                                                    <div className="nt-field">
                                                        <label className="nt-label">Full Name</label>
                                                        <input type="text" className="nt-form-input" placeholder="John Doe" {...register('fullName', { required: 'Full name is required', minLength: { value: 2, message: 'At least 2 characters' } })} autoComplete="name" autoFocus />
                                                        {errors.fullName && <div className="nt-field-error">{errors.fullName.message}</div>}
                                                    </div>
                                                    <div className="nt-field">
                                                        <label className="nt-label">Email</label>
                                                        <input type="email" className="nt-form-input" placeholder="you@company.com" {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' } })} autoComplete="email" />
                                                        {errors.email && <div className="nt-field-error">{errors.email.message}</div>}
                                                    </div>
                                                    <div className="nt-field">
                                                        <label className="nt-label">Password</label>
                                                        <input type="password" className="nt-form-input" placeholder="Min 8 chars · upper · lower · number" {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'At least 8 characters' }, pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: 'Need uppercase, lowercase & a number' } })} autoComplete="new-password" />
                                                        {errors.password && <div className="nt-field-error">{errors.password.message}</div>}
                                                    </div>
                                                    {/* Password meter */}
                                                    {pwdVal.length > 0 && (
                                                        <div style={{ marginTop: 8, marginBottom: 18 }}>
                                                            <div style={{ display: 'flex', gap: 3, marginBottom: 5 }}>
                                                                {[1, 2, 3, 4, 5].map(i => (
                                                                    <div key={i} style={{ height: 3, flex: 1, borderRadius: 3, background: i <= strength.score ? strength.color : C.s4, transition: `all 0.4s ease ${(i - 1) * 0.05}s` }} />
                                                                ))}
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono',monospace", fontSize: 10 }}>
                                                                <span style={{ fontWeight: 700, color: strength.color }}>{strength.label}</span>
                                                                <span style={{ color: C.txt4 }}>{pwdVal.length} chars</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* STEP 2 */}
                                            {step === 2 && (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                                                    <CountrySelectField name="country" label="Country" control={control} error={errors.country} required />
                                                    <SelectField name="investmentGoals" label="Investment Goals" placeholder="Select your primary goal" options={INVESTMENT_GOALS} control={control} error={errors.investmentGoals} required />
                                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '13px 15px', background: C.s2, border: `1px solid ${C.border}`, borderRadius: 13, marginTop: 4 }}>
                                                        <div style={{ width: 36, height: 36, borderRadius: 10, background: C.goldDim, color: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>✦</div>
                                                        <div>
                                                            <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 2, color: C.txt }}>Personalized Insights</div>
                                                            <div style={{ fontSize: 11, color: C.txt3, lineHeight: 1.45, fontWeight: 500 }}>We tailor every recommendation to your goals — no two portfolios look alike on NexTrade.</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* STEP 3 */}
                                            {step === 3 && (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                                                    <SelectField name="riskTolerance" label="Risk Tolerance" placeholder="Select your risk level" options={RISK_TOLERANCE_OPTIONS} control={control} error={errors.riskTolerance} required />
                                                    <SelectField name="preferredIndustry" label="Preferred Industry" placeholder="Select primary sector" options={PREFERRED_INDUSTRIES} control={control} error={errors.preferredIndustry} required />
                                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '13px 15px', background: C.s2, border: `1px solid ${C.border}`, borderRadius: 13, marginTop: 4 }}>
                                                        <div style={{ width: 36, height: 36, borderRadius: 10, background: C.greenDim, color: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🛡</div>
                                                        <div>
                                                            <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 2, color: C.txt }}>You&apos;re Almost There!</div>
                                                            <div style={{ fontSize: 11, color: C.txt3, lineHeight: 1.45, fontWeight: 500 }}>One click away from AI-powered investing insights tailored exactly to you.</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Form Footer */}
                                    <div style={{ padding: '20px 32px 24px', borderTop: `1px solid ${C.border}`, marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                            {step > 1 && (
                                                <button type="button" onClick={goBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '12px 18px', borderRadius: 12, background: C.s2, border: `1px solid ${C.border}`, color: C.txt2, fontSize: 12.5, fontWeight: 700, cursor: 'pointer', fontFamily: "'Syne',sans-serif", transition: 'all 0.18s', whiteSpace: 'nowrap' }}
                                                    onMouseEnter={e => { const el = e.currentTarget; el.style.background = C.s3; el.style.borderColor = C.border2; el.style.color = C.txt; }}
                                                    onMouseLeave={e => { const el = e.currentTarget; el.style.background = C.s2; el.style.borderColor = C.border; el.style.color = C.txt2; }}
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
                                                    Back
                                                </button>
                                            )}
                                            {step < 3 ? (
                                                <button type="button" onClick={goNext} style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px 24px', borderRadius: 12, background: C.gold, color: '#080810', fontSize: 13, fontWeight: 800, cursor: 'pointer', border: 'none', fontFamily: "'Syne',sans-serif", boxShadow: `0 4px 22px ${C.goldGlow}`, transition: 'all 0.2s' }}
                                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 8px 30px ${C.goldGlow}`; }}
                                                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `0 4px 22px ${C.goldGlow}`; }}
                                                >
                                                    Continue
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
                                                </button>
                                            ) : (
                                                <button type="submit" disabled={isSubmitting} style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px 24px', borderRadius: 12, background: `linear-gradient(135deg,${C.gold},#F5D76E)`, color: '#080810', fontSize: 13, fontWeight: 800, cursor: isSubmitting ? 'not-allowed' : 'pointer', border: 'none', fontFamily: "'Syne',sans-serif", opacity: isSubmitting ? 0.5 : 1, boxShadow: `0 4px 22px ${C.goldGlow}`, transition: 'all 0.2s' }}>
                                                    {isSubmitting ? (
                                                        <><span style={{ width: 18, height: 18, border: '2.5px solid rgba(8,8,16,0.3)', borderTopColor: '#080810', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} /> Creating Account…</>
                                                    ) : (
                                                        <>🚀 Launch My Journey</>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                        {step < 3 && (
                                            <div style={{ textAlign: 'center', fontSize: 10.5, color: C.txt4 }}>
                                                Press <kbd style={{ display: 'inline-block', padding: '1px 7px', background: C.s4, border: `1px solid ${C.border}`, borderRadius: 5, fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, color: C.txt3 }}>Enter ↵</kbd> to continue
                                            </div>
                                        )}
                                        <div style={{ textAlign: 'center', fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: C.txt4 }}>Step {step} of 3</div>
                                        <div style={{ textAlign: 'center', fontSize: 12, color: C.txt3 }}>
                                            Already have an account?{' '}
                                            <Link href="/sign-in" style={{ color: C.gold, fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
                                        </div>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>

                {/* ── RIGHT PANEL ── */}
                <div style={{ gridColumn: 3, gridRow: 2 }}>
                    <RightPanel stats={platformStats} />
                </div>

                {/* ── BOTTOM TRUST BAR ── */}
                <div style={{ gridColumn: '1/-1', gridRow: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '14px 32px', borderTop: `1px solid ${C.border}`, fontSize: 11, color: C.txt4 }}>
                    {[['🔒', '256-bit encryption'], ['✓', 'SOC 2 Type II certified'], ['🛡', 'SIPC protected'], ['⚡', 'Real-time data']].map(([icon, label], i, arr) => (
                        <React.Fragment key={label}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}><span style={{ fontSize: 12 }}>{icon}</span>{label}</div>
                            {i < arr.length - 1 && <span style={{ opacity: 0.3 }}>·</span>}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </>
    );
};

export default SignUp;