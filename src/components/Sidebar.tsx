
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Dumbbell,
  Activity,
  ChartNoAxesCombined,
  Bot,
  User,
  Settings,
  Menu,
  X,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Workouts",
    href: "/workouts",
    icon: Dumbbell,
  },
  {
    name: "Exercises",
    href: "/exercises",
    icon: Activity,
  },
  {
    name: "Progress",
    href: "/progress",
    icon: ChartNoAxesCombined,
  },
  {
    name: "AI Coach",
    href: "/ai",
    icon: Bot,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close the mobile menu after navigating.
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent background scrolling while the mobile menu is open.
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const linkClass = (href: string) =>
    `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
      isActive(href)
        ? "bg-red-600/10 text-red-600 dark:text-red-500"
        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
    }`;

  const navigation = (
    <>
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={linkClass(item.href)}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-zinc-200 pt-4 dark:border-zinc-800">
        <Link
          href="/settings"
          aria-current={isActive("/settings") ? "page" : undefined}
          className={linkClass("/settings")}
        >
          <Settings size={20} />
          <span>Settings</span>
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-sidebar"
        className="fixed left-4 top-[76px] z-[60] flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-900 shadow-sm transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:hover:bg-zinc-900 md:hidden"
      >
        {isOpen ? <X size={21} /> : <Menu size={21} />}
      </button>

      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-16 z-40 hidden h-[calc(100vh-64px)] w-64 border-r border-zinc-200 bg-white transition-colors duration-200 dark:border-zinc-800 dark:bg-black md:block">
        <div className="flex h-full flex-col p-4">
          {navigation}
        </div>
      </aside>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 md:hidden ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile sidebar drawer */}
      <aside
        id="mobile-sidebar"
        aria-label="Mobile navigation"
        aria-hidden={!isOpen}
        className={`fixed bottom-0 left-0 top-16 z-50 flex w-72 max-w-[85vw] flex-col border-r border-zinc-200 bg-white p-4 shadow-xl transition-transform duration-300 dark:border-zinc-800 dark:bg-black md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-5 flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
          <span className="text-lg font-bold tracking-wide">
            IRON<span className="text-red-500">MIND</span>
          </span>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation menu"
            tabIndex={isOpen ? 0 : -1}
            className="rounded-lg p-2 text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div
          className={`flex min-h-0 flex-1 flex-col ${
            isOpen ? "" : "invisible"
          }`}
        >
          {navigation}
        </div>
      </aside>
    </>
  );
}
