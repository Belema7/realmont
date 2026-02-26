import Link from "next/link"
import { Building2 } from "lucide-react"
import NavLinks from "./NavLinks"
import MobileMenu from "./MobileMenu"
import UserMenu from "./UserMenu"
import Input from "@/components/ui/Search"
import SearchBtn from "@/components/ui/Search"

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[var(--border-color)] bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto h-16 px-4 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold text-[var(--text-primary)]"
        >
          <Building2 size={22} />
          RealMont
        </Link>

        {/* Search (Desktop) */}
        <div className="hidden md:block w-1/3">
          <SearchBtn/>
        </div>

        {/* Navigation */}
        <NavLinks />

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-4">
          <UserMenu />

          <Link
            href="/list-property"
            className="flex items-center gap-2 px-4 py-2 rounded-xl 
                       bg-[var(--accent)] text-[var(--accent-foreground)]
                       hover:opacity-90 transition"
          >
            List Property
          </Link>
        </div>

        {/* Mobile */}
        <MobileMenu />
      </div>
    </nav>
  )
}

export default Navbar
