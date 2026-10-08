"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
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

  // console.log(exercises);

  // Search filter
  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Exercise <span className="text-red-500">Library</span>
        </h1>

        <p className="mt-2 text-zinc-400">
          Browse exercises and find the right movements for your workouts.
        </p>
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
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-3 pl-12 pr-4 text-white outline-none placeholder:text-zinc-600 focus:border-red-500"
          />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="mt-12 text-center">
          <p className="text-zinc-500">
            Loading exercises...
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-8 rounded-lg border border-red-900 bg-red-950/20 p-4">
          <p className="text-red-500">
            {error}
          </p>
        </div>
      )}

      {/* Exercise Grid */}
      {!loading && !error && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {filteredExercises.map((exercise) => (
            <div
              key={exercise._id}
              className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 transition hover:border-red-700"
            >

              {/* Top */}
              <div className="flex items-start justify-between gap-3">

                <div>
                  <h2 className="text-lg font-semibold">
                    {exercise.name}
                  </h2>

                  <p className="mt-1 text-sm text-red-500">
                    {exercise.muscleGroup}
                  </p>
                </div>

                <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs text-zinc-400">
                  {exercise.difficulty}
                </span>

              </div>

              {/* Details */}
              <div className="mt-5 border-t border-zinc-800 pt-4">

                <p className="text-sm text-zinc-500">
                  Equipment
                </p>

                <p className="mt-1 text-sm text-zinc-300">
                  {exercise.equipment}
                </p>

              </div>

              {/* Button */}
              <button
                className="mt-5 w-full rounded-lg border border-zinc-700 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-red-500 hover:bg-zinc-900 hover:text-white"
              >
                View Exercise
              </button>

            </div>
          ))}

        </div>
      )}

      {/* Empty State */}
      {!loading &&
        !error &&
        filteredExercises.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-zinc-500">
              No exercises found.
            </p>
          </div>
        )}

    </div>
  );
}