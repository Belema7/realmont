import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getProperties, createProperty } from "@/services/property.service";
import { z } from "zod";
import type { PropertyType } from "@/types";

const propertySchema = z.object({
    title: z.string().min(3).max(200),
    description: z.string().min(10).max(5000),
    price: z.number().positive(),
    location: z.string().min(2),
    images: z.array(z.string()).default([]),
    propertyType: z.enum(["house", "apartment", "land"]),
    bedrooms: z.number().int().min(0),
    bathrooms: z.number().int().min(0),
    area: z.number().positive(),
});

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const filters = {
            location: searchParams.get("location") || undefined,
            minPrice: searchParams.get("minPrice")
                ? Number(searchParams.get("minPrice"))
                : undefined,
            maxPrice: searchParams.get("maxPrice")
                ? Number(searchParams.get("maxPrice"))
                : undefined,
            propertyType: (searchParams.get("propertyType") as PropertyType) || undefined,
            page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
            limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 12,
        };

        const result = await getProperties(filters);

        return NextResponse.json({ success: true, ...result });
    } catch (error) {
        console.error("GET /api/properties error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch properties" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user || session.user.role !== "agent") {
            return NextResponse.json(
                { success: false, error: "Unauthorized. Only agents can create listings." },
                { status: 403 }
            );
        }

        const body = await request.json();
        const validated = propertySchema.safeParse(body);

        if (!validated.success) {
            return NextResponse.json(
                { success: false, error: validated.error.issues[0].message },
                { status: 400 }
            );
        }

        const property = await createProperty(validated.data, session.user.id);

        return NextResponse.json(
            { success: true, data: property },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST /api/properties error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create property" },
            { status: 500 }
        );
    }
}
