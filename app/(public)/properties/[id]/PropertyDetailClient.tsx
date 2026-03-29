"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Heart,
    MapPin,
    BedDouble,
    Bath,
    Ruler,
    Building2,
    ChevronLeft,
    ChevronRight,
    User,
    Mail,
    Share2,
} from "lucide-react";
import { useToggleSave, useSavedProperties } from "@/hooks/useProperties";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { IProperty, IUser } from "@/types";

interface PropertyDetailClientProps {
    property: IProperty;
    userId?: string;
}

const typeColors: Record<string, string> = {
    house: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    apartment: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    land: "bg-amber-500/10 text-amber-600 border-amber-500/20",
};

export function PropertyDetailClient({
    property,
    userId,
}: PropertyDetailClientProps) {
    const [currentImage, setCurrentImage] = useState(0);
    const { isAuthenticated } = useAuth();
    const toggleSave = useToggleSave();
    const { data: savedData } = useSavedProperties();

    const savedIds = savedData?.data?.map((p: IProperty) => p._id) || [];
    const isSaved = savedIds.includes(property._id);

    const agent =
        typeof property.createdBy === "object"
            ? (property.createdBy as IUser)
            : null;

    const handleSave = () => {
        if (!isAuthenticated) {
            toast.error("Please log in to save properties");
            return;
        }
        toggleSave.mutate(property._id, {
            onSuccess: () => {
                toast.success(isSaved ? "Removed from saved" : "Property saved!");
            },
        });
    };

    const nextImage = () => {
        if (property.images.length > 0) {
            setCurrentImage((prev) => (prev + 1) % property.images.length);
        }
    };

    const prevImage = () => {
        if (property.images.length > 0) {
            setCurrentImage(
                (prev) => (prev - 1 + property.images.length) % property.images.length
            );
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-7xl">
            {/* Header & Meta */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <Badge
                            variant="secondary"
                            className={cn(
                                "capitalize h-7 px-3 font-bold text-[10px] tracking-widest uppercase rounded-lg border",
                                typeColors[property.propertyType]
                            )}
                        >
                            {property.propertyType}
                        </Badge>
                        <Badge variant="outline" className="h-7 px-3 font-bold text-[10px] tracking-widest uppercase rounded-lg bg-muted/30">
                            ID: {property._id.slice(-6).toUpperCase()}
                        </Badge>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight leading-tight">
                        {property.title}
                    </h1>
                    <div className="flex items-center gap-2 text-muted-foreground font-medium">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                            <MapPin className="h-4 w-4" />
                        </div>
                        <span className="text-lg">{property.location}</span>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-4 min-w-[200px]">
                    <div className="text-right">
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Pricing Guide</p>
                        <p className="text-5xl font-heading font-black text-primary">
                            ${property.price.toLocaleString()}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-xl h-12 w-12 border-border shadow-sm hover:shadow-md transition-all active:scale-95"
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                toast.success("Link copied to clipboard");
                            }}
                        >
                            <Share2 className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleSave}
                            className={cn(
                                "h-12 w-12 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95",
                                isSaved
                                    ? "text-destructive border-destructive/20 bg-destructive/5 fill-destructive"
                                    : "border-border hover:text-destructive"
                            )}
                        >
                            <Heart
                                className={cn("h-5 w-5", isSaved && "fill-current")}
                            />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Showcase */}
            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-8">
                    {/* Hero Gallery */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[40px] bg-muted shadow-2xl">
                        {property.images.length > 0 ? (
                            <>
                                <Image
                                    src={property.images[currentImage]}
                                    alt={property.title}
                                    fill
                                    className="object-cover transition-transform duration-1000"
                                    priority
                                    sizes="(max-width: 1200px) 100vw, 1200px"
                                />
                                {property.images.length > 1 && (
                                    <>
                                        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                                        <div className="absolute inset-y-0 left-6 flex items-center">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={prevImage}
                                                className="h-14 w-14 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white border border-white/20 rounded-2xl shadow-2xl transition-all active:scale-90"
                                            >
                                                <ChevronLeft className="h-8 w-8" />
                                            </Button>
                                        </div>
                                        <div className="absolute inset-y-0 right-6 flex items-center">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={nextImage}
                                                className="h-14 w-14 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white border border-white/20 rounded-2xl shadow-2xl transition-all active:scale-90"
                                            >
                                                <ChevronRight className="h-8 w-8" />
                                            </Button>
                                        </div>
                                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 px-6 py-3 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10">
                                            {property.images.map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setCurrentImage(i)}
                                                    className={cn(
                                                        "h-2 w-2 rounded-full transition-all duration-300",
                                                        i === currentImage
                                                            ? "bg-white w-10"
                                                            : "bg-white/30 hover:bg-white/60"
                                                    )}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="flex h-full items-center justify-center">
                                <Building2 className="h-32 w-32 text-muted-foreground/10" />
                            </div>
                        )}
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {property.propertyType !== "land" && (
                            <>
                                <Card className="rounded-[32px] border-border bg-muted/30 shadow-sm transition-shadow hover:shadow-md">
                                    <CardContent className="flex items-center gap-5 p-6">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 shrink-0 shadow-inner">
                                            <BedDouble className="h-7 w-7" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Bedrooms</p>
                                            <p className="text-3xl font-heading font-black">{property.bedrooms}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="rounded-[32px] border-border bg-muted/30 shadow-sm transition-shadow hover:shadow-md">
                                    <CardContent className="flex items-center gap-5 p-6">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 shrink-0 shadow-inner">
                                            <Bath className="h-7 w-7" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Bathrooms</p>
                                            <p className="text-3xl font-heading font-black">{property.bathrooms}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        )}
                        <Card className="rounded-[32px] border-border bg-muted/30 shadow-sm transition-shadow hover:shadow-md col-span-2 md:col-span-1">
                            <CardContent className="flex items-center gap-5 p-6">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 shrink-0 shadow-inner">
                                    <Ruler className="h-7 w-7" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Living Area</p>
                                    <p className="text-3xl font-heading font-black text-foreground">{property.area} <span className="text-sm font-bold text-muted-foreground">sqft</span></p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Separator className="bg-border/60 my-4" />

                    {/* About Section */}
                    <div className="space-y-6 bg-card p-10 rounded-[40px] border border-border shadow-sm">
                        <h2 className="text-3xl font-heading font-black tracking-tight">Executive Summary</h2>
                        <p className="text-muted-foreground text-lg leading-[1.8] whitespace-pre-wrap font-medium">
                            {property.description}
                        </p>
                    </div>
                </div>

                {/* Sidebar Intelligence */}
                <div className="space-y-8">
                    {agent && (
                        <Card className="rounded-[40px] border-border bg-card shadow-lg p-2 overflow-hidden sticky top-24">
                            <CardContent className="p-8">
                                <div className="flex flex-col items-center text-center space-y-6">
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                                        <Avatar className="h-24 w-24 border-4 border-background relative z-10 shadow-2xl">
                                            <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-black">
                                                {agent.name
                                                    ?.split(" ")
                                                    .map((n) => n[0])
                                                    .join("")
                                                    .toUpperCase()
                                                    .slice(0, 2)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-heading font-black">{agent.name}</h3>
                                        <Badge variant="secondary" className="px-3 py-1 font-black text-[10px] tracking-widest uppercase rounded-lg border border-primary/10 text-primary">
                                            Elite Estate Director
                                        </Badge>
                                    </div>

                                    <div className="w-full grid grid-cols-2 gap-4 py-6 border-y border-border/60">
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] font-black uppercase text-muted-foreground">Status</p>
                                            <p className="text-sm font-bold text-emerald-500 flex items-center justify-center gap-1.5">
                                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                                Online
                                            </p>
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] font-black uppercase text-muted-foreground">Experience</p>
                                            <p className="text-sm font-bold">5+ Years</p>
                                        </div>
                                    </div>

                                    <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                                    <div className="w-full space-y-4">
                                        <Button className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                                            <Mail className="mr-3 h-5 w-5" />
                                            Request Consultation
                                        </Button>
                                        <Button variant="outline" className="w-full h-14 rounded-2xl border-border font-bold hover:bg-muted transition-all">
                                            View Portfolio
                                        </Button>
                                    </div>

                                    <div className="flex items-center gap-3 pt-2 text-muted-foreground">
                                        <div className="flex -space-x-3">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="h-10 w-10 rounded-full border-4 border-card bg-muted flex items-center justify-center">
                                                    <Avatar className="h-full w-full">
                                                        <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">U{i}</AvatarFallback>
                                                    </Avatar>
                                                </div>
                                            ))}
                                        </div>
                                        <span className="text-xs font-bold italic">+ 12 inquiries today</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Quick Stats Gallery */}
                    {property.images.length > 1 && (
                        <Card className="rounded-[40px] border-border bg-muted/20 p-8 shadow-sm">
                            <h3 className="text-lg font-heading font-black tracking-tight mb-6">Visual Portfolio ({property.images.length})</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {property.images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentImage(i)}
                                        className={cn(
                                            "relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-black/5",
                                            currentImage === i
                                                ? "border-primary ring-4 ring-primary/20"
                                                : "border-transparent opacity-60 hover:opacity-100"
                                        )}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${property.title} - ${i + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="100px"
                                        />
                                    </button>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
