"use client";

import { useSession } from "next-auth/react";
import type { UserRole } from "@/types";

export function useAuth() {
    const { data: session, status } = useSession();

    return {
        user: session?.user
            ? {
                id: session.user.id,
                name: session.user.name ?? "",
                email: session.user.email ?? "",
                role: session.user.role as UserRole,
                image: session.user.image ?? undefined,
            }
            : null,
        isAuthenticated: status === "authenticated",
        isLoading: status === "loading",
        isAgent: session?.user?.role === "agent",
        isBuyer: session?.user?.role === "buyer",
    };
}
