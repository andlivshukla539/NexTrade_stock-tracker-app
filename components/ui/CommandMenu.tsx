"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { SearchIcon, HomeIcon, BarChart3Icon, LogOutIcon, SettingsIcon, EyeIcon } from "lucide-react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import { useEffect, useState } from "react";

export function CommandMenu() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false);
        command();
    }, []);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="inline-flex h-9 items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 sm:pr-12 md:w-64"
            >
                <span className="flex items-center gap-2 text-muted-foreground">
                    <SearchIcon className="h-4 w-4" />
                    Search...
                </span>
                <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Navigation">
                        <CommandItem
                            onSelect={() => runCommand(() => router.push("/"))}
                        >
                            <HomeIcon className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                        </CommandItem>
                        <CommandItem
                            onSelect={() => runCommand(() => router.push("/portfolio"))}
                        >
                            <BarChart3Icon className="mr-2 h-4 w-4" />
                            <span>Portfolio</span>
                        </CommandItem>
                        <CommandItem
                            onSelect={() => runCommand(() => router.push("/watchlist"))}
                        >
                            <EyeIcon className="mr-2 h-4 w-4" />
                            <span>Watchlist</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Settings">
                        <CommandItem
                            onSelect={() => runCommand(() => alert('Theme switch coming soon'))}
                        >
                            <SettingsIcon className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </CommandItem>
                        <CommandItem
                            onSelect={() => runCommand(() => window.location.href = '/api/auth/signout')}
                        >
                            <LogOutIcon className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}
