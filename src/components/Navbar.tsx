"use client";

import { Dumbbell, ChevronDown, User } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 h-16 border-b border-zinc-800 bg-black px-6 flex items-center justify-between">

      {/* Logo */}
      <div className="flex items-center gap-2">
        <Dumbbell className="text-red-500" size={24} />

        <h1 className="text-xl font-bold">
          Iron<span className="text-red-500">Mind</span>
        </h1>
      </div>

      {/* Profile */}
      <button className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-zinc-900 transition">

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600">
          <User size={18} />
        </div>

        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-white">
            Nishad
          </p>

          <p className="text-xs text-zinc-500">
            Member
          </p>
        </div>

        {/* <ChevronDown size={18} className="text-zinc-500" /> */}

      </button>

    </nav>
  );
}