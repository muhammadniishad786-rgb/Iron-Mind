"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Dumbbell,
  Clock,
  BarChart3,
  CheckCircle2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import type { RootState, AppDispatch } from "@/store/store";

import {
  fetchWorkouts,
  removeWorkout,
} from "@/store/slices/workoutSlice";

import type { Workout } from "@/services/workoutApi";

export default function WorkoutsPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { workouts, loading, error } = useSelector(
    (state: RootState) => state.workout
  );

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Fetch workouts.
  useEffect(() => {
    dispatch(fetchWorkouts());
  }, [dispatch]);

  // Calculate volume using completed sets only.
  const calculateVolume = (workout: Workout): number => {
    return workout.exercises.reduce((total, workoutExercise) => {
      const exerciseVolume = (workoutExercise.performedSets ?? []).reduce(
        (setTotal, set) => {
          if (!set.completed) return setTotal;

          return (
            setTotal +
            (Number(set.weight) || 0) * (Number(set.reps) || 0)
          );
        },
        0
      );

      return total + exerciseVolume;
    }, 0);
  };

  // Format volume for display.
  const formatVolume = (volume: number) => {
    return volume >= 1000
      ? `${(volume / 1000).toFixed(1)}K`
      : volume.toLocaleString();
  };

  // Delete workout.
  const handleDelete = async (id: string) => {
    if (deletingId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this workout?"
    );

    if (!confirmed) return;

    setDeletingId(id);
    setDeleteError(null);

    try {
      await dispatch(removeWorkout(id)).unwrap();
    } catch (err) {
      console.error("Failed to delete workout:", err);

      setDeleteError(
        typeof err === "string"
          ? err
          : "Failed to delete workout. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const isInitialLoading = loading && workouts.length === 0;

  return (
    <div className="min-h-full p-4 text-white sm:p-6">
      <div className="mx-auto max-w-7xl">
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

          <Link
            href="/workouts/create"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold transition hover:bg-red-500"
          >
            <Plus size={18} />
            Create Workout
          </Link>
        </div>

        {/* Workout List */}
        <section className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Your Workouts</h2>

            {!isInitialLoading && workouts.length > 0 && (
              <span className="text-sm text-zinc-500">
                {workouts.length}{" "}
                {workouts.length === 1 ? "workout" : "workouts"}
              </span>
            )}
          </div>

          {/* Loading */}
          {isInitialLoading && (
            <div className="mt-10 flex items-center justify-center gap-2 text-zinc-400">
              <Loader2
                size={20}
                className="animate-spin text-red-500"
              />
              Loading workouts...
            </div>
          )}

          {/* Fetch error */}
          {error && workouts.length === 0 && !loading && (
            <div className="mt-6 rounded-lg border border-red-900 bg-red-950/20 p-4">
              <p className="text-sm text-red-400">{error}</p>

              <button
                type="button"
                onClick={() => dispatch(fetchWorkouts())}
                className="mt-3 text-sm font-semibold text-white underline underline-offset-4 hover:text-red-400"
              >
                Try again
              </button>
            </div>
          )}

          {/* Delete error */}
          {deleteError && (
            <div
              role="alert"
              className="mt-6 flex items-center justify-between gap-3 rounded-lg border border-red-900 bg-red-950/20 p-4"
            >
              <p className="text-sm text-red-400">{deleteError}</p>

              <button
                type="button"
                onClick={() => setDeleteError(null)}
                className="shrink-0 text-sm text-zinc-400 hover:text-white"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && workouts.length === 0 && (
            <div className="mt-8 rounded-xl border border-dashed border-zinc-800 bg-zinc-950 p-10 text-center">
              <Dumbbell
                size={36}
                className="mx-auto text-zinc-600"
              />

              <h3 className="mt-4 text-lg font-semibold">
                No workouts yet
              </h3>

              <p className="mt-2 text-sm text-zinc-500">
                Create your first workout to get started.
              </p>

              <Link
                href="/workouts/create"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-red-500"
              >
                <Plus size={17} />
                Create Workout
              </Link>
            </div>
          )}

          {/* Workout grid */}
          {!isInitialLoading && workouts.length > 0 && (
            <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {workouts.map((workout) => {
                const volume = calculateVolume(workout);
                const isDeleting = deletingId === workout._id;
                const isCompleted = workout.completed;

                return (
                  <article
                    key={workout._id}
                    className="flex flex-col rounded-xl border border-zinc-800 bg-zinc-950 p-5 transition duration-200 hover:border-red-600/70"
                  >
                    {/* Card header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wider text-red-500">
                          Workout
                        </p>

                        <h3 className="mt-2 break-words text-xl font-semibold">
                          {workout.name}
                        </h3>

                        {workout.description && (
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-500">
                            {workout.description}
                          </p>
                        )}
                      </div>

                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
                          isCompleted
                            ? "bg-green-500/10 text-green-400"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {isCompleted && <CheckCircle2 size={13} />}
                        {isCompleted ? "Completed" : "Planned"}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="mt-6 grid grid-cols-3 gap-2">
                      <div className="rounded-lg bg-zinc-900 p-3 text-center">
                        <Dumbbell
                          size={17}
                          className="mx-auto mb-2 text-red-400"
                        />

                        <p className="text-lg font-semibold">
                          {workout.exercises.length}
                        </p>

                        <p className="mt-1 text-xs text-zinc-500">
                          Exercises
                        </p>
                      </div>

                      <div className="rounded-lg bg-zinc-900 p-3 text-center">
                        <Clock
                          size={17}
                          className="mx-auto mb-2 text-red-400"
                        />

                        <p className="text-lg font-semibold">
                          {workout.duration || 0}
                        </p>

                        <p className="mt-1 text-xs text-zinc-500">
                          Minutes
                        </p>
                      </div>

                      <div className="rounded-lg bg-zinc-900 p-3 text-center">
                        <BarChart3
                          size={17}
                          className="mx-auto mb-2 text-red-400"
                        />

                        <p
                          className="text-lg font-semibold"
                          title={`${volume} kg`}
                        >
                          {formatVolume(volume)}
                        </p>

                        <p className="mt-1 text-xs text-zinc-500">
                          Volume (kg)
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-auto pt-5">
                      <Link
                        href={`/workouts/${workout._id}`}
                        className="block w-full rounded-lg border border-zinc-700 py-2.5 text-center text-sm font-medium text-zinc-300 transition hover:border-red-500 hover:bg-zinc-900 hover:text-white"
                      >
                        View Workout
                      </Link>

                      <div
                        className={`mt-3 grid gap-3 ${
                          isCompleted ? "grid-cols-1" : "grid-cols-2"
                        }`}
                      >
                        {!isCompleted && (
                          <Link
                            href={`/workouts/${workout._id}/edit`}
                            className="flex items-center justify-center gap-2 rounded-lg border border-zinc-800 py-2.5 text-sm font-medium text-zinc-400 transition hover:border-zinc-600 hover:bg-zinc-900 hover:text-white"
                          >
                            <Pencil size={16} />
                            Edit
                          </Link>
                        )}

                        <button
                          type="button"
                          disabled={Boolean(deletingId)}
                          onClick={() => handleDelete(workout._id)}
                          className="flex items-center justify-center gap-2 rounded-lg border border-red-900/70 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-950/30 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isDeleting ? (
                            <Loader2
                              size={16}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2 size={16} />
                          )}

                          {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
