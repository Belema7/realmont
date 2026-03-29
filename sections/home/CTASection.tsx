import Link from "next/link";
import { Button } from "@/components/ui/button";

export interface CTASectionProps {
  headline?: string;
  description?: string;
  cta?: { href: string; label: string };
}

export function CTASection({
  headline = "Start listing your property",
  description = "Reach serious buyers and renters with a clean, modern listing experience.",
  cta = { href: "/dashboard/properties/create", label: "Create a Listing" },
}: CTASectionProps) {
  return (
    <section className="bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="rounded-3xl bg-primary text-primary-foreground px-6 py-12 sm:px-10 sm:py-14 text-center">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            {headline}
          </h2>
          <p className="mt-3 text-primary-foreground/80 max-w-2xl mx-auto">
            {description}
          </p>

          <div className="mt-8 flex justify-center">
            <Link href={cta.href}>
              <Button
                size="lg"
                className="bg-background text-foreground hover:bg-background/90"
              >
                {cta.label}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

