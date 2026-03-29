import { connectToDatabase } from "@/lib/db";
import Property from "@/models/Property";
import type { PropertyFilters, PropertyFormData } from "@/types";

import type { IPropertyDocument } from "@/models/Property";

export async function getProperties(filters: PropertyFilters = {}) {
    await connectToDatabase();

    const query: Record<string, any> = {};

    if (filters.location) {
        query.location = { $regex: filters.location, $options: "i" };
    }

    if (filters.minPrice || filters.maxPrice) {
        query.price = {};
        if (filters.minPrice) query.price.$gte = filters.minPrice;
        if (filters.maxPrice) query.price.$lte = filters.maxPrice;
    }

    if (filters.propertyType) {
        query.propertyType = filters.propertyType;
    }

    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const skip = (page - 1) * limit;

    const [properties, total] = await Promise.all([
        Property.find(query)
            .populate("createdBy", "name email image")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Property.countDocuments(query),
    ]);

    return {
        data: JSON.parse(JSON.stringify(properties)),
        total,
        page,
        totalPages: Math.ceil(total / limit),
    };
}

export async function getPropertyById(id: string) {
    await connectToDatabase();

    const property = await Property.findById(id)
        .populate("createdBy", "name email image")
        .lean();

    if (!property) return null;

    return JSON.parse(JSON.stringify(property));
}

export async function getFeaturedProperties(limit = 6) {
    await connectToDatabase();

    const properties = await Property.find({})
        .populate("createdBy", "name email image")
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

    return JSON.parse(JSON.stringify(properties));
}

export async function getPropertiesByUser(userId: string) {
    await connectToDatabase();

    const properties = await Property.find({ createdBy: userId })
        .sort({ createdAt: -1 })
        .lean();

    return JSON.parse(JSON.stringify(properties));
}

export async function createProperty(
    data: PropertyFormData,
    userId: string
) {
    await connectToDatabase();

    const property = await Property.create({
        ...data,
        createdBy: userId,
    });

    return JSON.parse(JSON.stringify(property));
}

export async function updateProperty(
    id: string,
    data: Partial<PropertyFormData>,
    userId: string
) {
    await connectToDatabase();

    const property = await Property.findById(id);

    if (!property) {
        throw new Error("Property not found");
    }

    if (property.createdBy.toString() !== userId) {
        throw new Error("Not authorized to update this property");
    }

    const updated = await Property.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    }).lean();

    return JSON.parse(JSON.stringify(updated));
}

export async function deleteProperty(id: string, userId: string) {
    await connectToDatabase();

    const property = await Property.findById(id);

    if (!property) {
        throw new Error("Property not found");
    }

    if (property.createdBy.toString() !== userId) {
        throw new Error("Not authorized to delete this property");
    }

    await Property.findByIdAndDelete(id);

    return { success: true };
}
