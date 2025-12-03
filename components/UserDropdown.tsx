'use client';

import React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, ImagePlus, Shuffle } from "lucide-react";
import NavItems from "@/components/NavItems";
import { signOut } from "@/lib/actions/auth.actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

// Build a fun, consistent avatar using DiceBear, seeded by the user's identity
const dicebearStyles = ['adventurer', 'bottts', 'fun-emoji', 'micah', 'identicon', 'shapes'] as const;

type AvatarPref = {
    mode: 'dicebear' | 'upload' | 'url';
    sprite?: typeof dicebearStyles[number];
    seed?: string;
    dataUrl?: string; // for uploads
    url?: string; // for external URL
};

const prefKey = (user: User) => `nt/avatar-pref/${user.id || user.email || user.name || 'user'}`;

const buildCreativeAvatar = (user: User, override?: Partial<AvatarPref>) => {
    const seedBase = user.id || user.email || user.name || 'user';
    const seed = override?.seed || seedBase;
    const hash = Array.from(seed).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const sprite = override?.sprite || dicebearStyles[hash % dicebearStyles.length];
    const encodedSeed = encodeURIComponent(seed);
    // Rounded with soft gradient background for better look on dark UI
    return `https://api.dicebear.com/7.x/${sprite}/svg?seed=${encodedSeed}&backgroundType=gradientLinear&radius=50`;
}

const usePreferredAvatar = (user: User) => {
    const [preferred, setPreferred] = React.useState<string | null>(null);

    React.useEffect(() => {
        const load = () => {
            try {
                const raw = localStorage.getItem(prefKey(user));
                if (!raw) {
                    setPreferred(null);
                    return;
                }
                const pref: AvatarPref = JSON.parse(raw);
                if (pref.mode === 'upload' && pref.dataUrl) setPreferred(pref.dataUrl);
                else if (pref.mode === 'url' && pref.url) setPreferred(pref.url);
                else if (pref.mode === 'dicebear') setPreferred(buildCreativeAvatar(user, { sprite: pref.sprite, seed: pref.seed }));
                else setPreferred(null);
            } catch {
                setPreferred(null);
            }
        };

        // initial load on mount/user change
        load();

        // Listen for cross-tab changes and our own in-tab custom event
        const onStorage = (e: StorageEvent) => {
            if (e.key && e.key !== prefKey(user)) return;
            load();
        };
        const onCustom = (e: Event) => {
            // optional filtering if detail.key is present
            try {
                const detail = (e as CustomEvent).detail as { key?: string, url?: string } | undefined;
                if (detail && detail.key && detail.key !== prefKey(user)) return;
                // Optimistically apply the provided URL to avoid perceived delay
                if (detail && detail.url) setPreferred(detail.url);
            } catch { }
            load();
        };
        window.addEventListener('storage', onStorage);
        window.addEventListener('nt-avatar-updated', onCustom as EventListener);
        return () => {
            window.removeEventListener('storage', onStorage);
            window.removeEventListener('nt-avatar-updated', onCustom as EventListener);
        };
    }, [user.id, user.email, user.name, user]);

    return preferred;
}

const UserDropdown = ({ user, initialStocks }: { user: User, initialStocks: StockWithWatchlistStatus[] }) => {
    const router = useRouter();
    const preferred = usePreferredAvatar(user);
    const [open, setOpen] = React.useState(false);

    // Local working state for dialog selections
    const [working, setWorking] = React.useState<AvatarPref>({ mode: 'dicebear' });
    const [preview, setPreview] = React.useState<string>(buildCreativeAvatar(user));

    // Simple prefetch to warm the browser cache and reduce perceived delay
    const prefetch = React.useCallback((url: string) => {
        try {
            const img = new Image();
            img.src = url;
        } catch { }
    }, []);

    React.useEffect(() => {
        // Initialize working state from stored preference when opening
        if (!open) return;
        try {
            const raw = localStorage.getItem(prefKey(user));
            if (raw) {
                const pref = JSON.parse(raw) as AvatarPref;
                setWorking(pref);
                if (pref.mode === 'upload' && pref.dataUrl) { setPreview(pref.dataUrl); }
                else if (pref.mode === 'url' && pref.url) { setPreview(pref.url); }
                else { const url = buildCreativeAvatar(user, { sprite: pref.sprite, seed: pref.seed }); setPreview(url); prefetch(url); }
                return;
            }
        } catch { }
        // default
        setWorking({ mode: 'dicebear' });
        const url = buildCreativeAvatar(user);
        setPreview(url);
        prefetch(url);
    }, [open, user.id, user.email, user.name, user, prefetch]);

    const persist = (pref: AvatarPref) => {
        localStorage.setItem(prefKey(user), JSON.stringify(pref));
        setPreview(prev => prev); // noop to keep state
    }

    const handleShuffle = () => {
        // random seed variation to feel fresh
        const newSeed = Math.random().toString(36).slice(2);
        const pref: AvatarPref = { mode: 'dicebear', seed: `${user.id || user.email || user.name}-${newSeed}` };
        setWorking(pref);
        const url = buildCreativeAvatar(user, { seed: pref.seed });
        setPreview(url);
        prefetch(url);
    }

    const handleCycleStyle = () => {
        const currentSprite = working.sprite || dicebearStyles[0];
        const nextIndex = (dicebearStyles.indexOf(currentSprite) + 1) % dicebearStyles.length;
        const pref: AvatarPref = { mode: 'dicebear', sprite: dicebearStyles[nextIndex], seed: working.seed };
        setWorking(pref);
        const url = buildCreativeAvatar(user, { sprite: pref.sprite, seed: pref.seed });
        setPreview(url);
        prefetch(url);
    }

    const handleUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = String(reader.result || '');
            const pref: AvatarPref = { mode: 'upload', dataUrl };
            setWorking(pref);
            setPreview(dataUrl);
        };
        reader.readAsDataURL(file);
    }

    const handleSave = () => {
        persist(working);
        setOpen(false);
        // notify this tab (and any listeners) to reload avatar preference immediately with optimistic URL
        const ev = new CustomEvent('nt-avatar-updated', { detail: { key: prefKey(user), url: preview } });
        window.dispatchEvent(ev);
    }

    const resolvedSrc = preferred || user.image || buildCreativeAvatar(user);

    const handleSignOut = async () => {
        await signOut();
        router.push("/sign-in");
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 text-gray-4 hover:text-yellow-500">
                    <Avatar className="h-8 w-8 ring-1 ring-yellow-500/30">
                        <AvatarImage key={resolvedSrc} src={resolvedSrc} />
                        <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">
                            {user.name?.[0] || 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start">
                        <span className='text-base font-medium text-gray-400'>
                            {user.name}
                        </span>
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="text-gray-400">
                <DropdownMenuLabel>
                    <div className="flex relative items-center gap-3 py-2">
                        <Avatar className="h-10 w-10 ring-1 ring-yellow-500/30">
                            <AvatarImage key={resolvedSrc} src={resolvedSrc} />
                            <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">
                                {user.name?.[0] || 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className='text-base font-medium text-gray-400'>
                                {user.name}
                            </span>
                            <span className="text-sm text-gray-500">{user.email}</span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-600" />
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <DropdownMenuItem className="text-gray-100 text-md font-medium focus:bg-transparent focus:text-yellow-500 transition-colors cursor-pointer">
                            <ImagePlus className="h-4 w-4 mr-2 hidden sm:block" />
                            Change photo
                        </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[520px] text-gray-300">
                        <DialogHeader>
                            <DialogTitle>Update profile photo</DialogTitle>
                        </DialogHeader>
                        <div className="flex gap-4 items-start">
                            <Avatar className="h-20 w-20 ring-2 ring-yellow-500/50">
                                <AvatarImage src={preview} />
                                <AvatarFallback className="bg-yellow-500 text-yellow-900 font-bold">{user.name?.[0] || 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col gap-2 grow">
                                <div className="flex gap-2">
                                    <Button size="sm" variant="secondary" onClick={handleShuffle}>
                                        <Shuffle className="h-4 w-4 mr-1" /> Shuffle
                                    </Button>
                                    <Button size="sm" variant="secondary" onClick={handleCycleStyle}>
                                        Next style
                                    </Button>
                                </div>
                                <div className="grid grid-cols-6 gap-2 mt-2">
                                    {dicebearStyles.map((s) => {
                                        const url = buildCreativeAvatar(user, { sprite: s, seed: working.seed });
                                        return (
                                            <button key={s} type="button" onClick={() => { setWorking({ mode: 'dicebear', sprite: s, seed: working.seed }); setPreview(url); prefetch(url); }} className={`rounded-full overflow-hidden ring-1 ${working.sprite === s ? 'ring-yellow-400' : 'ring-transparent'} hover:ring-yellow-300`}>
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img alt={s} src={url} className="h-12 w-12" />
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="mt-3 flex items-center gap-2">
                                    <Input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button onClick={handleSave}>Save</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <DropdownMenuItem onClick={handleSignOut} className="text-gray-100 text-md font-medium focus:bg-transparent focus:text-yellow-500 transition-colors cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2 hidden sm:block" />
                    Logout
                </DropdownMenuItem>
                <DropdownMenuSeparator className="hidden sm:block bg-gray-600" />
                <nav className="sm:hidden">
                    <NavItems initialStocks={initialStocks} />
                </nav>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
export default UserDropdown