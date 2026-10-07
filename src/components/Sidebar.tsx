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
    <aside className="fixed left-0 top-16 z-40 hidden h-[calc(100vh-64px)] w-64 border-r border-zinc-800 bg-black md:block">
      
      <div className="flex h-full flex-col p-4">

        {/* Navigation */}
        <nav className="space-y-2">

          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-red-600/10 text-red-500"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                <Icon size={20} />

                <span>{item.name}</span>
              </Link>
            );
          })}

        </nav>

        {/* Bottom Settings */}
        <div className="mt-auto border-t border-zinc-800 pt-4">

          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
          >
            <Settings size={20} />

            <span>Settings</span>
          </Link>

        </div>

      </div>
    </aside>
  );
}