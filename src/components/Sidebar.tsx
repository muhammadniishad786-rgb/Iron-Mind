
"use client";

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

  return (
    <aside className="fixed left-0 top-16 z-40 hidden h-[calc(100vh-64px)] w-64 border-r border-zinc-200 bg-white transition-colors duration-200 dark:border-zinc-800 dark:bg-black md:block">
      <div className="flex h-full flex-col p-4">
        {/* Navigation */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.name}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-red-600/10 text-red-600 dark:text-red-500"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Settings */}
        <div className="mt-auto border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <Link
            href="/settings"
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
              pathname === "/settings" ||
              pathname.startsWith("/settings/")
                ? "bg-red-600/10 text-red-600 dark:text-red-500"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
            }`}
          >
            <Settings size={20} />
            <span>Settings</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
