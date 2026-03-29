"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FilterSidebar } from "@/components/shared/FilterSidebar";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { useProperties, useSavedProperties } from "@/hooks/useProperties";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Building2, Map } from "lucide-react";
import type { PropertyFilters, PropertyType } from "@/types";
import { Badge } from "@/components/ui/badge";

import { Suspense } from "react";

function PropertiesContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    const [filters, setFilters] = useState<PropertyFilters>({
        location: searchParams.get("location") || undefined,
        minPrice: searchParams.get("minPrice")
            ? Number(searchParams.get("minPrice"))
            : undefined,
        maxPrice: searchParams.get("maxPrice")
            ? Number(searchParams.get("maxPrice"))
            : undefined,
        propertyType:
            (searchParams.get("propertyType") as PropertyType) || undefined,
        page: 1,
    });

    const { data, isLoading } = useProperties(filters);
    const { data: savedData } = useSavedProperties();

    const savedIds =
        isAuthenticated && savedData?.data
            ? savedData.data.map((p) => p._id)
            : [];

    const handleFilterChange = (newFilters: PropertyFilters) => {
        setFilters(newFilters);

        // Update URL params
        const params = new URLSearchParams();
        if (newFilters.location) params.set("location", newFilters.location);
        if (newFilters.minPrice) params.set("minPrice", String(newFilters.minPrice));
        if (newFilters.maxPrice) params.set("maxPrice", String(newFilters.maxPrice));
        if (newFilters.propertyType) params.set("propertyType", newFilters.propertyType);
        router.push(`/properties?${params.toString()}`, { scroll: false });
    };

    const totalPages = data?.totalPages || 1;

    return (
        <div className="container mx-auto px-4 py-12 space-y-10">
            {/* Header / Search Summary */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px]">
                        <Map className="h-3 w-3" />
                        Global Inventory
                    </div>
                    <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight">Available Assets</h1>
                    <p className="text-muted-foreground font-medium flex items-center gap-2">
                        {isLoading ? (
                            <span className="flex items-center gap-2 italic animate-pulse">
                                Analyzing market data...
                            </span>
                        ) : (
                            <>
                                <span className="text-foreground font-bold">{data?.total || 0}</span>
                                matching properties identified in current sector
                            </>
                        )}
                    </p>
                </div>
                {!isLoading && data?.total && (
                    <Badge variant="secondary" className="h-9 px-4 rounded-xl font-bold border border-primary/10 text-primary bg-primary/5">
                        <Building2 className="h-3.5 w-3.5 mr-2 opacity-70" />
                        Active Listings
                    </Badge>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                <FilterSidebar
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />

                <div className="flex-1 space-y-12">
                    <PropertyGrid
                        properties={data?.data || []}
                        isLoading={isLoading}
                        savedPropertyIds={savedIds}
                    />

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-8 border-t border-border/50">
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                                Iteration <span className="text-foreground">{filters.page || 1}</span> of <span className="text-foreground">{totalPages}</span>
                            </p>
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    className="h-11 rounded-xl border-border hover:bg-muted font-bold px-6 gap-2"
                                    disabled={filters.page === 1}
                                    onClick={() =>
                                        setFilters((f) => ({ ...f, page: (f.page || 1) - 1 }))
                                    }
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-11 rounded-xl border-border hover:bg-muted font-bold px-6 gap-2"
                                    disabled={(filters.page || 1) >= totalPages}
                                    onClick={() =>
                                        setFilters((f) => ({ ...f, page: (f.page || 1) + 1 }))
                                    }
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function PropertiesPage() {
    return (
        <Suspense fallback={
            <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center space-y-4 animate-pulse">
                <Building2 className="h-12 w-12 text-primary opacity-20" />
                <p className="text-muted-foreground font-bold tracking-widest uppercase text-xs">Initializing sector data</p>
            </div>
        }>
            <PropertiesContent />
        </Suspense>
    );
}
