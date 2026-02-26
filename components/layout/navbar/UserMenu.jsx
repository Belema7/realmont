"use client"

import { useState } from "react"
import Link from "next/link"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import {
  LayoutDashboard,
  Heart,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react"

const UserMenu = () => {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative flex items-center gap-2">
      {/* Signed Out: Show Login button */}
      <SignedOut>
        <Link
          href="/sign-in"
          className="px-4 py-2 rounded-xl border border-[var(--border-color)]
                     text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition"
        >
          Login
        </Link>
      </SignedOut>

      {/* Signed In: Show UserButton */}
      <SignedIn>
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl
                       hover:bg-[var(--bg-secondary)] transition"
          >
            <UserButton afterSignOutUrl="/" />

            <ChevronDown
              size={16}
              className="text-[var(--text-secondary)]"
            />
          </button>

          {open && (
            <div
              className="absolute right-0 mt-3 w-56 rounded-2xl
                         bg-[var(--bg-primary)] border border-[var(--border-color)]
                         shadow-lg p-2 space-y-1 z-50"
            >
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-3 py-2 rounded-lg
                           hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] transition"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>

              <Link
                href="/saved"
                className="flex items-center gap-3 px-3 py-2 rounded-lg
                           hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] transition"
              >
                <Heart size={16} />
                Saved Properties
              </Link>

              <Link
                href="/settings"
                className="flex items-center gap-3 px-3 py-2 rounded-lg
                           hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] transition"
              >
                <Settings size={16} />
                Settings
              </Link>

              <div className="border-t border-[var(--border-color)] my-2" />

              <UserButton
                showName={false}
                appearance={{ elements: { signOutButtonBox: "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-500 hover:bg-red-500/10" } }}
              >
                <LogOut size={16} />
                Logout
              </UserButton>
            </div>
          )}
        </div>
      </SignedIn>
    </div>
  )
}

export default UserMenu
