
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  Trash2,
  Save,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

import type { RootState, AppDispatch } from "@/store/store";
import {
  fetchWorkoutById,
  editWorkout,
} from "@/store/slices/workoutSlice";
import { fetchExercises } from "@/store/slices/exerciseSlice";

interface WorkoutExerciseForm {
  id: string;
  exerciseId: string;
  sets: string;
  reps: string;
  weight: string;
}

export default function EditWorkoutPage() {
  const router = useRouter();
  const params = useParams();
  const workoutId = params.id as string;

  const dispatch = useDispatch<AppDispatch>();

  const { currentWorkout, loading, error } = useSelector(
    (state: RootState) => state.workout
  );

  const { exercises } = useSelector(
    (state: RootState) => state.exercise
  );

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [workoutExercises, setWorkoutExercises] = useState<
    WorkoutExerciseForm[]
  >([]);

  const [saving, setSaving] = useState(false);

  // Theme-aware styles
  const cardClass =
    "rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950";

  const nestedCardClass =
    "rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900";

  const headingClass =
    "text-xl font-semibold text-zinc-900 dark:text-white";

  const descriptionClass =
    "text-sm text-zinc-500 dark:text-zinc-400";

  const labelClass =
    "mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300";

  const smallLabelClass =
    "mb-2 block text-xs font-medium text-zinc-600 dark:text-zinc-400";

  const inputClass =
    "w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-600";

  const numberInputClass =
    `${inputClass} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`;

  const selectClass =
    "w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white";

  // Fetch workout and exercises.
  useEffect(() => {
    if (workoutId) {
      dispatch(fetchWorkoutById(workoutId));
      dispatch(fetchExercises());
    }
  }, [dispatch, workoutId]);

  // Populate form when workout data is available.
  useEffect(() => {
    if (!currentWorkout) return;

    setName(currentWorkout.name || "");
    setDescription(currentWorkout.description || "");

    const formattedExercises = currentWorkout.exercises.map(
      (workoutExercise, index) => {
        const exerciseId =
          typeof workoutExercise.exercise === "string"
            ? workoutExercise.exercise
            : workoutExercise.exercise._id;

        return {
          id: `${exerciseId}-${index}`,
          exerciseId,
          sets: String(workoutExercise.sets ?? 1),
          reps: String(workoutExercise.reps ?? 1),
          weight: String(workoutExercise.weight ?? 0),
        };
      }
    );

    setWorkoutExercises(formattedExercises);
  }, [currentWorkout]);

  // Add exercise.
  const handleAddExercise = () => {
    setWorkoutExercises((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        exerciseId: "",
        sets: "3",
        reps: "10",
        weight: "0",
      },
    ]);
  };

  // Remove exercise.
  const handleRemoveExercise = (id: string) => {
    setWorkoutExercises((prev) =>
      prev.filter((exercise) => exercise.id !== id)
    );
  };

  // Update fields without converting typed values to numbers.
  const handleExerciseChange = (
    id: string,
    field: keyof WorkoutExerciseForm,
    value: string
  ) => {
    setWorkoutExercises((prev) =>
      prev.map((exercise) =>
        exercise.id === id
          ? { ...exercise, [field]: value }
          : exercise
      )
    );
  };

  // Save workout.
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter a workout name.");
      return;
    }

    if (workoutExercises.length === 0) {
      alert("Please add at least one exercise.");
      return;
    }

    if (workoutExercises.some((exercise) => !exercise.exerciseId)) {
      alert("Please select an exercise for every row.");
      return;
    }

    const invalidExercise = workoutExercises.some((exercise) => {
      const sets = Number(exercise.sets);
      const reps = Number(exercise.reps);
      const weight = Number(exercise.weight);

      return (
        exercise.sets.trim() === "" ||
        exercise.reps.trim() === "" ||
        exercise.weight.trim() === "" ||
        !Number.isInteger(sets) ||
        sets < 1 ||
        !Number.isInteger(reps) ||
        reps < 1 ||
        !Number.isFinite(weight) ||
        weight < 0
      );
    });

    if (invalidExercise) {
      alert(
        "Sets and reps must be positive whole numbers. Weight must be zero or greater."
      );
      return;
    }

    try {
      setSaving(true);

      const workoutData = {
        name: name.trim(),
        description,
        exercises: workoutExercises.map((exercise) => ({
          exercise: exercise.exerciseId,
          sets: Number(exercise.sets),
          reps: Number(exercise.reps),
          weight: Number(exercise.weight),
        })),
      };

      await dispatch(
        editWorkout({
          id: workoutId,
          workoutData,
        })
      ).unwrap();

      router.push("/workouts");
    } catch (err) {
      console.error("Failed to update workout:", err);
      alert("Failed to update workout. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Loading state.
  if (loading && !currentWorkout) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-zinc-50 text-zinc-600 dark:bg-black dark:text-zinc-400">
        <div className="flex items-center gap-2">
          <Loader2
            size={20}
            className="animate-spin text-red-500"
          />
          Loading workout...
        </div>
      </div>
    );
  }

  // Workout not found.
  if (!currentWorkout && !loading) {
    return (
      <div className="min-h-screen bg-zinc-50 p-6 text-zinc-900 dark:bg-black dark:text-white">
        <div className="rounded-xl border border-red-200 bg-white p-8 text-center dark:border-red-900 dark:bg-red-950/20">
          <h2 className="text-xl font-semibold">
            Workout not found
          </h2>

          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            {error || "Unable to load this workout."}
          </p>

          <Link
            href="/workouts"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500"
          >
            <ArrowLeft size={16} />
            Back to Workouts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-4 text-zinc-900 transition-colors sm:p-6 dark:bg-black dark:text-white">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/workouts"
          className="mb-4 inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-red-500 dark:text-zinc-400"
        >
          <ArrowLeft size={16} />
          Back to Workouts
        </Link>

        <h1 className="text-3xl font-bold">
          Edit <span className="text-red-500">Workout</span>
        </h1>

        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Update your workout and exercise details.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl space-y-8"
      >
        {/* Workout Information */}
        <div className={cardClass}>
          <h2 className={headingClass}>
            Workout Information
          </h2>

          <div className="mt-5 space-y-5">
            <div>
              <label className={labelClass}>
                Workout Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Example: Push Day"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your workout..."
                rows={4}
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>
        </div>

        {/* Exercises */}
        <div className={cardClass}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className={headingClass}>
                Exercises
              </h2>

              <p className={`mt-1 ${descriptionClass}`}>
                Update exercises, sets, reps, and weight.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddExercise}
              className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500"
            >
              <Plus size={17} />
              Add Exercise
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {workoutExercises.map((workoutExercise, index) => (
              <div
                key={workoutExercise.id}
                className={nestedCardClass}
              >
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Exercise {index + 1}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveExercise(workoutExercise.id)
                    }
                    aria-label={`Remove exercise ${index + 1}`}
                    className="rounded-lg p-2 text-zinc-500 transition hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-500"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {/* Exercise Selection */}
                  <div className="sm:col-span-2 md:col-span-3">
                    <label className={smallLabelClass}>
                      Exercise
                    </label>

                    <select
                      value={workoutExercise.exerciseId}
                      onChange={(e) =>
                        handleExerciseChange(
                          workoutExercise.id,
                          "exerciseId",
                          e.target.value
                        )
                      }
                      className={selectClass}
                    >
                      <option value="">
                        Select an exercise
                      </option>

                      {exercises.map((exercise) => (
                        <option
                          key={exercise._id}
                          value={exercise._id}
                        >
                          {exercise.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sets */}
                  <div>
                    <label className={smallLabelClass}>
                      Sets
                    </label>

                    <input
                      type="number"
                      min="1"
                      step="1"
                      inputMode="numeric"
                      value={workoutExercise.sets}
                      onChange={(e) =>
                        handleExerciseChange(
                          workoutExercise.id,
                          "sets",
                          e.target.value
                        )
                      }
                      className={numberInputClass}
                    />
                  </div>

                  {/* Reps */}
                  <div>
                    <label className={smallLabelClass}>
                      Reps
                    </label>

                    <input
                      type="number"
                      min="1"
                      step="1"
                      inputMode="numeric"
                      value={workoutExercise.reps}
                      onChange={(e) =>
                        handleExerciseChange(
                          workoutExercise.id,
                          "reps",
                          e.target.value
                        )
                      }
                      className={numberInputClass}
                    />
                  </div>

                  {/* Weight */}
                  <div>
                    <label className={smallLabelClass}>
                      Weight (kg)
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="any"
                      inputMode="decimal"
                      value={workoutExercise.weight}
                      onChange={(e) =>
                        handleExerciseChange(
                          workoutExercise.id,
                          "weight",
                          e.target.value
                        )
                      }
                      className={numberInputClass}
                    />
                  </div>
                </div>
              </div>
            ))}

            {workoutExercises.length === 0 && (
              <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-800">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  No exercises added.
                </p>

                <button
                  type="button"
                  onClick={handleAddExercise}
                  className="mt-4 text-sm font-medium text-red-600 transition hover:text-red-500 dark:text-red-500 dark:hover:text-red-400"
                >
                  + Add your first exercise
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/20">
            <p className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/workouts"
            className="rounded-lg border border-zinc-300 px-6 py-3 text-center text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                />
                Saving...
              </>
            ) : (
              <>
                <Save size={17} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
