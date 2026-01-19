import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import SmoothScroll from "@/components/motion/SmoothScroll";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "NexTrade",
    description: "Stock Market Application",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <SmoothScroll>{children}</SmoothScroll>
                <Toaster />
            </body>
        </html>
    );
}