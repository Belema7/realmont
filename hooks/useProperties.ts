"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { PropertyFilters, IProperty, PaginatedResponse, PropertyFormData } from "@/types";

async function fetchProperties(
    filters: PropertyFilters
): Promise<PaginatedResponse<IProperty> & { success: boolean }> {
    const params = new URLSearchParams();

    if (filters.location) params.set("location", filters.location);
    if (filters.minPrice) params.set("minPrice", String(filters.minPrice));
    if (filters.maxPrice) params.set("maxPrice", String(filters.maxPrice));
    if (filters.propertyType) params.set("propertyType", filters.propertyType);
    if (filters.page) params.set("page", String(filters.page));
    if (filters.limit) params.set("limit", String(filters.limit));

    const res = await fetch(`/api/properties?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch properties");
    return res.json();
}

async function fetchProperty(id: string): Promise<{ success: boolean; data: IProperty }> {
    const res = await fetch(`/api/properties/${id}`);
    if (!res.ok) throw new Error("Failed to fetch property");
    return res.json();
}

async function fetchSavedProperties(): Promise<{ success: boolean; data: IProperty[] }> {
    const res = await fetch("/api/properties/saved");
    if (!res.ok) throw new Error("Failed to fetch saved properties");
    return res.json();
}

export function useProperties(filters: PropertyFilters = {}) {
    return useQuery({
        queryKey: ["properties", filters],
        queryFn: () => fetchProperties(filters),
    });
}

export function useProperty(id: string) {
    return useQuery({
        queryKey: ["property", id],
        queryFn: () => fetchProperty(id),
        enabled: !!id,
    });
}

export function useSavedProperties() {
    return useQuery({
        queryKey: ["savedProperties"],
        queryFn: fetchSavedProperties,
    });
}

export function useCreateProperty() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: PropertyFormData) => {
            const res = await fetch("/api/properties", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to create property");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["properties"] });
        },
    });
}

export function useUpdateProperty() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: PropertyFormData }) => {
            const res = await fetch(`/api/properties/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to update property");
            }
            return res.json();
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["properties"] });
            queryClient.invalidateQueries({ queryKey: ["property", variables.id] });
        },
    });
}

export function useDeleteProperty() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/properties/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to delete property");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["properties"] });
        },
    });
}

export function useToggleSave() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (propertyId: string) => {
            const res = await fetch("/api/properties/saved", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ propertyId }),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to toggle save");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["savedProperties"] });
            queryClient.invalidateQueries({ queryKey: ["properties"] });
        },
    });
}
