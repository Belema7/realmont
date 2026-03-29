import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["buyer", "agent"]),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validated = registerSchema.safeParse(body);

        if (!validated.success) {
            return NextResponse.json(
                { success: false, error: validated.error.issues[0].message },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const existingUser = await User.findOne({
            email: validated.data.email.toLowerCase(),
        });

        if (existingUser) {
            return NextResponse.json(
                { success: false, error: "An account with this email already exists" },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(validated.data.password, 12);

        const user = await User.create({
            ...validated.data,
            email: validated.data.email.toLowerCase(),
            password: hashedPassword,
        });

        return NextResponse.json(
            {
                success: true,
                data: {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
