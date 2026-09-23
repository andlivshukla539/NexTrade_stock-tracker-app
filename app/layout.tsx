import type { Metadata } from "next";
import { Playfair_Display, Syne, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";
import NextTopLoader from 'nextjs-toploader';
import CustomCursor from "@/components/ui/CustomCursor";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
    title: "NexTrade",
    description: "Stock Market Application",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
            <body className={`${playfair.variable} ${syne.variable} ${jetbrains.variable}`}
                style={{ fontFamily: "var(--font-syne), system-ui, sans-serif" }}>
                <NextTopLoader color="#2ECC8A" showSpinner={false} speed={200} height={3} shadow="0 0 10px #2ECC8A,0 0 5px #2ECC8A" />
                <CustomCursor />
                {children}
                <Toaster />
                <SpeedInsights />
            </body>
        </html>
    );
}