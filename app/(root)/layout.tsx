import Header from "@/components/Header";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Get session
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    // Protect route
    if (!session?.user) {
        redirect("/sign-in");
    }

    const user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
    };

    return (
        <div className="min-h-screen flex flex-col bg-black text-gray-400">
            {/* Top Header */}
            <Header user={user} />

            {/* Scrollable Content Area */}
            <main className="flex-1 overflow-y-auto">
                <div className="px-4 py-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
