import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
    getPropertyById,
    updateProperty,
    deleteProperty,
} from "@/services/property.service";
import { z } from "zod";

const updateSchema = z.object({
    title: z.string().min(3).max(200).optional(),
    description: z.string().min(10).max(5000).optional(),
    price: z.number().positive().optional(),
    location: z.string().min(2).optional(),
    images: z.array(z.string()).optional(),
    propertyType: z.enum(["house", "apartment", "land"]).optional(),
    bedrooms: z.number().int().min(0).optional(),
    bathrooms: z.number().int().min(0).optional(),
    area: z.number().positive().optional(),
});

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const property = await getPropertyById(id);

        if (!property) {
            return NextResponse.json(
                { success: false, error: "Property not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: property });
    } catch (error) {
        console.error("GET /api/properties/[id] error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch property" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        if (!session?.user || session.user.role !== "agent") {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 403 }
            );
        }

        const { id } = await params;
        const body = await request.json();
        const validated = updateSchema.safeParse(body);

        if (!validated.success) {
            return NextResponse.json(
                { success: false, error: validated.error.issues[0].message },
                { status: 400 }
            );
        }

        const property = await updateProperty(id, validated.data, session.user.id);

        return NextResponse.json({ success: true, data: property });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Failed to update property";
        const status = message.includes("Not authorized") ? 403 : 500;
        return NextResponse.json(
            { success: false, error: message },
            { status }
        );
    }
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        if (!session?.user || session.user.role !== "agent") {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 403 }
            );
        }

        const { id } = await params;
        await deleteProperty(id, session.user.id);

        return NextResponse.json({ success: true });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Failed to delete property";
        const status = message.includes("Not authorized") ? 403 : 500;
        return NextResponse.json(
            { success: false, error: message },
            { status }
        );
    }
}
