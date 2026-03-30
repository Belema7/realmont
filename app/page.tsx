import { Suspense } from "react";
import { FullscreenHero } from "@/sections/home/FullscreenHero";
import {
  FeaturedPropertiesSection,
  FeaturedPropertiesSectionSkeleton,
} from "@/sections/home/FeaturedPropertiesSection";
import { PropertyTypesSection } from "@/sections/home/PropertyTypesSection";
import { CTASection } from "@/sections/home/CTASection";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <FullscreenHero />
      <PropertyTypesSection />
      <Suspense fallback={<FeaturedPropertiesSectionSkeleton />}>
        <FeaturedPropertiesSection />
      </Suspense>
      <CTASection />
    </div>
  );
}
