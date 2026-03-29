"use client";

import { useRouter } from "next/navigation";
import { PropertyForm } from "@/components/forms/PropertyForm";
import { useCreateProperty } from "@/hooks/useProperties";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { PropertyFormData } from "@/types";

export default function CreatePropertyPage() {
    const router = useRouter();
    const createProperty = useCreateProperty();

    const handleSubmit = async (data: PropertyFormData) => {
        try {
            await createProperty.mutateAsync(data);
            toast.success("Property created successfully!");
            router.push("/dashboard");
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to create property";
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
                <h1 className="text-3xl font-bold">Create Property</h1>
                <p className="mt-1 text-muted-foreground">
                    Add a new property listing
                </p>
            </div>

            <PropertyForm
                onSubmit={handleSubmit}
                isSubmitting={createProperty.isPending}
                submitLabel="Create Property"
            />
        </div>
    );
}
