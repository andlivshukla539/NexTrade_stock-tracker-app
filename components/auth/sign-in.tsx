'use client';

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Eye, EyeOff, ArrowRight } from "lucide-react";
import { signInWithEmail } from "@/lib/actions/auth.actions";
import { authClient } from "@/lib/better-auth/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

const Schema = z.object({
    email: z.string().email("Enter a valid email"),
    password: z.string().min(1, "Password is required"),
    remember: z.boolean().optional(),
});
type FormData = z.infer<typeof Schema>;

// ── Small SVG icons ────────────────────────────────────────────────────────────

function GoogleG() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
    );
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function SignIn() {
    const router = useRouter();
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(Schema),
    });

    const onSubmit = useCallback(async (data: FormData) => {
        setLoading(true); setError(null);
        const res = await signInWithEmail(data);
        setLoading(false);
        if (res.success) { router.push("/"); router.refresh(); }
        else setError(res.error || "Sign in failed. Please try again.");
    }, [router]);

    const social = useCallback(async (provider: "google" | "apple") => {
        setLoading(true); setError(null);
        try { await authClient.signIn.social({ provider, callbackURL: "/" }); }
        catch { setError(`${provider} sign-in failed.`); setLoading(false); }
    }, []);

    return (
        <motion.div
            className="w-full"
            style={{ maxWidth: 480 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >

            {/* ── Top badges ── */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E8C547]/30 bg-[#E8C547]/[0.07]">
                    {/* shield icon */}
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#E8C547" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#E8C547]">Secure Portal</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-400">Encrypted</span>
                </div>
            </div>

            {/* ── Heading ── */}
            <div className="mb-8">
                <h1
                    className="font-serif font-extrabold leading-[1.05] mb-1"
                    style={{ fontSize: "clamp(2.6rem, 6vw, 3.4rem)", color: "#F0EEE8" }}
                >
                    Welcome<br />
                    <span>back</span>
                    <span style={{ color: "#E8C547" }}>.</span>
                </h1>
                {/* gold underline */}
                <div className="mt-3 mb-5 h-[2px] w-14 rounded-full bg-gradient-to-r from-[#E8C547] to-[#B89A30]" />
                <p className="text-[15px] leading-relaxed" style={{ color: "#A3A3A3" }}>
                    Access your dashboard, portfolio &amp;<br />real-time market intelligence.
                </p>
            </div>

            {/* ── Social buttons ── */}
            <div className="mb-7">
                <button
                    type="button"
                    onClick={() => social("google")}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white font-semibold text-sm transition-all duration-200 disabled:opacity-50"
                >
                    <GoogleG />
                    Continue with Google
                </button>
            </div>

            {/* ── Divider ── */}
            <div className="flex items-center gap-4 mb-7">
                <div className="flex-1 h-px bg-white/[0.07]" />
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase" style={{ color: "#525252" }}>
                    or continue with email
                </span>
                <div className="flex-1 h-px bg-white/[0.07]" />
            </div>

            {/* ── Error ── */}
            {error && (
                <div className="mb-5 flex items-center gap-2 p-3.5 rounded-xl bg-red-500/[0.08] border border-red-500/20 text-red-400 text-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {error}
                </div>
            )}

            {/* ── Form ── */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                {/* Email */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#A3A3A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                        <label htmlFor="email" className="text-[11px] font-bold uppercase tracking-[0.15em]" style={{ color: "#A3A3A3" }}>
                            Email Address
                        </label>
                    </div>
                    <input
                        {...register("email")}
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        autoComplete="email"
                        className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-200 border"
                        style={{
                            background: "#18181C",
                            border: errors.email ? "1px solid rgba(248,113,113,0.4)" : "1px solid rgba(255,255,255,0.07)",
                            color: "#F0EEE8",
                        }}
                        onFocus={e => e.currentTarget.style.borderColor = "rgba(232,197,71,0.4)"}
                        onBlur={e => e.currentTarget.style.borderColor = errors.email ? "rgba(248,113,113,0.4)" : "rgba(255,255,255,0.07)"}
                    />
                    {errors.email && <p className="mt-1.5 text-[11px] text-red-400">{errors.email.message}</p>}
                </div>

                {/* Password */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#A3A3A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            <label htmlFor="password" className="text-[11px] font-bold uppercase tracking-[0.15em]" style={{ color: "#A3A3A3" }}>
                                Password
                            </label>
                        </div>
                        <Link href="/forgot-password" className="text-[12px] font-semibold transition-colors hover:opacity-80" style={{ color: "#E8C547" }}>
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative">
                        <input
                            {...register("password")}
                            id="password"
                            type={showPw ? "text" : "password"}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            className="w-full px-4 py-3.5 pr-12 rounded-xl text-sm outline-none transition-all duration-200 border"
                            style={{
                                background: "#18181C",
                                border: errors.password ? "1px solid rgba(248,113,113,0.4)" : "1px solid rgba(255,255,255,0.07)",
                                color: "#F0EEE8",
                            }}
                            onFocus={e => e.currentTarget.style.borderColor = "rgba(232,197,71,0.4)"}
                            onBlur={e => e.currentTarget.style.borderColor = errors.password ? "rgba(248,113,113,0.4)" : "rgba(255,255,255,0.07)"}
                        />
                        <button
                            type="button"
                            aria-label={showPw ? "Hide" : "Show"}
                            onClick={() => setShowPw(v => !v)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 transition-opacity opacity-50 hover:opacity-100"
                            style={{ color: "#E8C547" }}
                        >
                            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {errors.password && <p className="mt-1.5 text-[11px] text-red-400">{errors.password.message}</p>}
                </div>

                {/* Remember + 2FA badge */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                        <input {...register("remember")} type="checkbox" className="sr-only peer" />
                        <span className="w-[18px] h-[18px] flex-shrink-0 rounded-[5px] border-2 border-white/20 bg-transparent peer-checked:bg-[#E8C547] peer-checked:border-[#E8C547] flex items-center justify-center transition-all duration-200 group-hover:border-[#E8C547]/50">
                            <svg className="hidden peer-checked:block w-3 h-3 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </span>
                        <span className="text-[13px]" style={{ color: "#737373" }}>Keep me signed in</span>
                    </label>
                    <div className="flex items-center gap-1.5">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth="1.5">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        <span className="text-[11px]" style={{ color: "#525252" }}>2FA Ready</span>
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="relative w-full flex items-center justify-center gap-2.5 py-4 rounded-full font-bold text-[15px] tracking-wide overflow-hidden transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed group"
                    style={{
                        background: "linear-gradient(135deg,#E8C547 0%,#D4AD2E 100%)",
                        color: "#0A0A0D",
                        boxShadow: "0 8px 32px rgba(232,197,71,0.35), 0 2px 8px rgba(232,197,71,0.2)",
                    }}
                >
                    {/* sheen */}
                    <span
                        aria-hidden
                        className="absolute inset-0 pointer-events-none -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"
                        style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)", transform: "skewX(-12deg)" }}
                    />
                    {loading
                        ? <Loader2 className="animate-spin" size={20} />
                        : <><span>Sign In to NexTrade</span><ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" /></>
                    }
                </button>
            </form>

            {/* ── Trust bar ── */}
            <div className="mt-8 pt-6 border-t border-white/[0.05]">
                <div className="flex items-center justify-center gap-6">
                    {[
                        { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", label: "SSL Secured" },
                        { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", label: "FDIC Insured" },
                        { icon: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.38 2 2 0 0 1 3.05 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 15v3z", label: "24/7 Support" },
                    ].map(({ icon, label }) => (
                        <div key={label} className="flex items-center gap-1.5">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#525252" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d={icon} />
                            </svg>
                            <span className="text-[10px] font-medium" style={{ color: "#525252" }}>{label}</span>
                        </div>
                    ))}
                </div>
                <p className="mt-5 text-center text-[13px]" style={{ color: "#525252" }}>
                    No account?{" "}
                    <Link href="/sign-up" className="font-semibold transition-colors" style={{ color: "#E8C547" }}>
                        Create one free →
                    </Link>
                </p>
            </div>
        </motion.div>
    );
}