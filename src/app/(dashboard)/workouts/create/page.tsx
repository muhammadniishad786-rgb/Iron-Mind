"use client";

import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CreateWorkoutPage() {
  const [workoutName, setWorkoutName] = useState("");

  const [exercises, setExercises] = useState([
    {
      id: 1,
      name: "",
      sets: 3,
      reps: 10,
      weight: 0,
    },
  ]);

  const addExercise = () => {
    setExercises([
      ...exercises,
      {
        id: Date.now(),
        name: "",
        sets: 3,
        reps: 10,
        weight: 0,
      },
    ]);
  };

  const removeExercise = (id: number) => {
    setExercises(exercises.filter((exercise) => exercise.id !== id));
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

      {/* Workout Information */}
      <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-950 p-6">
        <h2 className="text-lg font-semibold">Workout Information</h2>

        <div className="mt-5">
          <label className="text-sm text-zinc-400">Workout Name</label>

          <input
            type="text"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            placeholder="Example: Push Day"
            className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500"
          />
        </div>
      </div>

      {/* Exercises */}
      <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Exercises</h2>

            <p className="mt-1 text-sm text-zinc-500">
              Add exercises to your workout.
            </p>
          </div>

          <button
            onClick={addExercise}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold transition hover:bg-red-500"
          >
            <Plus size={18} />
            Add Exercise
          </button>
        </div>

        {/* Exercise List */}
        <div className="mt-6 space-y-4">
          {exercises.map((exercise, index) => (
            <div
              key={exercise.id}
              className="rounded-lg border border-zinc-800 bg-zinc-900 p-5"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Exercise {index + 1}</h3>

                {exercises.length > 1 && (
                  <button
                    onClick={() => removeExercise(exercise.id)}
                    className="text-zinc-500 transition hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Exercise Name */}
                <div className="lg:col-span-1">
                  <label className="text-xs text-zinc-500">Exercise</label>

                  <input
                    type="text"
                    placeholder="Bench Press"
                    value={exercise.name}
                    onChange={(e) => {
                      setExercises(
                        exercises.map((item) =>
                          item.id === exercise.id
                            ? {
                                ...item,
                                name: e.target.value,
                              }
                            : item,
                        ),
                      );
                    }}
                    className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-red-500"
                  />
                </div>

                {/* Sets */}
                <div>
                  <label className="text-xs text-zinc-500">Sets</label>

                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={exercise.sets === 0 ? "" : exercise.sets}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");

                      setExercises(
                        exercises.map((item) =>
                          item.id === exercise.id
                            ? {
                                ...item,
                                sets: value === "" ? 0 : Number(value),
                              }
                            : item,
                        ),
                      );
                    }}
                    className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-red-500"
                  />
                </div>

                {/* Reps */}
                <div>
                  <label className="text-xs text-zinc-500">Reps</label>

                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={exercise.reps === 0 ? "" : exercise.reps}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");

                      setExercises(
                        exercises.map((item) =>
                          item.id === exercise.id
                            ? {
                                ...item,
                                reps: value === "" ? 0 : Number(value),
                              }
                            : item,
                        ),
                      );
                    }}
                    className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-red-500"
                  />
                </div>

                {/* Weight */}
                <div>
                  <label className="text-xs text-zinc-500">Weight (kg)</label>

                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={exercise.weight === 0 ? "" : exercise.weight}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");

                      setExercises(
                        exercises.map((item) =>
                          item.id === exercise.id
                            ? {
                                ...item,
                                weight: value === "" ? 0 : Number(value),
                              }
                            : item,
                        ),
                      );
                    }}
                    className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-red-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
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
          onClick={() => {
            console.log({
              workoutName,
              exercises,
            });
          }}
          className="rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold transition hover:bg-red-500"
        >
          Create Workout
        </button>
      </div>
    </div>
  );
}
