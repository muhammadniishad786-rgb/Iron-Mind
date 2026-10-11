
"use client";

import {
  Bell,
  Lock,
  LogOut,
  Moon,
  Settings as SettingsIcon,
  Shield,
  User,
  Sun,
  Monitor,
  ChevronRight,
} from "lucide-react";

import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import type { AppDispatch } from "@/store/store";
import { logout } from "@/store/slices/authSlice";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [workoutReminders, setWorkoutReminders] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [mounted, setMounted] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    router.push("/login");
  };

  const cardClass =
    "rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-colors dark:border-zinc-800 dark:bg-zinc-950 sm:p-6";

  const secondaryText = "text-zinc-500 dark:text-zinc-400";

  const rowClass =
    "flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between";

  const selectClass =
    "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-800 outline-none transition focus:border-red-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 sm:w-auto";

  const toggleButtonClass = (enabled: boolean) =>
    `relative h-6 w-11 shrink-0 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950 ${
      enabled ? "bg-red-600" : "bg-zinc-300 dark:bg-zinc-700"
    }`;

  const Toggle = ({
    enabled,
    onToggle,
    label,
  }: {
    enabled: boolean;
    onToggle: () => void;
    label: string;
  }) => (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      onClick={onToggle}
      className={toggleButtonClass(enabled)}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${
          enabled ? "left-6" : "left-1"
        }`}
      />
    </button>
  );

  return (
    <main className="min-h-screen bg-zinc-50 p-4 text-zinc-900 transition-colors duration-300 dark:bg-black dark:text-white sm:p-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600 dark:text-red-500">
            Preferences
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Settings<span className="text-red-500">.</span>
          </h1>

          <p className={`mt-2 ${secondaryText}`}>
            Manage your IronMind preferences and account settings.
          </p>
        </div>

        {/* General Settings */}
        <section className={`mt-8 ${cardClass}`}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
              <SettingsIcon size={20} className="text-red-500" />
            </div>

            <div>
              <h2 className="text-lg font-semibold">General</h2>
              <p className={`text-sm ${secondaryText}`}>
                General application preferences.
              </p>
            </div>
          </div>

          <div className="mt-5 divide-y divide-zinc-200 dark:divide-zinc-800">
            {/* Appearance */}
            <div className={rowClass}>
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-zinc-100 p-2.5 dark:bg-zinc-900">
                  {mounted && theme === "light" ? (
                    <Sun size={20} className="text-amber-500" />
                  ) : mounted && theme === "system" ? (
                    <Monitor size={20} className="text-zinc-500" />
                  ) : (
                    <Moon size={20} className="text-zinc-500 dark:text-zinc-400" />
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium">Appearance</p>
                  <p className={`mt-1 text-xs ${secondaryText}`}>
                    Choose how IronMind looks.
                  </p>
                </div>
              </div>

              <select
                aria-label="Appearance theme"
                className={selectClass}
                value={mounted ? theme ?? "dark" : "dark"}
                disabled={!mounted}
                onChange={(event) => setTheme(event.target.value)}
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="system">System</option>
              </select>
            </div>

            {/* Notifications */}
            <div className={rowClass}>
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-zinc-100 p-2.5 dark:bg-zinc-900">
                  <Bell size={20} className="text-zinc-500 dark:text-zinc-400" />
                </div>

                <div>
                  <p className="text-sm font-medium">Notifications</p>
                  <p className={`mt-1 text-xs ${secondaryText}`}>
                    Receive notifications from IronMind.
                  </p>
                </div>
              </div>

              <Toggle
                enabled={notifications}
                onToggle={() => setNotifications((value) => !value)}
                label="Notifications"
              />
            </div>

            {/* Workout Reminders */}
            <div className={rowClass}>
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-zinc-100 p-2.5 dark:bg-zinc-900">
                  <User size={20} className="text-zinc-500 dark:text-zinc-400" />
                </div>

                <div>
                  <p className="text-sm font-medium">Workout Reminders</p>
                  <p className={`mt-1 text-xs ${secondaryText}`}>
                    Get reminded about your scheduled workouts.
                  </p>
                </div>
              </div>

              <Toggle
                enabled={workoutReminders}
                onToggle={() => setWorkoutReminders((value) => !value)}
                label="Workout reminders"
              />
            </div>

            {/* Email Updates */}
            <div className={rowClass}>
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-zinc-100 p-2.5 dark:bg-zinc-900">
                  <MailIcon />
                </div>

                <div>
                  <p className="text-sm font-medium">Email Updates</p>
                  <p className={`mt-1 text-xs ${secondaryText}`}>
                    Receive useful updates and announcements.
                  </p>
                </div>
              </div>

              <Toggle
                enabled={emailUpdates}
                onToggle={() => setEmailUpdates((value) => !value)}
                label="Email updates"
              />
            </div>
          </div>
        </section>

        {/* Security */}
        <section className={`mt-6 ${cardClass}`}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
              <Shield size={20} className="text-red-500" />
            </div>

            <div>
              <h2 className="text-lg font-semibold">Security</h2>
              <p className={`text-sm ${secondaryText}`}>
                Manage your account security.
              </p>
            </div>
          </div>

          <div className="mt-5 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => router.push("/settings/")}
              className="flex w-full items-center justify-between gap-4 rounded-lg py-5 text-left transition hover:bg-zinc-100 dark:hover:bg-zinc-900/60"
            >
              <div className="flex items-center gap-4">
                <Lock size={20} className="text-zinc-500 dark:text-zinc-400" />

                <div>
                  <p className="text-sm font-medium">Change Password</p>
                  <p className={`mt-1 text-xs ${secondaryText}`}>
                    Update your account password.
                  </p>
                </div>
              </div>

              <ChevronRight size={18} className={secondaryText} />
            </button>
          </div>
        </section>

        {/* Account */}
        <section className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5 transition-colors dark:border-red-900/40 dark:bg-red-950/10 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
              <LogOut size={20} className="text-red-600 dark:text-red-500" />
            </div>

            <div>
              <h2 className="text-lg font-semibold">Account</h2>
              <p className={`text-sm ${secondaryText}`}>
                Manage your IronMind account.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-6 flex items-center gap-2 rounded-lg border border-red-300 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-white dark:border-red-900/50 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white"
          >
            <LogOut size={17} />
            Logout
          </button>
        </section>
      </div>
    </main>
  );
}

function MailIcon() {
  return <Bell size={20} className="text-zinc-500 dark:text-zinc-400" />;
}
