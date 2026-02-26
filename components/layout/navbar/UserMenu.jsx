"use client"

import { useState } from "react"
import Link from "next/link"
import {
  User,
  LayoutDashboard,
  Heart,
  Settings,
  LogOut,
  ChevronDown
} from "lucide-react"

const UserMenu = () => {
  // Replace with real session later
  const user = {
    name: "Bella",
    email: "bella@email.com"
  }

  const [open, setOpen] = useState(false)

  if (!user) {
    return (
      <Link
        href="/login"
        className="px-4 py-2 rounded-xl 
                   border border-[var(--border-color)]
                   text-[var(--text-primary)]
                   hover:bg-[var(--bg-secondary)]
                   transition"
      >
        Login
      </Link>
    )
  }

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl
                   hover:bg-[var(--bg-secondary)]
                   transition"
      >
        <div className="w-8 h-8 flex items-center justify-center rounded-full
                        bg-[var(--bg-secondary)]
                        text-[var(--text-primary)]">
          <User size={16} />
        </div>

        <span className="hidden sm:block text-sm text-[var(--text-primary)]">
          {user.name}
        </span>

        <ChevronDown size={16} className="text-[var(--text-secondary)]" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-56 rounded-2xl
                        bg-[var(--bg-primary)]
                        border border-[var(--border-color)]
                        shadow-lg p-2 space-y-1 z-50">

          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg
                       hover:bg-[var(--bg-secondary)]
                       text-[var(--text-primary)] transition"
          >
            <LayoutDashboard size={16} />
            Dashboard
          </Link>

          <Link
            href="/saved"
            className="flex items-center gap-3 px-3 py-2 rounded-lg
                       hover:bg-[var(--bg-secondary)]
                       text-[var(--text-primary)] transition"
          >
            <Heart size={16} />
            Saved Properties
          </Link>

          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg
                       hover:bg-[var(--bg-secondary)]
                       text-[var(--text-primary)] transition"
          >
            <Settings size={16} />
            Settings
          </Link>

          <div className="border-t border-[var(--border-color)] my-2" />

          <button
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg
                       hover:bg-red-500/10
                       text-red-500 transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

export default UserMenu