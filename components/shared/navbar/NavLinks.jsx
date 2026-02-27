import Link from "next/link"

const NavLinks = () => {
  const base =
    "text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"

  return (
    <div className="hidden md:flex items-center gap-8">
      <Link href="/buy" className={base}>Buy</Link>
      <Link href="/rent" className={base}>Rent</Link>
      {/* <Link href="/agents" className={base}>Agents</Link> */}
      <Link href="/about" className={base}>About</Link>
    </div>
  )
}

export default NavLinks
