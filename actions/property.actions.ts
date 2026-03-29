"use server";

import { auth } from "@/lib/auth";
import {
    createProperty,
    updateProperty,
    deleteProperty,
} from "@/services/property.service";
import { toggleSavedProperty } from "@/services/user.service";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const propertySchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(200),
    description: z.string().min(10, "Description must be at least 10 characters").max(5000),
    price: z.number().positive("Price must be positive"),
    location: z.string().min(2, "Location is required"),
    images: z.array(z.string()).default([]),
    propertyType: z.enum(["house", "apartment", "land"]),
    bedrooms: z.number().int().min(0, "Must be 0 or more"),
    bathrooms: z.number().int().min(0, "Must be 0 or more"),
    area: z.number().positive("Area must be positive"),
});

export async function createPropertyAction(data: z.infer<typeof propertySchema>) {
    const session = await auth();

    if (!session?.user || session.user.role !== "agent") {
        return { success: false, error: "Unauthorized. Only agents can create properties." };
    }

    const validated = propertySchema.safeParse(data);
    if (!validated.success) {
        return { success: false, error: validated.error.issues[0].message };
    }

    try {
        const property = await createProperty(validated.data, session.user.id);
        revalidatePath("/properties");
        revalidatePath("/dashboard");
        return { success: true, data: property };
    } catch (error) {
        return { success: false, error: "Failed to create property" };
    }
}

export async function updatePropertyAction(
    id: string,
    data: z.infer<typeof propertySchema>
) {
    const session = await auth();

    if (!session?.user || session.user.role !== "agent") {
        return { success: false, error: "Unauthorized" };
    }

    const validated = propertySchema.safeParse(data);
    if (!validated.success) {
        return { success: false, error: validated.error.issues[0].message };
    }

    try {
        const property = await updateProperty(id, validated.data, session.user.id);
        revalidatePath("/properties");
        revalidatePath(`/properties/${id}`);
        revalidatePath("/dashboard");
        return { success: true, data: property };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to update property";
        return { success: false, error: message };
    }
}

export async function deletePropertyAction(id: string) {
    const session = await auth();

    if (!session?.user || session.user.role !== "agent") {
        return { success: false, error: "Unauthorized" };
    }

    try {
        await deleteProperty(id, session.user.id);
        revalidatePath("/properties");
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to delete property";
        return { success: false, error: message };
    }
}

export async function toggleSavePropertyAction(propertyId: string) {
    const session = await auth();

    if (!session?.user) {
        return { success: false, error: "Please log in to save properties" };
    }

    try {
        const result = await toggleSavedProperty(session.user.id, propertyId);
        revalidatePath("/properties");
        revalidatePath("/dashboard");
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: "Failed to save property" };
    }
}
