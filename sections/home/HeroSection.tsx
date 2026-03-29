import Link from "next/link";
import { Button } from "@/components/ui/button";

export interface HeroSectionProps {
  headline?: React.ReactNode;
  subheading?: string;
  primaryCta?: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
}

export function HeroSection({
  headline = (
    <>
      Find a place you&apos;ll <span className="bg-primary text-primary-foreground px-2 rounded-lg">love</span>.
    </>
  ),
  subheading = "Browse verified listings, compare options, and move with confidence.",
  primaryCta = { href: "/properties", label: "Browse Properties" },
  secondaryCta = { href: "/register", label: "List a Property" },
}: HeroSectionProps) {
  return (
    <section className="bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight">
            {headline}
          </h1>
          <p className="mt-6 text-base sm:text-lg text-muted-foreground">
            {subheading}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href={primaryCta.href}>
              <Button size="lg" className="w-full sm:w-auto">
                {primaryCta.label}
              </Button>
            </Link>
            <Link href={secondaryCta.href}>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-background"
              >
                {secondaryCta.label}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

