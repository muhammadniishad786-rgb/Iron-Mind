
"use client";

import { Dumbbell, User, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  return (
    <nav className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-4 text-zinc-900 transition-colors duration-200 dark:border-zinc-800 dark:bg-black dark:text-white sm:px-6">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <Dumbbell className="text-red-500" size={24} />

        <h1 className="text-xl font-bold">
          Iron<span className="text-red-500">Mind</span>
        </h1>
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          disabled={!mounted}
          aria-label={
            !mounted
              ? "Change theme"
              : `Switch to ${isDark ? "light" : "dark"} mode`
          }
          title={
            !mounted
              ? "Change theme"
              : `Switch to ${isDark ? "light" : "dark"} mode`
          }
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-100 text-zinc-700 transition hover:border-red-500 hover:text-red-500 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
        >
          {mounted ? (
            isDark ? <Sun size={19} /> : <Moon size={19} />
          ) : (
            <Sun size={19} />
          )}
        </button>

        {/* Profile */}
        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-zinc-100 dark:hover:bg-zinc-900"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white">
            <User size={18} />
          </div>

          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium">Nishad</p>
            <p className="text-xs text-zinc-500">Member</p>
          </div>
        </Link>
      </div>
    </nav>
  );
}
