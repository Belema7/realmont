import { Suspense } from "react";
import { HeroSection } from "@/sections/home/HeroSection";
import {
  FeaturedPropertiesSection,
  FeaturedPropertiesSectionSkeleton,
} from "@/sections/home/FeaturedPropertiesSection";
import { PropertyTypesSection } from "@/sections/home/PropertyTypesSection";
import { CTASection } from "@/sections/home/CTASection";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <PropertyTypesSection />
      <Suspense fallback={<FeaturedPropertiesSectionSkeleton />}>
        <FeaturedPropertiesSection />
      </Suspense>
      <CTASection />
    </div>
  );
}
