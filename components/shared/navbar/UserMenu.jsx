"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useUser, SignOutButton } from "@clerk/nextjs"
import {
  LayoutDashboard,
  Heart,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react"

export default function UserMenu() {
  const { isSignedIn, user } = useUser()
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (!isSignedIn) {
    return (
      <Link
        href="/sign-in"
        className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-muted transition"
      >
        Login
      </Link>
    )
  }

  return (
    <div ref={menuRef} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-muted transition"
      >
        <img
          src={user?.imageUrl}
          alt="User Avatar"
          className="h-8 w-8 rounded-full object-cover"
        />
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      <div
        className={`absolute right-0 mt-3 w-56 rounded-2xl border bg-background 
        shadow-xl p-2 space-y-1 z-50 transition-all duration-200
        ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
      >
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted transition"
        >
          <LayoutDashboard size={16} />
          Dashboard
        </Link>

        <Link
          href="/saved"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted transition"
        >
          <Heart size={16} />
          Saved Properties
        </Link>

        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted transition"
        >
          <Settings size={16} />
          Settings
        </Link>

        <div className="my-2 border-t" />

        <SignOutButton redirectUrl="/">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition">
            <LogOut size={16} />
            Logout
          </button>
        </SignOutButton>
      </div>
    </div>
  )
}