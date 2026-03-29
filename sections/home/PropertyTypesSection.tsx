import Link from "next/link";
import { Home, Building2, MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type PropertyTypeKey = "house" | "apartment" | "land";

export interface PropertyTypeItem {
  key: PropertyTypeKey;
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
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
    icon: Home,
  },
  {
    key: "apartment",
    title: "Apartment",
    description: "Modern living with great city access.",
    href: "/properties?propertyType=apartment",
    icon: Building2,
  },
  {
    key: "land",
    title: "Land",
    description: "Plots for building and long-term investment.",
    href: "/properties?propertyType=land",
    icon: MapPin,
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
            <Link key={item.key} href={item.href} className="block">
              <Card className="transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardHeader className="gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">
                      {item.title}
                    </CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Browse {item.title.toLowerCase()} listings
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

