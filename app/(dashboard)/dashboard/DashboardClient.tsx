"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Plus,
    Building2,
    Edit,
    Trash2,
    Eye,
    LayoutDashboard,
    DollarSign,
    Home,
    Heart,
    Loader2,
    TrendingUp,
} from "lucide-react";
import { useDeleteProperty } from "@/hooks/useProperties";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { toast } from "sonner";
import type { IProperty } from "@/types";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface DashboardClientProps {
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
    isAgent: boolean;
    properties: IProperty[];
    savedProperties: IProperty[];
}

export function DashboardClient({
    user,
    isAgent,
    properties,
    savedProperties,
}: DashboardClientProps) {
    const router = useRouter();
    const deleteProperty = useDeleteProperty();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        deleteProperty.mutate(id, {
            onSuccess: () => {
                toast.success("Property deleted");
                router.refresh();
            },
            onError: () => {
                toast.error("Failed to delete property");
            },
            onSettled: () => {
                setDeletingId(null);
            },
        });
    };

    const totalValue = properties.reduce((sum, p) => sum + p.price, 0);

    return (
        <div className="container mx-auto px-4 py-8 space-y-10">
            {/* Header section with welcome message */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-8">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs">
                        <LayoutDashboard className="h-4 w-4" />
                        Management Console
                    </div>
                    <h1 className="text-4xl font-heading font-extrabold tracking-tight">
                        Hello, {user.name.split(" ")[0]}!
                    </h1>
                    <p className="text-muted-foreground font-medium">
                        Manage your {isAgent ? "active listings" : "saved properties"} and market activity.
                    </p>
                </div>
                {isAgent && (
                    <Link href="/dashboard/properties/create">
                        <Button className="bg-primary text-primary-foreground font-bold rounded-2xl h-12 px-6 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-95 gap-2">
                            <Plus className="h-5 w-5" />
                            List New Property
                        </Button>
                    </Link>
                )}
            </div>

            {/* Stats overview */}
            {isAgent && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <Card className="rounded-3xl border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="flex items-center gap-5 p-7">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <Home className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground pb-0.5">Listings</p>
                                <p className="text-3xl font-heading font-black">{properties.length}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="rounded-3xl border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="flex items-center gap-5 p-7">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600">
                                <DollarSign className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground pb-0.5">Portfolio</p>
                                <p className="text-3xl font-heading font-black">
                                    ${(totalValue / 1000).toFixed(0)}K
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="rounded-3xl border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="flex items-center gap-5 p-7">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600">
                                <TrendingUp className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground pb-0.5">Diversity</p>
                                <p className="text-3xl font-heading font-black">
                                    {new Set(properties.map((p) => p.propertyType)).size} <span className="text-sm font-bold text-muted-foreground">Types</span>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Main content area */}
            <div className="space-y-6">
                {isAgent ? (
                    <Card className="rounded-3xl border-border bg-muted/30 pb-4">
                        <CardHeader className="flex flex-row items-center justify-between p-6">
                            <CardTitle className="flex items-center gap-3 font-heading font-bold text-xl">
                                <Building2 className="h-6 w-6 text-primary" />
                                Active Inventory
                            </CardTitle>
                            <Badge variant="secondary" className="rounded-lg px-3 py-1 font-bold">
                                {properties.length} Active
                            </Badge>
                        </CardHeader>
                        <CardContent className="px-6 pb-6">
                            {properties.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-2xl border border-dashed border-border/60">
                                    <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
                                        <Building2 className="h-10 w-10 text-muted-foreground/40" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">No property listings</h3>
                                    <p className="text-muted-foreground max-w-xs mx-auto mb-8">
                                        You haven&apos;t added any properties to your portfolio. Start listing now!
                                    </p>
                                    <Link href="/dashboard/properties/create">
                                        <Button className="rounded-xl h-12 px-8 font-bold">
                                            Add Your First Listing
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {properties.map((property) => (
                                        <div
                                            key={property._id}
                                            className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
                                        >
                                            <div className="relative aspect-video sm:aspect-square h-auto w-full sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-xl">
                                                {property.images?.[0] ? (
                                                    <Image
                                                        src={property.images[0]}
                                                        alt={property.title}
                                                        fill
                                                        className="object-cover transition-transform group-hover:scale-110"
                                                        sizes="96px"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center bg-muted">
                                                        <Building2 className="h-8 w-8 text-muted-foreground/30" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0 space-y-1">
                                                <h4 className="font-bold text-lg leading-snug truncate group-hover:text-primary transition-colors">
                                                    {property.title}
                                                </h4>
                                                <p className="text-sm text-muted-foreground font-medium truncate italic">
                                                    {property.location}
                                                </p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest px-1.5 h-5 rounded-md bg-muted/50 border-border/50">
                                                        {property.propertyType}
                                                    </Badge>
                                                    <span className="text-sm font-black text-primary">
                                                        ${property.price.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-border/50 shrink-0">
                                                <Link href={`/properties/${property._id}`} className="flex-1 sm:flex-none">
                                                    <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-border hover:bg-muted hover:text-primary transition-colors">
                                                        <Eye className="h-5 w-5" />
                                                    </Button>
                                                </Link>
                                                <Link
                                                    href={`/dashboard/properties/edit/${property._id}`}
                                                    className="flex-1 sm:flex-none"
                                                >
                                                    <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-border hover:bg-muted hover:text-blue-600 transition-colors">
                                                        <Edit className="h-5 w-5" />
                                                    </Button>
                                                </Link>

                                                <Dialog>
                                                    <DialogTrigger
                                                        render={
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                className="h-11 w-11 rounded-xl border-border text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors flex-1 sm:flex-none"
                                                            >
                                                                <Trash2 className="h-5 w-5" />
                                                            </Button>
                                                        }
                                                    />
                                                    <DialogContent className="rounded-3xl border-border p-8">
                                                        <DialogHeader>
                                                            <DialogTitle className="text-2xl font-heading font-black">Hold on!</DialogTitle>
                                                            <DialogDescription className="text-base pt-2">
                                                                Are you absolutely sure you want to delete <span className="text-foreground font-bold italic">&quot;{property.title}&quot;</span>?
                                                                This data will be purged from our servers and cannot be recovered.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <DialogFooter className="mt-8 gap-3 sm:gap-0">
                                                            <DialogClose render={<Button variant="outline" className="rounded-xl h-12 px-6 font-bold" />}>Keep Property</DialogClose>
                                                            <Button
                                                                variant="destructive"
                                                                className="rounded-xl h-12 px-8 font-bold"
                                                                onClick={() => handleDelete(property._id)}
                                                                disabled={deletingId === property._id}
                                                            >
                                                                {deletingId === property._id ? (
                                                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                                ) : (
                                                                    "Yes, Delete It"
                                                                )}
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between gap-4">
                            <h2 className="text-2xl font-heading font-bold flex items-center gap-3">
                                <Heart className="h-7 w-7 text-primary fill-primary" />
                                Curated Favorites
                            </h2>
                            <Badge variant="secondary" className="rounded-lg px-3 py-1 font-bold">
                                {savedProperties.length} Saved
                            </Badge>
                        </div>
                        <PropertyGrid
                            properties={savedProperties}
                            emptyMessage="Your favorite properties will appear here. Start exploring to build your list!"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
