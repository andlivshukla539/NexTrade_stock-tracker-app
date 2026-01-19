import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session?.user) redirect("/");

    return (
        <main className="h-screen w-full bg-black relative isolate flex">
            {/* ================= LEFT : AUTH ================= */}
            <section className="auth-left-section scrollbar-hide-default relative z-20 flex flex-col">
                <Link href="/" className="auth-logo mb-8">
                    <Image
                        src="/assets/icons/logo.svg"
                        alt="NexTrade logo"
                        width={140}
                        height={32}
                        className="h-8 w-auto"
                    />
                </Link>

                <div className="flex-1 pb-6 lg:pb-8">
                    {children}
                </div>
            </section>

            {/* ================= RIGHT : PREVIEW ================= */}
            <section className="auth-right-section relative flex flex-col h-full">
                {/* Testimonial */}
                <div className="relative z-20 lg:mt-6 lg:mb-16 max-w-md px-6">
                    <blockquote className="text-gray-200 text-lg leading-relaxed">
                        NexTrade’s alerts feel like having a pro trader on my side —
                        I never miss a good entry anymore.
                    </blockquote>

                    <div className="mt-6 flex items-center justify-between">
                        <div>
                            <cite className="block text-sm text-white font-medium">
                                — Liam Parker
                            </cite>
                            <p className="text-xs text-gray-400">
                                Retail Investor
                            </p>
                        </div>

                        <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Image
                                    key={star}
                                    src="/assets/icons/star.svg"
                                    alt="Star"
                                    width={18}
                                    height={18}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Dashboard Preview */}
                <div className="flex-1 relative">
                    <Image
                        src="/assets/images/dashboard.png"
                        alt="NexTrade dashboard preview"
                        fill
                        priority
                        className="object-cover"
                    />

                    {/* Dark + Blur Overlay */}
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
                </div>
            </section>
        </main>
    );
};

export default Layout;
