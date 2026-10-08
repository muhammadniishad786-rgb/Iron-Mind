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

  const {
    currentExercise,
    loading,
    error,
  } = useSelector(
    (state: RootState) => state.exercise
  );

  /*
   * Fetch exercise
   */
  useEffect(() => {
    if (exerciseId) {
      dispatch(fetchExerciseById(exerciseId));
    }
  }, [dispatch, exerciseId]);

  /*
   * Delete exercise
   */
  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this exercise?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await dispatch(
        removeExercise(exerciseId)
      ).unwrap();

      router.push("/exercises");
    } catch (error) {
      console.error(
        "Failed to delete exercise:",
        error
      );
    }
  };

  /*
   * Loading
   */
  if (loading && !currentExercise) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <div className="flex items-center gap-3 text-zinc-400">
          <Loader2
            size={22}
            className="animate-spin"
          />
          Loading exercise...
        </div>
      </div>
    );
  }

  /*
   * Error
   */
  if (error && !currentExercise) {
    return (
      <div className="p-6">
        <Link
          href="/exercises"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft size={18} />
          Back to Exercises
        </Link>

        <div className="mt-8 rounded-xl border border-red-900 bg-red-950/20 p-6">
          <h2 className="text-lg font-semibold text-red-500">
            Failed to load exercise
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            {error}
          </p>
        </div>
      </div>
    );
  }

  /*
   * Exercise not found
   */
  if (!currentExercise) {
    return (
      <div className="p-6">
        <Link
          href="/exercises"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft size={18} />
          Back to Exercises
        </Link>

        <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-950 p-10 text-center">
          <Dumbbell
            size={40}
            className="mx-auto text-zinc-700"
          />

          <h2 className="mt-4 text-lg font-semibold">
            Exercise not found
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            The exercise you're looking for doesn't
            exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Link
            href="/exercises"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
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
            className="flex items-center gap-2 rounded-lg border border-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-900 hover:text-white"
          >
            <Pencil size={17} />
            Edit
          </Link>

          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-red-900 px-4 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-950/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <Loader2
                size={17}
                className="animate-spin"
              />
            ) : (
              <Trash2 size={17} />
            )}

            Delete
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Left - Image / Video */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
            {currentExercise.image ? (
              <img
                src={currentExercise.image}
                alt={currentExercise.name}
                className="h-[400px] w-full object-cover"
              />
            ) : (
              <div className="flex h-[400px] items-center justify-center bg-zinc-900">
                <div className="text-center">
                  <Dumbbell
                    size={60}
                    className="mx-auto text-zinc-700"
                  />

                  <p className="mt-4 text-sm text-zinc-600">
                    No exercise image available
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Video */}
          {currentExercise.videoUrl && (
            <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950 p-6">
              <div className="flex items-center gap-2">
                <Play
                  size={18}
                  className="text-red-500"
                />

                <h2 className="font-semibold">
                  Exercise Video
                </h2>
              </div>

              <div className="mt-4 overflow-hidden rounded-lg">
                <video
                  controls
                  poster={
                    currentExercise.videoThumbnail ||
                    undefined
                  }
                  className="max-h-[500px] w-full bg-black"
                >
                  <source
                    src={currentExercise.videoUrl}
                    type="video/mp4"
                  />

                  Your browser does not support
                  video playback.
                </video>
              </div>
            </div>
          )}
        </div>

        {/* Right - Information */}
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-lg font-semibold">
              Exercise Information
            </h2>

            <div className="mt-6 space-y-5">
              {/* Muscle Group */}
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-600">
                  Muscle Group
                </p>

                <p className="mt-1 text-sm font-medium text-white">
                  {currentExercise.muscleGroup}
                </p>
              </div>

              {/* Equipment */}
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-600">
                  Equipment
                </p>

                <p className="mt-1 text-sm font-medium text-white">
                  {currentExercise.equipment}
                </p>
              </div>

              {/* Difficulty */}
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-600">
                  Difficulty
                </p>

                <span className="mt-2 inline-flex rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium capitalize text-red-500">
                  {currentExercise.difficulty}
                </span>
              </div>
            </div>
          </div>

          {/* Video URL */}
          {currentExercise.videoUrl && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
              <p className="text-xs uppercase tracking-wide text-zinc-600">
                Video URL
              </p>

              <p className="mt-2 break-all text-sm text-zinc-400">
                {currentExercise.videoUrl}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950 p-6">
        <h2 className="text-lg font-semibold">
          Instructions
        </h2>

        <div className="mt-5 whitespace-pre-line text-sm leading-7 text-zinc-400">
          {currentExercise.instructions}
        </div>
      </div>
    </div>
  );
}