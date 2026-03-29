import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
    getSavedProperties,
    toggleSavedProperty,
} from "@/services/user.service";

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const properties = await getSavedProperties(session.user.id);

        return NextResponse.json({ success: true, data: properties });
    } catch (error) {
        console.error("GET /api/properties/saved error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch saved properties" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { propertyId } = await request.json();

        if (!propertyId) {
            return NextResponse.json(
                { success: false, error: "Property ID is required" },
                { status: 400 }
            );
        }

        const result = await toggleSavedProperty(session.user.id, propertyId);

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        console.error("POST /api/properties/saved error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to toggle save" },
            { status: 500 }
        );
    }
}
