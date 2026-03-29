"use client";

import { useRouter } from "next/navigation";
import { PropertyForm } from "@/components/forms/PropertyForm";
import { useUpdateProperty } from "@/hooks/useProperties";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { IProperty, PropertyFormData } from "@/types";

interface EditPropertyClientProps {
    property: IProperty;
}

export function EditPropertyClient({ property }: EditPropertyClientProps) {
    const router = useRouter();
    const updateProperty = useUpdateProperty();

    const handleSubmit = async (data: PropertyFormData) => {
        try {
            await updateProperty.mutateAsync({
                id: property._id,
                data,
            });
            toast.success("Property updated successfully!");
            router.push("/dashboard");
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Failed to update property";
            toast.error(message);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8">
                <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="gap-1 mb-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold">Edit Property</h1>
                <p className="mt-1 text-muted-foreground">
                    Update your property listing
                </p>
            </div>

            <PropertyForm
                initialData={{
                    title: property.title,
                    description: property.description,
                    price: property.price,
                    location: property.location,
                    images: property.images,
                    propertyType: property.propertyType,
                    bedrooms: property.bedrooms,
                    bathrooms: property.bathrooms,
                    area: property.area,
                }}
                onSubmit={handleSubmit}
                isSubmitting={updateProperty.isPending}
                submitLabel="Update Property"
            />
        </div>
    );
}
