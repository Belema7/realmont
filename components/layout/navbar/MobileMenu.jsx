"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

const MobileMenu = () => {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="text-[var(--text-primary)]"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {open && (
        <div className="absolute left-0 top-16 w-full bg-[var(--bg-primary)] 
                        border-t border-[var(--border-color)] 
                        flex flex-col px-6 py-6 space-y-4">
          <Link href="/buy">Buy</Link>
          <Link href="/rent">Rent</Link>
          <Link href="/agents">Agents</Link>
          <Link href="/about">About</Link>
          <Link href="/login">Login</Link>
        </div>
      )}
    </div>
  )
}

export default MobileMenu
