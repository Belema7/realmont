import Link from "next/link";
import { BrandLogo } from "@/components/shared/BrandLogo";

export function Footer() {
    return (
        <footer className="border-t bg-muted/30">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                                <BrandLogo
                                    size={20}
                                    className="h-5 w-5 brightness-0 invert"
                                />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                EstateHub
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Find your dream property with EstateHub. We connect buyers with
                            trusted agents for a seamless real estate experience.
                        </p>
                    </div>

                    {/* Quick links */}
                    <div>
                        <h4 className="text-sm font-semibold mb-4">Quick Links</h4>
                        <nav className="flex flex-col gap-2">
                            <Link href="/properties" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Browse Properties
                            </Link>
                            <Link href="/properties?propertyType=house" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Houses
                            </Link>
                            <Link href="/properties?propertyType=apartment" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Apartments
                            </Link>
                            <Link href="/properties?propertyType=land" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Land
                            </Link>
                        </nav>
                    </div>

                    {/* For agents */}
                    <div>
                        <h4 className="text-sm font-semibold mb-4">For Agents</h4>
                        <nav className="flex flex-col gap-2">
                            <Link href="/register" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Become an Agent
                            </Link>
                            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Agent Dashboard
                            </Link>
                            <Link href="/dashboard/properties/create" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                List a Property
                            </Link>
                        </nav>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-sm font-semibold mb-4">Contact</h4>
                        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                            <p>support@estatehub.com</p>
                            <p>+1 (555) 123-4567</p>
                            <p>123 Real Estate Ave, Suite 100</p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} EstateHub. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
