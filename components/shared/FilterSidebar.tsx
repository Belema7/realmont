"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal, X, Search, Filter } from "lucide-react";
import type { PropertyFilters, PropertyType } from "@/types";

interface FilterSidebarProps {
    filters: PropertyFilters;
    onFilterChange: (filters: PropertyFilters) => void;
}

function FilterContent({
    filters,
    onFilterChange,
}: FilterSidebarProps) {
    const [localLocation, setLocalLocation] = useState(filters.location || "");

    // Debounce location input
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localLocation !== (filters.location || "")) {
                onFilterChange({ ...filters, location: localLocation || undefined, page: 1 });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [localLocation]);

    const handlePriceChange = useCallback(
        (key: "minPrice" | "maxPrice", value: string) => {
            const num = value ? Number(value) : undefined;
            onFilterChange({ ...filters, [key]: num, page: 1 });
        },
        [filters, onFilterChange]
    );

    const handleTypeChange = useCallback(
        (value: string) => {
            onFilterChange({
                ...filters,
                propertyType: value === "all" ? undefined : (value as PropertyType),
                page: 1,
            });
        },
        [filters, onFilterChange]
    );

    const handleClear = useCallback(() => {
        setLocalLocation("");
        onFilterChange({ page: 1 });
    }, [onFilterChange]);

    const hasActiveFilters =
        filters.location ||
        filters.minPrice ||
        filters.maxPrice ||
        filters.propertyType;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between pb-2">
                <h3 className="text-xl font-heading font-black flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Filter className="h-4 w-4" />
                    </div>
                    Intelligence
                </h3>
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClear}
                        className="text-primary hover:text-primary hover:bg-primary/5 h-8 font-bold text-[10px] uppercase tracking-widest gap-1"
                    >
                        <X className="h-3 w-3" />
                        Reset
                    </Button>
                )}
            </div>

            {/* Location */}
            <div className="space-y-3">
                <Label htmlFor="location" className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                    Target Geography
                </Label>
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input
                        id="location"
                        placeholder="Search regions..."
                        value={localLocation}
                        onChange={(e) => setLocalLocation(e.target.value)}
                        className="pl-10 h-11 rounded-xl border-border focus-visible:ring-primary/20 bg-muted/30"
                    />
                </div>
            </div>

            {/* Property type */}
            <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Asset Classification</Label>
                <Select
                    value={filters.propertyType || "all"}
                    onValueChange={(v) => handleTypeChange(v || "all")}
                >
                    <SelectTrigger className="h-11 rounded-xl border-border focus:ring-primary/20 bg-muted/30">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border">
                        <SelectItem value="all">All Portfolios</SelectItem>
                        <SelectItem value="house">🏠 Residential House</SelectItem>
                        <SelectItem value="apartment">🏢 Modern Apartment</SelectItem>
                        <SelectItem value="land">🌍 Investment Land</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Price range */}
            <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Valuation Range ($)</Label>
                <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[10px] font-bold">MIN</span>
                        <Input
                            type="number"
                            placeholder="0"
                            value={filters.minPrice || ""}
                            onChange={(e) => handlePriceChange("minPrice", e.target.value)}
                            className="pl-10 h-11 rounded-xl border-border focus-visible:ring-primary/20 bg-muted/30 font-mono text-sm"
                        />
                    </div>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[10px] font-bold">MAX</span>
                        <Input
                            type="number"
                            placeholder="Any"
                            value={filters.maxPrice || ""}
                            onChange={(e) => handlePriceChange("maxPrice", e.target.value)}
                            className="pl-10 h-11 rounded-xl border-border focus-visible:ring-primary/20 bg-muted/30 font-mono text-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="pt-6">
                <div className="rounded-2xl bg-primary/5 p-4 border border-primary/10">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2 text-center">Market Pulse</p>
                    <p className="text-xs text-muted-foreground text-center font-medium leading-relaxed italic">
                        &quot;Filtering by regional trends ensures maximum ROI on your residential acquisition.&quot;
                    </p>
                </div>
            </div>
        </div>
    );
}

export function FilterSidebar(props: FilterSidebarProps) {
    return (
        <>
            {/* Desktop sidebar */}
            <aside className="hidden lg:block w-72 shrink-0">
                <div className="sticky top-24 rounded-[32px] border border-border bg-card/50 backdrop-blur-xl p-8 shadow-sm">
                    <FilterContent {...props} />
                </div>
            </aside>

            {/* Mobile sheet */}
            <div className="lg:hidden">
                <Sheet>
                    <SheetTrigger
                        render={
                            <Button variant="outline" className="h-11 rounded-xl border-border bg-card shadow-sm gap-2 px-6 font-bold text-sm">
                                <SlidersHorizontal className="h-4 w-4" />
                                Portfolio Filters
                            </Button>
                        }
                    />
                    <SheetContent side="left" className="w-80 pt-12 border-r border-border rounded-r-[32px]">
                        <FilterContent {...props} />
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}
