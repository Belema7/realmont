"use client";

import { PropertyCard } from "./PropertyCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, SearchX } from "lucide-react";
import type { IProperty } from "@/types";

interface PropertyGridProps {
    properties: IProperty[];
    isLoading?: boolean;
    savedPropertyIds?: string[];
    emptyMessage?: string;
}

function PropertyCardSkeleton() {
    return (
        <div className="rounded-2xl border bg-card overflow-hidden">
            <Skeleton className="aspect-[4/3] w-full" />
            <div className="p-5 space-y-4">
                <Skeleton className="h-7 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-1/2 rounded-md" />
                <div className="flex justify-between items-center pt-4 border-t border-border/50">
                    <div className="flex gap-3">
                        <Skeleton className="h-4 w-10 rounded-md" />
                        <Skeleton className="h-4 w-10 rounded-md" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-md" />
                </div>
            </div>
        </div>
    );
}

export function PropertyGrid({
    properties,
    isLoading = false,
    savedPropertyIds = [],
    emptyMessage = "No relevant properties identified in the current sector.",
}: PropertyGridProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <PropertyCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (!properties || properties.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-center bg-muted/5 rounded-[40px] border border-dashed border-border/40">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted/20 mb-8 border border-border/10">
                    <SearchX className="h-10 w-10 text-muted-foreground/30" />
                </div>
                <h3 className="text-2xl font-heading font-black tracking-tight text-foreground max-w-sm mx-auto mb-3">
                    {emptyMessage}
                </h3>
                <p className="text-muted-foreground font-medium max-w-xs mx-auto italic">
                    Consider broadening your technical criteria or exploring adjacent geography.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
                <PropertyCard
                    key={property._id}
                    property={property}
                    savedPropertyIds={savedPropertyIds}
                />
            ))}
        </div>
    );
}
