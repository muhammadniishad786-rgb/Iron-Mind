
"use client";

import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Calendar,
  Dumbbell,
  Pencil,
  Save,
} from "lucide-react";
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
        return goal || "Not specified";
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
        return experience || "Not specified";
    }
  };

  const inputClass =
    "w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none transition focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white";

  const displayClass =
    "min-w-0 rounded-lg border border-zinc-200 bg-zinc-100 px-4 py-3 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white";

  const labelClass = "mb-2 block text-sm text-zinc-600 dark:text-zinc-400";

  const cardClass =
    "rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6";

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-zinc-50 text-zinc-900 transition-colors dark:bg-black dark:text-white">
        <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-red-500 dark:border-zinc-700 dark:border-t-red-500" />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-zinc-50 px-4 py-8 text-zinc-900 transition-colors duration-300 dark:bg-black dark:text-white sm:px-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>

            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Manage your personal information
            </p>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-500"
            >
              <Pencil size={17} />
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-500"
            >
              <Save size={17} />
              Save Changes
            </button>
          )}
        </div>

        {/* Profile Card */}
        <div className={`mb-6 ${cardClass}`}>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {/* Avatar */}
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-red-600 text-3xl font-bold text-white shadow-lg shadow-red-600/10">
              {user.name?.charAt(0).toUpperCase() || (
                <User size={36} />
              )}
            </div>

            {/* User Info */}
            <div className="min-w-0">
              <h2 className="break-words text-2xl font-bold">
                {user.name}
              </h2>

              <p className="mt-1 break-all text-sm text-zinc-500 dark:text-zinc-400">
                {user.email}
              </p>

              <div className="mt-3 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                <Calendar size={15} className="text-red-500" />
                <span>IronMind Member</span>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className={`mb-6 ${cardClass}`}>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
              <User size={20} className="text-red-500" />
            </div>

            <div>
              <h2 className="font-semibold">Personal Information</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Your account information
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Name */}
            <div>
              <label className={labelClass}>Full Name</label>

              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className={inputClass}
                />
              ) : (
                <div className={displayClass}>
                  {user.name || "Not specified"}
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className={labelClass}>Email</label>

              <div className={`${displayClass} flex items-center gap-3`}>
                <Mail
                  size={17}
                  className="shrink-0 text-zinc-500"
                />

                <span className="break-all">{user.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Fitness Information */}
        <div className={cardClass}>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
              <Dumbbell size={20} className="text-red-500" />
            </div>

            <div>
              <h2 className="font-semibold">Fitness Information</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Your fitness preferences
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Goal */}
            <div>
              <label className={labelClass}>Fitness Goal</label>

              {isEditing ? (
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className={inputClass}
                >
                  <option value="muscle_gain">Build Muscle</option>
                  <option value="weight_loss">Lose Weight</option>
                  <option value="strength">Increase Strength</option>
                  <option value="general_fitness">Improve Fitness</option>
                </select>
              ) : (
                <div className={displayClass}>
                  {formatGoal(user.goal)}
                </div>
              )}
            </div>

            {/* Experience */}
            <div>
              <label className={labelClass}>Experience Level</label>

              {isEditing ? (
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className={inputClass}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              ) : (
                <div className={displayClass}>
                  {formatExperience(user.experience)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Mode Actions */}
        {isEditing && (
          <div className="mt-6 flex flex-col justify-end gap-3 sm:flex-row">
            <button
              onClick={() => {
                setName(user.name || "");
                setEmail(user.email || "");
                setGoal(user.goal || "");
                setExperience(user.experience || "");
                setIsEditing(false);
              }}
              className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-500"
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
