import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getFeaturedProperties } from "@/services/property.service";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import type { IProperty } from "@/types";
import { MapPin } from "lucide-react";

export interface FeaturedPropertiesSectionProps {
  title?: string;
  description?: string;
  limit?: number;
  viewAllHref?: string;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

function FeaturedPropertyCard({ property }: { property: IProperty }) {
  const imageSrc = property.images?.[0];

  return (
    <Link href={`/properties/${property._id}`} className="group block">
      <Card className="h-full gap-0 py-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-foreground/20">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted/20">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={property.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-semibold text-muted-foreground">
                No image
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0 opacity-90" />

          <div className="absolute left-4 top-4 rounded-lg bg-background/95 px-3 py-1 text-xs font-bold text-foreground ring-1 ring-border/60 backdrop-blur">
            {formatPrice(property.price)}
          </div>
        </div>

        <CardContent className="flex flex-1 flex-col gap-2 py-5">
          <CardTitle className="line-clamp-1 text-lg font-bold tracking-tight">
            {property.title}
          </CardTitle>
          <CardDescription className="line-clamp-2 text-sm leading-relaxed">
            {property.description}
          </CardDescription>

          <div className="mt-2 flex items-center justify-between gap-3 border-t border-border/60 pt-4">
            <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0 text-primary/80" />
              <span className="truncate font-medium">{property.location}</span>
            </div>
            <div className="shrink-0 text-sm font-semibold text-primary transition-colors group-hover:text-primary/85">
              View details →
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-[360px] rounded-2xl border border-border/60 bg-card/60"
              />
            ))}
          </div>
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
  let properties: IProperty[] = [];
  try {
    properties = (await getFeaturedProperties(limit)) as IProperty[];
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
          {properties.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <FeaturedPropertyCard key={property._id} property={property} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border/60 bg-muted/5 px-6 py-16 text-center">
              <h3 className="text-xl font-heading font-black tracking-tight">
                No items created yet
              </h3>
              <p className="mt-3 text-sm font-medium text-muted-foreground">
                Create your first property in the dashboard and it will appear
                here automatically.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
