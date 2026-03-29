import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { getFeaturedProperties } from "@/services/property.service";

export interface FeaturedPropertiesSectionProps {
  title?: string;
  description?: string;
  limit?: number;
  viewAllHref?: string;
}

export function FeaturedPropertiesSectionSkeleton({
  title = "Featured Properties",
  description = "A curated selection of recent listings.",
}: Pick<FeaturedPropertiesSectionProps, "title" | "description">) {
  return (
    <section className="bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              {title}
            </h2>
            <p className="mt-3 text-muted-foreground">{description}</p>
          </div>
          <div className="h-9 w-28 rounded-lg bg-card" />
        </div>

        <div className="mt-10">
          <PropertyGrid properties={[]} isLoading />
        </div>
      </div>
    </section>
  );
}

export async function FeaturedPropertiesSection({
  title = "Featured Properties",
  description = "A curated selection of recent listings.",
  limit = 6,
  viewAllHref = "/properties",
}: FeaturedPropertiesSectionProps) {
  let properties = [];
  try {
    properties = await getFeaturedProperties(limit);
  } catch {
    // DB not connected yet — show empty state gracefully
  }

  return (
    <section className="bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              {title}
            </h2>
            <p className="mt-3 text-muted-foreground">{description}</p>
          </div>

          <Link href={viewAllHref}>
            <Button variant="outline" className="bg-background">
              View all
            </Button>
          </Link>
        </div>

        <div className="mt-10">
          <PropertyGrid
            properties={properties}
            emptyMessage="No featured properties yet. Add your first listing to get started."
          />
        </div>
      </div>
    </section>
  );
}

