"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Trash2, Save, Loader2, ArrowLeft } from "lucide-react";
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
  sets: number;
  reps: number;
  weight: number;
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

  // Fetch workout and exercises
  useEffect(() => {
    if (workoutId) {
      dispatch(fetchWorkoutById(workoutId));
      dispatch(fetchExercises());
    }
  }, [dispatch, workoutId]);

  // Load workout data into form
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
          sets: workoutExercise.sets || 1,
          reps: workoutExercise.reps || 1,
          weight: workoutExercise.weight || 0,
        };
      }
    );

    setWorkoutExercises(formattedExercises);
  }, [currentWorkout]);

  // Add exercise row
  const handleAddExercise = () => {
    setWorkoutExercises((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        exerciseId: "",
        sets: 3,
        reps: 10,
        weight: 0,
      },
    ]);
  };

  // Remove exercise row
  const handleRemoveExercise = (id: string) => {
    setWorkoutExercises((prev) =>
      prev.filter((exercise) => exercise.id !== id)
    );
  };

  // Update exercise field
  const handleExerciseChange = (
    id: string,
    field: keyof WorkoutExerciseForm,
    value: string
  ) => {
    setWorkoutExercises((prev) =>
      prev.map((exercise) =>
        exercise.id === id
          ? {
              ...exercise,
              [field]:
                field === "exerciseId"
                  ? value
                  : Number(value),
            }
          : exercise
      )
    );
  };

  // Save workout
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

    const hasInvalidExercise = workoutExercises.some(
      (exercise) => !exercise.exerciseId
    );

    if (hasInvalidExercise) {
      alert("Please select an exercise for every row.");
      return;
    }

    try {
      setSaving(true);

      const workoutData = {
        name,
        description,
        exercises: workoutExercises.map((exercise) => ({
          exercise: exercise.exerciseId,
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight,
        })),
      };

      await dispatch(
        editWorkout({
          id: workoutId,
          workoutData,
        })
      ).unwrap();

      router.push("/workouts");
    } catch (error) {
      console.error("Failed to update workout:", error);
    } finally {
      setSaving(false);
    }
  };

  // Loading workout
  if (loading && !currentWorkout) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <div className="flex items-center gap-2 text-zinc-400">
          <Loader2
            size={20}
            className="animate-spin text-red-500"
          />
          Loading workout...
        </div>
      </div>
    );
  }

  // Workout not found
  if (!currentWorkout && !loading) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-900 bg-red-950/20 p-8 text-center">
          <h2 className="text-xl font-semibold">
            Workout not found
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            {error || "Unable to load this workout."}
          </p>

          <Link
            href="/workouts"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold hover:bg-red-500"
          >
            <ArrowLeft size={16} />
            Back to Workouts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/workouts"
          className="mb-4 inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Workouts
        </Link>

        <h1 className="text-3xl font-bold">
          Edit{" "}
          <span className="text-red-500">
            Workout
          </span>
        </h1>

        <p className="mt-2 text-zinc-400">
          Update your workout and exercise details.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl space-y-8"
      >
        {/* Basic Information */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-xl font-semibold">
            Workout Information
          </h2>

          <div className="mt-5 space-y-5">
            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Workout Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Example: Push Day"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Describe your workout..."
                rows={4}
                className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500"
              />
            </div>
          </div>
        </div>

        {/* Exercises */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">
                Exercises
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Update exercises, sets, reps, and weight.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddExercise}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold transition hover:bg-red-500"
            >
              <Plus size={17} />
              Add Exercise
            </button>
          </div>

          {/* Exercise rows */}
          <div className="mt-6 space-y-4">
            {workoutExercises.map(
              (workoutExercise, index) => (
                <div
                  key={workoutExercise.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-medium text-zinc-400">
                      Exercise {index + 1}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveExercise(
                          workoutExercise.id
                        )
                      }
                      className="rounded-lg p-2 text-zinc-500 transition hover:bg-red-950/30 hover:text-red-500"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-4">
                    {/* Exercise */}
                    <div className="md:col-span-4">
                      <label className="mb-2 block text-xs font-medium text-zinc-400">
                        Exercise
                      </label>

                      <select
                        value={
                          workoutExercise.exerciseId
                        }
                        onChange={(e) =>
                          handleExerciseChange(
                            workoutExercise.id,
                            "exerciseId",
                            e.target.value
                          )
                        }
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-red-500"
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
                      <label className="mb-2 block text-xs font-medium text-zinc-400">
                        Sets
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={workoutExercise.sets}
                        onChange={(e) =>
                          handleExerciseChange(
                            workoutExercise.id,
                            "sets",
                            e.target.value
                          )
                        }
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-red-500"
                      />
                    </div>

                    {/* Reps */}
                    <div>
                      <label className="mb-2 block text-xs font-medium text-zinc-400">
                        Reps
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={workoutExercise.reps}
                        onChange={(e) =>
                          handleExerciseChange(
                            workoutExercise.id,
                            "reps",
                            e.target.value
                          )
                        }
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-red-500"
                      />
                    </div>

                    {/* Weight */}
                    <div>
                      <label className="mb-2 block text-xs font-medium text-zinc-400">
                        Weight (kg)
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={workoutExercise.weight}
                        onChange={(e) =>
                          handleExerciseChange(
                            workoutExercise.id,
                            "weight",
                            e.target.value
                          )
                        }
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-red-500"
                      />
                    </div>
                  </div>
                </div>
              )
            )}

            {/* No exercises */}
            {workoutExercises.length === 0 && (
              <div className="rounded-xl border border-dashed border-zinc-800 p-8 text-center">
                <p className="text-sm text-zinc-500">
                  No exercises added.
                </p>

                <button
                  type="button"
                  onClick={handleAddExercise}
                  className="mt-4 text-sm font-medium text-red-500 hover:text-red-400"
                >
                  + Add your first exercise
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-900 bg-red-950/20 p-4">
            <p className="text-sm text-red-500">
              {error}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/workouts"
            className="rounded-lg border border-zinc-800 px-6 py-3 text-center text-sm font-medium text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
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