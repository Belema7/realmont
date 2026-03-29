import mongoose, { Schema, model, models, Document } from "mongoose";
import type { IUser } from "@/types";

export interface IUserDocument extends Omit<IUser, "_id">, Document { }

const UserSchema = new Schema<IUserDocument>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            maxlength: [100, "Name cannot exceed 100 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
        },
        image: {
            type: String,
            default: "",
        },
        role: {
            type: String,
            enum: ["buyer", "agent"],
            default: "buyer",
        },
        savedProperties: [
            {
                type: Schema.Types.ObjectId,
                ref: "Property",
            },
        ],
    },
    {
        timestamps: true,
    }
);

const User =
    (models.User as mongoose.Model<IUserDocument>) ||
    model<IUserDocument>("User", UserSchema);

export default User;
