"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, BedDouble, Bath, Ruler, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { IProperty } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { useToggleSave } from "@/hooks/useProperties";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
    property: IProperty;
    savedPropertyIds?: string[];
}

const typeColors: Record<string, string> = {
    house: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    apartment: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    land: "bg-amber-500/10 text-amber-600 border-amber-500/20",
};

function formatPrice(price: number): string {
    if (price >= 1_000_000) {
        return `$${(price / 1_000_000).toFixed(1)}M`;
    }
    if (price >= 1_000) {
        return `$${(price / 1_000).toFixed(0)}K`;
    }
    return `$${price.toLocaleString()}`;
}

export function PropertyCard({ property, savedPropertyIds = [] }: PropertyCardProps) {
    const { isAuthenticated } = useAuth();
    const toggleSave = useToggleSave();
    const isSaved = savedPropertyIds.includes(property._id);

    const handleSave = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            toast.error("Please log in to save properties");
            return;
        }

        toggleSave.mutate(property._id, {
            onSuccess: () => {
                toast.success(isSaved ? "Removed from saved" : "Property saved!");
            },
            onError: () => {
                toast.error("Failed to save property");
            },
        });
    };

    return (
        <Link href={`/properties/${property._id}`}>
            <Card className="group overflow-hidden border-border bg-card transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1.5 rounded-2xl">
                {/* Image container */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
                    {property.images && property.images.length > 0 ? (
                        <Image
                            src={property.images[0]}
                            alt={property.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center bg-muted">
                            <Building2 className="h-16 w-16 text-muted-foreground/20" />
                        </div>
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Price badge */}
                    <div className="absolute top-4 left-4">
                        <Badge className="bg-background/95 text-foreground backdrop-blur-md border border-border shadow-sm text-sm font-bold px-3 py-1 rounded-lg">
                            {formatPrice(property.price)}
                        </Badge>
                    </div>

                    {/* Save button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "absolute top-4 right-4 h-10 w-10 rounded-xl bg-background/95 backdrop-blur-md shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-background active:scale-90",
                            isSaved && "opacity-100 text-destructive bg-background"
                        )}
                        onClick={handleSave}
                    >
                        <Heart
                            className={cn("h-5 w-5", isSaved && "fill-current")}
                        />
                    </Button>

                    {/* Type badge */}
                    <div className="absolute bottom-4 left-4">
                        <Badge
                            variant="outline"
                            className={cn(
                                "backdrop-blur-md border text-[10px] uppercase font-bold tracking-wider px-2 h-6 rounded-md bg-background/50",
                                typeColors[property.propertyType]
                            )}
                        >
                            {property.propertyType}
                        </Badge>
                    </div>
                </div>

                <CardContent className="p-5 space-y-4">
                    {/* Header info */}
                    <div className="space-y-1">
                        <h3 className="font-heading font-bold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                            {property.title}
                        </h3>
                        {/* Location */}
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                            <span className="text-xs font-medium line-clamp-1 italic">{property.location}</span>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        {property.propertyType !== "land" ? (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                                    <BedDouble className="h-4 w-4 text-primary/70" />
                                    <span>{property.bedrooms}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                                    <Bath className="h-4 w-4 text-primary/70" />
                                    <span>{property.bathrooms}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="h-4" />
                        )}
                        <div className="flex items-center gap-1.5 text-xs font-bold text-foreground bg-muted/50 px-2 py-1 rounded-md border border-border/50">
                            <Ruler className="h-3.5 w-3.5 text-primary" />
                            <span>{property.area} <span className="text-[10px] text-muted-foreground uppercase">sqft</span></span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
