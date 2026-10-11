
"use client";

import { ArrowLeft, Dumbbell, Loader2 } from "lucide-react";
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

    if (formError) setFormError("");
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setFormError("");

    if (
      !formData.name.trim() ||
      !formData.muscleGroup ||
      !formData.equipment ||
      !formData.difficulty ||
      !formData.instructions.trim()
    ) {
      setFormError("Please fill in all required fields.");
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
        videoThumbnail: formData.videoThumbnail.trim(),
      };

      await dispatch(addExercise(exerciseData)).unwrap();
      router.push("/exercises");
    } catch (error) {
      console.error("Failed to create exercise:", error);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-600";

  const labelClass = "text-sm text-zinc-600 dark:text-zinc-400";

  const sectionClass =
    "rounded-xl border border-zinc-200 bg-white p-5 transition-colors duration-200 dark:border-zinc-800 dark:bg-zinc-950 sm:p-6";

  return (
    <div className="min-h-screen bg-zinc-50 p-4 text-zinc-900 transition-colors duration-200 dark:bg-[#090909] dark:text-white sm:p-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/exercises"
            aria-label="Back to exercises"
            className="rounded-lg border border-zinc-300 p-2 text-zinc-600 transition hover:border-red-400 hover:bg-zinc-100 hover:text-red-600 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
          >
            <ArrowLeft size={20} />
          </Link>

          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              Add <span className="text-red-500">Exercise</span>
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              Add a new exercise to your exercise library.
            </p>
          </div>
        </div>

        {/* Error */}
        {(formError || error) && (
          <div
            role="alert"
            className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/20"
          >
            <p className="text-sm text-red-600 dark:text-red-400">
              {formError || error}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Basic Information */}
          <section className={sectionClass}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                <Dumbbell size={20} className="text-red-500" />
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
                <label htmlFor="name" className={labelClass}>
                  Exercise Name <span className="text-red-500">*</span>
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Example: Bench Press"
                  className={inputClass}
                />
              </div>

              {/* Muscle Group */}
              <div>
                <label htmlFor="muscleGroup" className={labelClass}>
                  Muscle Group <span className="text-red-500">*</span>
                </label>

                <select
                  id="muscleGroup"
                  name="muscleGroup"
                  required
                  value={formData.muscleGroup}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select Muscle Group</option>
                  <option value="chest">Chest</option>
                  <option value="back">Back</option>
                  <option value="shoulders">Shoulders</option>
                  <option value="biceps">Biceps</option>
                  <option value="triceps">Triceps</option>
                  <option value="legs">Legs</option>
                  <option value="glutes">Glutes</option>
                  <option value="abs">Abs</option>
                  <option value="calves">Calves</option>
                  <option value="forearms">Forearms</option>
                  <option value="full_body">Full Body</option>
                </select>
              </div>

              {/* Equipment */}
              <div>
                <label htmlFor="equipment" className={labelClass}>
                  Equipment <span className="text-red-500">*</span>
                </label>

                <select
                  id="equipment"
                  name="equipment"
                  required
                  value={formData.equipment}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select Equipment</option>
                  <option value="barbell">Barbell</option>
                  <option value="dumbbell">Dumbbell</option>
                  <option value="cable">Cable Machine</option>
                  <option value="machine">Machine</option>
                  <option value="bodyweight">Bodyweight</option>
                  <option value="kettlebell">Kettlebell</option>
                  <option value="resistance_band">Resistance Band</option>
                  <option value="smith_machine">Smith Machine</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label htmlFor="difficulty" className={labelClass}>
                  Difficulty <span className="text-red-500">*</span>
                </label>

                <select
                  id="difficulty"
                  name="difficulty"
                  required
                  value={formData.difficulty}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select Difficulty</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          </section>

          {/* Instructions */}
          <section className={sectionClass}>
            <h2 className="text-lg font-semibold">Instructions</h2>

            <p className="mt-1 text-sm text-zinc-500">
              Explain how to perform the exercise correctly.
            </p>

            <label htmlFor="instructions" className="sr-only">
              Exercise instructions
            </label>

            <textarea
              id="instructions"
              name="instructions"
              required
              value={formData.instructions}
              onChange={handleChange}
              placeholder={`Example:

1. Lie flat on the bench.
2. Grip the bar slightly wider than shoulder width.
3. Lower the bar slowly toward your chest.
4. Push the bar back to the starting position.`}
              rows={8}
              className={`${inputClass} resize-y leading-6`}
            />
          </section>

          {/* Media */}
          <section className={sectionClass}>
            <h2 className="text-lg font-semibold">Media</h2>

            <p className="mt-1 text-sm text-zinc-500">
              Add images and video links for this exercise.
            </p>

            <div className="mt-6 space-y-5">
              {/* Image URL */}
              <div>
                <label htmlFor="image" className={labelClass}>
                  Image URL
                </label>

                <input
                  id="image"
                  name="image"
                  type="url"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/bench-press.jpg"
                  className={inputClass}
                />
              </div>

              {/* Video URL */}
              <div>
                <label htmlFor="videoUrl" className={labelClass}>
                  Video URL
                </label>

                <input
                  id="videoUrl"
                  name="videoUrl"
                  type="url"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/bench-press.mp4"
                  className={inputClass}
                />
              </div>

              {/* Video Thumbnail */}
              <div>
                <label htmlFor="videoThumbnail" className={labelClass}>
                  Video Thumbnail URL
                </label>

                <input
                  id="videoThumbnail"
                  name="videoThumbnail"
                  type="url"
                  value={formData.videoThumbnail}
                  onChange={handleChange}
                  placeholder="https://example.com/bench-press-thumbnail.jpg"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <Link
              href="/exercises"
              className="inline-flex items-center justify-center rounded-lg border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && (
                <Loader2 size={18} className="animate-spin" />
              )}

              {loading ? "Creating..." : "Create Exercise"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
