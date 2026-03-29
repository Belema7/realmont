import { getPropertyById } from "@/services/property.service";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { EditPropertyClient } from "./EditPropertyClient";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function EditPropertyPage({ params }: Props) {
    const session = await auth();

    if (!session?.user || session.user.role !== "agent") {
        redirect("/dashboard");
    }

    const { id } = await params;
    const property = await getPropertyById(id);

    if (!property) {
        notFound();
    }

    // Only allow the owner to edit
    const createdById =
        typeof property.createdBy === "object"
            ? property.createdBy._id
            : property.createdBy;

    if (createdById !== session.user.id) {
        redirect("/dashboard");
    }

    return <EditPropertyClient property={property} />;
}
