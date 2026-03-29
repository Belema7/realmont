import mongoose, { Schema, model, models, Document } from "mongoose";
import type { IProperty } from "@/types";

export interface IPropertyDocument extends Omit<IProperty, "_id" | "createdBy">, Document {
    createdBy: mongoose.Types.ObjectId;
}

const PropertySchema = new Schema<IPropertyDocument>(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            maxlength: [200, "Title cannot exceed 200 characters"],
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            maxlength: [5000, "Description cannot exceed 5000 characters"],
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price must be a positive number"],
        },
        location: {
            type: String,
            required: [true, "Location is required"],
            trim: true,
        },
        images: {
            type: [String],
            default: [],
        },
        propertyType: {
            type: String,
            enum: ["house", "apartment", "land"],
            required: [true, "Property type is required"],
        },
        bedrooms: {
            type: Number,
            required: [true, "Number of bedrooms is required"],
            min: [0, "Bedrooms must be a non-negative number"],
        },
        bathrooms: {
            type: Number,
            required: [true, "Number of bathrooms is required"],
            min: [0, "Bathrooms must be a non-negative number"],
        },
        area: {
            type: Number,
            required: [true, "Area is required"],
            min: [0, "Area must be a positive number"],
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Creator is required"],
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient querying
PropertySchema.index({ location: "text", title: "text" });
PropertySchema.index({ price: 1 });
PropertySchema.index({ propertyType: 1 });
PropertySchema.index({ createdBy: 1 });

const Property =
    (models.Property as mongoose.Model<IPropertyDocument>) ||
    model<IPropertyDocument>("Property", PropertySchema);

export default Property;
