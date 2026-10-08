"use client";

import {
  ArrowLeft,
  Dumbbell,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import type { RootState, AppDispatch } from "@/store/store";
import { addExercise } from "@/store/slices/exerciseSlice";

export default function CreateExercisePage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { loading, error } = useSelector(
    (state: RootState) => state.exercise
  );

  const [formData, setFormData] = useState({
    name: "",
    muscleGroup: "",
    equipment: "",
    difficulty: "",
    instructions: "",
    image: "",
    videoUrl: "",
    videoThumbnail: "",
  });

  const [formError, setFormError] = useState("");

  /*
   * Handle input changes
   */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /*
   * Create exercise
   */
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setFormError("");

    /*
     * Required field validation
     */
    if (
      !formData.name.trim() ||
      !formData.muscleGroup ||
      !formData.equipment ||
      !formData.difficulty ||
      !formData.instructions.trim()
    ) {
      setFormError(
        "Please fill in all required fields."
      );

      return;
    }

    try {
      const exerciseData = {
        name: formData.name.trim(),
        muscleGroup: formData.muscleGroup,
        equipment: formData.equipment,
        difficulty: formData.difficulty,
        instructions: formData.instructions.trim(),
        image: formData.image.trim(),
        videoUrl: formData.videoUrl.trim(),
        videoThumbnail:
          formData.videoThumbnail.trim(),
      };

      await dispatch(
        addExercise(exerciseData)
      ).unwrap();

      /*
       * Exercise created successfully
       */
      router.push("/exercises");
    } catch (error) {
      console.error(
        "Failed to create exercise:",
        error
      );
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/exercises"
          className="rounded-lg border border-zinc-800 p-2 text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
        >
          <ArrowLeft size={20} />
        </Link>

        <div>
          <h1 className="text-3xl font-bold">
            Add <span className="text-red-500">Exercise</span>
          </h1>

          <p className="mt-1 text-sm text-zinc-500">
            Add a new exercise to your exercise library.
          </p>
        </div>
      </div>

      {/* Error */}
      {(formError || error) && (
        <div className="mt-6 rounded-lg border border-red-900 bg-red-950/20 p-4">
          <p className="text-sm text-red-500">
            {formError || error}
          </p>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-6"
      >
        {/* Basic Information */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
              <Dumbbell
                size={20}
                className="text-red-500"
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                Exercise Information
              </h2>

              <p className="text-sm text-zinc-500">
                Enter the basic details of the exercise.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {/* Exercise Name */}
            <div className="md:col-span-2">
              <label
                htmlFor="name"
                className="text-sm text-zinc-400"
              >
                Exercise Name
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Example: Bench Press"
                className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500"
              />
            </div>

            {/* Muscle Group */}
            <div>
              <label
                htmlFor="muscleGroup"
                className="text-sm text-zinc-400"
              >
                Muscle Group
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <select
                id="muscleGroup"
                name="muscleGroup"
                value={formData.muscleGroup}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-red-500"
              >
                <option value="">
                  Select Muscle Group
                </option>

                <option value="chest">
                  Chest
                </option>

                <option value="back">
                  Back
                </option>

                <option value="shoulders">
                  Shoulders
                </option>

                <option value="biceps">
                  Biceps
                </option>

                <option value="triceps">
                  Triceps
                </option>

                <option value="legs">
                  Legs
                </option>

                <option value="glutes">
                  Glutes
                </option>

                <option value="abs">
                  Abs
                </option>

                <option value="calves">
                  Calves
                </option>

                <option value="forearms">
                  Forearms
                </option>

                <option value="full_body">
                  Full Body
                </option>
              </select>
            </div>

            {/* Equipment */}
            <div>
              <label
                htmlFor="equipment"
                className="text-sm text-zinc-400"
              >
                Equipment
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <select
                id="equipment"
                name="equipment"
                value={formData.equipment}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-red-500"
              >
                <option value="">
                  Select Equipment
                </option>

                <option value="barbell">
                  Barbell
                </option>

                <option value="dumbbell">
                  Dumbbell
                </option>

                <option value="cable">
                  Cable Machine
                </option>

                <option value="machine">
                  Machine
                </option>

                <option value="bodyweight">
                  Bodyweight
                </option>

                <option value="kettlebell">
                  Kettlebell
                </option>

                <option value="resistance_band">
                  Resistance Band
                </option>

                <option value="smith_machine">
                  Smith Machine
                </option>

                <option value="other">
                  Other
                </option>
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label
                htmlFor="difficulty"
                className="text-sm text-zinc-400"
              >
                Difficulty
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-red-500"
              >
                <option value="">
                  Select Difficulty
                </option>

                <option value="beginner">
                  Beginner
                </option>

                <option value="intermediate">
                  Intermediate
                </option>

                <option value="advanced">
                  Advanced
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-lg font-semibold">
            Instructions
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Explain how to perform the exercise correctly.
          </p>

          <textarea
            id="instructions"
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            placeholder={`Example:

1. Lie flat on the bench.
2. Grip the bar slightly wider than shoulder width.
3. Lower the bar slowly toward your chest.
4. Push the bar back to the starting position.`}
            rows={8}
            className="mt-5 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500"
          />
        </div>

        {/* Media */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-lg font-semibold">
            Media
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Add images and video links for this exercise.
          </p>

          <div className="mt-6 space-y-5">
            {/* Image */}
            <div>
              <label
                htmlFor="image"
                className="text-sm text-zinc-400"
              >
                Image URL
              </label>

              <input
                id="image"
                name="image"
                type="url"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/bench-press.jpg"
                className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500"
              />
            </div>

            {/* Video URL */}
            <div>
              <label
                htmlFor="videoUrl"
                className="text-sm text-zinc-400"
              >
                Video URL
              </label>

              <input
                id="videoUrl"
                name="videoUrl"
                type="url"
                value={formData.videoUrl}
                onChange={handleChange}
                placeholder="https://example.com/bench-press.mp4"
                className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500"
              />
            </div>

            {/* Video Thumbnail */}
            <div>
              <label
                htmlFor="videoThumbnail"
                className="text-sm text-zinc-400"
              >
                Video Thumbnail URL
              </label>

              <input
                id="videoThumbnail"
                name="videoThumbnail"
                type="url"
                value={formData.videoThumbnail}
                onChange={handleChange}
                placeholder="https://example.com/bench-press-thumbnail.jpg"
                className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Link
            href="/exercises"
            className="rounded-lg border border-zinc-800 px-5 py-3 text-sm font-medium text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && (
              <Loader2
                size={18}
                className="animate-spin"
              />
            )}

            {loading
              ? "Creating..."
              : "Create Exercise"}
          </button>
        </div>
      </form>
    </div>
  );
}