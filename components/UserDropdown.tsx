'use client';

import React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import NavItems from "@/components/NavItems";
import { signOut } from "@/lib/actions/auth.actions";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { generateUserAvatar } from "@/lib/avatar";

/* ================= INLINE ICONS (TURBOPACK SAFE) ================= */

const IconLogOut = ({ className = "" }) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

const IconCamera = ({ className = "" }) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
    </svg>
);

const IconShuffle = ({ className = "" }) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polyline points="16 3 21 3 21 8" />
        <line x1="4" y1="20" x2="21" y2="3" />
        <polyline points="21 16 21 21 16 21" />
        <line x1="15" y1="15" x2="21" y2="21" />
        <line x1="4" y1="4" x2="9" y2="9" />
    </svg>
);

const IconImagePlus = ({ className = "" }) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
        <line x1="12" y1="10" x2="12" y2="16" />
        <line x1="9" y1="13" x2="15" y2="13" />
    </svg>
);

/* ================= TYPES ================= */

type AvatarPref = {
    mode: "upload";
    dataUrl: string;
};

const prefKey = (user: User) =>
    `nt/avatar-pref/${user.id || user.email || user.name || "user"}`;

/* ================= HOOK ================= */

const usePreferredAvatar = (user: User) => {
    const [avatar, setAvatar] = React.useState<string | null>(null);

    React.useEffect(() => {
        try {
            const raw = localStorage.getItem(prefKey(user));
            if (!raw) return;
            const pref: AvatarPref = JSON.parse(raw);
            setAvatar(pref.dataUrl);
        } catch { }
    }, [user]);

    return avatar;
};

/* ================= COMPONENT ================= */

const UserDropdown = ({
    user,
    initialStocks,
}: {
    user: User;
    initialStocks: StockWithWatchlistStatus[];
}) => {
    const router = useRouter();

    const preferred = usePreferredAvatar(user);

    const [mounted, setMounted] = React.useState(false);
    const [avatarSrc, setAvatarSrc] = React.useState<string | null>(null);
    const [preview, setPreview] = React.useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    React.useEffect(() => {
        if (!mounted) return;

        if (preferred) {
            setAvatarSrc(preferred);
            setPreview(preferred);
        } else if (user.image) {
            setAvatarSrc(user.image);
            setPreview(user.image);
        } else {
            const generated = generateUserAvatar(
                user.id || user.email || "default"
            );
            setAvatarSrc(generated);
            setPreview(generated);
        }
    }, [mounted, preferred, user]);

    const handleSignOut = async () => {
        await signOut();
        router.push("/sign-in");
    };

    const handleSave = () => {
        if (!preview) return;
        localStorage.setItem(
            prefKey(user),
            JSON.stringify({ mode: "upload", dataUrl: preview })
        );
        setAvatarSrc(preview);
        setDialogOpen(false);
    };

    if (!mounted || !avatarSrc) return null;

    return (
        <>
            {/* EDIT AVATAR DIALOG */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent 
                    style={{ backgroundColor: '#000000', opacity: 1, backdropFilter: 'none' }}
                    className="!bg-black !opacity-100 border border-white/10 text-white rounded-xl"
                >
                    <DialogHeader>
                        <DialogTitle>Edit profile photo</DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col items-center gap-6 py-6">
                        <Avatar className="h-32 w-32 ring-4 ring-white/10">
                            <AvatarImage src={preview ?? undefined} />
                            <AvatarFallback>P</AvatarFallback>
                        </Avatar>

                        <div className="flex w-full gap-2">
                            <Button
                                variant="outline"
                                className="flex-1 !bg-black border-white/10 hover:bg-white/5"
                                onClick={() => {
                                    const seed = Math.random().toString(36);
                                    setPreview(generateUserAvatar(seed));
                                }}
                            >
                                <IconShuffle className="mr-2 h-4 w-4" />
                                Randomize
                            </Button>

                            <div className="relative flex-1">
                                <Button
                                    variant="outline"
                                    className="w-full !bg-black border-white/10 hover:bg-white/5"
                                >
                                    <IconImagePlus className="mr-2 h-4 w-4" />
                                    Upload
                                </Button>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        const reader = new FileReader();
                                        reader.onload = () =>
                                            setPreview(reader.result as string);
                                        reader.readAsDataURL(file);
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="flex justify-between">
                        <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            className="bg-yellow-500 text-black hover:bg-yellow-400"
                            onClick={handleSave}
                        >
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* USER DROPDOWN */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-3 px-2">
                        <Avatar className="h-9 w-9 ring-2 ring-white/10">
                            <AvatarImage src={avatarSrc} />
                            <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
                        </Avatar>
                        <span className="hidden md:block text-sm font-medium">
                            {user.name}
                        </span>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="end"
                    sideOffset={12}
                    variant="dark"
                    style={{ backgroundColor: '#000000 !important', opacity: '1 !important', backdropFilter: 'none !important' } as any}
                    className="w-[300px] border border-white/20 rounded-xl shadow-2xl p-0 overflow-hidden !bg-black !opacity-100"
                >
                    <div className="!bg-black w-full h-full">
                        <div className="flex flex-col items-center p-6 !bg-black">
                            <div
                                className="relative cursor-pointer group"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setDialogOpen(true);
                                }}
                            >
                                <Avatar className="h-20 w-20 ring-4 ring-black">
                                    <AvatarImage src={avatarSrc} />
                                    <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
                                </Avatar>

                                <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-full opacity-0 group-hover:opacity-100 transition">
                                    <IconCamera className="h-6 w-6 text-white" />
                                </div>
                            </div>

                            <h3 className="mt-4 font-semibold text-white">{user.name}</h3>
                            <p className="text-sm text-gray-400 truncate max-w-[200px]">
                                {user.email}
                            </p>
                        </div>

                        <DropdownMenuSeparator className="bg-white/5" />

                        <div className="p-2 !bg-black">
                            <nav className="sm:hidden mb-2">
                                <NavItems initialStocks={initialStocks} />
                                <DropdownMenuSeparator className="bg-white/5 my-2" />
                            </nav>

                            <DropdownMenuItem
                                onClick={handleSignOut}
                                className="flex items-center gap-2 text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-400 cursor-pointer"
                            >
                                <IconLogOut className="h-4 w-4" />
                                Log out
                            </DropdownMenuItem>
                        </div>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export default UserDropdown;
