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
            <section className="auth-left-section scrollbar-hide-default relative z-20 flex flex-col w-full lg:w-1/2 xl:w-[45%] h-full overflow-y-auto px-8 lg:px-12">
                <Link href="/" className="auth-logo mb-8 pt-8 block">
                    <Image
                        src="/assets/icons/logo.svg"
                        alt="NexTrade logo"
                        width={140}
                        height={32}
                        className="h-8 w-auto"
                    />
                </Link>

                <div className="flex-1 pb-6 lg:pb-8 flex flex-col justify-center">
                    {children}
                </div>
            </section>

            {/* ================= RIGHT : PREVIEW ================= */}
            <section className="auth-right-section relative hidden lg:flex flex-col h-full w-1/2 xl:w-[55%] overflow-hidden bg-primary/5">
                {/* Testimonial */}
                <div className="relative z-20 mt-auto mb-16 max-w-lg px-12 self-center">
                    <blockquote className="text-gray-200 text-lg leading-relaxed font-light">
                        &quot;NexTrade’s alerts feel like having a pro trader on my side —
                        I never miss a good entry anymore.&quot;
                    </blockquote>

                    <div className="mt-6 flex items-center justify-between">
                        <div>
                            <cite className="block text-sm text-white font-medium not-italic">
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
