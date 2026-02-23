import type { Metadata } from "next";
import { Playfair_Display, Syne, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { CommandMenu } from "@/components/ui/CommandMenu";
import { WebSocketProvider } from "@/components/realtime/LiveTicker";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
    title: "NexTrade",
    description: "Stock Market Application",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${playfair.variable} ${syne.variable} ${jetbrains.variable}`}
                style={{ fontFamily: "var(--font-syne), system-ui, sans-serif" }}>
                <WebSocketProvider>
                    {children}
                    <CommandMenu />
                    <Toaster />
                </WebSocketProvider>
            </body>
        </html>
    );
}
