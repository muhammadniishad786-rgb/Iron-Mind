"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Loader2,
  Dumbbell,
  Clock,
  BarChart3,
  CheckCircle2,
  Play,
  Timer,
  Save,
} from "lucide-react";

import type { RootState, AppDispatch } from "@/store/store";

import {
  fetchWorkoutById,
  removeWorkout,
  finishWorkout,
} from "@/store/slices/workoutSlice";

import type { WorkoutExercise } from "@/services/workoutApi";

interface SessionSet {
  setNumber: number;
  reps: number;
  weight: number;
  completed: boolean;
}

interface SessionExercise {
  exerciseId: string;
  name: string;
  sets: SessionSet[];
}

export default function ViewWorkoutPage() {
  const params = useParams();
  const router = useRouter();

  const workoutId = params.id as string;
  const dispatch = useDispatch<AppDispatch>();

  const { currentWorkout, loading, error } = useSelector(
    (state: RootState) => state.workout
  );

  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [sessionExercises, setSessionExercises] = useState<
    SessionExercise[]
  >([]);
  const [sessionError, setSessionError] = useState<string | null>(null);

  // Fetch the selected workout.
  useEffect(() => {
    if (workoutId) {
      dispatch(fetchWorkoutById(workoutId));
    }
  }, [dispatch, workoutId]);

  // Initialize the editable workout session.
  useEffect(() => {
    if (!currentWorkout || currentWorkout._id !== workoutId) {
      return;
    }

    setSessionExercises(
      currentWorkout.exercises.map((item) => {
        const exerciseId =
          typeof item.exercise === "string"
            ? item.exercise
            : item.exercise._id;

        const exerciseName =
          typeof item.exercise === "string"
            ? "Exercise"
            : item.exercise.name;

        return {
          exerciseId,
          name: exerciseName,
          sets: Array.from(
            { length: Math.max(0, item.sets) },
            (_, index) => ({
              setNumber: index + 1,
              reps: item.performedSets?.[index]?.reps ?? item.reps,
              weight: item.performedSets?.[index]?.weight ?? item.weight,
              completed:
                item.performedSets?.[index]?.completed ?? false,
            })
          ),
        };
      })
    );
  }, [currentWorkout, workoutId]);

  // Workout timer.
  useEffect(() => {
    if (!isWorkoutStarted) return;

    const intervalId = window.setInterval(() => {
      setElapsedSeconds((seconds) => seconds + 1);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isWorkoutStarted]);

  // Format elapsed time as HH:MM:SS.
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return [
      String(hours).padStart(2, "0"),
      String(minutes).padStart(2, "0"),
      String(remainingSeconds).padStart(2, "0"),
    ].join(":");
  };

  // Calculate volume using saved performed sets.
  const calculateVolume = () => {
    if (!currentWorkout) return 0;

    return currentWorkout.exercises.reduce((total, exercise) => {
      const exerciseVolume = (exercise.performedSets ?? []).reduce(
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

  // Start the workout session.
  const handleStartWorkout = () => {
    if (!currentWorkout || currentWorkout.completed) return;

    setSessionError(null);
    setElapsedSeconds(0);
    setIsWorkoutStarted(true);
  };

  // Update reps or weight for a particular set.
  const handleSetChange = (
    exerciseIndex: number,
    setIndex: number,
    field: "reps" | "weight",
    value: number
  ) => {
    setSessionExercises((previous) =>
      previous.map((exercise, index) => {
        if (index !== exerciseIndex) return exercise;

        return {
          ...exercise,
          sets: exercise.sets.map((set, currentSetIndex) =>
            currentSetIndex === setIndex
              ? { ...set, [field]: value }
              : set
          ),
        };
      })
    );
  };

  // Mark a set complete or incomplete.
  const handleToggleSet = (
    exerciseIndex: number,
    setIndex: number
  ) => {
    setSessionExercises((previous) =>
      previous.map((exercise, index) => {
        if (index !== exerciseIndex) return exercise;

        return {
          ...exercise,
          sets: exercise.sets.map((set, currentSetIndex) =>
            currentSetIndex === setIndex
              ? { ...set, completed: !set.completed }
              : set
          ),
        };
      })
    );
  };

  // Complete the workout and save the session data.
  const handleCompleteWorkout = async () => {
    if (!currentWorkout || loading) return;

    const confirmed = window.confirm(
      "Finish this workout and save your session?"
    );

    if (!confirmed) return;

    setSessionError(null);

    try {
      const exercises: WorkoutExercise[] = sessionExercises.map(
        (sessionExercise) => {
          const plannedExercise = currentWorkout.exercises.find(
            (item) => {
              const id =
                typeof item.exercise === "string"
                  ? item.exercise
                  : item.exercise._id;

              return id === sessionExercise.exerciseId;
            }
          );

          return {
            exercise: sessionExercise.exerciseId,
            sets: plannedExercise?.sets ?? sessionExercise.sets.length,
            reps: plannedExercise?.reps ?? 1,
            weight: plannedExercise?.weight ?? 0,
            restTime: plannedExercise?.restTime,

            // setNumber is required by the backend Mongoose schema.
            performedSets: sessionExercise.sets.map((set, index) => ({
              setNumber: index + 1,
              reps: set.reps,
              weight: set.weight,
              completed: set.completed,
            })),

            completed: sessionExercise.sets.every(
              (set) => set.completed
            ),
          };
        }
      );

      await dispatch(
        finishWorkout({
          id: workoutId,
          data: {
            duration: Math.max(1, Math.ceil(elapsedSeconds / 60)),
            exercises,
          },
        })
      ).unwrap();

      setIsWorkoutStarted(false);

      // Refresh the workout so the page displays saved results.
      await dispatch(fetchWorkoutById(workoutId)).unwrap();
    } catch (err) {
      console.error("Failed to complete workout:", err);

      setSessionError(
        typeof err === "string"
          ? err
          : err instanceof Error
            ? err.message
            : "Unable to save your workout. Please try again."
      );
    }
  };

  // Delete the workout.
  const handleDelete = async () => {
    if (!currentWorkout || loading) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this workout?"
    );

    if (!confirmed) return;

    try {
      await dispatch(removeWorkout(currentWorkout._id)).unwrap();
      router.push("/workouts");
    } catch (err) {
      console.error("Failed to delete workout:", err);
      setSessionError(
        typeof err === "string"
          ? err
          : "Failed to delete workout. Please try again."
      );
    }
  };

  // Loading state.
  if (
    (loading && !currentWorkout) ||
    (currentWorkout && currentWorkout._id !== workoutId)
  ) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <div className="flex items-center gap-2 text-zinc-400">
          <Loader2 size={20} className="animate-spin text-red-500" />
          Loading workout...
        </div>
      </div>
    );
  }

  // Not found state.
  if (!currentWorkout) {
    return (
      <div className="p-6">
        <div className="mx-auto max-w-3xl rounded-xl border border-red-900 bg-red-950/20 p-10 text-center">
          <h2 className="text-xl font-semibold">Workout not found</h2>

          <p className="mt-2 text-sm text-zinc-500">
            {error || "Unable to load this workout."}
          </p>

          <Link
            href="/workouts"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-red-500"
          >
            <ArrowLeft size={16} />
            Back to Workouts
          </Link>
        </div>
      </div>
    );
  }

  const volume = calculateVolume();

  const completedSets = sessionExercises.reduce(
    (total, exercise) =>
      total + exercise.sets.filter((set) => set.completed).length,
    0
  );

  const totalSets = sessionExercises.reduce(
    (total, exercise) => total + exercise.sets.length,
    0
  );

  return (
    <div className="min-h-full p-4 text-white sm:p-6">
      <div className="mx-auto max-w-5xl">
        {/* Back navigation */}
        <Link
          href="/workouts"
          className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Workouts
        </Link>

        {/* Workout header */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600/10 text-red-500">
                  <Dumbbell size={25} />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-red-500">
                    Workout
                  </p>

                  <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                    {currentWorkout.name}
                  </h1>
                </div>
              </div>

              {currentWorkout.description && (
                <p className="mt-5 max-w-2xl text-sm leading-6 text-zinc-400">
                  {currentWorkout.description}
                </p>
              )}
            </div>

            <span
              className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
                currentWorkout.completed
                  ? "bg-green-500/10 text-green-500"
                  : isWorkoutStarted
                    ? "bg-red-500/10 text-red-400"
                    : "bg-zinc-800 text-zinc-400"
              }`}
            >
              {currentWorkout.completed ? (
                <CheckCircle2 size={16} />
              ) : isWorkoutStarted ? (
                <Timer size={16} />
              ) : null}

              {currentWorkout.completed
                ? "Completed"
                : isWorkoutStarted
                  ? "In Progress"
                  : "Planned"}
            </span>
          </div>

          {/* Header actions */}
          <div className="mt-6 flex flex-col gap-3 border-t border-zinc-800 pt-6 sm:flex-row sm:flex-wrap">
            {!currentWorkout.completed && !isWorkoutStarted && (
              <button
                type="button"
                onClick={handleStartWorkout}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold transition hover:bg-red-500"
              >
                <Play size={17} />
                Start Workout
              </button>
            )}

            {!isWorkoutStarted && (
              <Link
                href={`/workouts/${currentWorkout._id}/edit`}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-700 px-5 py-3 text-sm font-semibold transition hover:bg-zinc-900"
              >
                <Pencil size={16} />
                Edit Workout
              </Link>
            )}

            <button
              type="button"
              onClick={handleDelete}
              disabled={loading || isWorkoutStarted}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-900/70 px-5 py-3 text-sm font-medium text-red-500 transition hover:bg-red-950/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 size={16} />
              Delete Workout
            </button>
          </div>
        </div>

        {/* Workout statistics */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-600/10 p-2 text-red-500">
                <Dumbbell size={19} />
              </div>
              <p className="text-sm text-zinc-500">Exercises</p>
            </div>

            <p className="mt-4 text-2xl font-bold">
              {currentWorkout.exercises?.length || 0}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-600/10 p-2 text-red-500">
                <Clock size={19} />
              </div>
              <p className="text-sm text-zinc-500">Duration</p>
            </div>

            <p className="mt-4 text-2xl font-bold">
              {isWorkoutStarted
                ? Math.floor(elapsedSeconds / 60)
                : currentWorkout.duration || 0}
              <span className="ml-1 text-sm font-normal text-zinc-500">
                min
              </span>
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-600/10 p-2 text-red-500">
                <BarChart3 size={19} />
              </div>
              <p className="text-sm text-zinc-500">Volume</p>
            </div>

            <p className="mt-4 text-2xl font-bold">
              {volume >= 1000
                ? `${(volume / 1000).toFixed(1)}K`
                : volume}
              <span className="ml-1 text-sm font-normal text-zinc-500">
                kg
              </span>
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-600/10 p-2 text-red-500">
                <CheckCircle2 size={19} />
              </div>
              <p className="text-sm text-zinc-500">Status</p>
            </div>

            <p className="mt-4 text-lg font-bold">
              {currentWorkout.completed
                ? "Completed"
                : isWorkoutStarted
                  ? "In Progress"
                  : "Not Started"}
            </p>
          </div>
        </div>

        {/* Active workout session */}
        {isWorkoutStarted && !currentWorkout.completed && (
          <section className="mt-8 space-y-5">
            <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-5 sm:p-6">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-red-400">
                    Training Session
                  </p>

                  <h2 className="mt-2 text-2xl font-bold">
                    Stay focused.
                  </h2>

                  <p className="mt-1 text-sm text-zinc-400">
                    Complete each set and record your actual reps and weight.
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-5 py-4">
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Timer size={16} className="text-red-400" />
                    Elapsed time
                  </div>

                  <p className="mt-2 font-mono text-3xl font-bold tabular-nums">
                    {formatTime(elapsedSeconds)}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Sets completed</span>
                  <span className="font-semibold text-white">
                    {completedSets} / {totalSets}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-red-500 transition-all"
                    style={{
                      width: `${
                        totalSets > 0
                          ? (completedSets / totalSets) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {sessionExercises.map((exercise, exerciseIndex) => (
              <div
                key={`${exercise.exerciseId}-${exerciseIndex}`}
                className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"
              >
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600/10 font-bold text-red-500">
                    {exerciseIndex + 1}
                  </span>

                  <div>
                    <h3 className="font-semibold">{exercise.name}</h3>
                    <p className="text-xs text-zinc-500">
                      {exercise.sets.length} sets planned
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {exercise.sets.map((set, setIndex) => (
                    <div
                      key={set.setNumber}
                      className={`grid grid-cols-1 items-end gap-3 rounded-xl border p-3 sm:grid-cols-[70px_1fr_1fr_auto] ${
                        set.completed
                          ? "border-green-900/60 bg-green-950/10"
                          : "border-zinc-800 bg-zinc-900/60"
                      }`}
                    >
                      <div className="pb-2">
                        <p className="text-sm font-semibold">
                          Set {set.setNumber}
                        </p>
                        {set.completed && (
                          <span className="text-xs text-green-500">
                            Done
                          </span>
                        )}
                      </div>

                      <label className="text-xs text-zinc-400">
                        Reps
                        <input
                          type="number"
                          min={1}
                          step={1}
                          value={set.reps}
                          disabled={set.completed}
                          onChange={(event) =>
                            handleSetChange(
                              exerciseIndex,
                              setIndex,
                              "reps",
                              Math.max(
                                1,
                                Number(event.target.value) || 1
                              )
                            )
                          }
                          className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-red-500 disabled:opacity-60"
                        />
                      </label>

                      <label className="text-xs text-zinc-400">
                        Weight (kg)
                        <input
                          type="number"
                          min={0}
                          step={0.5}
                          value={set.weight}
                          disabled={set.completed}
                          onChange={(event) =>
                            handleSetChange(
                              exerciseIndex,
                              setIndex,
                              "weight",
                              Math.max(
                                0,
                                Number(event.target.value) || 0
                              )
                            )
                          }
                          className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-red-500 disabled:opacity-60"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() =>
                          handleToggleSet(exerciseIndex, setIndex)
                        }
                        className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                          set.completed
                            ? "bg-green-600/10 text-green-400 hover:bg-green-600/20"
                            : "bg-red-600 text-white hover:bg-red-500"
                        }`}
                      >
                        <CheckCircle2 size={16} />
                        {set.completed ? "Undo" : "Complete Set"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {sessionError && (
              <div
                role="alert"
                className="rounded-xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-300"
              >
                {sessionError}
              </div>
            )}

            <button
              type="button"
              onClick={handleCompleteWorkout}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-4 font-bold text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={19} className="animate-spin" />
              ) : (
                <Save size={19} />
              )}

              {loading ? "Saving Workout..." : "Complete Workout"}
            </button>

            <p className="text-center text-xs text-zinc-500">
              Make sure your sets are recorded before completing the workout.
            </p>
          </section>
        )}

        {/* Exercise details and saved results */}
        {!isWorkoutStarted && (
          <section className="mt-8">
            <div className="mb-4">
              <h2 className="text-2xl font-bold">
                {currentWorkout.completed
                  ? "Workout Results"
                  : "Exercises"}
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                {currentWorkout.completed
                  ? "Review the sets recorded for this workout."
                  : "Exercises included in this workout."}
              </p>
            </div>

            <div className="space-y-4">
              {currentWorkout.exercises?.map(
                (workoutExercise, index) => {
                  const exercise =
                    typeof workoutExercise.exercise === "string"
                      ? null
                      : workoutExercise.exercise;

                  const exerciseKey =
                    typeof workoutExercise.exercise === "string"
                      ? workoutExercise.exercise
                      : workoutExercise.exercise._id;

                  return (
                    <div
                      key={`${exerciseKey}-${index}`}
                      className="rounded-xl border border-zinc-800 bg-zinc-950 p-5"
                    >
                      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600/10 text-sm font-bold text-red-500">
                              {index + 1}
                            </span>

                            <h3 className="text-lg font-semibold">
                              {exercise?.name || "Exercise"}
                            </h3>
                          </div>

                          {exercise && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs text-zinc-500">
                                {exercise.muscleGroup}
                              </span>

                              <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs text-zinc-500">
                                {exercise.equipment}
                              </span>

                              <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs text-zinc-500">
                                {exercise.difficulty}
                              </span>
                            </div>
                          )}
                        </div>

                        {workoutExercise.completed && (
                          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-500">
                            <CheckCircle2 size={14} />
                            Completed
                          </span>
                        )}
                      </div>

                      <div className="mt-5 grid grid-cols-3 gap-3">
                        <div className="rounded-lg bg-zinc-900 p-4 text-center">
                          <p className="text-xl font-bold">
                            {workoutExercise.sets}
                          </p>
                          <p className="mt-1 text-xs text-zinc-500">
                            Sets
                          </p>
                        </div>

                        <div className="rounded-lg bg-zinc-900 p-4 text-center">
                          <p className="text-xl font-bold">
                            {workoutExercise.reps}
                          </p>
                          <p className="mt-1 text-xs text-zinc-500">
                            Reps
                          </p>
                        </div>

                        <div className="rounded-lg bg-zinc-900 p-4 text-center">
                          <p className="text-xl font-bold">
                            {workoutExercise.weight}
                            <span className="ml-1 text-xs font-normal text-zinc-500">
                              kg
                            </span>
                          </p>
                          <p className="mt-1 text-xs text-zinc-500">
                            Weight
                          </p>
                        </div>
                      </div>

                      {workoutExercise.performedSets &&
                        workoutExercise.performedSets.length > 0 && (
                          <div className="mt-5 border-t border-zinc-800 pt-5">
                            <h4 className="mb-3 text-sm font-semibold text-zinc-300">
                              Performed Sets
                            </h4>

                            <div className="space-y-2">
                              {workoutExercise.performedSets.map(
                                (set, setIndex) => (
                                  <div
                                    key={setIndex}
                                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-zinc-900 px-4 py-3"
                                  >
                                    <span className="text-sm text-zinc-400">
                                      Set {setIndex + 1}
                                    </span>

                                    <div className="flex items-center gap-4 text-sm">
                                      <span className="text-zinc-300">
                                        {set.reps} reps
                                      </span>

                                      <span className="text-zinc-300">
                                        {set.weight} kg
                                      </span>

                                      {set.completed ? (
                                        <CheckCircle2
                                          size={16}
                                          className="text-green-500"
                                        />
                                      ) : (
                                        <span className="text-xs text-zinc-500">
                                          Not completed
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  );
                }
              )}

              {currentWorkout.exercises?.length === 0 && (
                <div className="rounded-xl border border-dashed border-zinc-800 p-10 text-center">
                  <Dumbbell
                    size={32}
                    className="mx-auto text-zinc-700"
                  />

                  <p className="mt-3 text-sm text-zinc-500">
                    No exercises in this workout.
                  </p>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
