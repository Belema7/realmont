"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "./ThemeToggle";
import {
    Home,
    Building2,
    LayoutDashboard,
    LogOut,
    Menu,
    Plus,
    Heart,
} from "lucide-react";
import { useState } from "react";

const publicLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/properties", label: "Properties", icon: Building2 },
];

export function Navbar() {
    const { user, isAuthenticated, isAgent, isLoading } = useAuth();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const getInitials = (name: string) =>
        name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <nav className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                        <Building2 className="h-6 w-6" />
                    </div>
                    <span className="text-xl font-heading font-bold tracking-tight text-foreground">
                        EstateHub
                    </span>
                </Link>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-1">
                    {publicLinks.map((link) => (
                        <Link key={link.href} href={link.href}>
                            <Button
                                variant={pathname === link.href ? "secondary" : "ghost"}
                                size="sm"
                                className="gap-2 font-medium"
                            >
                                <link.icon className="h-4 w-4" />
                                {link.label}
                            </Button>
                        </Link>
                    ))}
                </div>

                {/* Desktop actions */}
                <div className="hidden md:flex items-center gap-3">
                    <ThemeToggle />

                    {isLoading ? (
                        <div className="h-9 w-24 animate-pulse rounded-full bg-muted" />
                    ) : isAuthenticated && user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                render={
                                    <Button variant="ghost" className="gap-2 pl-2 pr-3 rounded-full hover:bg-accent focus-visible:ring-ring">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                                                {getInitials(user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm font-semibold max-w-[100px] truncate">{user.name}</span>
                                        <Badge
                                            variant="secondary"
                                            className="text-[10px] uppercase font-bold tracking-wider px-1.5 h-4"
                                        >
                                            {user.role}
                                        </Badge>
                                    </Button>
                                }
                            />
                            <DropdownMenuContent align="end" className="w-56 mt-2 p-1.5 rounded-xl border-border shadow-lg">
                                <DropdownMenuItem render={<Link href="/dashboard" />} className="gap-2.5 cursor-pointer rounded-lg p-2.5">
                                    <LayoutDashboard className="h-4.5 w-4.5 text-muted-foreground" />
                                    <span className="font-medium">Dashboard</span>
                                </DropdownMenuItem>

                                {isAgent && (
                                    <DropdownMenuItem render={<Link href="/dashboard/properties/create" />} className="gap-2.5 cursor-pointer rounded-lg p-2.5">
                                        <Plus className="h-4.5 w-4.5 text-muted-foreground" />
                                        <span className="font-medium">Add Property</span>
                                    </DropdownMenuItem>
                                )}

                                {!isAgent && (
                                    <DropdownMenuItem render={<Link href="/dashboard" />} className="gap-2.5 cursor-pointer rounded-lg p-2.5">
                                        <Heart className="h-4.5 w-4.5 text-muted-foreground" />
                                        <span className="font-medium">Saved Properties</span>
                                    </DropdownMenuItem>
                                )}

                                <DropdownMenuSeparator className="my-1.5" />

                                <DropdownMenuItem
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="gap-2.5 cursor-pointer rounded-lg p-2.5 text-destructive focus:text-destructive focus:bg-destructive/10"
                                >
                                    <LogOut className="h-4.5 w-4.5" />
                                    <span className="font-medium">Sign Out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login">
                                <Button variant="ghost" size="sm" className="font-medium">
                                    Log In
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button
                                    size="sm"
                                    className="bg-primary text-primary-foreground font-semibold px-4 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
                                >
                                    Sign Up
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile menu toggle */}
                <div className="flex items-center gap-2 md:hidden">
                    <ThemeToggle />
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger
                            render={
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            }
                        />
                        <SheetContent side="right" className="w-[300px] sm:w-[350px] p-6 border-l border-border rounded-l-3xl">
                            <div className="flex flex-col gap-6 mt-8">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-4 mb-3">Menu</p>
                                    {publicLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setOpen(false)}
                                        >
                                            <Button
                                                variant={pathname === link.href ? "secondary" : "ghost"}
                                                className="w-full justify-start gap-4 h-12 rounded-xl text-base"
                                            >
                                                <link.icon className="h-5 w-5" />
                                                {link.label}
                                            </Button>
                                        </Link>
                                    ))}
                                </div>

                                <div className="space-y-1 pt-4 border-t border-border">
                                    {isAuthenticated && user ? (
                                        <>
                                            <div className="flex items-center gap-3 px-4 py-4 mb-4 rounded-2xl bg-muted/50">
                                                <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                                                    <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
                                                        {getInitials(user.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold truncate">{user.name}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                                    <Badge
                                                        variant="outline"
                                                        className="text-[10px] mt-1.5 uppercase font-bold px-1.5 h-4 bg-background"
                                                    >
                                                        {user.role}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <Link href="/dashboard" onClick={() => setOpen(false)}>
                                                <Button variant="ghost" className="w-full justify-start gap-4 h-12 rounded-xl text-base">
                                                    <LayoutDashboard className="h-5 w-5" />
                                                    Dashboard
                                                </Button>
                                            </Link>

                                            {isAgent && (
                                                <Link href="/dashboard/properties/create" onClick={() => setOpen(false)}>
                                                    <Button variant="ghost" className="w-full justify-start gap-4 h-12 rounded-xl text-base">
                                                        <Plus className="h-5 w-5" />
                                                        Add Property
                                                    </Button>
                                                </Link>
                                            )}

                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start gap-4 h-12 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 text-base mt-4"
                                                onClick={() => {
                                                    setOpen(false);
                                                    signOut({ callbackUrl: "/" });
                                                }}
                                            >
                                                <LogOut className="h-5 w-5" />
                                                Sign Out
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="grid gap-3 pt-2">
                                            <Link href="/login" onClick={() => setOpen(false)}>
                                                <Button variant="outline" className="w-full h-12 rounded-xl text-base border-border">
                                                    Log In
                                                </Button>
                                            </Link>
                                            <Link href="/register" onClick={() => setOpen(false)}>
                                                <Button className="w-full h-12 rounded-xl text-base bg-primary text-primary-foreground font-bold">
                                                    Create Account
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>
        </header>
    );
}
