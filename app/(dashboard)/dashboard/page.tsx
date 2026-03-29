import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getPropertiesByUser } from "@/services/property.service";
import { getSavedProperties } from "@/services/user.service";
import { DashboardClient } from "./DashboardClient";

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const isAgent = session.user.role === "agent";

    let properties = [];
    let savedProperties = [];

    try {
        if (isAgent) {
            properties = await getPropertiesByUser(session.user.id);
        } else {
            savedProperties = await getSavedProperties(session.user.id);
        }
    } catch {
        // Handle gracefully
    }

    return (
        <DashboardClient
            user={session.user}
            isAgent={isAgent}
            properties={properties}
            savedProperties={savedProperties}
        />
    );
}
