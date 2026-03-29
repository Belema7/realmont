import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import type { RegisterFormData } from "@/types";
import bcrypt from "bcryptjs";

export async function getUserByEmail(email: string) {
    await connectToDatabase();
    const user = await User.findOne({ email: email.toLowerCase() }).lean();
    return user ? JSON.parse(JSON.stringify(user)) : null;
}

export async function getUserById(id: string) {
    await connectToDatabase();
    const user = await User.findById(id).select("-password").lean();
    return user ? JSON.parse(JSON.stringify(user)) : null;
}

export async function createUser(data: RegisterFormData) {
    await connectToDatabase();

    const existingUser = await User.findOne({
        email: data.email.toLowerCase(),
    });

    if (existingUser) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await User.create({
        ...data,
        email: data.email.toLowerCase(),
        password: hashedPassword,
    });

    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
    };
}

export async function toggleSavedProperty(
    userId: string,
    propertyId: string
) {
    await connectToDatabase();

    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    const index = user.savedProperties.indexOf(
        propertyId as unknown as typeof user.savedProperties[0]
    );

    if (index > -1) {
        user.savedProperties.splice(index, 1);
    } else {
        user.savedProperties.push(
            propertyId as unknown as typeof user.savedProperties[0]
        );
    }

    await user.save();

    return {
        saved: index === -1,
        savedProperties: user.savedProperties.map((id) => id.toString()),
    };
}

export async function getSavedProperties(userId: string) {
    await connectToDatabase();

    const user = await User.findById(userId)
        .populate({
            path: "savedProperties",
            populate: {
                path: "createdBy",
                select: "name email image",
            },
        })
        .lean();

    if (!user) {
        throw new Error("User not found");
    }

    return JSON.parse(JSON.stringify(user.savedProperties));
}
