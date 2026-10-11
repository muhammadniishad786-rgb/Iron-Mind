
"use client";

import { Plus, Search, Dumbbell } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

import type { RootState, AppDispatch } from "@/store/store";
import { fetchExercises } from "@/store/slices/exerciseSlice";

export default function ExercisesPage() {
  const [search, setSearch] = useState("");

  const dispatch = useDispatch<AppDispatch>();

  const { exercises, loading, error } = useSelector(
    (state: RootState) => state.exercise
  );

  // Fetch exercises from backend
  useEffect(() => {
    dispatch(fetchExercises());
  }, [dispatch]);

  // Search filter
  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-50 p-4 text-zinc-900 transition-colors duration-300 dark:bg-black dark:text-white sm:p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">
            Exercise{" "}
            <span className="text-red-600 dark:text-red-500">
              Library
            </span>
          </h1>

          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 sm:text-base">
            Browse exercises and find the right movements for your workouts.
          </p>
        </div>

        {/* Create Exercise */}
        <Link
          href="/exercises/create"
          className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
        >
          <Plus size={18} />
          Add Exercise
        </Link>
      </div>

      {/* Search */}
      <div className="mt-8 max-w-xl">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
          />

          <input
            type="text"
            placeholder="Search exercises..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white py-3 pl-12 pr-4 text-zinc-900 outline-none placeholder:text-zinc-400 transition focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-600"
          />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-3 text-zinc-500 dark:text-zinc-400">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-red-500 dark:border-zinc-700 dark:border-t-red-500" />
            <p>Loading exercises...</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/20">
          <p className="text-sm text-red-600 dark:text-red-500">
            {error}
          </p>
        </div>
      )}

      {/* Exercise Grid */}
      {!loading && !error && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredExercises.map((exercise) => (
            <div
              key={exercise._id}
              className="group rounded-xl border border-zinc-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-red-400 hover:shadow-lg hover:shadow-red-500/5 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-red-700"
            >
              {/* Top */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="break-words text-lg font-semibold text-zinc-900 dark:text-white">
                    {exercise.name}
                  </h2>

                  <p className="mt-1 text-sm capitalize text-red-600 dark:text-red-500">
                    {exercise.muscleGroup.replace(/_/g, " ")}
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-zinc-100 px-3 py-1 text-xs capitalize text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
                  {exercise.difficulty}
                </span>
              </div>

              {/* Exercise Icon */}
              <div className="mt-5 flex h-28 items-center justify-center rounded-lg bg-zinc-100 transition group-hover:bg-red-50 dark:bg-zinc-900/70 dark:group-hover:bg-red-950/20">
                <Dumbbell
                  size={38}
                  strokeWidth={1.5}
                  className="text-zinc-400 transition group-hover:text-red-500 dark:text-zinc-600 dark:group-hover:text-red-500"
                />
              </div>

              {/* Details */}
              <div className="mt-5 border-t border-zinc-200 pt-4 dark:border-zinc-800">
                <p className="text-sm text-zinc-500 dark:text-zinc-500">
                  Equipment
                </p>

                <p className="mt-1 text-sm capitalize text-zinc-700 dark:text-zinc-300">
                  {exercise.equipment.replace(/_/g, " ")}
                </p>
              </div>

              {/* Button */}
              <Link
                href={`/exercises/${exercise._id}`}
                className="mt-5 block w-full rounded-lg border border-zinc-300 py-2.5 text-center text-sm font-medium text-zinc-700 transition hover:border-red-500 hover:bg-red-50 hover:text-red-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-red-500 dark:hover:bg-zinc-900 dark:hover:text-white"
              >
                View Exercise
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading &&
        !error &&
        filteredExercises.length === 0 && (
          <div className="mt-12 rounded-xl border border-zinc-200 bg-white p-10 text-center dark:border-zinc-800 dark:bg-zinc-950">
            <Dumbbell
              size={40}
              className="mx-auto text-zinc-400 dark:text-zinc-600"
            />

            <h2 className="mt-4 text-lg font-semibold text-zinc-800 dark:text-zinc-200">
              No exercises found
            </h2>

            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              {search
                ? "Try another search term or clear your search."
                : "Add your first exercise to get started."}
            </p>

            {search ? (
              <button
                onClick={() => setSearch("")}
                className="mt-4 text-sm font-medium text-red-600 transition hover:text-red-500 dark:text-red-500 dark:hover:text-red-400"
              >
                Clear search
              </button>
            ) : (
              <Link
                href="/exercises/create"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500"
              >
                <Plus size={16} />
                Add Exercise
              </Link>
            )}
          </div>
        )}
    </div>
  );
}
