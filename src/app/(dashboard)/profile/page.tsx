"use client";

import { useEffect, useState } from "react";
import { User, Mail, Calendar, Dumbbell, Pencil, Save } from "lucide-react";
import { useSelector } from "react-redux";

import type { RootState } from "@/store/store";

export default function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.auth);

  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [goal, setGoal] = useState("");
  const [experience, setExperience] = useState("");

  // Load registered user data
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setGoal(user.goal || "");
      setExperience(user.experience || "");
    }
  }, [user]);

  const handleSave = () => {
    // Backend update will be added later
    setIsEditing(false);
  };

  const formatGoal = (goal: string) => {
    switch (goal) {
      case "muscle_gain":
        return "Build Muscle";

      case "weight_loss":
        return "Lose Weight";

      case "strength":
        return "Increase Strength";

      case "general_fitness":
        return "Improve Fitness";

      default:
        return goal;
    }
  };

  const formatExperience = (experience: string) => {
    switch (experience) {
      case "beginner":
        return "Beginner";

      case "intermediate":
        return "Intermediate";

      case "advanced":
        return "Advanced";

      default:
        return experience;
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <p className="text-zinc-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-black px-6 py-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Profile</h1>

            <p className="mt-1 text-sm text-zinc-500">
              Manage your personal information
            </p>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-500"
            >
              <Pencil size={17} />
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-500"
            >
              <Save size={17} />
              Save Changes
            </button>
          )}
        </div>

        {/* Profile Card */}
        <div className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {/* Avatar */}
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-red-600 text-3xl font-bold text-white">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            {/* User info */}
            <div>
              <h2 className="text-2xl font-bold text-white">{user.name}</h2>

              <p className="mt-1 text-sm text-zinc-500">{user.email}</p>

              <div className="mt-3 flex items-center gap-2 text-sm text-zinc-500">
                <Calendar size={15} />
                <span>IronMind Member</span>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600/10">
              <User size={20} className="text-red-500" />
            </div>

            <div>
              <h2 className="font-semibold text-white">Personal Information</h2>

              <p className="text-sm text-zinc-500">Your account information</p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Name */}
            <div>
              <label className="mb-2 block text-sm text-zinc-400">
                Full Name
              </label>

              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-red-500"
                />
              ) : (
                <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white">
                  {user.name}
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm text-zinc-400">Email</label>

              <div className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3">
                <Mail size={17} className="text-zinc-500" />

                <span className="text-white">{user.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Fitness Information */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600/10">
              <Dumbbell size={20} className="text-red-500" />
            </div>

            <div>
              <h2 className="font-semibold text-white">Fitness Information</h2>

              <p className="text-sm text-zinc-500">Your fitness preferences</p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Goal */}
            <div>
              <label className="mb-2 block text-sm text-zinc-400">
                Fitness Goal
              </label>

              {isEditing ? (
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-red-500"
                >
                  <option value="muscle_gain">Build Muscle</option>

                  <option value="weight_loss">Lose Weight</option>

                  <option value="strength">Increase Strength</option>

                  <option value="general_fitness">Improve Fitness</option>
                </select>
              ) : (
                <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white">
                  {formatGoal(user.goal)}
                </div>
              )}
            </div>

            {/* Experience */}
            <div>
              <label className="mb-2 block text-sm text-zinc-400">
                Experience Level
              </label>

              {isEditing ? (
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-red-500"
                >
                  <option value="beginner">Beginner</option>

                  <option value="intermediate">Intermediate</option>

                  <option value="advanced">Advanced</option>
                </select>
              ) : (
                <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white">
                  {formatExperience(user.experience)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
