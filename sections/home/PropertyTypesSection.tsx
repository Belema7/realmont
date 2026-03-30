import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

export type PropertyTypeKey = "house" | "apartment" | "land";

export interface PropertyTypeItem {
  key: PropertyTypeKey;
  title: string;
  description: string;
  href: string;
  imageSrc: string;
  ctaLabel?: string;
}

export interface PropertyTypesSectionProps {
  title?: string;
  description?: string;
  items?: PropertyTypeItem[];
}

const DEFAULT_ITEMS: PropertyTypeItem[] = [
  {
    key: "house",
    title: "House",
    description: "Family-friendly homes with space to grow.",
    href: "/properties?propertyType=house",
    imageSrc: "/images/house.jpg",
    ctaLabel: "View Listings",
  },
  {
    key: "apartment",
    title: "Apartment",
    description: "Modern living with great city access.",
    href: "/properties?propertyType=apartment",
    imageSrc: "/images/apartment.jpg",
    ctaLabel: "View Listings",
  },
  {
    key: "land",
    title: "Land",
    description: "Plots for building and long-term investment.",
    href: "/properties?propertyType=land",
    imageSrc: "/images/land.jpg",
    ctaLabel: "View Listings",
  },
];

export function PropertyTypesSection({
  title = "Explore by Type",
  description = "Choose a category that matches your needs.",
  items = DEFAULT_ITEMS,
}: PropertyTypesSectionProps) {
  return (
    <section className="bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            {title}
          </h2>
          <p className="mt-3 text-muted-foreground">{description}</p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Link key={item.key} href={item.href} className="group block">
              <Card className="h-full gap-0 py-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-foreground/20">
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={item.imageSrc}
                    alt={`${item.title} listings`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                    priority={item.key === "house"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0 opacity-90" />
                </div>

                <CardContent className="flex flex-1 flex-col gap-2 py-5">
                  <CardTitle className="text-lg font-bold tracking-tight">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {item.description}
                  </CardDescription>

                  {item.ctaLabel ? (
                    <div className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      <span className="transition-colors group-hover:text-primary/85">
                        {item.ctaLabel}
                      </span>
                      <span
                        aria-hidden="true"
                        className="transition-transform group-hover:translate-x-0.5"
                      >
                        →
                      </span>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
