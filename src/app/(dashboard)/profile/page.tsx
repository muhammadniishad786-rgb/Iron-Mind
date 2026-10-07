"use client";

import {
  User,
  Mail,
  Calendar,
  Dumbbell,
  Pencil,
  Save,
} from "lucide-react";
import { useState } from "react";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState("Nishad");
  const [email, setEmail] = useState("nishad@example.com");
  const [goal, setGoal] = useState("Build Muscle");
  const [experience, setExperience] = useState("Intermediate");

  const handleSave = () => {
    setIsEditing(false);

    console.log({
      name,
      email,
      goal,
      experience,
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          My <span className="text-red-500">Profile</span>
        </h1>

        <p className="mt-2 text-zinc-400">
          Manage your personal information and fitness preferences.
        </p>
      </div>

      {/* Profile Header */}
      <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-950 p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          {/* Avatar */}
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-red-600 text-3xl font-bold">
            N
          </div>

          {/* User Info */}
          <div>
            <h2 className="text-2xl font-bold">
              {name}
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              IronMind Member
            </p>

            <div className="mt-3 flex items-center gap-2 text-sm text-zinc-400">
              <Calendar size={16} />
              <span>Member since October 2026</span>
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="sm:ml-auto flex items-center justify-center gap-2 rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
          >
            <Pencil size={16} />

            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </div>

      {/* Personal Information */}
      <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950 p-6">
        <div>
          <h2 className="text-lg font-semibold">
            Personal Information
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Your basic account information.
          </p>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {/* Name */}
          <div>
            <label className="text-sm text-zinc-400">
              Full Name
            </label>

            <div className="relative mt-2">
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
              />

              <input
                type="text"
                value={name}
                disabled={!isEditing}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-3 pl-10 pr-4 text-sm text-white outline-none transition disabled:cursor-not-allowed disabled:text-zinc-500 focus:border-red-500"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-zinc-400">
              Email Address
            </label>

            <div className="relative mt-2">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
              />

              <input
                type="email"
                value={email}
                disabled={!isEditing}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-3 pl-10 pr-4 text-sm text-white outline-none transition disabled:cursor-not-allowed disabled:text-zinc-500 focus:border-red-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fitness Information */}
      <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950 p-6">
        <div>
          <h2 className="text-lg font-semibold">
            Fitness Information
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Tell IronMind about your training preferences.
          </p>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {/* Goal */}
          <div>
            <label className="text-sm text-zinc-400">
              Fitness Goal
            </label>

            <div className="relative mt-2">
              <Dumbbell
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
              />

              <select
                value={goal}
                disabled={!isEditing}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full appearance-none rounded-lg border border-zinc-800 bg-zinc-900 py-3 pl-10 pr-4 text-sm text-white outline-none transition disabled:cursor-not-allowed disabled:text-zinc-500 focus:border-red-500"
              >
                <option>Build Muscle</option>
                <option>Lose Weight</option>
                <option>Increase Strength</option>
                <option>Improve Fitness</option>
              </select>
            </div>
          </div>

          {/* Experience */}
          <div>
            <label className="text-sm text-zinc-400">
              Experience Level
            </label>

            <select
              value={experience}
              disabled={!isEditing}
              onChange={(e) => setExperience(e.target.value)}
              className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition disabled:cursor-not-allowed disabled:text-zinc-500 focus:border-red-500"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
        </div>

        {/* Save */}
        {isEditing && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold transition hover:bg-red-500"
            >
              <Save size={17} />
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}