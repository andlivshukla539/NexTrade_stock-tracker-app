import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session?.user) redirect("/");

    return (
        <main className="min-h-screen w-full bg-black relative isolate overflow-hidden flex">
            {/* LEFT */}
            <section className="auth-left-section relative z-10">
                <Link href="/" className="auth-logo">
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

            {/* RIGHT */}
            <section className="auth-right-section relative">
                <div className="relative z-10 lg:mt-4 lg:mb-16">
                    <blockquote className="auth-blockquote">
                        NexTrade’s alerts feel like having a pro trader on my side — I never miss a good entry anymore.
                    </blockquote>

                    <div className="flex items-center justify-between">
                        <div>
                            <cite className="auth-testimonial-author">
                                - Liam Parker
                            </cite>
                            <p className="text-gray-500 text-sm">
                                Retail Investor
                            </p>
                        </div>

                        <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Image
                                    key={star}
                                    src="/assets/icons/star.svg"
                                    alt="Star"
                                    width={20}
                                    height={20}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex-1 relative">
                    <Image
                        src="/assets/images/dashboard.png"
                        alt="Dashboard Preview"
                        fill
                        priority
                        className="object-cover opacity-60"
                    />
                </div>
            </section>
        </main>
    );
}
