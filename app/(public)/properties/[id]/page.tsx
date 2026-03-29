import { getPropertyById } from "@/services/property.service";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import { PropertyDetailClient } from "./PropertyDetailClient";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function PropertyDetailPage({ params }: Props) {
    const { id } = await params;
    const property = await getPropertyById(id);

    if (!property) {
        notFound();
    }

    const session = await auth();
    const userId = session?.user?.id;

    return <PropertyDetailClient property={property} userId={userId} />;
}
