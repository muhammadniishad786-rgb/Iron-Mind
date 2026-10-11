
"use client";

import {
  ArrowLeft,
  Dumbbell,
  Trash2,
  Pencil,
  Play,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import type { RootState, AppDispatch } from "@/store/store";

import {
  fetchExerciseById,
  removeExercise,
} from "@/store/slices/exerciseSlice";

export default function ViewExercisePage() {
  const params = useParams();
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();
  const exerciseId = params.id as string;

  const { currentExercise, loading, error } = useSelector(
    (state: RootState) => state.exercise
  );

  useEffect(() => {
    if (exerciseId) {
      dispatch(fetchExerciseById(exerciseId));
    }
  }, [dispatch, exerciseId]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this exercise?"
    );

    if (!confirmed) return;

    try {
      await dispatch(removeExercise(exerciseId)).unwrap();
      router.push("/exercises");
    } catch (error) {
      console.error("Failed to delete exercise:", error);
    }
  };

  // Loading
  if (loading && !currentExercise) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-zinc-50 text-zinc-900 transition-colors duration-200 dark:bg-[#090909] dark:text-white">
        <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
          <Loader2 size={22} className="animate-spin text-red-500" />
          Loading exercise...
        </div>
      </div>
    );
  }

  // Error
  if (error && !currentExercise) {
    return (
      <div className="min-h-screen bg-zinc-50 p-6 text-zinc-900 transition-colors duration-200 dark:bg-[#090909] dark:text-white">
        <Link
          href="/exercises"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-red-500 dark:text-zinc-400 dark:hover:text-white"
        >
          <ArrowLeft size={18} />
          Back to Exercises
        </Link>

        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/20">
          <h2 className="text-lg font-semibold text-red-600 dark:text-red-500">
            Failed to load exercise
          </h2>

          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {error}
          </p>
        </div>
      </div>
    );
  }

  // Exercise not found
  if (!currentExercise) {
    return (
      <div className="min-h-screen bg-zinc-50 p-6 text-zinc-900 transition-colors duration-200 dark:bg-[#090909] dark:text-white">
        <Link
          href="/exercises"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-red-500 dark:text-zinc-400 dark:hover:text-white"
        >
          <ArrowLeft size={18} />
          Back to Exercises
        </Link>

        <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-10 text-center dark:border-zinc-800 dark:bg-zinc-950">
          <Dumbbell
            size={40}
            className="mx-auto text-zinc-400 dark:text-zinc-700"
          />

          <h2 className="mt-4 text-lg font-semibold">
            Exercise not found
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            The exercise you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-4 text-zinc-900 transition-colors duration-200 dark:bg-[#090909] dark:text-white sm:p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Link
            href="/exercises"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-red-500 dark:text-zinc-400 dark:hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Exercises
          </Link>

          <h1 className="mt-5 text-3xl font-bold">
            {currentExercise.name}
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Exercise details and instructions
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href={`/exercises/${exerciseId}/edit`}
            className="flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:border-red-400 hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-900 dark:hover:text-white"
          >
            <Pencil size={17} />
            Edit
          </Link>

          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900 dark:text-red-500 dark:hover:bg-red-950/30"
          >
            {loading ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <Trash2 size={17} />
            )}

            Delete
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Left - Image and Video */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            {currentExercise.image ? (
              <img
                src={currentExercise.image}
                alt={currentExercise.name}
                className="h-[300px] w-full object-cover sm:h-[400px]"
              />
            ) : (
              <div className="flex h-[300px] items-center justify-center bg-zinc-100 dark:bg-zinc-900 sm:h-[400px]">
                <div className="text-center">
                  <Dumbbell
                    size={60}
                    className="mx-auto text-zinc-400 dark:text-zinc-700"
                  />

                  <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-600">
                    No exercise image available
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Video */}
          {currentExercise.videoUrl && (
            <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
              <div className="flex items-center gap-2">
                <Play size={18} className="text-red-500" />

                <h2 className="font-semibold">Exercise Video</h2>
              </div>

              <div className="mt-4 overflow-hidden rounded-lg">
                <video
                  controls
                  poster={currentExercise.videoThumbnail || undefined}
                  className="max-h-[500px] w-full rounded-lg bg-black"
                >
                  <source
                    src={currentExercise.videoUrl}
                    type="video/mp4"
                  />

                  Your browser does not support video playback.
                </video>
              </div>
            </div>
          )}
        </div>

        {/* Right - Information */}
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-lg font-semibold">
              Exercise Information
            </h2>

            <div className="mt-6 space-y-5">
              {/* Muscle Group */}
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-600">
                  Muscle Group
                </p>

                <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-white">
                  {currentExercise.muscleGroup}
                </p>
              </div>

              {/* Equipment */}
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-600">
                  Equipment
                </p>

                <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-white">
                  {currentExercise.equipment}
                </p>
              </div>

              {/* Difficulty */}
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-600">
                  Difficulty
                </p>

                <span className="mt-2 inline-flex rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium capitalize text-red-600 dark:text-red-500">
                  {currentExercise.difficulty}
                </span>
              </div>
            </div>
          </div>

          {/* Video URL */}
          {currentExercise.videoUrl && (
            <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
              <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-600">
                Video URL
              </p>

              <p className="mt-2 break-all text-sm text-zinc-600 dark:text-zinc-400">
                {currentExercise.videoUrl}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-lg font-semibold">Instructions</h2>

        <div className="mt-5 whitespace-pre-line text-sm leading-7 text-zinc-600 dark:text-zinc-400">
          {currentExercise.instructions || "No instructions available for this exercise."}
        </div>
      </div>
    </div>
  );
}
