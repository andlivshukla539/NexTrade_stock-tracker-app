'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { signInWithEmail } from '@/lib/actions/auth.actions';
import { authClient } from '@/lib/better-auth/auth-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

// ---------------- SCHEMA ----------------
const SignInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
    rememberMe: z.boolean().optional(),
});

type SignInFormData = z.infer<typeof SignInSchema>;

export default function SignIn() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isEmailLoading, setIsEmailLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, control } = useForm<SignInFormData>({
        resolver: zodResolver(SignInSchema),
    });

    // ENTER KEY SUBMIT
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                handleSubmit((data) => {
                    const res = signInWithEmail(data);
                    return res;
                })();
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [handleSubmit]);

    const onSubmit = async (data: SignInFormData) => {
        setIsEmailLoading(true);
        setError(null);
        const res = await signInWithEmail(data);
        setIsEmailLoading(false);
        if (res.success) {
            router.push('/');
            router.refresh();
        } else {
            setError(res.error || 'Sign in failed. Please try again.');
        }
    };

    const socialLogin = async () => {
        setIsGoogleLoading(true);
        setError(null);
        try {
            await authClient.signIn.social({
                provider: 'google',
                callbackURL: '/',
            });
        } catch {
            setError('Social sign-in failed. Please try again.');
            setIsGoogleLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-md"
        >
            {/* CARD */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/40 p-8">

                {/* HEADER */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-semibold text-white">Welcome back</h1>
                    <p className="text-sm text-gray-400 mt-1" suppressHydrationWarning>
                        Sign in to access your account
                    </p>
                </div>

                {/* GOOGLE */}
                <button
                    onClick={socialLogin}
                    disabled={isGoogleLoading || isEmailLoading}
                    suppressHydrationWarning
                    className="w-full h-12 rounded-full border border-white/20 text-white flex items-center justify-center gap-3 hover:bg-white/5 hover:border-white/40 transition mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isGoogleLoading ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span className="text-sm font-medium">Connecting...</span>
                        </>
                    ) : (
                        <>
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22z" />
                                <path fill="#EA4335" d="M12 4.63c1.69 0 3.26.58 4.54 1.8l3.29-3.29C17.45 1.14 14.97 0 12 0z" />
                            </svg>
                            <span className="text-sm font-medium">Continue with Google</span>
                        </>
                    )}
                </button>

                {/* DIVIDER */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-px flex-1 bg-white/15" />
                    <span className="text-xs text-gray-400">OR CONTINUE WITH EMAIL</span>
                    <div className="h-px flex-1 bg-white/15" />
                </div>

                {/* ERROR MESSAGE */}
                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {/* FORM */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    {/* EMAIL */}
                    <div>
                        <Label className="text-sm text-gray-300">Email</Label>
                        <div className="relative mt-1">

                            <Input
                                {...register('email')}
                                type="email"
                                placeholder="you@example.com"
                                className="h-12 pl-12 pr-4 rounded-full bg-zinc-900 border border-white/20 text-white placeholder:text-gray-500 focus:border-yellow-400/60 focus:ring-2 focus:ring-yellow-400/20"
                            />
                        </div>
                    </div>

                    {/* PASSWORD */}
                    <div>
                        <div className="flex justify-between">
                            <Label className="text-sm text-gray-300">Password</Label>
                            <Link href="/forgot-password" className="text-xs text-yellow-400 hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative mt-1">

                            <Input
                                {...register('password')}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                className="
                                h-12 
                                w-full
                                
                                rounded-full 
                                bg-zinc-900
                                pr-14
                                border 
                                border-white/20
                                 pl-5
                                text-white 
                                placeholder:text-gray-500 
                                focus:border-yellow-400/60 
                                focus:ring-2 focus:ring-yellow-400/20
                            
                                "


                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute 
                                top-1/2
        -translate-y-1/2
                                right-4
                                flex
                                items-center
                                text-gray-400
                                hover:text-white 
                                z-10 
                                 pointer-events-auto"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* REMEMBER */}
                    <div className="flex items-center gap-2">
                        <Controller
                            name="rememberMe"
                            control={control}
                            render={({ field }) => (
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            )}
                        />
                        <span className="text-sm text-gray-300">Remember me for 30 days</span>
                    </div>

                    {/* SUBMIT */}
                    <button
                        type="submit"
                        disabled={isEmailLoading || isGoogleLoading}
                        suppressHydrationWarning
                        className="w-full h-12 rounded-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold flex items-center justify-center transition disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isEmailLoading ? <Loader2 className="animate-spin" /> : 'Sign In'}
                    </button>
                </form>

                {/* FOOTER */}
                <p className="text-center text-sm text-gray-400 mt-6">
                    Don&apos;t have an account?{' '}
                    <Link href="/sign-up" className="text-yellow-400 font-semibold hover:underline">
                        Create account
                    </Link>
                </p>
            </div>
        </motion.div>
    );
}
