'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { authClient } from '@/lib/better-auth/auth-client';

type Status = 'verifying' | 'success' | 'error';

const C = {
    bg: '#080810', gold: '#E8C547', green: '#00E5A0', red: '#FF4D6D',
    txt: '#F2F0FF', txt2: 'rgba(242,240,255,0.6)', txt3: 'rgba(242,240,255,0.3)',
    border: 'rgba(255,255,255,0.07)', goldBorder: 'rgba(232,197,71,0.2)',
    s2: 'rgba(255,255,255,0.04)', goldDim: 'rgba(232,197,71,0.08)',
};

export default function VerifyEmailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<Status>('verifying');
    const [countdown, setCountdown] = useState(5);
    const ranRef = useRef(false);

    const token = searchParams?.get('token');
    const error = searchParams?.get('error');

    useEffect(() => {
        if (ranRef.current) return;
        ranRef.current = true;

        if (error) { setStatus('error'); return; }
        if (!token) { setStatus('error'); return; }

        authClient.verifyEmail({ query: { token } })
            .then(() => setStatus('success'))
            .catch(() => setStatus('error'));
    }, [token, error]);

    // Countdown redirect after success
    useEffect(() => {
        if (status !== 'success') return;
        const id = setInterval(() => {
            setCountdown(c => {
                if (c <= 1) { clearInterval(id); router.push('/sign-in'); return 0; }
                return c - 1;
            });
        }, 1000);
        return () => clearInterval(id);
    }, [status, router]);

    return (
        <>
            <style>{`
                html,body{background:#080810!important;color:#F2F0FF!important;font-family:'Syne',sans-serif!important}
                @keyframes spin{to{transform:rotate(360deg)}}
                @keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
                @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
                .fade-up{animation:fadeUp 0.45s ease both}
            `}</style>

            <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative' }}>

                {/* Ambient orbs */}
                <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                    <div style={{ position: 'absolute', width: 400, height: 400, top: -100, left: '50%', transform: 'translateX(-50%)', borderRadius: '50%', background: `rgba(232,197,71,0.06)`, filter: 'blur(80px)' }} />
                </div>

                {/* Card */}
                <div className="fade-up" style={{
                    position: 'relative', zIndex: 1,
                    background: 'rgba(15,15,22,0.95)', border: `1px solid ${C.goldBorder}`,
                    borderRadius: 20, padding: '48px 40px', maxWidth: 460, width: '100%',
                    backdropFilter: 'blur(20px)', textAlign: 'center',
                }}>
                    {/* Logo */}
                    <div style={{ marginBottom: 32 }}>
                        <Link href="/">
                            <Image src="/assets/icons/logo.svg" alt="NexTrade" width={130} height={30} style={{ height: 30, width: 'auto' }} />
                        </Link>
                    </div>

                    {/* Gold top bar */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, borderRadius: '20px 20px 0 0', background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)` }} />

                    {/* ── VERIFYING ── */}
                    {status === 'verifying' && (
                        <>
                            <div style={{
                                width: 64, height: 64, borderRadius: '50%', margin: '0 auto 24px',
                                border: `2px solid ${C.gold}`, borderTopColor: 'transparent',
                                animation: 'spin 0.9s linear infinite',
                            }} />
                            <h1 style={{ margin: '0 0 10px', fontSize: 22, fontWeight: 700, color: C.txt }}>Verifying your email…</h1>
                            <p style={{ margin: 0, fontSize: 14, color: C.txt2 }}>Hang tight, this only takes a second.</p>
                        </>
                    )}

                    {/* ── SUCCESS ── */}
                    {status === 'success' && (
                        <>
                            <div style={{
                                width: 68, height: 68, borderRadius: '50%', margin: '0 auto 24px',
                                background: 'rgba(0,229,160,0.1)', border: `1.5px solid ${C.green}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 28,
                            }}>✓</div>
                            <h1 style={{ margin: '0 0 10px', fontSize: 22, fontWeight: 700, color: C.txt }}>Email Verified!</h1>
                            <p style={{ margin: '0 0 32px', fontSize: 14, color: C.txt2, lineHeight: 1.6 }}>
                                Your NexTrade account is now fully active. Redirecting to sign in in <strong style={{ color: C.gold }}>{countdown}s</strong>…
                            </p>
                            {/* Progress bar */}
                            <div style={{ height: 3, background: C.s2, borderRadius: 2, marginBottom: 28, overflow: 'hidden' }}>
                                <div style={{ height: '100%', background: C.green, borderRadius: 2, width: `${(5 - countdown) / 5 * 100}%`, transition: 'width 1s linear' }} />
                            </div>
                            <Link href="/sign-in" style={{
                                display: 'block', padding: '13px 0',
                                background: `linear-gradient(135deg, ${C.gold}, #FDD458)`,
                                borderRadius: 11, color: '#0A0A0C', fontWeight: 700, fontSize: 14,
                                textDecoration: 'none', letterSpacing: '0.02em',
                            }}>Sign In Now →</Link>
                        </>
                    )}

                    {/* ── ERROR ── */}
                    {status === 'error' && (
                        <>
                            <div style={{
                                width: 68, height: 68, borderRadius: '50%', margin: '0 auto 24px',
                                background: 'rgba(255,77,109,0.1)', border: `1.5px solid ${C.red}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 28,
                            }}>✕</div>
                            <h1 style={{ margin: '0 0 10px', fontSize: 22, fontWeight: 700, color: C.txt }}>Verification Failed</h1>
                            <p style={{ margin: '0 0 28px', fontSize: 14, color: C.txt2, lineHeight: 1.6 }}>
                                This link may have expired or already been used. Please request a new verification email.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <Link href="/sign-in" style={{
                                    display: 'block', padding: '13px 0',
                                    background: `linear-gradient(135deg, ${C.gold}, #FDD458)`,
                                    borderRadius: 11, color: '#0A0A0C', fontWeight: 700, fontSize: 14,
                                    textDecoration: 'none', letterSpacing: '0.02em',
                                }}>Go to Sign In</Link>
                                <Link href="/sign-up" style={{
                                    display: 'block', padding: '12px 0',
                                    background: C.s2, border: `1px solid ${C.border}`,
                                    borderRadius: 11, color: C.txt2, fontSize: 13,
                                    textDecoration: 'none',
                                }}>Create a New Account</Link>
                            </div>
                        </>
                    )}
                </div>

                {/* Bottom note */}
                <p style={{ position: 'relative', zIndex: 1, marginTop: 20, fontSize: 12.5, color: C.txt3, textAlign: 'center' }}>
                    Didn&apos;t receive an email? Check your spam folder or{' '}
                    <Link href="/sign-up" style={{ color: C.gold, textDecoration: 'none' }}>sign up again</Link>.
                </p>
            </div>
        </>
    );
}
