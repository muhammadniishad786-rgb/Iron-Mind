"use client";

import { ArrowLeft, Plus, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { RootState, AppDispatch } from "@/store/store";
import { fetchExercises } from "@/store/slices/exerciseSlice";
import { addWorkout } from "@/store/slices/workoutSlice";

interface WorkoutExerciseForm {
  id: number;
  exerciseId: string;
  sets: number;
  reps: number;
  weight: number;
}

export default function CreateWorkoutPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { exercises: availableExercises, loading: exercisesLoading } =
    useSelector((state: RootState) => state.exercise);

  const {
    loading: workoutLoading,
    error: workoutError,
  } = useSelector((state: RootState) => state.workout);

  const [workoutName, setWorkoutName] = useState("");

  const [description, setDescription] = useState("");

  const [exercises, setExercises] = useState<WorkoutExerciseForm[]>([
    {
      id: Date.now(),
      exerciseId: "",
      sets: 3,
      reps: 10,
      weight: 0,
    },
  ]);

  const [error, setError] = useState("");

  /*
   * Fetch exercises from backend
   */
  useEffect(() => {
    dispatch(fetchExercises());
  }, [dispatch]);

  /*
   * Add a new exercise row
   */
  const addExercise = () => {
    setExercises([
      ...exercises,
      {
        id: Date.now(),
        exerciseId: "",
        sets: 3,
        reps: 10,
        weight: 0,
      },
    ]);
  };

  /*
   * Remove exercise row
   */
  const removeExercise = (id: number) => {
    setExercises(
      exercises.filter((exercise) => exercise.id !== id)
    );
  };

  /*
   * Update exercise field
   */
  const updateExercise = (
    id: number,
    field: keyof WorkoutExerciseForm,
    value: string | number
  ) => {
    setExercises(
      exercises.map((exercise) =>
        exercise.id === id
          ? {
              ...exercise,
              [field]: value,
            }
          : exercise
      )
    );
  };

  /*
   * Handle workout creation
   */
  const handleCreateWorkout = async () => {
    setError("");

    /*
     * Validate workout name
     */
    if (!workoutName.trim()) {
      setError("Please enter a workout name.");
      return;
    }

    /*
     * Validate exercises
     */
    const hasEmptyExercise = exercises.some(
      (exercise) => !exercise.exerciseId
    );

    if (hasEmptyExercise) {
      setError("Please select an exercise for every row.");
      return;
    }

    /*
     * Validate sets and reps
     */
    const hasInvalidValues = exercises.some(
      (exercise) =>
        exercise.sets <= 0 ||
        exercise.reps <= 0
    );

    if (hasInvalidValues) {
      setError("Sets and reps must be greater than 0.");
      return;
    }

    /*
     * Prepare data for backend
     */
    const workoutData = {
      name: workoutName.trim(),

      description: description.trim(),

      exercises: exercises.map((exercise) => ({
        exercise: exercise.exerciseId,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight,
      })),
    };

    try {
      await dispatch(addWorkout(workoutData)).unwrap();

      /*
       * Workout created successfully
       */
      window.location.href = "/workouts";
    } catch (err) {
      console.error("Failed to create workout:", err);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/workouts"
          className="rounded-lg border border-zinc-800 p-2 text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
        >
          <ArrowLeft size={20} />
        </Link>

        <div>
          <h1 className="text-3xl font-bold">
            Create <span className="text-red-500">Workout</span>
          </h1>

          <p className="mt-1 text-sm text-zinc-500">
            Build your workout and add exercises.
          </p>
        </div>
      </div>

      {/* Error Message */}
      {(error || workoutError) && (
        <div className="mt-6 rounded-lg border border-red-900 bg-red-950/20 p-4">
          <p className="text-sm text-red-500">
            {error || workoutError}
          </p>
        </div>
      )}

      {/* Workout Information */}
      <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-950 p-6">
        <h2 className="text-lg font-semibold">
          Workout Information
        </h2>

        <div className="mt-5 space-y-5">
          {/* Workout Name */}
          <div>
            <label className="text-sm text-zinc-400">
              Workout Name
            </label>

            <input
              type="text"
              value={workoutName}
              onChange={(e) =>
                setWorkoutName(e.target.value)
              }
              placeholder="Example: Push Day"
              className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-zinc-400">
              Description
              <span className="ml-1 text-zinc-600">
                (optional)
              </span>
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Example: Chest, shoulders and triceps workout"
              rows={3}
              className="mt-2 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500"
            />
          </div>
        </div>
      </div>

      {/* Exercises */}
      <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950 p-6">
        {/* Exercise Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold">
              Exercises
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Add exercises to your workout.
            </p>
          </div>

          <button
            type="button"
            onClick={addExercise}
            className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold transition hover:bg-red-500"
          >
            <Plus size={18} />
            Add Exercise
          </button>
        </div>

        {/* Loading Exercises */}
        {exercisesLoading && (
          <div className="mt-8 flex items-center justify-center gap-2 py-8 text-sm text-zinc-500">
            <Loader2
              size={18}
              className="animate-spin"
            />
            Loading exercises...
          </div>
        )}

        {/* No Exercises */}
        {!exercisesLoading &&
          availableExercises.length === 0 && (
            <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-center">
              <p className="text-sm text-zinc-400">
                No exercises available.
              </p>

              <p className="mt-1 text-xs text-zinc-600">
                Add exercises to your exercise library first.
              </p>
            </div>
          )}

        {/* Exercise List */}
        {!exercisesLoading &&
          availableExercises.length > 0 && (
            <div className="mt-6 space-y-4">
              {exercises.map((exercise, index) => (
                <div
                  key={exercise.id}
                  className="rounded-lg border border-zinc-800 bg-zinc-900 p-5"
                >
                  {/* Exercise Row Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">
                        Exercise {index + 1}
                      </h3>

                      {exercise.exerciseId && (
                        <p className="mt-1 text-xs text-zinc-600">
                          {
                            availableExercises.find(
                              (item) =>
                                item._id ===
                                exercise.exerciseId
                            )?.muscleGroup
                          }
                        </p>
                      )}
                    </div>

                    {exercises.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeExercise(exercise.id)
                        }
                        className="text-zinc-500 transition hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Exercise Select */}
                    <div className="lg:col-span-1">
                      <label className="text-xs text-zinc-500">
                        Exercise
                      </label>

                      <select
                        value={exercise.exerciseId}
                        onChange={(e) =>
                          updateExercise(
                            exercise.id,
                            "exerciseId",
                            e.target.value
                          )
                        }
                        className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-red-500"
                      >
                        <option value="">
                          Select Exercise
                        </option>

                        {availableExercises.map(
                          (availableExercise) => (
                            <option
                              key={
                                availableExercise._id
                              }
                              value={
                                availableExercise._id
                              }
                            >
                              {availableExercise.name}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    {/* Sets */}
                    <div>
                      <label className="text-xs text-zinc-500">
                        Sets
                      </label>

                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={
                          exercise.sets === 0
                            ? ""
                            : exercise.sets
                        }
                        onChange={(e) => {
                          const value =
                            e.target.value.replace(
                              /\D/g,
                              ""
                            );

                          updateExercise(
                            exercise.id,
                            "sets",
                            value === ""
                              ? 0
                              : Number(value)
                          );
                        }}
                        className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-red-500"
                      />
                    </div>

                    {/* Reps */}
                    <div>
                      <label className="text-xs text-zinc-500">
                        Reps
                      </label>

                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={
                          exercise.reps === 0
                            ? ""
                            : exercise.reps
                        }
                        onChange={(e) => {
                          const value =
                            e.target.value.replace(
                              /\D/g,
                              ""
                            );

                          updateExercise(
                            exercise.id,
                            "reps",
                            value === ""
                              ? 0
                              : Number(value)
                          );
                        }}
                        className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-red-500"
                      />
                    </div>

                    {/* Weight */}
                    <div>
                      <label className="text-xs text-zinc-500">
                        Weight (kg)
                      </label>

                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={
                          exercise.weight === 0
                            ? ""
                            : exercise.weight
                        }
                        onChange={(e) => {
                          const value =
                            e.target.value.replace(
                              /\D/g,
                              ""
                            );

                          updateExercise(
                            exercise.id,
                            "weight",
                            value === ""
                              ? 0
                              : Number(value)
                          );
                        }}
                        className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-red-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>

      {/* Actions */}
      <div className="mt-6 flex justify-end gap-3">
        <Link
          href="/workouts"
          className="rounded-lg border border-zinc-800 px-5 py-3 text-sm font-medium text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
        >
          Cancel
        </Link>

        <button
          type="button"
          disabled={workoutLoading}
          onClick={handleCreateWorkout}
          className="flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {workoutLoading && (
            <Loader2
              size={18}
              className="animate-spin"
            />
          )}

          {workoutLoading
            ? "Creating..."
            : "Create Workout"}
        </button>
      </div>
    </div>
  );
}