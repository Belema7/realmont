import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user || session.user.role !== "agent") {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 403 }
            );
        }

        const { images } = await request.json();

        if (!images || !Array.isArray(images) || images.length === 0) {
            return NextResponse.json(
                { success: false, error: "No images provided" },
                { status: 400 }
            );
        }

        const uploadPromises = images.map((image: string) => uploadImage(image));
        const urls = await Promise.all(uploadPromises);

        return NextResponse.json({ success: true, data: urls });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to upload images" },
            { status: 500 }
        );
    }
}
