"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { RootState, AppDispatch } from "@/store/store";
import {
  fetchWorkouts,
} from "@/store/slices/workoutSlice";

export default function WorkoutsPage() {
  const dispatch = useDispatch<AppDispatch>();

  const {
    workouts,
    loading,
    error,
  } = useSelector(
    (state: RootState) => state.workout
  );

  // Fetch workouts
  useEffect(() => {
    dispatch(fetchWorkouts());
  }, [dispatch]);

  // Calculate workout volume
  const calculateVolume = (workout: any) => {
    let volume = 0;

    workout.exercises?.forEach((workoutExercise: any) => {
      workoutExercise.performedSets?.forEach((set: any) => {
        if (!set.completed) return;

        volume +=
          (Number(set.weight) || 0) *
          (Number(set.reps) || 0);
      });
    });

    return volume;
  };

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <h1 className="text-3xl font-bold">
            My <span className="text-red-500">Workouts</span>
          </h1>

          <p className="mt-2 text-zinc-400">
            Create, manage, and track your workouts.
          </p>
        </div>

        <Link href="/workouts/create">
          <button className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold transition hover:bg-red-500">
            <Plus size={18} />
            Create Workout
          </button>
        </Link>

      </div>

      {/* Workout List */}
      <div className="mt-8">

        <h2 className="text-xl font-semibold">
          Your Workouts
        </h2>

        {/* Loading */}
        {loading && (
          <div className="mt-8 text-center">
            <p className="text-zinc-500">
              Loading workouts...
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-lg border border-red-900 bg-red-950/20 p-4">
            <p className="text-red-500">
              {error}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading &&
          !error &&
          workouts.length === 0 && (
            <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-950 p-10 text-center">
              <h3 className="text-lg font-semibold">
                No workouts yet
              </h3>

              <p className="mt-2 text-sm text-zinc-500">
                Create your first workout to get started.
              </p>

              <Link href="/workouts/create">
                <button className="mt-5 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-red-500">
                  Create Workout
                </button>
              </Link>
            </div>
          )}

        {/* Workout Grid */}
        {!loading &&
          !error &&
          workouts.length > 0 && (
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">

              {workouts.map((workout) => {
                const volume = calculateVolume(workout);

                return (
                  <div
                    key={workout._id}
                    className="rounded-xl border border-red-800 bg-zinc-950 p-5 transition hover:border-red-600"
                  >

                    {/* Top */}
                    <div className="flex items-start justify-between gap-3">

                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-red-500">
                          Workout
                        </p>

                        <h3 className="mt-2 text-xl font-semibold">
                          {workout.name}
                        </h3>

                        {workout.description && (
                          <p className="mt-1 text-sm text-zinc-500">
                            {workout.description}
                          </p>
                        )}
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          workout.completed
                            ? "bg-green-500/10 text-green-500"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {workout.completed
                          ? "Completed"
                          : "Planned"}
                      </span>

                    </div>

                    {/* Stats */}
                    <div className="mt-5 grid grid-cols-3 gap-3 text-center">

                      <div className="rounded-lg bg-zinc-900 p-3">
                        <p className="text-lg font-semibold">
                          {workout.exercises?.length || 0}
                        </p>

                        <p className="text-xs text-zinc-500">
                          Exercises
                        </p>
                      </div>

                      <div className="rounded-lg bg-zinc-900 p-3">
                        <p className="text-lg font-semibold">
                          {workout.duration || 0}
                        </p>

                        <p className="text-xs text-zinc-500">
                          Minutes
                        </p>
                      </div>

                      <div className="rounded-lg bg-zinc-900 p-3">
                        <p className="text-lg font-semibold">
                          {volume >= 1000
                            ? `${(volume / 1000).toFixed(1)}K`
                            : volume}
                        </p>

                        <p className="text-xs text-zinc-500">
                          Volume
                        </p>
                      </div>

                    </div>

                    {/* View Button */}
                    <Link
                      href={`/workouts/${workout._id}`}
                    >
                      <button className="mt-5 w-full rounded-lg border border-zinc-700 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-red-500 hover:bg-zinc-900 hover:text-white">
                        View Workout
                      </button>
                    </Link>

                  </div>
                );
              })}

            </div>
          )}

      </div>
    </div>
  );
}