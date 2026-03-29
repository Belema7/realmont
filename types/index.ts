import { Types } from "mongoose";

// ─── User Types ───────────────────────────────────────────────────────
export type UserRole = "buyer" | "agent";

export interface IUser {
    _id: string;
    name: string;
    email: string;
    password: string;
    image?: string;
    role: UserRole;
    savedProperties: string[];
    createdAt: Date;
    updatedAt: Date;
}

export type SafeUser = Omit<IUser, "password">;

// ─── Property Types ───────────────────────────────────────────────────
export type PropertyType = "house" | "apartment" | "land";

export interface IProperty {
    _id: string;
    title: string;
    description: string;
    price: number;
    location: string;
    images: string[];
    propertyType: PropertyType;
    bedrooms: number;
    bathrooms: number;
    area: number;
    createdBy: string | IUser;
    createdAt: Date;
    updatedAt: Date;
}

// ─── API Types ────────────────────────────────────────────────────────
export interface PropertyFilters {
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    propertyType?: PropertyType;
    page?: number;
    limit?: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    totalPages: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

// ─── Form Types ───────────────────────────────────────────────────────
export interface PropertyFormData {
    title: string;
    description: string;
    price: number;
    location: string;
    images: string[];
    propertyType: PropertyType;
    bedrooms: number;
    bathrooms: number;
    area: number;
}

export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    role: UserRole;
}

export interface LoginFormData {
    email: string;
    password: string;
}

// ─── Session Types ────────────────────────────────────────────────────
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
            role: UserRole;
            image?: string | null;
        };
    }

    interface User {
        id?: string;
        role?: UserRole;
    }
}

// declare module "next-auth/jwt" {
//     interface JWT {
//         id: string;
//         role: UserRole;
//     }
// }
