"use client"

import { useEffect, useState } from "react"
import { CommandDialog, CommandEmpty, CommandInput, CommandList } from "@/components/ui/command"
import { Loader2, TrendingUp, Search } from "lucide-react";
import Link from "next/link";
import { searchStocks } from "@/lib/actions/finnhub.actions";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchCommandProps {
    renderAs?: 'button' | 'text';
    label?: string;
    initialStocks?: { symbol: string, name?: string, exchange?: string, type?: string }[];
}

export default function SearchCommand({ renderAs = 'button', label = 'Add stock', initialStocks }: SearchCommandProps) {
    const [open, setOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(false)
    const [stocks, setStocks] = useState<{ symbol: string, name?: string, exchange?: string, type?: string }[]>(initialStocks || []);

    const isSearchMode = !!searchTerm.trim();
    const displayStocks = isSearchMode ? stocks : stocks?.slice(0, 10);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault()
                setOpen(v => !v)
            }
        }
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [])

    const handleSearch = async () => {
        if (!isSearchMode) return setStocks(initialStocks || []);

        setLoading(true)
        try {
            const results = await searchStocks(searchTerm.trim());
            setStocks(results);
        } catch (error) {
            console.error('Stock search failed:', error);
            setStocks([])
        } finally {
            setLoading(false)
        }
    }

    const debouncedSearch = useDebounce(handleSearch, 300);

    useEffect(() => {
        debouncedSearch();
    }, [debouncedSearch, searchTerm]);

    const handleSelectStock = () => {
        setOpen(false);
        setSearchTerm("");
        setStocks(initialStocks || []);
    }

    return (
        <>
            {renderAs === 'text' ? (
                <span
                    onClick={() => setOpen(true)}
                    className="cursor-pointer text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                    {label}
                </span>
            ) : (
                <button
                    onClick={() => setOpen(true)}
                    id="cmd-palette-btn"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm font-medium text-gray-400 hover:bg-white/[0.08] hover:text-white transition-all duration-200 shadow-none cursor-pointer"
                >
                    <Search className="h-3.5 w-3.5" />
                    {label}
                </button>
            )}
            <CommandDialog open={open} onOpenChange={setOpen}>
                <div className="flex items-center gap-2 border-b border-white/10 px-3">
                    <Search className="h-4 w-4 shrink-0 text-gray-500" />
                    <CommandInput
                        value={searchTerm}
                        onValueChange={setSearchTerm}
                        placeholder="Search stocks..."
                        className="flex-1 border-0 bg-transparent py-3 text-sm text-white placeholder:text-gray-500 outline-none ring-0 focus:ring-0"
                    />
                    {loading && <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />}
                </div>
                <CommandList className="max-h-[320px] overflow-y-auto p-2">
                    {loading ? (
                        <CommandEmpty className="py-8 text-center text-sm text-gray-500">
                            Loading stocks...
                        </CommandEmpty>
                    ) : displayStocks?.length === 0 ? (
                        <div className="py-8 text-center text-sm text-gray-500">
                            {isSearchMode ? 'No results found' : 'No stocks available'}
                        </div>
                    ) : (
                        <ul className="space-y-0.5">
                            <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                                {isSearchMode ? 'Search results' : 'Popular stocks'}
                                {` `}({displayStocks?.length || 0})
                            </div>
                            {displayStocks?.map((stock) => (
                                <li key={stock.symbol}>
                                    <Link
                                        href={`/stocks/${stock.symbol}`}
                                        onClick={handleSelectStock}
                                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-150 hover:bg-white/[0.06] group"
                                    >
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                                            <TrendingUp className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-gray-200 truncate">
                                                {stock.name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {stock.symbol} | {stock.exchange} | {stock.type}
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )
                    }
                </CommandList>
            </CommandDialog>
        </>
    )
}