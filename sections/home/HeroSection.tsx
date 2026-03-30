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
      Find your <span className="bg-primary text-primary-foreground px-3 py-1 rounded-xl">dream home</span>
    </>
  ),
  subheading = "Discover verified properties, compare smartly, and move with complete confidence.",
  primaryCta = { href: "/properties", label: "Browse Properties" },
  secondaryCta = { href: "/register", label: "List Your Property" },
}: HeroSectionProps) {
  return (
    <section className="relative bg-background text-foreground overflow-hidden">
      {/* Optional subtle background pattern or gradient overlay can be added here later */}
      <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-[1.05]">
            {headline}
          </h1>

          <p className="mt-8 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            {subheading}
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href={primaryCta.href} className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto text-base font-semibold px-10 py-7 rounded-2xl"
              >
                {primaryCta.label}
              </Button>
            </Link>

            <Link href={secondaryCta.href} className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-base font-medium px-10 py-7 rounded-2xl border-2 hover:bg-muted"
              >
                {secondaryCta.label}
              </Button>
            </Link>
          </div>

          {/* Trust signals (optional but recommended for real estate) */}
          <div className="mt-10 flex items-center justify-center gap-x-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Verified Listings
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Secure Transactions
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Expert Support
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}