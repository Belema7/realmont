import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Search,
  Shield,
  ArrowRight,
  Home,
  Building,
  MapPin,
  TrendingUp,
  Users,
  Star,
  ArrowUpRight,
} from "lucide-react";
import { getFeaturedProperties } from "@/services/property.service";
import { PropertyGrid } from "@/components/property/PropertyGrid";

export default async function HomePage() {
  let featuredProperties = [];
  try {
    featuredProperties = await getFeaturedProperties(6);
  } catch {
    // DB not connected yet — show empty state gracefully
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
        {/* Modern subtle backgrounds */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--color-primary)_0%,transparent_25%)] opacity-[0.03] dark:opacity-[0.05]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,var(--color-primary)_0%,transparent_25%)] opacity-[0.02] dark:opacity-[0.03]" />

        <div className="container relative mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Trusted by 10,000+ homebuyers</span>
          </div>

          <h1 className="text-5xl font-heading font-black tracking-tight sm:text-6xl md:text-7xl lg:text-8xl mb-8 leading-[1.1]">
            Discover Your <br />
            <span className="text-primary italic">Perfect Sanctuary.</span>
          </h1>

          <p className="mt-4 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-medium">
            EstateHub bridges the gap between vision and reality. Explore the most prestigious residential and commercial properties curated by leading experts.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link href="/properties">
              <Button
                size="lg"
                className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-bold shadow-2xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all gap-2"
              >
                <Search className="h-5 w-5" />
                Start Exploring
              </Button>
            </Link>
            <Link href="/register">
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-8 rounded-2xl border-border hover:bg-muted font-bold transition-all"
              >
                Sell Your Property
                <ArrowUpRight className="h-5 w-5 ml-1 opacity-50" />
              </Button>
            </Link>
          </div>

          {/* Floating property stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { label: "Active Listings", value: "2.5K+" },
              { label: "Verified Agents", value: "480+" },
              { label: "Dream Homes Sold", value: "12K+" },
              { label: "Client Satisfaction", value: "99%" },
            ].map((stat) => (
              <div key={stat.label} className="p-6 rounded-3xl border border-border bg-card/50 backdrop-blur-sm text-center">
                <p className="text-2xl font-black font-heading text-foreground">{stat.value}</p>
                <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="bg-muted/10 py-24 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-heading font-black tracking-tight sm:text-4xl text-foreground">
                Featured Selections
              </h2>
              <p className="text-muted-foreground font-medium text-lg">
                Hand-picked properties representing the gold standard of real estate.
              </p>
            </div>
            <Link href="/properties">
              <Button variant="ghost" className="font-bold gap-2 text-primary hover:text-primary hover:bg-primary/10 rounded-xl group px-6">
                View Entire Catalog
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <PropertyGrid
            properties={featuredProperties}
            emptyMessage="Our latest collection is arriving soon. Check back shortly."
          />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl font-heading font-black tracking-tight sm:text-4xl">
              The Architecture of Choice
            </h2>
            <p className="text-muted-foreground font-medium">
              Tailored categories to match your specific lifestyle requirements and investment goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Home,
                type: "house",
                title: "Residential Houses",
                desc: "Estate living with privacy, gardens, and artisanal architecture.",
                color: "text-blue-500 bg-blue-500/10",
              },
              {
                icon: Building,
                type: "apartment",
                title: "Urban Apartments",
                desc: "High-rise living with skyline views and metropolitan convenience.",
                color: "text-purple-500 bg-purple-500/10",
              },
              {
                icon: MapPin,
                type: "land",
                title: "Strategic Land",
                desc: "Investment plots and building sites in high-growth corridors.",
                color: "text-amber-500 bg-amber-500/10",
              },
            ].map((item) => (
              <Link
                key={item.type}
                href={`/properties?propertyType=${item.type}`}
                className="group p-10 rounded-[40px] border border-border bg-card shadow-sm hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-500"
              >
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${item.color} mb-8 shrink-0`}>
                  <item.icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-heading font-black mb-4">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-medium mb-8">{item.desc}</p>
                <div className="flex items-center gap-2 text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-all">
                  Browse category <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Professional CTA Section */}
      <section className="container mx-auto px-4 py-24 mb-16">
        <div className="relative overflow-hidden rounded-[50px] bg-foreground p-12 md:p-24 text-center">
          <div className="absolute inset-0 bg-primary opacity-[0.07] dark:opacity-[0.15]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--color-primary)_0%,transparent_70%)] opacity-20" />

          <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
            <Shield className="mx-auto h-20 w-20 text-primary opacity-90 drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
            <h2 className="text-4xl font-heading font-black sm:text-5xl md:text-6xl tracking-tight text-background leading-tight">
              Agents. Elevate Your <span className="text-primary italic">Distribution.</span>
            </h2>
            <p className="text-xl text-background/60 font-medium max-w-xl mx-auto leading-relaxed">
              Join the premier marketplace for luxury real estate. Access the tools you need to reach qualified global buyers.
            </p>
            <Link href="/register">
              <Button
                size="lg"
                className="h-16 px-12 rounded-2xl bg-primary text-primary-foreground font-black text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all"
              >
                Apply for Partner Status
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
