"use client";

import {
  Bell,
  Lock,
  LogOut,
  Moon,
  Settings as SettingsIcon,
  Shield,
  User,
} from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [workoutReminders, setWorkoutReminders] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);

  return (
    <div className="p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          <span className="text-red-500">Settings</span>
        </h1>

        <p className="mt-2 text-zinc-400">
          Manage your IronMind preferences and account settings.
        </p>
      </div>

      {/* General Settings */}
      <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-950 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900">
            <SettingsIcon size={20} className="text-red-500" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              General
            </h2>

            <p className="text-sm text-zinc-500">
              General application preferences.
            </p>
          </div>
        </div>

        <div className="mt-6 divide-y divide-zinc-800">
          {/* Theme */}
          <div className="flex items-center justify-between py-5">
            <div className="flex items-center gap-4">
              <Moon size={20} className="text-zinc-500" />

              <div>
                <p className="text-sm font-medium">
                  Appearance
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  Choose how IronMind looks.
                </p>
              </div>
            </div>

            <select
              className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 outline-none focus:border-red-500"
              defaultValue="dark"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="system">System</option>
            </select>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between py-5">
            <div className="flex items-center gap-4">
              <Bell size={20} className="text-zinc-500" />

              <div>
                <p className="text-sm font-medium">
                  Notifications
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  Receive notifications from IronMind.
                </p>
              </div>
            </div>

            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative h-6 w-11 rounded-full transition ${
                notifications ? "bg-red-600" : "bg-zinc-700"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                  notifications ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>

          {/* Workout Reminders */}
          <div className="flex items-center justify-between py-5">
            <div className="flex items-center gap-4">
              <User size={20} className="text-zinc-500" />

              <div>
                <p className="text-sm font-medium">
                  Workout Reminders
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  Get reminded about your scheduled workouts.
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                setWorkoutReminders(!workoutReminders)
              }
              className={`relative h-6 w-11 rounded-full transition ${
                workoutReminders ? "bg-red-600" : "bg-zinc-700"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                  workoutReminders ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>

          {/* Email Updates */}
          <div className="flex items-center justify-between py-5">
            <div className="flex items-center gap-4">
              <Bell size={20} className="text-zinc-500" />

              <div>
                <p className="text-sm font-medium">
                  Email Updates
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  Receive useful updates and announcements.
                </p>
              </div>
            </div>

            <button
              onClick={() => setEmailUpdates(!emailUpdates)}
              className={`relative h-6 w-11 rounded-full transition ${
                emailUpdates ? "bg-red-600" : "bg-zinc-700"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                  emailUpdates ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900">
            <Shield size={20} className="text-red-500" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              Security
            </h2>

            <p className="text-sm text-zinc-500">
              Manage your account security.
            </p>
          </div>
        </div>

        <div className="mt-6 divide-y divide-zinc-800">
          {/* Change Password */}
          <button className="flex w-full items-center justify-between py-5 text-left transition hover:bg-zinc-900/40">
            <div className="flex items-center gap-4">
              <Lock size={20} className="text-zinc-500" />

              <div>
                <p className="text-sm font-medium">
                  Change Password
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  Update your account password.
                </p>
              </div>
            </div>

            <span className="text-sm text-zinc-500">
              →
            </span>
          </button>
        </div>
      </div>

      {/* Account */}
      <div className="mt-6 rounded-xl border border-red-900/40 bg-red-950/10 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600/10">
            <LogOut size={20} className="text-red-500" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              Account
            </h2>

            <p className="text-sm text-zinc-500">
              Manage your IronMind account.
            </p>
          </div>
        </div>

        <button
          onClick={() => console.log("Logout")}
          className="mt-6 flex items-center gap-2 rounded-lg border border-red-900/50 px-5 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-600 hover:text-white"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </div>
  );
}